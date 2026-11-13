import Button from '@/components/ui/Button'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import Phone from '@/components/devices/Phone'
import DeviceStage from './digitalinvoice/DeviceStage'
import InvoiceScreen from './digitalinvoice/InvoiceScreen'
import styles from './CtaSection.module.css'

/** Final invitation to connect: always-navy panel with a cropped product phone. */
export default function CtaSection({ content }) {
  return (
    <section id="cta" className={styles.section} aria-labelledby="cta-title">
      <div className="container">
        <Reveal from="scale" className={styles.panel}>
          <div className={styles.copy}>
            <Eyebrow tone="light">{content.eyebrow}</Eyebrow>
            <h2 id="cta-title" className={styles.title}>{content.title}</h2>
            <p className={styles.body}>{content.body}</p>
            <p className={styles.followup}>{content.followup}</p>
            <div className={styles.actions}>
              <Button href={content.primary.href} variant="primary">
                {content.primary.label}
              </Button>
              <Button href={content.secondary.href} variant="glass">
                {content.secondary.label}
              </Button>
            </div>
          </div>

          <DeviceStage
            className={styles.phoneStage}
            label="DigitalInvoice example invoice shown on a phone"
          >
            <Reveal delay={300} className={styles.phoneReveal}>
              <div className={styles.phoneAngle}>
                <div className={styles.phoneFloat}>
                  <Phone><InvoiceScreen /></Phone>
                </div>
              </div>
            </Reveal>
          </DeviceStage>
        </Reveal>
      </div>
    </section>
  )
}
