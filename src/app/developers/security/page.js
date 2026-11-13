import { getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import DocsLayout from '@/components/docs/DocsLayout'

const document = getDocumentation('security')

export const metadata = docsMetadata(document, '/developers/security/')

/** Source-grounded controls; no certification or deployment attestations. */
export default function SecurityPage() {
  return <DocsLayout document={document} breadcrumbs={[{ label: 'Developers', href: '/developers/' }]} />
}
