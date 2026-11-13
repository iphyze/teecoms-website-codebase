import styles from './MethodBadge.module.css'

const METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
export default function MethodBadge({ method = 'GET' }) {
  const label = String(method).toUpperCase()
  if (!METHODS.has(label)) return null
  return <span className={styles.badge} data-method={label}>{label}</span>
}
