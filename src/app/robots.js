import { site } from '@/config/site'

// Required by `output: 'export'`: generate this file once at build time.
export const dynamic = 'force-static'

/** Draft pages use <meta name="robots" content="noindex">, not robots disallow. */
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('/sitemap.xml', site.url).toString(),
  }
}
