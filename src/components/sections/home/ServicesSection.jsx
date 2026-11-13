'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Activity,
  BookOpen,
  Braces,
  ChevronRight,
  Cloud,
  Code2,
  Compass,
  Database,
  Fingerprint,
  Globe,
  GraduationCap,
  Lightbulb,
  Lock,
  MessageSquare,
  MonitorCog,
  Network,
  Presentation,
  Router,
  Server,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Users,
  Workflow,
  Wrench,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import styles from './ServicesSection.module.css'

const ICONS = { Cloud, Code2, GraduationCap, MonitorCog, Presentation, Server, ShieldCheck, Workflow }

// Two small accent icons float in each service's showcase visual
const ACCENTS = {
  Server: [Network, Router],
  Cloud: [Database, Globe],
  ShieldCheck: [Lock, Fingerprint],
  MonitorCog: [Activity, Wrench],
  Code2: [Braces, Smartphone],
  Workflow: [Compass, TrendingUp],
  GraduationCap: [Users, BookOpen],
  Presentation: [Lightbulb, Users],
}

const pad = (n) => String(n).padStart(2, '0')

/**
 * Services "Explorer": a list of services beside a showcase panel.
 * Desktop: the panel sits to the right and stays in view while scrolling.
 * Mobile: the same panel moves directly below the chosen service (accordion).
 * Each service is a button with aria-expanded, controlling the one panel.
 */
export default function ServicesSection({ content }) {
  const items = content.items
  const [active, setActive] = useState(0)
  const tabs = useRef([])

  const select = useCallback((index, { focus = false } = {}) => {
    setActive(index)
    if (focus) tabs.current[index]?.focus()
    // On the stacked mobile layout, keep the chosen service in view as the panel moves
    if (window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() => tabs.current[index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
    }
  }, [])

  const onKeyDown = (event, index) => {
    const last = items.length - 1
    const keys = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    if (event.key in keys) {
      event.preventDefault()
      select(keys[event.key], { focus: true })
    }
  }

  const item = items[active]
  const Icon = ICONS[item.icon]
  const [AccentA, AccentB] = ACCENTS[item.icon] || [Network, Globe]

  // Preselects this service in the contact form (ContactForm listens for the event)
  const discuss = () => {
    window.dispatchEvent(new CustomEvent('teecoms:select-service', { detail: item.title }))
  }

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className="container">
        <Reveal className={styles.head}>
          <div>
            <Eyebrow>{content.eyebrow}</Eyebrow>
            <h2 id="services-title" className={styles.title}>{content.title}</h2>
          </div>
          <p className={styles.intro}>{content.intro}</p>
        </Reveal>

        <Reveal stagger className={styles.explorer} style={{ '--active': active }}>
          {items.map((service, index) => (
            <button
              key={service.title}
              ref={(node) => { tabs.current[index] = node }}
              id={`service-tab-${index}`}
              type="button"
              className={styles.tab}
              style={{ '--i': index }}
              aria-expanded={index === active}
              aria-controls="services-panel"
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className={`num ${styles.num}`}>{pad(index + 1)}</span>
              <span className={styles.tabText}>
                <strong>{service.title}</strong>
                <small>{service.tagline}</small>
              </span>
              <ChevronRight className={styles.chev} size={18} aria-hidden="true" />
            </button>
          ))}

          <div id="services-panel" className={styles.panel} role="region" aria-labelledby={`service-tab-${active}`}>
            <div className={styles.visual} aria-hidden="true">
              <span className={styles.ring} />
              <span className={`${styles.ring} ${styles.ringLarge}`} />
              <span key={`a-${active}`} className={`${styles.accent} ${styles.accentA}`}><AccentA size={18} /></span>
              <span key={`b-${active}`} className={`${styles.accent} ${styles.accentB}`}><AccentB size={18} /></span>
              <span key={`i-${active}`} className={styles.bigIcon}><Icon size={44} strokeWidth={1.8} /></span>
              <span className={`num ${styles.count}`}>
                <b>{pad(active + 1)}</b> / {pad(items.length)}
              </span>
            </div>

            <div key={`body-${active}`} className={styles.body}>
              <h3 className={styles.panelTitle}>{item.title}</h3>
              <p className={styles.tagline}>{item.tagline}</p>
              <p className={styles.description}>{item.body}</p>
              <div className={styles.actions}>
                <Button href="#contact" onClick={discuss}>Discuss this service</Button>
                <a href="#contact" className={styles.textLink}>
                  <MessageSquare size={16} aria-hidden="true" />
                  Or ask about anything else
                </a>
              </div>
              <div className={styles.progress} aria-hidden="true">
                {items.map((service, index) => (
                  <i key={service.title} data-on={index === active} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className={styles.ctaRow}>
          <Button href={content.cta.href} variant="outline">{content.cta.label}</Button>
        </Reveal>
      </div>
    </section>
  )
}
