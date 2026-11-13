import { getDocumentation } from '@/lib/docs'
import { docsMetadata } from '@/lib/docs/metadata'
import { getSampleAvailability } from '@/lib/docs/sampleAvailability'
import DocsLayout from '@/components/docs/DocsLayout'
import SampleCard from '@/components/docs/SampleCard'
import styles from './page.module.css'

const document = getDocumentation('samples')
const { rows: sampleRows, readyCount, totalCount, complete } = getSampleAvailability()

// Prevent publishing a gallery with broken or missing files.
if (document.status === 'published' && !complete) {
  throw new Error(`Samples are marked published, but only ${readyCount}/${totalCount} PDF/PNG pairs exist. Generate and copy every sample or leave samples.md status: planned.`)
}

export const metadata = docsMetadata(document, '/developers/samples/')

export default function SamplesPage() {
  return (
    <DocsLayout document={document} breadcrumbs={[{ label: 'Developers', href: '/developers/' }]}>
      <section className={styles.section} aria-label="Fictional DigitalInvoice document gallery">
        <div className={styles.headingRow}>
          <div>
            <p className={styles.eyebrow}>Eight illustrated documents</p>
            <h2>Visual sample gallery</h2>
          </div>
          <span className={styles.count}>{readyCount} of {totalCount} available</span>
        </div>
        {!complete ? (
          <p className={styles.notice} role="note">
            Some PDF and PNG examples are missing from this site. Missing files have no download links; upload the complete set before publishing the gallery.
          </p>
        ) : null}
        <div className={styles.grid}>
          {sampleRows.map((row) => (
            <SampleCard
              key={`${row.key}-${row.state.key}`}
              title={`${row.title} — ${row.state.title}`}
              type={`${row.type} · ${row.state.description}`}
              description={row.description}
              preview={row.preview}
              pdf={row.pdf}
              pending={!row.ready}
            />
          ))}
        </div>
        <p className={styles.disclaimer}>
          All documents use fictional demonstration data. The verification-field previews show mock IRN, CSID and QR values solely to illustrate the design, not to represent official verification.
        </p>
      </section>
    </DocsLayout>
  )
}
