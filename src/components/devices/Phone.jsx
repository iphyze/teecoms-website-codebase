import styles from './Phone.module.css'

/**
 * Phone frame (9:19) with a Dynamic Island. Children render inside a screen
 * that is a size container, so content can scale with `cqw` units.
 */
const Phone = ({ children, className = '' }) => (
  <div className={`${styles.phone} ${className}`}>
    <div className={styles.screen}>
      <span className={styles.island} />
      {children}
    </div>
  </div>
)

export default Phone
