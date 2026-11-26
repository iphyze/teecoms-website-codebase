'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Cloud,
  Code2,
  GraduationCap,
  MessageSquare,
  MonitorCog,
  Presentation,
  Server,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import HeadingAccent from '@/components/ui/HeadingAccent'
import Reveal from '@/components/ui/Reveal'
import styles from './ServicesSection.module.css'

const ICONS = { Cloud, Code2, GraduationCap, MonitorCog, Presentation, Server, ShieldCheck, Workflow }
const pad = (n) => String(n).padStart(2, '0')

export default function ServicesSection({ content }) {
  const items = content.items
  const [active, setActive] = useState(null)
  const [closing, setClosing] = useState(null)
  const controls = useRef([])

  // Keep natural grid rows until the closing slide finishes. Restoring equal
  // rows immediately would briefly stretch every row to the open card height.
  useEffect(() => {
    if (closing === null) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setClosing(null)
      return undefined
    }
    // Fallback if a transition is cancelled or the browser skips its end event.
    const timer = window.setTimeout(() => setClosing(null), 400)
    return () => window.clearTimeout(timer)
  }, [closing])

  const toggleDetails = (index, expanded) => {
    setClosing(expanded ? index : null)
    setActive(expanded ? null : index)
  }

  const finishSlide = (event, index) => {
    if (event.target === event.currentTarget && event.propertyName === 'grid-template-rows' && active === null && closing === index) {
      setClosing(null)
    }
  }

  const onKeyDown = (event, index) => {
    const last = items.length - 1
    const next = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    controls.current[next]?.focus()
  }

  // ContactForm listens for this event; retain the exact approved service title.
  const discuss = (title) => {
    window.dispatchEvent(new CustomEvent('teecoms:select-service', { detail: title }))
  }

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className="container">
        <div className={styles.feature}>
          <Reveal from="left" className={styles.photoFrame}>
            <img
              className={styles.photo}
              src="/images/services/technology-collaboration.webp"
              alt="Illustrative image of technology professionals collaborating in front of cloud and network monitoring displays"
              width="508"
              height="356"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal from="right" delay={90} className={styles.featureCopy}>
            <Eyebrow tone="light" className={styles.eyebrow}>{content.eyebrow}</Eyebrow>
            <h2 id="services-title" className={styles.title}><HeadingAccent title={content.title} phrases={['Technology Solutions']} /></h2>
            <p className={styles.intro}>{content.intro}</p>
            <Button href="#service-offerings" className={styles.featureAction}>{content.exploreLabel}</Button>
          </Reveal>
        </div>

        <Reveal className={styles.catalogueHead}>
          <h3 id="service-offerings" className={styles.catalogueTitle}><HeadingAccent title={content.catalogueTitle} phrases={['Technology Services']} /></h3>
        </Reveal>

        <ul className={styles.grid} data-has-expanded={active !== null || closing !== null} aria-labelledby="service-offerings">
          {items.map((service, index) => {
            const Icon = ICONS[service.icon]
            const expanded = index === active
            const titleId = `service-title-${index}`
            const panelId = `service-details-${index}`
            return (
              <Reveal as="li" key={service.title} delay={(index % 4) * 55} className={styles.item}>
                <article className={styles.card} data-expanded={expanded}>
                  <div className={styles.cardTop} aria-hidden="true">
                    <span className={`num ${styles.number}`}>{pad(index + 1)}</span>
                    <span className={styles.icon}><Icon size={27} strokeWidth={1.8} /></span>
                  </div>
                  <h4 id={titleId} className={styles.cardTitle}>{service.title}</h4>
                  <p className={styles.tagline}>{service.tagline}</p>
                  <button
                    ref={(node) => { controls.current[index] = node }}
                    type="button"
                    className={styles.detailsButton}
                    aria-label={`${expanded ? 'Hide details for' : 'Learn more about'} ${service.title}`}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => toggleDetails(index, expanded)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                  >
                    <span>{expanded ? 'Show less' : 'Learn more'}</span>
                    <span className={styles.arrow} aria-hidden="true"><ArrowRight size={19} strokeWidth={2} /></span>
                  </button>
                  <div
                    id={panelId}
                    className={styles.detail}
                    data-expanded={expanded}
                    inert={!expanded}
                    aria-hidden={!expanded}
                    role="region"
                    aria-labelledby={titleId}
                    onTransitionEnd={(event) => finishSlide(event, index)}
                  >
                    <div className={styles.detailClip}>
                      <div className={styles.detailContent}>
                        <p className={styles.description}>{service.body}</p>
                        <Button href="#contact" size="sm" onClick={() => discuss(service.title)}>Discuss this service</Button>
                        <a href="#contact" className={styles.textLink}>
                          <MessageSquare size={16} aria-hidden="true" />
                          Or ask about anything else
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>

        <Reveal delay={100} className={styles.ctaRow}>
          <Button href={content.cta.href} variant="primary">{content.cta.label}</Button>
        </Reveal>
      </div>
    </section>
  )
}
