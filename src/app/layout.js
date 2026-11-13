import localFont from 'next/font/local'
import ThemeProvider from '@/contexts/ThemeContext'
import { site, THEME_STORAGE_KEY } from '@/config/site'
import { defaultMetaDescription, defaultTitle } from '@/utils/seo'
import '@/styles/tokens.css'
import '@/styles/globals.css'
import '@/styles/docs-print.css'

// Self-hosted Plus Jakarta Sans (variable 200–800). The subset includes the
// Naira sign and Yoruba/Igbo diacritics, which Google's default "latin"
// subset leaves out. Same file is used by the DigitalInvoice app.
const jakarta = localFont({
  src: '../assets/fonts/PlusJakartaSans-Variable.woff2',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-jakarta',
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
})

export const metadata = {
  metadataBase: new URL(site.url),
  title: defaultTitle,
  description: defaultMetaDescription,
  applicationName: site.shortName,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: defaultTitle,
    description: defaultMetaDescription,
    locale: site.locale,
    url: '/',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f8fc' },
    { media: '(prefers-color-scheme: dark)', color: '#09131f' },
  ],
}

// Runs before first paint: applies the saved theme, or the OS preference,
// so dark-mode visitors never see a white flash.
const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t}catch(e){}})()`

export default function RootLayout({ children }) {
  return (
    <html lang="en-NG" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
