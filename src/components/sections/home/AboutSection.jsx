import {
  Cloud,
  Code2,
  Compass,
  Cpu,
  Eye,
  MonitorCog,
  Server,
  Settings2,
  ShieldCheck,
  Target,
  Users,
  Workflow,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import styles from './AboutSection.module.css'

const ICONS = { Cloud, Code2, Compass, Cpu, MonitorCog, Server, Settings2, ShieldCheck, Users, Workflow }

const AboutSection = ({ content }) => {
  const { mission, vision } = content

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className="container">
        {/* Centred introduction */}
        <Reveal className={styles.intro}>
          <Eyebrow className={styles.eyebrow}>{content.eyebrow}</Eyebrow>
          <h2 id="about-title" className={styles.title}>{content.title}</h2>
          <p className={styles.lead}>{content.lead}</p>
          <p className={styles.body}>{content.paragraphs[1]}</p>
        </Reveal>

        {/* Technology, people and processes */}
        <Reveal as="ul" stagger className={styles.pillars}>
          {content.pillars.map(({ icon, title, body }, index) => {
            const Icon = ICONS[icon]
            return (
              <li key={title} className={styles.pillarItem}>
                <div className={styles.pillar} data-tone={index === 1 ? 'green' : 'blue'}>
                  <span className={styles.pillarIcon}>
                    <Icon size={24} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className={styles.pillarTitle}>{title}</h3>
                  <p className={styles.pillarBody}>{body}</p>
                </div>
              </li>
            )
          })}
        </Reveal>

        <Reveal className={styles.closingWrap}>
          <p className={styles.closing}>
            <strong>{content.closing.strong}</strong>
            {content.closing.rest}
          </p>
          <Button href={content.cta.href} variant="outline">
            {content.cta.label}
          </Button>
        </Reveal>
      </div>

      {/* Full-width expertise ribbon; scrolls only while on screen */}
      <Reveal className={styles.marquee} role="group" aria-label={content.expertiseLabel}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.group} aria-hidden={copy === 1 || undefined}>
              {content.expertise.map(({ icon, label }) => {
                const Icon = ICONS[icon]
                return (
                  <li key={label} className={styles.chip}>
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                    {label}
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
      </Reveal>

      <div className="container">
        <Reveal stagger className={styles.cards}>
          <article className={styles.card}>
            <span className={styles.cardIcon}><Target size={20} strokeWidth={2} aria-hidden="true" /></span>
            <p className={styles.cardLabel}>{mission.label}</p>
            <h3 className={styles.cardTitle}>{mission.title}</h3>
            <p className={styles.cardBody}>{mission.body}</p>
          </article>
          <article className={`${styles.card} ${styles.cardDark}`}>
            <span className={styles.cardIcon}><Eye size={20} strokeWidth={2} aria-hidden="true" /></span>
            <p className={styles.cardLabel}>{vision.label}</p>
            <h3 className={styles.cardTitle}>{vision.title}</h3>
            <p className={styles.cardBody}>{vision.body}</p>
          </article>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutSection
