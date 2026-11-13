import {
  ArrowLeftRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleCheck,
  Factory,
  FileCheck2,
  FileText,
  Fuel,
  GraduationCap,
  HeartPulse,
  Landmark,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Eye,
} from 'lucide-react'
import BrandLogo from '@/components/brand/BrandLogo'
import Laptop from '@/components/devices/Laptop'
import Phone from '@/components/devices/Phone'
import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import { site } from '@/config/site'
import DashboardScreen from './digitalinvoice/DashboardScreen'
import DeviceStage from './digitalinvoice/DeviceStage'
import InvoiceScreen from './digitalinvoice/InvoiceScreen'
import styles from './DigitalInvoiceSection.module.css'

const ICONS = {
  ArrowLeftRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Eye,
  Factory,
  FileCheck2,
  FileText,
  Fuel,
  GraduationCap,
  HeartPulse,
  Landmark,
  Receipt,
  ShieldCheck,
  ShoppingCart,
}

const DigitalInvoiceSection = ({ content }) => {
  const discoverHref = site.digitalInvoiceUrl || '#digitalinvoice-features'
  const demoHref = site.digitalInvoiceDemoUrl || '#contact'
  const productExternal = Boolean(site.digitalInvoiceUrl)
  const demoExternal = Boolean(site.digitalInvoiceDemoUrl)

  return (
    <section id="digitalinvoice" className={styles.section} aria-labelledby="digitalinvoice-title">
      <div className="container">
        <div className={styles.hero}>
          <Reveal from="left" className={styles.copy}>
            <BrandLogo brand="digitalinvoice" height={56} className={styles.logo} />
            <Eyebrow tone="di">{content.eyebrow}</Eyebrow>
            <h2 id="digitalinvoice-title" className={styles.title}>
              {content.title}
            </h2>
            <p className={styles.subtitle}>{content.subtitle}</p>
            {content.paragraphs.map((text) => (
              <p key={text.slice(0, 24)} className={styles.body}>
                {text}
              </p>
            ))}
            <div className={styles.actions}>
              <Button href={discoverHref} variant="di" {...(productExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {content.primary.label}
              </Button>
              <Button href={demoHref} variant="outline" {...(demoExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {content.secondary.label}
              </Button>
            </div>
          </Reveal>

          <DeviceStage className={styles.devices} label={content.devicesLabel}>
            <Reveal className={styles.laptopWrap}>
              <Laptop>
                <DashboardScreen />
              </Laptop>
            </Reveal>
            <Reveal from="right" delay={250} className={styles.phoneWrap}>
              <div className={styles.float}>
                <Phone>
                  <InvoiceScreen />
                </Phone>
              </div>
            </Reveal>
            <Reveal from="scale" delay={900} className={styles.toastWrap}>
              <div className={`${styles.toast} ${styles.float}`} style={{ '--float-delay': '-2.5s' }}>
                <CircleCheck size={18} strokeWidth={2.4} aria-hidden="true" />
                <span>
                  <strong>{content.toast.title}</strong>
                  <small className="num">{content.toast.note}</small>
                </span>
              </div>
            </Reveal>
          </DeviceStage>
        </div>

        <Reveal as="h3" id="digitalinvoice-features" className={styles.featuresTitle}>
          {content.featuresTitle}
        </Reveal>
        <Reveal as="ul" stagger className={styles.features}>
          {content.features.map(({ icon, title, body }) => {
            const Icon = ICONS[icon]
            return (
              <li key={title}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>
                    <Icon size={20} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h4 className={styles.featureTitle}>{title}</h4>
                  <p className={styles.featureBody}>{body}</p>
                </div>
              </li>
            )
          })}
        </Reveal>

        {/* Separate product-specific e-invoicing context from Teecoms' general ICT services. */}
        <div className={styles.complianceBlock} aria-labelledby="di-compliance-title">
          <Reveal from="left" className={styles.complianceIntro}>
            <span className={styles.complianceKicker}>{content.compliance.eyebrow}</span>
            <h3 id="di-compliance-title" className={styles.complianceTitle}>
              {content.compliance.title}
            </h3>
            <p className={styles.complianceBody}>{content.compliance.body}</p>
          </Reveal>
          <div className={styles.complianceDetail}>
            <Reveal as="ul" stagger className={styles.complianceList}>
              {content.compliance.items.map(({ icon, title, body }) => {
                const Icon = ICONS[icon]
                return (
                  <li key={title} className={styles.complianceItem}>
                    <span className={styles.complianceIcon}>
                      <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <div>
                      <h4>{title}</h4>
                      <p>{body}</p>
                    </div>
                  </li>
                )
              })}
            </Reveal>
            <p className={styles.complianceNote}>{content.compliance.note}</p>
          </div>
        </div>

        <Reveal className={styles.integrationBlock}>
          <div className={styles.integrationCopy}>
            <Eyebrow tone="di">{content.integrations.eyebrow}</Eyebrow>
            <h3 className={styles.subsectionTitle}>{content.integrations.title}</h3>
            <p className={styles.subsectionText}>{content.integrations.body}</p>
          </div>
          <div className={styles.integrationPanel}>
            <p className={styles.integrationLabel}>Examples to discuss</p>
            <ul className={styles.integrationGrid} aria-label="Examples of systems for compatibility assessment">
              {content.integrations.systems.map((system) => (
                <li key={system} className={styles.integrationPill}>{system}</li>
              ))}
            </ul>
            <p className={styles.integrationNote}>{content.integrations.note}</p>
          </div>
        </Reveal>

        <div className={styles.industriesBlock}>
          <Reveal className={styles.industryHeader}>
            <div>
              <Eyebrow tone="di">{content.industries.eyebrow}</Eyebrow>
              <h3 className={styles.subsectionTitle}>{content.industries.title}</h3>
            </div>
            <p className={styles.subsectionText}>{content.industries.body}</p>
          </Reveal>
          <Reveal as="ul" stagger className={styles.industryGrid}>
            {content.industries.items.map(({ icon, title, body }) => {
              const Icon = ICONS[icon]
              return (
                <li key={title} className={styles.industryItem}>
                  <span className={styles.industryIcon}>
                    <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
                  </span>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </li>
              )
            })}
          </Reveal>
        </div>

        <Reveal className={styles.closing}>
          <div>
            <h3 className={styles.closingTitle}>{content.closing.title}</h3>
            <p className={styles.closingBody}>{content.closing.body}</p>
          </div>
          <Button href={demoHref} variant="di" {...(demoExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {content.secondary.label}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

export default DigitalInvoiceSection
