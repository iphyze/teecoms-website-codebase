import { Expand } from 'lucide-react'
import styles from './DiagramFigure.module.css'

/** SVGs are rendered at build time and open in a new tab for full-size viewing. */
export default function DiagramFigure({ src, alt, title, caption }) {
  return (
    <figure className={styles.figure}>
      {title && <strong>{title}</strong>}
      <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size diagram: ${alt}`}>
        <img src={src} alt={alt} loading="lazy" />
        <span className={styles.expand}><Expand size={16} aria-hidden="true" /> View full size</span>
      </a>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
