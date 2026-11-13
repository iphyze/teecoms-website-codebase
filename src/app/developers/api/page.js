import { getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import DocsLayout from '@/components/docs/DocsLayout'

const document = getDocumentation('api')

export const metadata = docsMetadata(document, '/developers/api/')

/** Build-time, statically exported public API reference. */
export default function ApiDocumentationPage() {
  return (
    <DocsLayout
      document={document}
      breadcrumbs={[{ label: 'Developers', href: '/developers/' }]}
    />
  )
}
