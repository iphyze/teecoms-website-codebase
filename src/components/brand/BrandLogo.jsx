import { brandAssets } from '@/config/site'

/**
 * Renders both logo variants and lets CSS show the right one for the
 * current theme, so there is no flash or hydration mismatch. The hidden
 * variant is display:none, so browsers never download it.
 *
 * brand    "teecoms" | "digitalinvoice"
 * tone     "auto" follows the theme; "on-dark" is for navy bands in either theme
 * compact  DigitalInvoice without its tagline; use it below ~64px tall,
 *          where the tagline is too small to read
 */
const BrandLogo = ({
  brand = 'teecoms',
  tone = 'auto',
  compact = false,
  height = 40,
  className = '',
  priority = false,
}) => {
  const isDi = brand === 'digitalinvoice'
  const asset = brandAssets[isDi ? 'digitalInvoice' : 'teecoms']
  const lightSrc = isDi && compact ? asset.compactLight : asset.light
  const darkSrc = isDi && compact ? asset.compactDark : asset.dark
  const width = Math.round((asset.width / asset.height) * height)
  const alt = isDi ? 'DigitalInvoice by Teecoms' : 'Teecoms Integrated Solutions Limited'
  const imgProps = {
    width,
    height,
    decoding: 'async',
    loading: priority ? 'eager' : 'lazy',
    fetchPriority: priority ? 'high' : undefined,
    style: { width: 'auto', height },
  }

  if (tone === 'on-dark') {
    return <img src={darkSrc} alt={alt} className={className} {...imgProps} />
  }

  return (
    <span className={className} style={{ display: 'inline-flex' }}>
      <img src={lightSrc} alt={alt} className="on-light-only" {...imgProps} />
      <img src={darkSrc} alt="" aria-hidden="true" className="on-dark-only" {...imgProps} />
    </span>
  )
}

export default BrandLogo
