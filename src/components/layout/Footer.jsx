import { ArrowUp } from 'lucide-react'
import BrandLogo from '@/components/brand/BrandLogo'
import Button from '@/components/ui/Button'
import DigitalInvoiceSocialLinks from '@/components/sections/home/DigitalInvoiceSocialLinks'
import { site } from '@/config/site'
import { resolveSiteHref } from '@/utils/navigation'
import { documentationLinks } from '@/content/docs/navigation'
import { footerContent } from '@/content/home.content'
import styles from './Footer.module.css'

/** Shared footer for homepage and static documentation routes. */
export default function Footer({ isHome = false }) {
  const productHref = site.digitalInvoiceUrl || resolveSiteHref('#digitalinvoice-features', isHome)

  return (
    <footer id="footer" className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <a className={styles.brandLink} href="/" aria-label="Teecoms — home">
              <BrandLogo tone="on-dark" height={40} />
            </a>
            <p className={styles.tagline}>{site.tagline}</p>
            <p className={styles.description}>{site.description}</p>
          </div>

          <nav className={styles.column} aria-label="Footer quick links">
            <h2 className={styles.heading}>{footerContent.quickLinksTitle}</h2>
            <ul className={styles.links}>
              {footerContent.quickLinks.map(({ label, href }) => (
                <li key={href}><a href={resolveSiteHref(href, isHome)}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-label="Footer services">
            <h2 className={styles.heading}>{footerContent.servicesTitle}</h2>
            <ul className={styles.links}>
              {footerContent.services.map(({ label, href }) => (
                <li key={label}><a href={resolveSiteHref(href, isHome)}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-label="Legal and developers">
            <h2 className={styles.heading}>Legal &amp; developers</h2>
            <ul className={styles.links}>
              {documentationLinks.map(({ label, href }) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <div className={styles.product}>
            <h2 className={styles.heading}>{footerContent.productTitle}</h2>
            <a href={productHref} className={styles.productLogoLink} aria-label="Explore DigitalInvoice">
              <BrandLogo brand="digitalinvoice" tone="on-dark" compact height={26} />
            </a>
            <p className={styles.productDescription}>{footerContent.productDescription}</p>
            <Button href={productHref} variant="glass" size="sm" className={styles.productButton}
              {...(site.digitalInvoiceUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {footerContent.productButton}
            </Button>
            <DigitalInvoiceSocialLinks
              title={footerContent.socialTitle}
              links={site.digitalInvoiceSocial}
              tone="on-dark"
              compact
            />
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © <span className="num">{new Date().getFullYear()}</span> {site.name}. {footerContent.rights}
          </p>
          <a href={isHome ? '#home' : '#main'} className={styles.toTop}>
            {footerContent.backToTop}
            <ArrowUp size={16} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
