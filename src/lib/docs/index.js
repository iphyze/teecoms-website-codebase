import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { renderMarkdown } from './markdown'

const DOCS_DIR = path.join(process.cwd(), 'src/content/docs')
const VALID_SLUGS = new Set(['developers', 'api', 'data-structure', 'samples', 'architecture', 'security', 'sla', 'timeline'])
const FRONT_MATTER_KEYS = new Set(['title', 'description', 'version', 'effective', 'updated', 'status', 'pdf'])

/** Small intentionally strict parser: no executable YAML or third-party YAML runtime. */
export function parseFrontMatter(input) {
  const normalised = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(normalised)
  if (!match) throw new Error('Documentation must begin with a --- front matter block.')
  const meta = {}
  for (const line of match[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const field = /^([a-z_]+):(?:\s*)(.*)$/.exec(line)
    if (!field || !FRONT_MATTER_KEYS.has(field[1])) throw new Error(`Unsupported documentation metadata: ${line}`)
    if (Object.hasOwn(meta, field[1])) throw new Error(`Duplicate documentation metadata key: ${field[1]}`)
    const value = field[2].trim()
    meta[field[1]] = (value[0] === '"' && value.at(-1) === '"') || (value[0] === "'" && value.at(-1) === "'")
      ? value.slice(1, -1) : value
  }
  for (const required of ['title', 'description', 'version', 'updated', 'status']) {
    if (!meta[required]) throw new Error(`Missing required documentation metadata: ${required}`)
  }
  if (!['draft', 'approved', 'published', 'foundation', 'planned'].includes(meta.status)) {
    throw new Error(`Invalid documentation status: ${meta.status}`)
  }
  // Allow dotted version labels (for example, v1.0.pdf) while rejecting traversal, URLs and unsafe segments.
  if (meta.pdf && !/^\/docs\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*\.pdf$/.test(meta.pdf)) {
    throw new Error('PDF download must be a local /docs/*.pdf path.')
  }
  return { meta, body: normalised.slice(match[0].length).trim() }
}

export function documentationExists(slug) {
  return VALID_SLUGS.has(slug) && fs.existsSync(path.join(DOCS_DIR, `${slug}.md`))
}

export function getDocumentation(slug) {
  if (!documentationExists(slug)) throw new Error(`Documentation not present: ${slug}`)
  const source = fs.readFileSync(path.join(DOCS_DIR, `${slug}.md`), 'utf8')
  const { meta, body } = parseFrontMatter(source)
  if (slug === 'sla' && !['draft', 'approved'].includes(meta.status)) {
    throw new Error('SLA status must be draft or approved; published/foundation are not valid SLA states.')
  }
  // Publication of the management-approved *online* SLA is independent of a
  // downloadable PDF. Never render a broken download link or accept a fake PDF.
  // The PDF may be added later as a verified print copy of the same version.
  if (slug === 'sla' && meta.status === 'approved' && meta.effective !== '2026-11-27') {
    throw new Error('Approved SLA requires the confirmed 2026-11-27 effective date.')
  }
  const publicPdfPresent = (url) => {
    if (!url || !/^\/docs\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*\.pdf$/.test(url)) return false
    const file = path.join(process.cwd(), 'public', url.slice(1))
    if (!fs.existsSync(file)) return false
    const signature = Buffer.alloc(5)
    const fd = fs.openSync(file, 'r')
    try { return fs.readSync(fd, signature, 0, 5, 0) === 5 && signature.toString() === '%PDF-' }
    finally { fs.closeSync(fd) }
  }
  if (slug === 'sla' && meta.status === 'approved' && !publicPdfPresent(meta.pdf)) {
    // Keep the approved page indexed but omit its download until the PDF exists.
    meta.pdf = ''
  }
  const certificateUrl = '/docs/teecoms-iso-iec-27001-2022-certificate.pdf'
  const safeBody = publicPdfPresent(certificateUrl)
    ? body
    : body.replace(/\[([^\]\n]+)\]\(\/docs\/teecoms-iso-iec-27001-2022-certificate\.pdf\)/g, '$1 (PDF available from Teecoms on request until uploaded)')
  const rendered = renderMarkdown(safeBody, { status: meta.status, title: meta.title })
  if (slug === 'sla' && meta.status === 'approved') {
    if (/\[CONFIRM(?::[^\]]*)?\]/i.test(rendered.html)) throw new Error('Approved SLA has unresolved confirmation markers.')
  }
  return { ...meta, ...rendered, slug }
}
