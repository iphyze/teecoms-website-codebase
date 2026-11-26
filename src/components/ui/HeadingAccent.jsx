import styles from './HeadingAccent.module.css'

/** Style selected phrases without rewriting the approved heading copy. */
export default function HeadingAccent({ title, phrases }) {
  const parts = []
  let cursor = 0
  // Phrases are supplied in reading order. Missing phrases leave copy intact.
  for (const phrase of phrases) {
    const start = title.indexOf(phrase, cursor)
    if (start < 0) continue
    parts.push(title.slice(cursor, start))
    parts.push(<span key={start} className={styles.accent}>{phrase}</span>)
    cursor = start + phrase.length
  }
  parts.push(title.slice(cursor))
  return <>{parts}</>
}
