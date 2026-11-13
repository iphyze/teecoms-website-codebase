import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/layout/BackToTop'
import DocsHeader from './DocsHeader'
import DocsToc from './DocsToc'
import DocsCodeCopy from './DocsCodeCopy'
import styles from './DocsLayout.module.css'

export default function DocsLayout({ document, breadcrumbs, children }) {
  const draft = document.status === 'draft'
  return (
    <>
      <Header />
      <main id="main" className={styles.page}>
        <DocsHeader document={document} breadcrumbs={breadcrumbs} />
        {draft ? (
          <div className={`container ${styles.draft}`} role="note">
            <strong>Draft for management review.</strong> Proposed terms and figures are not approved or in effect.
          </div>
        ) : null}
        <div className={`container ${styles.content}`}>
          <aside className={styles.sidebar}><DocsToc items={document.toc} /></aside>
          <div className={styles.right}>
            <article className={styles.article} aria-label={document.title} dangerouslySetInnerHTML={{ __html: document.html }} />
            {children}
          </div>
        </div>
      </main>
      <DocsCodeCopy />
      <Footer />
      <BackToTop />
    </>
  )
}
