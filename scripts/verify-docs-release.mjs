#!/usr/bin/env node
/**
 * D8: dependency-free DigitalInvoice documentation release verification.
 *
 * node scripts/verify-docs-release.mjs local [--out-dir path] [--nrs]
 * node scripts/verify-docs-release.mjs live https://confirmed-domain.example [--nrs]
 *
 * Checks cannot certify NRS compliance, management approval or document contents.
 * Uses only Node built-ins and fetch. No authentication, tokens or live NRS calls.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const DOCS = path.join(ROOT, 'src', 'content', 'docs')
const DEFAULT_OUT = path.join(ROOT, 'out')
const DOC_ROUTES = Object.freeze({
  developers: '/developers/',
  api: '/developers/api/',
  'data-structure': '/developers/data-structure/',
  samples: '/developers/samples/',
  architecture: '/developers/architecture/',
  security: '/developers/security/',
  timeline: '/developers/timeline/',
  sla: '/sla/',
})
const STATUSES = new Set(['foundation', 'planned', 'draft', 'published', 'approved'])
const IMAGE_MAGIC = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const PDF_MAGIC = Buffer.from('%PDF-')

const resources = [
  { path: '/docs/digitalinvoice-api-documentation-v1.1.pdf', kind: 'pdf', doc: 'api' },
  { path: '/docs/digitalinvoice-implementation-timeline-v1.0.pdf', kind: 'pdf', doc: 'timeline' },
  ...['', '-dark'].map((theme) => ({ path: `/docs/diagrams/digitalinvoice-implementation-timeline-v1.0${theme}.svg`, kind: 'svg', doc: 'timeline' })),
  { path: '/docs/diagrams/digitalinvoice-implementation-timeline-v1.0.mmd', kind: 'text', doc: 'timeline' },
  { path: '/docs/digitalinvoice-invoice-schema-v1.0.json', kind: 'json', doc: 'data-structure' },
  { path: '/docs/digitalinvoice-field-mapping-v1.0.csv', kind: 'csv', doc: 'data-structure' },
  { path: '/docs/digitalinvoice-architecture-v1.0.pdf', kind: 'pdf', doc: 'architecture' },
  ...[
    'b2b-multi-line-discount-vat', 'b2c-simplified', 'credit-note',
    'vat-exempt', 'multiple-tax-categories', 'two-level-discount',
  ].map((name) => ({ path: `/docs/sample-payloads/digitalinvoice-${name}-v1.0.json`, kind: 'json', doc: 'data-structure' })),
  ...[
    'system-architecture', 'b2b-clearance', 'b2c-reporting', 'buyer-verification',
  ].flatMap((name) => [
    { path: `/docs/diagrams/digitalinvoice-${name}-v1.0.svg`, kind: 'svg', doc: 'architecture' },
    { path: `/docs/diagrams/digitalinvoice-${name}-v1.0-dark.svg`, kind: 'svg', doc: 'architecture' },
    { path: `/docs/diagrams/digitalinvoice-${name}-v1.0.mmd`, kind: 'text', doc: 'architecture' },
  ]),
  ...[
    'b2b-tax-invoice', 'b2c-simplified-invoice', 'credit-note', 'payment-receipt',
  ].flatMap((name) => ['current', 'mock-post-validation'].flatMap((state) => {
    const prefix = `/docs/samples/digitalinvoice-${name}-${state}-v1.0`
    return [
      { path: `${prefix}.pdf`, kind: 'pdf', doc: 'samples' },
      { path: `${prefix}.png`, kind: 'png', doc: 'samples' },
    ]
  })),
  { path: '/docs/teecoms-digitalinvoice-sla-v1.0.pdf', kind: 'pdf', doc: 'sla', optional: true },
  { path: '/docs/teecoms-iso-iec-27001-2022-certificate.pdf', kind: 'pdf', doc: 'security', optional: true },
]

const counters = { fail: 0, warn: 0, pass: 0 }
const report = (level, label, detail = '') => {
  counters[level] += 1
  const mark = { pass: 'PASS', warn: 'WARN', fail: 'FAIL' }[level]
  console.log(`[${mark}] ${label}${detail ? ` — ${detail}` : ''}`)
}
const assert = (condition, label, detail = '') => report(condition ? 'pass' : 'fail', label, detail)
const warn = (label, detail = '') => report('warn', label, detail)
const read = async (file) => fs.readFile(file)
const exists = async (file) => fs.access(file).then(() => true, () => false)
const text = async (file) => (await read(file)).toString('utf8')

function attr(markup, key) {
  const match = markup.match(new RegExp(`\\b${key}\\s*=\\s*["']([^"']*)["']`, 'i'))
  return match?.[1] ?? null
}
function tagByAttr(html, tagName, attribute, expected) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || []
  return tags.find((tag) => attr(tag, attribute)?.toLowerCase() === expected) || null
}
function canonicalOf(html) {
  const tag = tagByAttr(html, 'link', 'rel', 'canonical')
  return tag ? attr(tag, 'href') : null
}
function isNoindex(html) {
  const tag = tagByAttr(html, 'meta', 'name', 'robots')
  return Boolean(tag && /\bnoindex\b/i.test(attr(tag, 'content') || ''))
}
function isPublic(status) { return status === 'published' || status === 'approved' }
function hasSignature(buffer, kind) {
  if (kind === 'pdf') return buffer.subarray(0, 5).equals(PDF_MAGIC)
  if (kind === 'png') return buffer.subarray(0, 8).equals(IMAGE_MAGIC)
  if (kind === 'json') {
    try { JSON.parse(buffer.toString('utf8')); return true } catch { return false }
  }
  if (kind === 'svg') return /<svg\b/i.test(buffer.toString('utf8'))
  if (kind === 'csv') return buffer.toString('utf8').split(/\r?\n/)[0]?.includes(',')
  return buffer.length > 0
}
function parseStatus(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) throw new Error('Missing Markdown front matter')
  const status = match[1].match(/^status:\s*(.+?)\s*$/m)?.[1]
  if (!STATUSES.has(status)) throw new Error(`Invalid documentation status: ${status ?? '(missing)'}`)
  return status
}
function cli() {
  const args = process.argv.slice(2)
  const mode = args.shift()
  if (!['local', 'live'].includes(mode)) throw new Error('Usage: verify-docs-release.mjs local [--out-dir <path>] [--nrs] OR live <https://domain> [--nrs]')
  const strict = args.includes('--nrs')
  const withoutFlags = args.filter((arg) => arg !== '--nrs')
  if (mode === 'live') {
    if (withoutFlags.length !== 1) throw new Error('Live checks require the exact public HTTPS origin, e.g. live https://your-domain.example')
    const u = new URL(withoutFlags[0])
    if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash || u.pathname !== '/' || u.port) {
      throw new Error('Live URL must be an HTTPS origin with no path, port, credentials or query')
    }
    return { mode, strict, origin: u.origin, out: DEFAULT_OUT }
  }
  const index = withoutFlags.indexOf('--out-dir')
  if (index >= 0 && (withoutFlags.length !== 2 || index !== 0)) throw new Error('Use: local --out-dir <path> [--nrs]')
  if (index === -1 && withoutFlags.length) throw new Error(`Unrecognized arguments: ${withoutFlags.join(' ')}`)
  return { mode, strict, origin: null, out: index >= 0 ? path.resolve(withoutFlags[1]) : DEFAULT_OUT }
}

// Internal NRS gap analysis must not be exposed as a public page or download.
const INTERNAL_REVIEW_ROUTE = '/developers/nrs-alignment/'
const INTERNAL_REVIEW_PDF = '/docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf'
const INTERNAL_REVIEW_PATTERNS = [
  /\/?developers\/nrs-alignment\/?/i,
  /digitalinvoice-nrs-v1\.1-alignment-review-2026-11\.pdf/i,
]
function includesInternalReviewLink(contents) {
  // Inspect the entire exported HTML, including anchors, hydration attributes
  // and JSON strings, to avoid missing links introduced in new shared navs.
  return INTERNAL_REVIEW_PATTERNS.some((pattern) => pattern.test(contents))
}
async function walkHtml(directory) {
  if (!(await exists(directory))) return []
  const files = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walkHtml(file))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(file)
  }
  return files
}
async function verifyRemovedInternalReviewSource() {
  for (const file of [
    'src/app/developers/nrs-alignment/page.js',
    'src/content/docs/nrs-alignment.md',
    'public/docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf',
  ]) assert(!(await exists(path.join(ROOT, file))), `Internal review removed from source: ${file}`)
  for (const file of await fs.readdir(DOCS).then((entries) => entries.filter((entry) => entry.endsWith('.md')))) {
    const source = await text(path.join(DOCS, file))
    assert(!includesInternalReviewLink(source), `No internal review link in public Markdown: ${file}`)
  }
}
async function verifyRemovedInternalReviewExport(out) {
  for (const file of [
    'developers/nrs-alignment/index.html',
    'docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf',
  ]) assert(!(await exists(path.join(out, file))), `Internal review absent from export: ${file}`)
  for (const file of await walkHtml(out)) {
    const html = await text(file)
    assert(!includesInternalReviewLink(html), `No internal review links: ${path.relative(out, file)}`)
  }
  const sitemap = path.join(out, 'sitemap.xml')
  if (await exists(sitemap)) assert(!includesInternalReviewLink(await text(sitemap)), 'No internal review sitemap entry')
}

async function statusesFromSource() {
  const data = {}
  for (const slug of Object.keys(DOC_ROUTES)) {
    try { data[slug] = parseStatus(await text(path.join(DOCS, `${slug}.md`))) }
    catch (error) { report('fail', `${slug}.md front matter`, error.message); data[slug] = 'missing' }
  }
  return data
}

async function local(options, statuses) {
  const out = options.out
  if (!(await exists(out))) throw new Error(`Static output is missing: ${out}. Run npm run build first.`)
  await verifyRemovedInternalReviewExport(out)
  const htmlBySlug = {}
  let origin
  for (const [slug, route] of Object.entries(DOC_ROUTES)) {
    const file = path.join(out, route.slice(1), 'index.html')
    if (!(await exists(file))) { report('fail', route, 'Missing exported index.html'); continue }
    const html = await text(file)
    htmlBySlug[slug] = html
    const canonical = canonicalOf(html)
    if (!origin && canonical) {
      try { origin = new URL(canonical).origin } catch { /* verified below */ }
    }
    assert(Boolean(canonical && /^https:\/\//i.test(canonical) && canonical.endsWith(route)), `${route} canonical HTTPS`, canonical || 'Missing canonical URL')
    assert(isNoindex(html) === !isPublic(statuses[slug]), `${route} indexing status`, statuses[slug])
    assert(/<html\b/i.test(html) && /<h1\b/i.test(html), `${route} exported HTML`)
  }
  assert(Boolean(origin && /^https:\/\//.test(origin) && !/localhost|127\.0\.0\.1/i.test(origin)), 'Production HTTPS origin in canonical metadata', origin || 'Missing')
  for (const staticPath of ['index.html', 'robots.txt', 'sitemap.xml']) {
    assert(await exists(path.join(out, staticPath)), `out/${staticPath}`)
  }
  if (await exists(path.join(out, 'sitemap.xml'))) {
    const sitemap = await text(path.join(out, 'sitemap.xml'))
    for (const [slug, route] of Object.entries(DOC_ROUTES)) {
      const expected = origin ? `${origin}${route}` : route
      const inSitemap = sitemap.includes(expected)
      assert(inSitemap === isPublic(statuses[slug]), `Sitemap entry ${route}`, inSitemap ? 'Present' : 'Omitted')
    }
  }
  for (const item of resources) {
    if (!isPublic(statuses[item.doc])) continue
    const target = path.join(out, item.path.slice(1))
    if (!(await exists(target))) {
      if (item.optional && !options.strict) { warn(`PDF not yet available: ${item.path}`, 'Link must be hidden until the verified PDF is added'); continue }
      report('fail', item.path, 'Missing published asset'); continue
    }
    assert(hasSignature(await read(target), item.kind), `Asset ${item.path}`, `${item.kind} signature/content`)
  }
  const sampleFiles = resources.filter((item) => item.doc === 'samples')
  if (!isPublic(statuses.samples)) {
    const present = (await Promise.all(sampleFiles.map((item) => exists(path.join(out, item.path.slice(1)))))).filter(Boolean).length
    warn('PDF sample gallery not published', `${present}/${sampleFiles.length} exported files present; status: ${statuses.samples}`)
  }
  if (!isPublic(statuses.sla)) warn('SLA not approved', `Current source status: ${statuses.sla}`)
  // In the existing Teecoms build, out/api/env.php contains SMTP settings. It
  // must never become a directly downloadable source file on the web host.
  const envPhp = path.join(out, 'api', 'env.php')
  if (await exists(envPhp)) {
    const conf = path.join(out, 'api', '.htaccess')
    assert(await exists(conf), 'PHP secrets directory access guard', 'out/api/.htaccess')
    if (await exists(conf)) {
      const rule = await text(conf)
      assert(/Require all denied|Deny from all/i.test(rule), 'PHP secrets access denied by default')
    }
  }
  for (const forbidden of ['.env', '.env.local', 'digitalinvoice_db.sql', 'database.sql', '.git/config']) {
    assert(!(await exists(path.join(out, forbidden))), `No private file out/${forbidden}`)
  }
}

async function publicRequest(url, method = 'GET') {
  const response = await fetch(url, { method, redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'TeecomsDocsReleaseCheck/1.0' } })
  return response
}
async function verifyLiveResource(origin, item) {
  const uri = `${origin}${item.path}`
  try {
    const head = await publicRequest(uri, 'HEAD')
    const get = await publicRequest(uri, 'GET')
    assert(head.status === 200, `HEAD ${item.path}`, `HTTP ${head.status}`)
    assert(get.status === 200, `GET ${item.path}`, `HTTP ${get.status}`)
    if (get.status !== 200) return
    assert(hasSignature(Buffer.from(await get.arrayBuffer()), item.kind), `Content ${item.path}`, item.kind)
    const mime = (get.headers.get('content-type') || '').toLowerCase()
    if (item.kind === 'pdf' && !mime.includes('pdf')) warn(`MIME ${item.path}`, mime || 'Missing Content-Type')
    if (item.kind === 'png' && !mime.includes('image/png')) warn(`MIME ${item.path}`, mime || 'Missing Content-Type')
  } catch (error) { report('fail', `Public asset ${item.path}`, error.message) }
}
async function live(options, statuses) {
  const { origin } = options
  for (const removed of [INTERNAL_REVIEW_ROUTE, INTERNAL_REVIEW_PDF]) {
    try {
      const response = await publicRequest(`${origin}${removed}`)
      assert([404, 410].includes(response.status), `Internal review not publicly served: ${removed}`, `HTTP ${response.status}`)
    } catch (error) { report('fail', `Internal review URL check ${removed}`, error.message) }
  }
  const pages = [{ route: '/', slug: null }, ...Object.entries(DOC_ROUTES).map(([slug, route]) => ({ slug, route }))]
  for (const { slug, route } of pages) {
    try {
      const url = `${origin}${route}`
      const head = await publicRequest(url, 'HEAD')
      const get = await publicRequest(url)
      assert(head.status === 200, `HEAD ${route}`, `HTTP ${head.status}`)
      assert(get.status === 200, `GET ${route}`, `HTTP ${get.status}`)
      if (get.status !== 200) continue
      const html = await get.text()
      assert(!includesInternalReviewLink(html), `Public HTML excludes internal review: ${route}`)
      assert(/<html\b/i.test(html) && /<h1\b/i.test(html), `HTML ${route}`)
      if (!slug) continue
      assert(canonicalOf(html) === url, `Canonical ${route}`, canonicalOf(html) || 'Missing or unexpected')
      assert(isNoindex(html) === !isPublic(statuses[slug]), `Robots meta ${route}`, statuses[slug])
    } catch (error) { report('fail', `Public page ${route}`, error.message) }
  }
  let sitemap = ''
  for (const key of ['sitemap.xml', 'robots.txt']) {
    try {
      const response = await publicRequest(`${origin}/${key}`)
      assert(response.status === 200, `GET /${key}`, `HTTP ${response.status}`)
      if (response.ok && key === 'sitemap.xml') sitemap = await response.text()
    } catch (error) { report('fail', `Public ${key}`, error.message) }
  }
  if (sitemap) {
    assert(!includesInternalReviewLink(sitemap), 'Public sitemap excludes internal review')
    for (const [slug, route] of Object.entries(DOC_ROUTES)) {
      assert(sitemap.includes(`${origin}${route}`) === isPublic(statuses[slug]), `Public sitemap ${route}`)
    }
  }
  // Bound concurrency to avoid flooding shared cPanel servers.
  const targets = []
  for (const item of resources.filter((item) => isPublic(statuses[item.doc]))) {
    if (item.optional && !options.strict && !(await exists(path.join(ROOT, 'public', item.path.slice(1))))) {
      warn(`Optional PDF not yet published: ${item.path}`, 'Upload and rebuild to expose download')
      continue
    }
    targets.push(item)
  }
  for (let i = 0; i < targets.length; i += 4) {
    await Promise.all(targets.slice(i, i + 4).map((item) => verifyLiveResource(origin, item)))
  }
  // With the shipped Apache .htaccess the PHP configuration endpoint is denied.
  // Never print the response, even if the server misconfigures PHP.
  try {
    const response = await publicRequest(`${origin}/api/env.php`)
    const body = await response.text()
    const exposed = /<\?php|SMTP_|CONTACT_FROM_EMAIL|TURNSTILE_SECRET_KEY/i.test(body)
    assert(!exposed, 'Server-only mail configuration not exposed')
    if (response.status === 200) warn('PHP configuration endpoint', 'Returned 200; verify it executes safely and .htaccess is honoured')
  } catch (error) { warn('Mail configuration probe', `Could not verify: ${error.message}`) }
}

async function main() {
  const options = cli()
  console.log(`DigitalInvoice D8 release verification: ${options.mode}${options.strict ? ' (NRS submission gate)' : ''}\n`)
  const statuses = await statusesFromSource()
  await verifyRemovedInternalReviewSource()
  if (options.strict) {
    assert(statuses.samples === 'published', 'NRS gate: samples published', `current: ${statuses.samples}`)
    assert(statuses.sla === 'approved', 'NRS gate: management-approved SLA', `current: ${statuses.sla}`)
    for (const item of resources.filter((entry) => entry.optional)) {
      assert(await exists(path.join(ROOT, 'public', item.path.slice(1))), `NRS gate: ${item.path} source PDF present`)
    }
    try {
      const api = await text(path.join(DOCS, 'api.md'))
      assert(!/\[CONFIRM(?::[^\]]*)?\]/.test(api), 'NRS gate: API publication placeholders resolved')
    } catch (error) { report('fail', 'NRS gate: API source', error.message) }
  }
  if (options.mode === 'local') await local(options, statuses)
  else await live(options, statuses)
  console.log(`\nSummary: ${counters.pass} passed, ${counters.warn} warnings, ${counters.fail} failed.`)
  if (!options.strict && (statuses.sla !== 'approved' || statuses.samples !== 'published')) {
    console.log('Note: the documentation site can be published in draft/review state, but is not yet ready for final NRS submission.')
  }
  if (counters.fail) process.exitCode = 1
}

main().catch((error) => { console.error(`Release checker error: ${error.message}`); process.exitCode = 1 })
