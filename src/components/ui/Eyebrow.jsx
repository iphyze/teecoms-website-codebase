import styles from './Eyebrow.module.css'

/**
 * Small section heading with a short gradient line before it.
 * tone  "brand" (default, on page backgrounds) · "di" (DigitalInvoice) · "light" (on navy bands)
 */
const Eyebrow = ({ children, tone = 'brand', className = '' }) => (
  <p className={`${styles.eyebrow} ${className}`} data-tone={tone}>
    {children}
  </p>
)

export default Eyebrow
