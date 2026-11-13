import { ClipboardCheck, FileLock2, HardHat } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import styles from './CommitmentsSection.module.css'

const ICONS = { ClipboardCheck, HardHat, FileLock2 }

/** Corporate commitments: the always-navy band from the approved section preview. */
export default function CommitmentsSection({ content }) {
  return (
    <section
      id="commitments"
      className={styles.section}
      aria-labelledby="commitments-title"
    >
      <div className="container">
        <Reveal className={styles.head}>
          <div>
            <Eyebrow tone="light">{content.eyebrow}</Eyebrow>
            <h2 id="commitments-title" className={styles.title}>
              {content.title}
            </h2>
          </div>
          <p className={styles.intro}>{content.intro}</p>
        </Reveal>

        <Reveal as="ul" stagger className={styles.grid}>
          {content.items.map(({ icon, title, tagline, body }) => {
            const Icon = ICONS[icon]
            return (
              <li key={title} className={styles.item}>
                <article className={styles.card}>
                  <span className={styles.iconTile} aria-hidden="true">
                    <Icon size={22} strokeWidth={1.9} />
                  </span>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.tagline}>{tagline}</p>
                  <p className={styles.body}>{body}</p>
                </article>
              </li>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
