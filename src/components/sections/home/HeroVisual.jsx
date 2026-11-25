import {
  Activity,
  CheckCircle2,
  Cloud,
  Code2,
  FileText,
  Layers3,
  LockKeyhole,
  MonitorCog,
  Network,
  ReceiptText,
  ServerCog,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import styles from './HeroVisual.module.css'

/**
 * Product-led preview for the public Teecoms hero. The graphic describes the
 * company's published service areas; it intentionally avoids fabricated
 * customers, financial metrics, uptime statistics, or NRS clearance evidence.
 * The hero's approved titles/descriptions/buttons come from home.content.js.
 */
const experiences = {
  network: {
    title: 'Teecoms',
    subtitle: 'Technology, people and processes',
    flow: [
      { label: 'ICT infrastructure', icon: ServerCog },
      { label: 'Cybersecurity', icon: ShieldCheck },
      { label: 'Digital transformation', icon: Workflow },
    ],
    sections: [
      { label: 'Cloud & hosting', icon: Cloud },
      { label: 'Software & applications', icon: Code2 },
      { label: 'Managed IT operations', icon: MonitorCog },
    ],
  },
  infrastructure: {
    title: 'Infrastructure',
    subtitle: 'Built for Performance',
    flow: [
      { label: 'IT Infrastructure Services', icon: ServerCog },
      { label: 'Cloud & Hosting Services', icon: Cloud },
      { label: 'Managed ICT Services', icon: MonitorCog },
    ],
    sections: [
      { label: 'Connectivity', icon: Network },
      { label: 'Cybersecurity', icon: ShieldCheck },
      { label: 'Business continuity', icon: CheckCircle2 },
    ],
  },
  transformation: {
    title: 'Transformation',
    subtitle: 'Technology That Works for You',
    flow: [
      { label: 'Digital Transformation & Advisory', icon: Workflow },
      { label: 'Software & Application Services', icon: Code2 },
      { label: 'Cybersecurity & Compliance Services', icon: ShieldCheck },
    ],
    sections: [
      { label: 'Technology consultancy', icon: Layers3 },
      { label: 'Managed IT operations', icon: MonitorCog },
      { label: 'Cloud & hosting', icon: Cloud },
    ],
  },
  digitalinvoice: {
    title: 'DigitalInvoice',
    subtitle: 'Smarter Invoicing. Simpler Business.',
    flow: [
      { label: 'Invoice management', icon: ReceiptText },
      { label: 'Transaction visibility', icon: Activity },
      { label: 'Digital workflows', icon: Workflow },
    ],
    sections: [
      { label: 'Invoice management', icon: FileText },
      { label: 'Transaction visibility', icon: Activity },
      { label: 'Digital workflows', icon: LockKeyhole },
    ],
  },
}

const CHART_POINTS = '0,89 62,79 123,85 184,48 245,60 307,38 368,45 429,21 490,29 550,5'

export const getHeroExperience = (type) => experiences[type] || experiences.network

export function HeroFlow({ type }) {
  const experience = getHeroExperience(type)
  return (
    <div className={styles.flow} aria-label="Featured capabilities">
      {experience.flow.map(({ label, icon: Icon }, index) => (
        <div className={styles.flowPart} key={label}>
          {index > 0 ? <span className={styles.connector} aria-hidden="true" /> : null}
          <div className={styles.flowChip}>
            <span className={styles.flowIcon}><Icon size={19} strokeWidth={2.1} aria-hidden="true" /></span>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HeroVisual({ type }) {
  const experience = getHeroExperience(type)
  return (
    <div className={styles.stage} data-experience={type}>
      <div className={styles.window}>
        <div className={styles.windowTop}>
          <div className={styles.windowBrand}>
            <span className={styles.brandMark}><Layers3 size={17} strokeWidth={2.4} /></span>
            <span><strong>{experience.title}</strong><small>{experience.subtitle}</small></span>
          </div>
          <div className={styles.windowDots} aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className={styles.windowBody}>
          <aside className={styles.sideNavigation} aria-hidden="true">
            <span className={styles.navActive}><Activity size={16} /> Overview</span>
            {experience.sections.map(({ label, icon: Icon }) => (
              <span key={label}><Icon size={16} /> {label}</span>
            ))}
          </aside>
          <div className={styles.workspace}>
            <div className={styles.workspaceHeading}>
              <div>
                <span className={styles.kicker}>Teecoms Integrated Solutions</span>
                <strong>{experience.title}</strong>
              </div>
              <span className={styles.status}><span className={styles.statusDot} /> Illustrative preview</span>
            </div>
            <div className={styles.chartCard}>
              <div className={styles.chartTop}>
                <span>Technology solutions</span>
                <span className={styles.chartIcon}><Activity size={16} /></span>
              </div>
              <svg className={styles.chart} viewBox="0 0 550 114" preserveAspectRatio="none" role="img" aria-label="Illustrative flowing line chart">
                <defs>
                  <linearGradient id={`hero-area-${type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--preview-chart)" stopOpacity=".26" />
                    <stop offset="1" stopColor="var(--preview-chart)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M ${CHART_POINTS.replaceAll(' ', ' L ')} L 550,114 L 0,114 Z`} fill={`url(#hero-area-${type})`} />
                <polyline className={styles.chartLine} points={CHART_POINTS} />
              </svg>
            </div>
            <div className={styles.previewCards}>
              {experience.sections.map(({ label, icon: Icon }, index) => (
                <div className={styles.previewCard} key={label} style={{ '--meter-width': `${52 + index * 13}%` }}>
                  <span><Icon size={18} strokeWidth={2} /></span>
                  <strong>{label}</strong>
                  <i aria-hidden="true" className={styles.meter}><b /></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.floatCard} ${styles.floatLeft}`} aria-hidden="true">
        <span className={styles.floatIcon}><ShieldCheck size={21} /></span>
        <div><strong>Cybersecurity</strong><small>Security & compliance</small></div>
        <CheckCircle2 size={16} className={styles.floatCheck} />
      </div>
      <div className={`${styles.floatCard} ${styles.floatRight}`} aria-hidden="true">
        <span className={styles.floatIcon}><Cloud size={21} /></span>
        <div><strong>Cloud & hosting</strong><small>Digital infrastructure</small></div>
      </div>
    </div>
  )
}
