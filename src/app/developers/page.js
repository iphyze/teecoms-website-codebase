import { ExternalLink, Mail, MapPin, Phone, ShieldCheck, Workflow, BookOpenText } from 'lucide-react'
import { documentationExists, getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import { getSampleAvailability } from '@/lib/docs/sampleAvailability'
import { site } from '@/config/site'
import { docsTopics } from '@/content/docs/navigation'
import DocsLayout from '@/components/docs/DocsLayout'
import DocsCard from '@/components/docs/DocsCard'
import Button from '@/components/ui/Button'
import styles from './page.module.css'

const document = getDocumentation('developers')
const sampleAvailability = getSampleAvailability()

function statusDetails(topicId, status) {
  if (topicId === 'sla' && status === 'draft') return { statusLabel: 'Draft · management approval pending', statusTone: 'review' }
  if (topicId === 'samples' && status === 'planned') {
    const statusLabel = sampleAvailability.complete
      ? 'Files ready · publication review pending'
      : `${sampleAvailability.readyCount} of ${sampleAvailability.totalCount} sample pairs ready`
    return { statusLabel, statusTone: 'pending' }
  }
  if (status === 'published') return { statusLabel: 'Published', statusTone: 'published' }
  if (status === 'approved') return { statusLabel: 'Approved', statusTone: 'published' }
  if (status === 'draft') return { statusLabel: 'Draft · not effective', statusTone: 'review' }
  return { statusLabel: 'In preparation', statusTone: 'pending' }
}

// Derive every card from real page metadata. No manually maintained "published"
// list that can get out of step with a future SLA or gallery approval.
const resourceCards = docsTopics.map((topic) => {
  const present = documentationExists(topic.id)
  const status = present ? getDocumentation(topic.id).status : 'missing'
  return {
    ...topic,
    available: present,
    ...statusDetails(topic.id, status),
    ...(present ? {} : { statusLabel: 'Coming soon', statusTone: 'pending' }),
  }
})

const hubDocument = {
  ...document,
  toc: [
    { id: 'documentation-library', label: 'Documentation library', depth: 2 },
    { id: 'integration-status', label: 'Integration status', depth: 2 },
    { id: 'developer-support', label: 'Developer support', depth: 2 },
  ],
}

export const metadata = docsMetadata(document, '/developers/')

export default function DevelopersPage() {
  const email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(site.contact.email || '') ? site.contact.email : ''
  const phone = /^\+?[\d ()-]{7,30}$/.test(site.contact.phone || '') ? site.contact.phone : ''
  return (
    <DocsLayout document={hubDocument}>
      <section className={styles.section} aria-labelledby="documentation-library">
        <div className={styles.sectionHeading}>
          <BookOpenText size={22} aria-hidden="true" />
          <h2 id="documentation-library">Documentation library</h2>
        </div>
        <p className={styles.lead}>Select a technical resource to view its complete reference page, including available downloads.</p>
        <div className={styles.grid}>
          {resourceCards.map(({ id, ...topic }) => <DocsCard key={id} {...topic} title={topic.label} />)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="integration-status">
        <div className={styles.sectionHeading}>
          <Workflow size={22} aria-hidden="true" />
          <h2 id="integration-status">Integration status</h2>
        </div>
        <p className={styles.lead}>A concise summary of which capabilities are implemented and which remain subject to external access or approval.</p>
        <div className={styles.statusPanel}>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}><ShieldCheck size={19} aria-hidden="true" /></span>
            <div>
              <h3>Application and ERP integration</h3>
              <p>Invoice workflows, a read-only ERP API using OAuth 2.0 client credentials, and signed outbound webhooks are implemented. Availability is subject to organisation permissions and configuration.</p>
            </div>
            <span className={styles.statusValue}>Implemented</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}><Workflow size={19} aria-hidden="true" /></span>
            <div>
              <h3>NRS MBS preparation</h3>
              <p>The UBL-style adapter, local readiness checks and credential-gated sandbox client exist. Sandbox capability does not mean a live NRS integration has been established.</p>
            </div>
            <span className={styles.statusValue} data-state="review">Sandbox-controlled</span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusIcon}><ExternalLink size={19} aria-hidden="true" /></span>
            <div>
              <h3>NRS production submissions</h3>
              <p>Live NRS submission and official clearance/verification are disabled pending MBS licensing and production activation. Fictional demonstration evidence is not official NRS evidence.</p>
            </div>
            <span className={styles.statusValue} data-state="pending">Licence-gated</span>
          </div>
        </div>
        <p className={styles.statusFootnote}>For implementation detail, see the <a href="/developers/architecture/">architecture</a> and <a href="/developers/security/">security</a> documentation.</p>
      </section>

      <section className={styles.section} aria-labelledby="developer-support">
        <div className={styles.sectionHeading}>
          <Mail size={22} aria-hidden="true" />
          <h2 id="developer-support">Developer support</h2>
        </div>
        <div className={styles.support}>
          <div>
            <h3>Need help with DigitalInvoice?</h3>
            <p>Contact Teecoms for integration enquiries, documentation clarifications or details about the MBS onboarding process. The draft SLA does not establish contractual support response times.</p>
            {(email || phone) && (
              <div className={styles.contactMethods}>
                {email && (
                  <a className={styles.contactLink} href={`mailto:${email}`}>
                    <Mail size={17} aria-hidden="true" />
                    <span>{email}</span>
                  </a>
                )}
                {phone && (
                  <a className={styles.contactLink} href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
                    <Phone size={17} aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                )}
              </div>
            )}
            {site.contact.address && (
              <p className={styles.address}>
                <MapPin size={17} aria-hidden="true" />
                <span>{site.contact.address}</span>
              </p>
            )}
          </div>
          <Button href="/#contact" variant="outline" size="sm">Contact Teecoms</Button>
        </div>
      </section>
    </DocsLayout>
  )
}
