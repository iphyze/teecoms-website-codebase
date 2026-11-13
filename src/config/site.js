export const THEME_STORAGE_KEY = 'teecoms-theme'

// Only allow actual web addresses in external, visitor-facing links.
// Empty/invalid values never produce a broken or unsafe outbound link.
const publicWebUrl = (value) => {
  try {
    if (!value?.trim()) return ''
    const url = new URL(value.trim())
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

export const site = {
  name: 'Teecoms Integrated Solutions Limited',
  shortName: 'Teecoms',
  tagline: 'Connecting People. Securing Systems. Transforming Businesses.',
  description:
    'Innovative ICT, telecommunications and digital transformation solutions for a connected future.',
  // Set NEXT_PUBLIC_SITE_URL in .env for production so canonical and Open Graph URLs resolve
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'en_NG',
  // Live DigitalInvoice app address. Empty: the button scrolls to the feature list instead
  digitalInvoiceUrl: publicWebUrl(process.env.NEXT_PUBLIC_DIGITALINVOICE_URL),
  // Optional product demo booking / walkthrough destination.
  digitalInvoiceDemoUrl: publicWebUrl(process.env.NEXT_PUBLIC_DIGITALINVOICE_DEMO_URL),
  // Only verified DigitalInvoice profiles should be linked.
  digitalInvoiceSocial: {
    linkedin: publicWebUrl(process.env.NEXT_PUBLIC_DIGITALINVOICE_LINKEDIN_URL),
    facebook: publicWebUrl(process.env.NEXT_PUBLIC_DIGITALINVOICE_FACEBOOK_URL),
    twitter: publicWebUrl(process.env.NEXT_PUBLIC_DIGITALINVOICE_TWITTER_URL),
    instagram: publicWebUrl(process.env.NEXT_PUBLIC_DIGITALINVOICE_INSTAGRAM_URL),
    whatsapp: publicWebUrl(process.env.NEXT_PUBLIC_DIGITALINVOICE_WHATSAPP_URL),
  },
  // Previously published Teecoms contact details; production variables can override.
  // Recheck the mailbox/number are operational before submitting contractual documents.
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@teecomsintegratedsolutions.ng',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+2347038020088',
    // Verified office address (company profile); NEXT_PUBLIC_CONTACT_ADDRESS overrides it
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'No. 12 Olayiwola Liasu Street, Polar Bed, along Sadiku Road, off Oshodi–Apapa Expressway, Lagos',
  },
}

// Homepage section anchors, plus a permanent Developers route
export const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'DigitalInvoice', href: '#digitalinvoice' },
  { label: 'Our Team', href: '#team' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Developers', href: '/developers/' },
]

export const brandAssets = {
  teecoms: {
    light: '/images/brand/teecoms-logo-light.webp',
    dark: '/images/brand/teecoms-logo-dark.webp',
    stackedLight: '/images/brand/teecoms-logo-stacked-light.webp',
    stackedDark: '/images/brand/teecoms-logo-stacked-dark.webp',
    markLight: '/images/brand/teecoms-mark-light.webp',
    markDark: '/images/brand/teecoms-mark-dark.webp',
    width: 1269,
    height: 210,
  },
  digitalInvoice: {
    light: '/images/digitalinvoice/digitalinvoice-logo-light.svg',
    dark: '/images/digitalinvoice/digitalinvoice-logo-dark.svg',
    compactLight: '/images/digitalinvoice/digitalinvoice-logo-compact-light.svg',
    compactDark: '/images/digitalinvoice/digitalinvoice-logo-compact-dark.svg',
    icon: '/images/digitalinvoice/digitalinvoice-icon.svg',
    width: 2392,
    height: 510,
  },
}
