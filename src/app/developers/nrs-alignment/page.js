import { getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import DocsLayout from '@/components/docs/DocsLayout'

const document = getDocumentation('nrs-alignment')
export const metadata = docsMetadata(document, '/developers/nrs-alignment/')

/** Public, static, evidence-labelled NRS v1.1 comparison; never a certification badge. */
export default function NrsAlignmentPage() {
  return <DocsLayout document={document} breadcrumbs={[{ label: 'Developers', href: '/developers/' }]} />
}
