import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  CreditCard,
  FileCheck2,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Receipt,
  Search,
  WalletCards,
} from 'lucide-react'
import styles from './DashboardScreen.module.css'

/*
  Recreates the DigitalInvoice app dashboard (sidebar, metric cards,
  "Invoices and collections" chart, recent invoices) with sample data.
  Labels, statuses and layout follow the real app. Decorative: the parent
  provides the accessible description.
*/

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FolderKanban, label: 'Sales', group: true },
  { icon: CreditCard, label: 'Payments' },
  { icon: BarChart3, label: 'Reports', group: true },
]

// Sample figures: outstanding = approved − collected
const METRICS = [
  { icon: FileCheck2, tone: 'blue', label: 'Approved invoices', value: '₦24,850,000', note: '38 approved' },
  { icon: WalletCards, tone: 'teal', label: 'Collections received', value: '₦18,420,500', note: '29 receipts' },
  { icon: Receipt, tone: 'amber', label: 'Outstanding balance', value: '₦6,429,500', note: '9 invoices' },
  { icon: AlertTriangle, tone: 'red', label: 'Overdue receivables', value: '₦1,186,000', note: '3 overdue' },
]

const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
const INVOICED = [52, 61, 58, 72, 80, 92] // % of chart height
const COLLECTED = [40, 49, 51, 57, 66, 70]

const INVOICES = [
  { number: 'INV-0422', customer: 'Ụgọchukwu Logistics', amount: '₦860,000.00', status: 'Pending approval', tone: 'warning' },
  { number: 'INV-0421', customer: 'Lagos Data Hub Ltd', amount: '₦4,837,500.00', status: 'Approved', tone: 'success' },
  { number: 'INV-0420', customer: 'Adébáyọ̀ Stores', amount: '₦1,236,250.00', status: 'Approved', tone: 'success' },
  { number: 'INV-0419', customer: 'Kano Agro Ventures', amount: '₦612,250.00', status: 'Draft', tone: 'neutral' },
]

// Area path for the invoiced series across a 600 × 100 viewBox
const areaPoints = INVOICED.map((v, i) => `${50 + i * 100},${100 - v}`)
const linePath = `M${areaPoints.join(' L')}`
const areaPath = `${linePath} L550,100 L50,100 Z`

const DashboardScreen = () => (
  <div className={styles.app}>
    <aside className={styles.side}>
      <img
        className="on-light-only"
        src="/images/digitalinvoice/digitalinvoice-logo-compact-light.svg"
        alt=""
        width="94"
        height="20"
      />
      <img
        className="on-dark-only"
        src="/images/digitalinvoice/digitalinvoice-logo-compact-dark.svg"
        alt=""
        width="94"
        height="20"
      />
      <div className={styles.org}>
        <small>Organisation</small>
        <strong>Lagos Data Hub Ltd</strong>
      </div>
      <nav className={styles.nav}>
        {NAV.map(({ icon: Icon, label, active, group }) => (
          <span key={label} data-active={active || undefined}>
            <Icon aria-hidden="true" />
            {label}
            {group ? <ChevronDown className={styles.chev} aria-hidden="true" /> : null}
          </span>
        ))}
      </nav>
    </aside>

    <div className={styles.main}>
      <header className={styles.top}>
        <div>
          <strong>Dashboard</strong>
          <small>Business overview for October</small>
        </div>
        <span className={styles.search}>
          <Search aria-hidden="true" />
          Search
        </span>
        <span className={styles.newBtn}>
          <Plus aria-hidden="true" />
          New invoice
        </span>
      </header>

      <div className={styles.metrics}>
        {METRICS.map(({ icon: Icon, tone, label, value, note }, i) => (
          <div key={label} className={styles.metric} data-tone={tone} style={{ '--i': i }}>
            <div className={styles.metricTop}>
              <span className={styles.metricIcon}>
                <Icon aria-hidden="true" />
              </span>
              <span className={styles.metricNote}>{note}</span>
            </div>
            <p>{label}</p>
            <strong className="num">{value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.row}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <strong>Invoices and collections</strong>
            <span className={styles.legend}>
              <i data-s="inv" />
              Invoiced
              <i data-s="col" />
              Collected
            </span>
          </div>
          <div className={styles.chart}>
            <div className={styles.bars}>
              {COLLECTED.map((v, i) => (
                <i key={MONTHS[i]} style={{ '--h': `${v}%`, '--i': i }} />
              ))}
            </div>
            <svg className={styles.area} viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="di-invoice-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2487da" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#2487da" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#di-invoice-area)" />
              <path d={linePath} fill="none" stroke="#2487da" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className={styles.months}>
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <strong>Recent invoices</strong>
          </div>
          <ul className={styles.list}>
            {INVOICES.map((inv) => (
              <li key={inv.number}>
                <span>
                  <strong className="num">{inv.number}</strong>
                  <small>{inv.customer}</small>
                </span>
                <span className={styles.amount}>
                  <strong className="num">{inv.amount}</strong>
                  <b className={styles.badge} data-tone={inv.tone}>
                    {inv.status}
                  </b>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
)

export default DashboardScreen
