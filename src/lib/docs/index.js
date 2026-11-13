import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { renderMarkdown } from './markdown'

const DOCS_DIR = path.join(process.cwd(), 'src/content/docs')
const VALID_SLUGS = new Set(['developers', 'api', 'data-structure', 'samples', 'architecture', 'security', 'sla', 'nrs-alignment'])
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
  // An approved SLA must never publish without its reviewed, signed PDF.
  // Drafts may carry the intended future filename but never expose a download.
  if (slug === 'sla' && meta.status === 'approved') {
    if (!meta.effective) throw new Error('Approved SLA requires a confirmed effective date in front matter.')
    if (!meta.pdf) throw new Error('Approved SLA requires a signed PDF in the pdf front-matter field.')
    const pdfFile = path.join(process.cwd(), 'public', meta.pdf.replace(/^\//, ''))
    if (!fs.existsSync(pdfFile)) throw new Error(`Approved SLA PDF is missing: ${meta.pdf}`)
    const pdfMagic = Buffer.alloc(5)
    const fd = fs.openSync(pdfFile, 'r')
    try { if (fs.readSync(fd, pdfMagic, 0, 5, 0) !== 5 || pdfMagic.toString() !== '%PDF-') throw new Error(`Approved SLA file is not a PDF: ${meta.pdf}`) }
    finally { fs.closeSync(fd) }
  }
  const rendered = renderMarkdown(body, { status: meta.status, title: meta.title })
  if (slug === 'sla' && meta.status === 'approved') {
    if (rendered.html.includes('[CONFIRM:')) throw new Error('Approved SLA contains unresolved [CONFIRM:] placeholders.')
    meta.version = '1.0'
    meta.description = 'Service levels, support procedures, security controls and recovery commitments for DigitalInvoice.'
  }
  return { ...meta, ...rendered, slug }
}
