import { getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import DocsLayout from '@/components/docs/DocsLayout'

const document = getDocumentation('timeline')
export const metadata = docsMetadata(document, '/developers/timeline/')

/** Static, printable programme timeline. The Mermaid diagram is pre-rendered. */
export default function TimelinePage() {
  return <DocsLayout document={document} breadcrumbs={[{ label: 'Developers', href: '/developers/' }]} />
}
