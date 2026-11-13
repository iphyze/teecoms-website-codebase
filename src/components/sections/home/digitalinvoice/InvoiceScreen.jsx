import { CircleCheck, ChevronLeft, Download, Link2 } from 'lucide-react'
import styles from './InvoiceScreen.module.css'

/*
  Invoice document as shown in the DigitalInvoice app: issuer, bill-to,
  due date, line items, subtotal, VAT 7.5% and total, with the app's
  "Share secure link" (customer portal) and PDF actions. Sample data.
*/

const LINES = [
  { name: 'Network installation', qty: '1 job', total: '₦850,000.00' },
  { name: 'Cloud hosting', qty: '12 mo', total: '₦300,000.00' },
]

const InvoiceScreen = () => (
  <div className={styles.screen}>
    <header className={styles.top}>
      <ChevronLeft aria-hidden="true" />
      <strong className="num">INV-0420</strong>
      <b className={styles.badge}>Approved</b>
    </header>

    <article className={styles.doc}>
      <div className={styles.issuer}>
        <span className={styles.mark}>L</span>
        <span>
          <strong>Lagos Data Hub Ltd</strong>
          <small>Invoice INV-0420</small>
        </span>
      </div>

      <dl className={styles.meta}>
        <div>
          <dt>Bill to</dt>
          <dd>Adébáyọ̀ Stores</dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd className="num">30 Oct 2026</dd>
        </div>
      </dl>

      <ul className={styles.lines}>
        {LINES.map((line) => (
          <li key={line.name}>
            <span>
              <strong>{line.name}</strong>
              <small>{line.qty}</small>
            </span>
            <span className="num">{line.total}</span>
          </li>
        ))}
      </ul>

      <dl className={styles.totals}>
        <div>
          <dt>Subtotal</dt>
          <dd className="num">₦1,150,000.00</dd>
        </div>
        <div>
          <dt>VAT 7.5%</dt>
          <dd className="num">₦86,250.00</dd>
        </div>
        <div className={styles.grand}>
          <dt>Total</dt>
          <dd className="num">₦1,236,250.00</dd>
        </div>
      </dl>
    </article>

    <div className={styles.payment}>
      <CircleCheck aria-hidden="true" />
      <span>
        <strong>Paid in full</strong>
        <small className="num">Receipt RCT-0187, 16 Oct 2026</small>
      </span>
    </div>

    <div className={styles.actions}>
      <span className={styles.primary}>
        <Link2 aria-hidden="true" />
        Share secure link
      </span>
      <span className={styles.secondary}>
        <Download aria-hidden="true" />
        Download PDF
      </span>
    </div>
  </div>
)

export default InvoiceScreen
