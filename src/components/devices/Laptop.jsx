import styles from './Laptop.module.css'

/**
 * Laptop frame. Children render inside a 16:10 screen that is a size
 * container, so screen content can scale with `cqw` units.
 */
const Laptop = ({ children, className = '' }) => (
  <div className={`${styles.laptop} ${className}`}>
    <div className={styles.lid}>
      <span className={styles.camera} />
      <div className={styles.screen}>{children}</div>
    </div>
    <div className={styles.base}>
      <span className={styles.notch} />
    </div>
  </div>
)

export default Laptop
