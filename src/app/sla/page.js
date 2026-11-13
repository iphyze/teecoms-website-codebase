import { getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import DocsLayout from '@/components/docs/DocsLayout'

const document = getDocumentation('sla')

export const metadata = docsMetadata(document, '/sla/')

/** Statically exported page. The Markdown status drives its draft/approved state. */
export default function ServiceLevelAgreementPage() {
  return (
    <DocsLayout
      document={document}
      breadcrumbs={[{ label: 'Developers', href: '/developers/' }]}
    />
  )
}
