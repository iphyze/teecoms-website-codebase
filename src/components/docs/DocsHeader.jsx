import { ChevronRight, FileDown } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import Button from '@/components/ui/Button'
import DocsCopyLink from './DocsCopyLink'
import styles from './DocsHeader.module.css'

export default function DocsHeader({ document, breadcrumbs = [] }) {
  const { title, description, version, effective, updated, status, pdf } = document
  return (
    <div className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            {breadcrumbs.map((item) => (
              <li key={item.href}>
                <ChevronRight size={14} aria-hidden="true" />
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li aria-current="page"><ChevronRight size={14} aria-hidden="true" /><span>{title}</span></li>
          </ol>
        </nav>
        <Eyebrow>Developer resources</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.bottom}>
          <div className={styles.meta} aria-label="Document information">
            <span>Version {version}</span>
            {effective && <span>Effective {effective}</span>}
            <span>Updated {updated}</span>
            <span className={styles.status} data-status={status}>{status === 'foundation' ? 'In preparation' : status === 'draft' ? 'Draft for management review' : status}</span>
          </div>
          <div className={styles.actions}>
            {pdf && ['published', 'approved'].includes(status) ? <Button href={pdf} variant="outline" size="sm" arrow={false} download><FileDown size={16} aria-hidden="true" /> Download PDF</Button> : null}
            <DocsCopyLink />
          </div>
        </div>
      </div>
    </div>
  )
}
