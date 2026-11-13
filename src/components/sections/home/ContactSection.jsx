import { Building2, Mail, MapPin, Phone } from 'lucide-react'
import { site } from '@/config/site'
import Eyebrow from '@/components/ui/Eyebrow'
import Reveal from '@/components/ui/Reveal'
import ContactForm from './ContactForm'
import styles from './ContactSection.module.css'

const DETAILS = [
  { label: 'Company', key: 'company', icon: Building2 },
  { label: 'Email', key: 'email', icon: Mail },
  { label: 'Telephone', key: 'phone', icon: Phone },
  { label: 'Office location', key: 'address', icon: MapPin },
]

/** Two-column contact section. Unverified contact details are never fabricated. */
export default function ContactSection({ content }) {
  const details = {
    company: site.name,
    email: site.contact.email,
    phone: site.contact.phone,
    address: site.contact.address,
  }

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <Reveal from="left" className={styles.copy}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 id="contact-title" className={styles.title}>{content.title}</h2>
          <p className={styles.lead}>{content.intro}</p>
          <ul className={styles.details}>
            {DETAILS.map(({ label, key, icon: Icon }) => {
              const value = details[key]
              return (
                <li key={key} className={styles.detail}>
                  <span className={styles.iconTile} aria-hidden="true">
                    <Icon size={19} strokeWidth={1.9} />
                  </span>
                  <div className={styles.detailText}>
                    <span className={styles.detailLabel}>{label}</span>
                    {key === 'email' && value ? (
                      <a className={styles.detailValue} href={`mailto:${value}`}>{value}</a>
                    ) : key === 'phone' && value ? (
                      <a className={styles.detailValue} href={`tel:${value.replace(/[^+\d]/g, '')}`}>{value}</a>
                    ) : (
                      <span className={value ? styles.detailValue : styles.unconfirmed}>
                        {value || content.unconfirmed}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </Reveal>
        <Reveal from="right" className={styles.formWrap}>
          <ContactForm content={content.form} services={content.serviceOptions} />
        </Reveal>
      </div>
    </section>
  )
}
