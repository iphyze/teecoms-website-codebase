'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import styles from './BackToTop.module.css'

/** A floating return-to-top control, shown after the first substantial scroll. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(window.scrollY > Math.max(480, window.innerHeight * 0.65))
    }
    const onViewportChange = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update() // Also handles loading the page at a deep scroll position.
    window.addEventListener('scroll', onViewportChange, { passive: true })
    window.addEventListener('resize', onViewportChange)
    return () => {
      window.removeEventListener('scroll', onViewportChange)
      window.removeEventListener('resize', onViewportChange)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={visible}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      inert={!visible}
      title="Back to top"
      onClick={scrollToTop}
    >
      <ArrowUp size={22} strokeWidth={2.25} aria-hidden="true" />
    </button>
  )
}
