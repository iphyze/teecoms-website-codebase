'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import BrandLogo from '@/components/brand/BrandLogo'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { navigation } from '@/config/site'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'
import { resolveSiteHref } from '@/utils/navigation'
import styles from './Header.module.css'

const SECTION_IDS = navigation.filter((item) => item.href.startsWith('#')).map((item) => item.href.slice(1))

// All documentation routes belong to the Developers navigation group, including
// the SLA, which intentionally has a permanent top-level URL of its own.
const isDocumentationPath = (path) =>
  path === '/developers' || path.startsWith('/developers/') || path === '/sla' || path.startsWith('/sla/')

const isNavigationActive = (item, pathname, isHome, activeId) => {
  if (item.href === '/developers/') return isDocumentationPath(pathname)
  if (item.href.startsWith('#')) return isHome && activeId === item.href.slice(1)
  return pathname === item.href || pathname.startsWith(item.href)
}

const Header = () => {
  const pathname = usePathname() || '/'
  const isHome = pathname === '/'
  const [isScrolled, setIsScrolled] = useState(false) // glass activates after 100px on home
  const [activeId, setActiveId] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)

  useScrollLock(isMenuOpen)
  useFocusTrap({
    active: isMenuOpen,
    containerRef: menuRef,
    initialFocusRef: closeButtonRef,
    restoreFocusRef: menuButtonRef,
  })

  // Keep the header clear over the navy hero; reveal theme-aware glass after 100px.
  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setIsScrolled(window.scrollY >= 100)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  // Scroll-spy: highlight the section occupying the middle of the viewport
  useEffect(() => {
    if (!isHome) return undefined
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome])

  useEffect(() => {
    if (!isMenuOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 1200) setIsMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [isMenuOpen])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  return (
    <>
      <a className={styles.skip} href="#main">Skip to content</a>
      <header
        className={styles.header}
        data-scrolled={!isHome || isScrolled}
        data-document={!isHome}
      >
        <div className={`container ${styles.bar}`}>
          <a href="/" className={styles.brand} aria-label="Teecoms, home">
            {/* The hero follows the theme, so the logo does too */}
            <BrandLogo height={34} priority />
          </a>

          <nav className={styles.nav} aria-label="Main">
            <ul>
              {navigation.map((item) => {
                const isActive = isNavigationActive(item, pathname, isHome, activeId)
                return (
                  <li key={item.href}>
                    <a
                      href={resolveSiteHref(item.href, isHome)}
                      className={styles.link}
                      data-active={isActive}
                      aria-current={isActive ? (item.href.startsWith('#') ? 'location' : 'page') : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className={styles.actions}>
            <ThemeToggle />
            <Button href={resolveSiteHref('#contact', isHome)} size="sm" className={styles.cta}>
              Talk to an Expert
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={22} aria-hidden="true" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={styles.sheet}
        data-open={isMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!isMenuOpen}
      >
        <div className={styles.sheetTop}>
          <BrandLogo height={32} />
          <button ref={closeButtonRef} type="button" className={styles.menuButton} onClick={closeMenu}>
            <X size={22} aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <ul className={styles.sheetLinks}>
          {navigation.map((item, index) => {
            const isActive = isNavigationActive(item, pathname, isHome, activeId)
            return (
              <li key={item.href} style={{ '--i': index }}>
                <a
                  href={resolveSiteHref(item.href, isHome)}
                  onClick={closeMenu}
                  data-active={isActive}
                  aria-current={isActive ? (item.href.startsWith('#') ? 'location' : 'page') : undefined}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
        <div className={styles.sheetFoot}>
          <Button href={resolveSiteHref('#contact', isHome)} onClick={closeMenu}>Talk to an Expert</Button>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}

export default Header
