import {
  Check,
  CircleCheck,
  Cloud,
  Code2,
  Compass,
  Network,
  Router,
  ServerCog,
  ShieldCheck,
  Wifi,
} from 'lucide-react'
import BrandLogo from '@/components/brand/BrandLogo'
import styles from './HeroVisual.module.css'

/*
  Decorative product-style illustrations, one per hero slide. Built from HTML
  and CSS so they stay sharp, follow the theme and cost nothing to download.
  Entrance animations replay when the slide becomes active; idle loops follow
  --loop-state from the hero (paused off-screen or when the visitor pauses).
*/

const piece = (delay, extra = {}) => ({ style: { '--d': `${delay}ms`, ...extra } })

/* ---- 1. Connected future: network hub ----------------------------------- */
const NODES = [
  { label: 'Cloud', icon: Cloud, x: 80, y: 17 },
  { label: 'Security', icon: ShieldCheck, x: 89, y: 60 },
  { label: 'Infrastructure', icon: ServerCog, x: 64, y: 88 },
  { label: 'Connectivity', icon: Wifi, x: 17, y: 80 },
  { label: 'Software', icon: Code2, x: 10, y: 38 },
  { label: 'Advisory', icon: Compass, x: 33, y: 11 },
]

const NetworkVisual = () => (
  <div className={styles.canvas}>
    <svg className={styles.lines} viewBox="0 0 100 90" aria-hidden="true">
      {NODES.map((node) => (
        <line key={node.label} x1="50" y1="45" x2={node.x} y2={node.y * 0.9} />
      ))}
    </svg>

    {NODES.map((node, index) => (
      <span
        key={`p-${node.label}`}
        className={styles.packet}
        style={{
          '--dx': `${(node.x - 50) * 1}cqw`,
          '--dy': `${(node.y - 50) * 0.9}cqw`,
          '--p': `${index * 520}ms`,
          '--dir': index % 2 ? 'reverse' : 'normal',
        }}
      />
    ))}

    <span className={`${styles.ring} ${styles.ringA}`} />
    <span className={`${styles.ring} ${styles.ringB}`} />

    <div className={`${styles.hub} ${styles.in}`} {...piece(200)}>
      <img src="/images/brand/teecoms-mark-light.webp" alt="" width="66" height="45" />
    </div>

    {NODES.map((node, index) => {
      const Icon = node.icon
      return (
        <div
          key={node.label}
          className={`${styles.node} ${styles.in}`}
          {...piece(380 + index * 90, { left: `${node.x}%`, top: `${node.y}%` })}
        >
          <div className={styles.bob} style={{ '--b': `${index * -1.1}s` }}>
            <span className={styles.nodeIcon}><Icon size={16} strokeWidth={2.2} /></span>
            <span>{node.label}</span>
          </div>
        </div>
      )
    })}
  </div>
)

/* ---- 2. Infrastructure: rack + status cards ------------------------------ */
const RACK = ['Core switch', 'Compute', 'Storage', 'Backup', 'Firewall']

const InfrastructureVisual = () => (
  <div className={styles.canvas}>
    <svg className={styles.lines} viewBox="0 0 100 90" aria-hidden="true">
      <path d="M58 24 H66" />
      <path d="M58 64 H70" />
    </svg>

    <div className={`${styles.card} ${styles.rack} ${styles.in}`} {...piece(160)}>
      <div className={styles.cardHead}>
        <Router size={15} strokeWidth={2.2} />
        <span>Data centre rack</span>
      </div>
      {RACK.map((unit, index) => (
        <div key={unit} className={styles.unit}>
          <span className={styles.leds}>
            <i style={{ '--blink': `${index * 0.37}s` }} />
            <i style={{ '--blink': `${index * 0.53 + 0.2}s` }} />
          </span>
          <span className={styles.vent} />
          <span className={styles.unitLabel}>{unit}</span>
        </div>
      ))}
    </div>

    <div className={`${styles.floatCard} ${styles.netCard} ${styles.in}`} {...piece(420)}>
      <div className={`${styles.card} ${styles.bob}`} style={{ '--b': '-0.8s' }}>
        <div className={styles.cardHead}>
          <Network size={15} strokeWidth={2.2} />
          <span>Network</span>
          <span className={styles.live}>Online</span>
        </div>
        <div className={styles.bars}>
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} style={{ '--h': `${38 + ((i * 37) % 55)}%`, '--w': `${i * 0.12}s` }} />
          ))}
        </div>
        <p className={styles.caption}>Throughput across all links</p>
      </div>
    </div>

    <div className={`${styles.floatCard} ${styles.cloudCard} ${styles.in}`} {...piece(620)}>
      <div className={`${styles.card} ${styles.bob}`} style={{ '--b': '-2.4s' }}>
        <div className={styles.cardHead}>
          <Cloud size={15} strokeWidth={2.2} />
          <span>Cloud &amp; hosting</span>
        </div>
        <div className={styles.checkRow}>
          <span className={styles.tick}><Check size={12} strokeWidth={3} /></span>
          Backups complete
        </div>
        <div className={styles.meter}><i /></div>
      </div>
    </div>
  </div>
)

/* ---- 3. Transformation: roadmap + code card ------------------------------ */
const STEPS = [
  { label: 'Strategic digital advisory', icon: Compass },
  { label: 'Tailored software solutions', icon: Code2 },
  { label: 'Managed IT services', icon: ServerCog },
  { label: 'Cybersecurity', icon: ShieldCheck },
]

