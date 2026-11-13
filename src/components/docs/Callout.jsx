import styles from './Callout.module.css'

export default function Callout({ tone = 'info', title, children }) {
  return (
    <aside className={styles.callout} data-tone={tone}>
      <strong>{title || ({ info: 'Note', warning: 'Important', planned: 'Planned' }[tone] || 'Note')}</strong>
      <div>{children}</div>
    </aside>
  )
}
