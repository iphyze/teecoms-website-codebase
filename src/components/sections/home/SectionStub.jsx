// TEMPORARY placeholder so navigation anchors and scroll-spy can be tested.
// Each stub is replaced by its real section in the following steps.
import styles from './SectionStub.module.css'

const SectionStub = ({ id, eyebrow, title }) => (
  <section id={id} className={styles.stub}>
    <div className="container">
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.note}>Section content arrives in the next build step.</p>
    </div>
  </section>
)

export default SectionStub
