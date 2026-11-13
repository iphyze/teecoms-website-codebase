import { site } from '@/config/site'

export function docsMetadata(document, pathname) {
  const url = new URL(pathname, site.url).toString()
  const isDraft = document.status === 'draft' || document.status === 'foundation' || document.status === 'planned'
  return {
    title: `${document.title} | Teecoms Developers`,
    description: document.description,
    alternates: { canonical: url },
    openGraph: {
      title: document.title,
      description: document.description,
      type: 'article',
      url,
      siteName: site.name,
    },
    robots: { index: !isDraft, follow: true },
  }
}
