import {
  Award,
  BadgeCheck,
  Handshake,
  Leaf,
  Lightbulb,
  Lock,
  Scale,
  Users,
} from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import styles from './WhySection.module.css'

const ICONS = {
  Award,
  BadgeCheck,
  Handshake,
  Leaf,
  Lightbulb,
  Lock,
  Scale,
  Users,
}

const WhySection = ({ content }) => (
  <section id="why" className={styles.section} aria-labelledby="why-title">
    <div className={`container ${styles.layout}`}>
      <div className={styles.sticky}>
        <Reveal from="left">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 id="why-title" className={styles.title}>{content.title}</h2>
        </Reveal>
        <Reveal delay={100} className={styles.intro}>
          <p className={styles.lead}>{content.lead}</p>
          <p className={styles.body}>{content.body}</p>
        </Reveal>
      </div>

      <Reveal as="ul" stagger className={styles.values}>
        {content.values.map(({ icon, title, body }) => {
          const Icon = ICONS[icon]
          return (
            <li key={title} className={styles.value}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={20} strokeWidth={2} />
              </span>
              <div className={styles.valueCopy}>
                <h3 className={styles.valueTitle}>{title}</h3>
                <p className={styles.valueBody}>{body}</p>
              </div>
            </li>
          )
        })}
      </Reveal>
    </div>
  </section>
)

export default WhySection