const TransformationVisual = () => (
  <div className={styles.canvas}>
    <div className={`${styles.card} ${styles.window} ${styles.in}`} {...piece(160)}>
      <div className={styles.windowBar}>
        <i /><i /><i />
        <span>Modernisation roadmap</span>
      </div>
      <ol className={styles.steps}>
        <span className={styles.stepLine}><i /></span>
        {STEPS.map((step, index) => {
          const Icon = step.icon
          return (
            <li key={step.label} style={{ '--s': `${700 + index * 520}ms` }}>
              <span className={styles.stepIcon}><Icon size={16} strokeWidth={2.2} /></span>
              <span className={styles.stepText}>
                <strong>{step.label}</strong>
                <span className={styles.skeleton} style={{ '--sw': `${62 - index * 8}%` }} />
              </span>
              <span className={styles.stepDone}><Check size={12} strokeWidth={3} /></span>
            </li>
          )
        })}
      </ol>
    </div>

    <div className={`${styles.floatCard} ${styles.codeCard} ${styles.in}`} {...piece(520)}>
      <div className={`${styles.card} ${styles.code} ${styles.bob}`} style={{ '--b': '-1.6s' }}>
        {[72, 48, 86, 38, 64, 54].map((w, i) => (
          <span key={i} className={styles.codeLine} style={{ '--cw': `${w}%`, '--ci': i, '--indent': i % 3 === 1 ? 1 : 0 }} />
        ))}
        <span className={styles.cursor} />
      </div>
    </div>

    <div className={`${styles.floatCard} ${styles.shieldCard} ${styles.in}`} {...piece(820)}>
      <div className={`${styles.pill} ${styles.bob}`} style={{ '--b': '-3s' }}>
        <span className={styles.pulse}><ShieldCheck size={16} strokeWidth={2.2} /></span>
        Systems protected
      </div>
    </div>
  </div>
)

/* ---- 4. DigitalInvoice: dashboard, e-invoice, payment toast --------------- */
const QR = '1111111010110111000001001010000110111010111011101111011101010001011101101100110000010110011011111110101010'
const INVOICES = [
  ['INV-2026-0418', '₦1,245,000.00', 'Paid'],
  ['INV-2026-0419', '₦86,500.00', 'Pending'],
  ['INV-2026-0420', '₦24,850,000.00', 'Submitted'],
]

const DigitalInvoiceVisual = () => (
  <div className={styles.canvas}>
    <div className={`${styles.paperWrap} ${styles.in}`} {...piece(520)}>
      <div className={`${styles.card} ${styles.paper} ${styles.bob}`} style={{ '--b': '-2s' }}>
        <div className={styles.paperHead}>
          <strong>E-Invoice</strong>
          <span className={styles.qr}>
            {QR.slice(0, 49).split('').map((bit, i) => <i key={i} data-on={bit === '1'} />)}
          </span>
        </div>
        <span className={styles.skeleton} style={{ '--sw': '70%' }} />
        <span className={styles.skeleton} style={{ '--sw': '52%' }} />
        <span className={styles.skeleton} style={{ '--sw': '84%' }} />
        <div className={styles.paperTotal}>
          <span>Total</span>
          <strong className="num">₦24,850,000</strong>
        </div>
      </div>
    </div>

    <div className={`${styles.card} ${styles.dash} ${styles.in}`} {...piece(160)}>
      <div className={styles.dashHead}>
        <BrandLogo brand="digitalinvoice" compact height={20} />
        <span className={styles.caption}>Welcome back</span>
      </div>
      <div className={styles.kpis}>
        <div>
          <span className={styles.caption}>Invoices issued</span>
          <strong className="num">1,245</strong>
        </div>
        <div>
          <span className={styles.caption}>Total billed</span>
          <strong className="num">₦24,850,000</strong>
        </div>
      </div>
      <div className={styles.chart}>
        {[42, 58, 50, 72, 64, 86, 78].map((h, i) => (
          <i key={i} style={{ '--h': `${h}%`, '--ci': i }} />
        ))}
      </div>
      <div className={styles.rows}>
        {INVOICES.map(([id, amount, status]) => (
          <div key={id} className={styles.row}>
            <span className="num">{id}</span>
            <strong className="num">{amount}</strong>
            <span className={styles.status} data-status={status.toLowerCase()}>{status}</span>
          </div>
        ))}
      </div>
    </div>

    <div className={`${styles.floatCard} ${styles.toastWrap} ${styles.in}`} {...piece(1500)}>
      <div className={`${styles.card} ${styles.toast} ${styles.bob}`} style={{ '--b': '-1s' }}>
        <span className={styles.toastIcon}><CircleCheck size={18} strokeWidth={2.4} /></span>
        <span>
          <strong>Payment received</strong>
          <span className={`${styles.caption} num`}>₦1,245,000.00 for INV-2026-0418</span>
        </span>
      </div>
    </div>
  </div>
)

const VISUALS = {
  network: NetworkVisual,
  infrastructure: InfrastructureVisual,
  transformation: TransformationVisual,
  digitalinvoice: DigitalInvoiceVisual,
}

const HeroVisual = ({ type, active }) => {
  const Visual = VISUALS[type]
  if (!Visual) return null
  return (
    <div className={styles.stage} data-active={active} data-type={type}>
      <Visual />
    </div>
  )
}

export default HeroVisual
