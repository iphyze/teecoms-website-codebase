import { site } from '@/config/site'
import { documentationExists, getDocumentation } from '@/lib/docs'

// Required by `output: 'export'`: generate this file once at build time.
export const dynamic = 'force-static'

const DOC_PATHS = [
  ['developers', '/developers/'],
  ['api', '/developers/api/'],
  ['data-structure', '/developers/data-structure/'],
  ['samples', '/developers/samples/'],
  ['architecture', '/developers/architecture/'],
  ['security', '/developers/security/'],
  ['timeline', '/developers/timeline/'],
  ['sla', '/sla/'],
]

export default function sitemap() {
  const base = site.url.replace(/\/+$/, '')
  const entries = [{ url: `${base}/`, changeFrequency: 'monthly', priority: 1 }]
  for (const [slug, pathname] of DOC_PATHS) {
    if (!documentationExists(slug)) continue
    const doc = getDocumentation(slug)
    if (['draft', 'foundation', 'planned'].includes(doc.status)) continue
    entries.push({ url: `${base}${pathname}`, lastModified: doc.updated, changeFrequency: 'monthly', priority: slug === 'developers' ? 0.8 : 0.6 })
  }
  return entries
}
