/**
 * D5 public display manifest. Names must match the DigitalInvoice frontend's
 * scripts/generate-nrs-samples.mjs output exactly.
 */
export const SAMPLE_DOCUMENTS = Object.freeze([
  {
    key: 'b2b-tax-invoice',
    title: 'B2B tax invoice',
    type: 'Business-to-business tax invoice',
    description: 'Two fictional invoice lines showing discounts, VAT, totals and NRS evidence placement.',
  },
  {
    key: 'b2c-simplified-invoice',
    title: 'B2C simplified invoice',
    type: 'Business-to-consumer simplified invoice',
    description: 'Fictional consumer invoice with a taxable item and simplified buyer details.',
  },
  {
    key: 'credit-note',
    title: 'Credit note',
    type: 'Credit adjustment',
    description: 'A fictional adjustment linked to an illustrative source invoice.',
  },
  {
    key: 'payment-receipt',
    title: 'Payment receipt',
    type: 'Payment receipt',
    description: 'A fictional receipt and allocation; the mock view only illustrates linked-invoice evidence placement.',
  },
])

export const SAMPLE_STATES = Object.freeze([
  {
    key: 'current',
    title: 'Standard document layout',
    description: 'Fictional document example',
  },
  {
    key: 'mock-post-validation',
    title: 'Illustrative verification-field layout',
    description: 'Mock IRN, CSID and QR placement',
  },
])

export function getSamplePaths(documentKey, stateKey) {
  if (!SAMPLE_DOCUMENTS.some((doc) => doc.key === documentKey) || !SAMPLE_STATES.some((state) => state.key === stateKey)) {
    throw new Error('Unsupported documentation sample key/state')
  }
  const base = `/docs/samples/digitalinvoice-${documentKey}-${stateKey}-v1.0`
  return { pdf: `${base}.pdf`, preview: `${base}.png` }
}
