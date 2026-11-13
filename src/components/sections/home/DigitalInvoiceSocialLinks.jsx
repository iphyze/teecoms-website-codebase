import styles from './DigitalInvoiceSocialLinks.module.css'

// Lucide intentionally does not export trademarked social-media brand icons.
// Keep these icons local so upgrading lucide-react cannot break the site.
function BrandSvg({ size = 19, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

function Linkedin({ size = 19 }) {
  return (
    <BrandSvg size={size}>
      <circle cx="4.8" cy="5.25" r="1.8" />
      <path d="M3.2 9h3.3v11.1H3.2V9Zm6.05 0h3.15v1.5c.64-1.07 1.78-1.76 3.37-1.76 3.33 0 4.06 2.19 4.06 4.93v6.43h-3.3v-5.75c0-1.38-.08-2.64-1.91-2.64-1.79 0-2.08 1.32-2.08 2.55v5.84H9.25V9Z" />
    </BrandSvg>
  )
}

function Facebook({ size = 19 }) {
  return (
    <BrandSvg size={size}>
      <path d="M14.2 21v-8h2.7l.42-3.3H14.2V7.62c0-.96.28-1.61 1.64-1.61h1.69V3.08A22.2 22.2 0 0 0 15.04 3c-2.61 0-4.41 1.61-4.41 4.55V9.7H8V13h2.63v8h3.57Z" />
    </BrandSvg>
  )
}

function Twitter({ size = 19 }) {
  return (
    <BrandSvg size={size}>
      <path d="M22.16 5.35a8.2 8.2 0 0 1-2.4.65 4.15 4.15 0 0 0 1.82-2.29 8.23 8.23 0 0 1-2.64 1.01 4.14 4.14 0 0 0-7.06 3.77A11.75 11.75 0 0 1 3.35 4.16a4.14 4.14 0 0 0 1.28 5.52 4.1 4.1 0 0 1-1.87-.52v.05a4.14 4.14 0 0 0 3.32 4.06 4.15 4.15 0 0 1-1.86.07 4.14 4.14 0 0 0 3.87 2.88 8.31 8.31 0 0 1-5.14 1.77c-.33 0-.66-.02-.99-.06a11.71 11.71 0 0 0 6.35 1.86c7.61 0 11.77-6.3 11.77-11.77l-.01-.54a8.4 8.4 0 0 0 2.09-2.15Z" />
    </BrandSvg>
  )
}

function Instagram({ size = 19 }) {
  return (
    <BrandSvg size={size}>
      <rect x="2.85" y="2.85" width="18.3" height="18.3" rx="5.15" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <circle cx="12" cy="12" r="4.15" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <circle cx="17.45" cy="6.55" r="1.35" />
    </BrandSvg>
  )
}

function WhatsAppIcon({ size = 19 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M20.25 11.72a8.25 8.25 0 0 1-12.23 7.2L3 20.25l1.34-4.81a8.25 8.25 0 1 1 15.91-3.72Z"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.6 8.3c-.36-.38-.61-.16-.84.09-.26.29-.49.78-.35 1.32.37 1.56 2.83 4.64 5.75 5.33.57.13 1.05-.08 1.46-.52l.27-.43c.13-.22.07-.44-.17-.56l-1.67-.74c-.23-.1-.38-.05-.52.12l-.57.7c-.79-.25-2.12-1.41-2.55-2.19l.61-.65c.15-.16.18-.35.08-.56L9.2 8.69c-.14-.31-.31-.42-.6-.39Z"
        fill="currentColor" />
    </svg>
  )
}

const platforms = [
  { key: 'linkedin', name: 'LinkedIn', Icon: Linkedin },
  { key: 'facebook', name: 'Facebook', Icon: Facebook },
  { key: 'twitter', name: 'Twitter', Icon: Twitter },
  { key: 'instagram', name: 'Instagram', Icon: Instagram },
  { key: 'whatsapp', name: 'WhatsApp', Icon: WhatsAppIcon },
]

/** Icons remain visible as inactive previews until verified profile URLs are configured. */
export default function DigitalInvoiceSocialLinks({ title, links = {}, tone = 'page', compact = false }) {
  return (
    <div className={styles.social} data-tone={tone} data-compact={compact || undefined} aria-label="DigitalInvoice social media">
      <p className={styles.heading}>{title}</p>
      <ul className={styles.list}>
        {platforms.map(({ key, name, Icon }) => (
          <li key={key}>
            {links[key] ? (
              <a
                className={styles.icon}
                href={links[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`DigitalInvoice on ${name} (opens in a new tab)`}
                title={`DigitalInvoice on ${name}`}
              >
                <Icon size={19} />
              </a>
            ) : (
              <span className={`${styles.icon} ${styles.unconfigured}`} title={`${name} profile not configured`} aria-hidden="true">
                <Icon size={19} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
