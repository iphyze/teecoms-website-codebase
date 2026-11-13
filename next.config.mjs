import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

// Static export: `npm run build` writes a deployable site to /out.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  allowedDevOrigins: ['192.168.100.7'],
  images: {
    unoptimized: true,
  },
}

/**
 * During `npm run dev`, the contact form's PHP mailer (public/api/contact.php)
 * is forwarded to PHP's built-in server, because the Next.js dev server can't
 * run PHP (posting to the file directly returns 405). Start PHP alongside the
 * dev server with `npm run dev:php`. Production builds are unchanged.
 *
 * `beforeFiles` is required: plain rewrites run after /public files are
 * matched, so the static contact.php would still win.
 */
export default function config(phase) {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig

  const php = (process.env.CONTACT_DEV_PHP_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')
  // Rewrites aren't supported together with static export, so dev runs without it
  const { output: _staticExport, ...devConfig } = nextConfig
  return {
    ...devConfig,
    async rewrites() {
      return {
        beforeFiles: [{ source: '/api/contact.php', destination: `${php}/api/contact.php` }],
      }
    },
  }
}
