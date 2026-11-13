import { FileText } from 'lucide-react'
import DownloadButton from './DownloadButton'
import styles from './SampleCard.module.css'

/** One safely labeled, fictional document state; no broken download buttons. */
export default function SampleCard({ title, type, preview, pdf, description, pending = false }) {
  return (
    <article className={styles.card}>
      <div className={styles.preview}>
        {preview ? (
          <img src={preview} alt={`Preview of fictional ${title}`} loading="lazy" />
        ) : (
          <div className={styles.previewPlaceholder}>
            <FileText size={32} strokeWidth={1.5} aria-hidden="true" />
            <span>Preview pending generation</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.type}>{type}</span>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <span className={styles.note}>Fictional sample · demonstration data</span>
        {pdf && !pending ? (
          <DownloadButton href={pdf}>Download sample PDF</DownloadButton>
        ) : (
          <span className={styles.pending} role="status">PDF download pending generation</span>
        )}
      </div>
    </article>
  )
}
