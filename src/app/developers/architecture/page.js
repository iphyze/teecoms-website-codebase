import { getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import DocsLayout from '@/components/docs/DocsLayout'

const document = getDocumentation('architecture')

export const metadata = docsMetadata(document, '/developers/architecture/')

/** Public static HTML with theme-aware local diagrams; no runtime Mermaid. */
export default function ArchitecturePage() {
  return <DocsLayout document={document} breadcrumbs={[{ label: 'Developers', href: '/developers/' }]} />
}
