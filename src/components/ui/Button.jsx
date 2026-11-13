import styles from './Button.module.css'

/**
 * Button / link styled as a button.
 *
 * variant  "primary" Teecoms blue · "di" DigitalInvoice green
 *          "glass" outline for navy bands · "outline" theme-aware outline
 * size     "md" (46px) · "sm" (40px, header)
 * shine    true loops a soft light sweep (hero CTAs only); otherwise it plays on hover
 */
const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" />
  </svg>
)

const Button = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  arrow = true,
  shine = false,
  className = '',
  ...rest
}) => {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      href={href}
      type={href ? undefined : rest.type || 'button'}
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-size={size}
      data-shine={shine ? 'loop' : 'hover'}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
      {arrow ? (
        // Two arrows: on hover the first slides out right, the second slides in
        <span className={styles.arrow}>
          <Arrow />
          <Arrow />
        </span>
      ) : null}
    </Tag>
  )
}

export default Button
