import { ArrowUpRight, CalendarRange, ClipboardCheck, Code2, Database, FileText, Network, ScrollText, ShieldCheck } from 'lucide-react'
import styles from './DocsCard.module.css'

const ICONS = { CalendarRange, ClipboardCheck, Code2, Database, FileText, Network, ScrollText, ShieldCheck }

/** Server-rendered hub card: status comes from the corresponding Markdown metadata. */
export default function DocsCard({ title, description, href, icon = 'FileText', available = true, statusLabel = '', statusTone = 'neutral' }) {
  const Icon = ICONS[icon] || FileText
  const content = (
    <>
      <div className={styles.icon}><Icon size={21} aria-hidden="true" /></div>
      <div className={styles.heading}>
        <h3>{title}</h3>
        {available && <ArrowUpRight size={18} aria-hidden="true" />}
      </div>
      <p>{description}</p>
      {statusLabel && <span className={styles.status} data-tone={statusTone}>{statusLabel}</span>}
    </>
  )
  return available
    ? <a href={href} className={styles.card}>{content}</a>
    : <div className={styles.card} data-pending="true">{content}</div>
}
