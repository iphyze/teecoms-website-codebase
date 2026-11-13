import styles from './CodeBlock.module.css'

export default function CodeBlock({ code, language = 'text' }) {
  return (
    <div className={`${styles.block} docs-code`}>
      <div className={styles.bar}><span>{language}</span><button type="button" className="docs-code-copy">Copy code</button></div>
      <pre><code>{code}</code></pre>
    </div>
  )
}
