import {
  Cloud,
  Code2,
  Compass,
  Cpu,
  Eye,
  MonitorCog,
  Quote,
  Server,
  Settings2,
  ShieldCheck,
  Target,
  Users,
  Workflow,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import HeadingAccent from '@/components/ui/HeadingAccent'
import Reveal from '@/components/ui/Reveal'
import styles from './AboutSection.module.css'

const ICONS = {
  Cloud, Code2, Compass, Cpu, MonitorCog, Server, Settings2,
  ShieldCheck, Users, Workflow,
}

/**
 * Story + Metrics layout. All public copy comes from the existing approved
 * home.content.js values. The three pillars replace illustrative numerical
 * metrics; no invented customer counts or testimonials are displayed.
 * The illustrative team collaboration image is separate from leadership portraits.
 */
export default function AboutSection({ content }) {
  const { mission, vision } = content

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className="container">
        <div className={styles.storyGrid}>
          <Reveal from="left" className={styles.mediaWrap}>
            <div className={styles.media}>
              <img
                className={styles.teamPhoto}
                src="/images/about/team-collaboration.webp"
                alt="Illustrative image of two professionals collaborating at a laptop"
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
              <div className={styles.mediaAccents} aria-hidden="true" />
              <div className={styles.mediaCaption}>
                <span className={styles.captionIcon} aria-hidden="true">
                  <Users size={19} strokeWidth={2} />
                </span>
                <span>
                  <strong>{content.sector.title}</strong>
                  <small>{content.sector.note}</small>
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal from="right" className={styles.storyCopy} delay={90}>
            <Eyebrow className={styles.eyebrow}>{content.eyebrow}</Eyebrow>
            <h2 id="about-title" className={styles.title}>
              <HeadingAccent title={content.title} phrases={['Built', 'Your Business']} />
            </h2>
            <p className={styles.lead}>{content.lead}</p>
            <p className={styles.body}>{content.paragraphs[1]}</p>
            <div className={styles.storyActions}>
              <Button href={content.cta.href} variant="primary">
                {content.cta.label}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* The three real Teecoms pillars take the role of the concept's
            metrics band; unlike mockup numbers these have approved copy. */}
        <Reveal as="ul" stagger className={styles.pillars}>
          {content.pillars.map(({ icon, title, body }, index) => {
            const Icon = ICONS[icon]
            return (
              <li key={title} className={styles.pillarItem}>
                <article className={styles.pillar} data-tone={index === 1 ? 'green' : 'blue'}>
                  <span className={styles.pillarIcon} aria-hidden="true">
                    <Icon size={24} strokeWidth={1.9} />
                  </span>
                  <h3 className={styles.pillarTitle}>{title}</h3>
                  <p className={styles.pillarBody}>{body}</p>
                </article>
              </li>
            )
          })}
        </Reveal>

        {/* Brand statement, NOT a fictional customer testimonial. */}
        <Reveal className={styles.statement} from="up">
          <span className={styles.quoteMark} aria-hidden="true">
            <Quote size={28} strokeWidth={2} />
          </span>
          <p className={styles.statementText}>
            <strong>{content.closing.strong}</strong>
            {content.closing.rest}
          </p>
        </Reveal>

        <Reveal as="ul" stagger className={styles.expertise} aria-label={content.expertiseLabel}>
          {content.expertise.map(({ icon, label }) => {
            const Icon = ICONS[icon]
            return (
              <li key={label} className={styles.expertiseItem}>
                <span className={styles.expertiseIcon} aria-hidden="true"><Icon size={19} strokeWidth={1.9} /></span>
                <span>{label}</span>
              </li>
            )
          })}
        </Reveal>

        <Reveal as="ul" stagger className={styles.cards}>
          <li className={styles.cardItem}>
            <article className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true"><Target size={23} strokeWidth={2} /></span>
              <p className={styles.cardLabel}>{mission.label}</p>
              <h3 className={styles.cardTitle}>{mission.title}</h3>
              <p className={styles.cardBody}>{mission.body}</p>
            </article>
          </li>
          <li className={styles.cardItem}>
            <article className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true"><Eye size={23} strokeWidth={2} /></span>
              <p className={styles.cardLabel}>{vision.label}</p>
              <h3 className={styles.cardTitle}>{vision.title}</h3>
              <p className={styles.cardBody}>{vision.body}</p>
            </article>
          </li>
        </Reveal>
      </div>
    </section>
  )
}
