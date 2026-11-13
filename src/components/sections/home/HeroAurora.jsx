'use client'

import { useEffect, useRef } from 'react'
import styles from './HeroAurora.module.css'

/**
 * Living background for the hero: drifting aurora light, a dot grid that
 * lights up around the cursor, and a slight 3D tilt on the slide visuals.
 *
 * visual   active slide's visual key; sets the aurora colours (they glide
 *          between slides because the colour properties are registered)
 *
 * Pointer effects run only with a mouse/trackpad and without reduced
 * motion. Everything animates transform/opacity, except the colour glide.
 */
export default function HeroAurora({ visual = 'network' }) {
  const ref = useRef(null)

  useEffect(() => {
    const aurora = ref.current
    const hero = aurora?.parentElement
    if (!aurora || !hero) return undefined

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return undefined

    const spot = aurora.querySelector('[data-spot]')
    const halo = aurora.querySelector('[data-halo]')
    const SPOT = 220 // half of the spotlight size
    const HALO = 280
    let rect = null
    let frame = 0
    let point = null

    // Measured on enter/resize only: no layout reads while the mouse moves
    const measure = () => { rect = hero.getBoundingClientRect() }

    const apply = () => {
      frame = 0
      if (!point || !rect) return
      const x = point.x - rect.left
      const y = point.y - rect.top
      // Small layers moved with transforms (compositor only). The spotlight's
      // dot pattern is counter-offset so it lines up with the grid beneath.
      spot.style.transform = `translate3d(${x - SPOT}px, ${y - SPOT}px, 0)`
      spot.style.backgroundPosition = `${SPOT - x}px ${SPOT - y}px`
      halo.style.transform = `translate3d(${x - HALO}px, ${y - HALO}px, 0)`
      const px = (x / rect.width - 0.5) * 2
      const py = (y / rect.height - 0.5) * 2
      const tilt = `perspective(1400px) rotateX(${(py * -3).toFixed(2)}deg) rotateY(${(px * 4).toFixed(2)}deg) translate3d(${(px * -10).toFixed(1)}px, ${(py * -8).toFixed(1)}px, 0)`
      hero.querySelectorAll('[data-parallax]').forEach((el) => { el.style.transform = tilt })
    }

    const onEnter = () => {
      measure()
      aurora.dataset.pointer = 'on'
    }

    const onMove = (event) => {
      if (!rect) onEnter()
      point = { x: event.clientX, y: event.clientY }
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onLeave = () => {
      point = null
      rect = null
      aurora.dataset.pointer = 'off'
      hero.querySelectorAll('[data-parallax]').forEach((el) => { el.style.transform = '' })
    }

    hero.addEventListener('pointerenter', onEnter)
    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      hero.removeEventListener('pointerenter', onEnter)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className={styles.aurora} data-visual={visual} data-pointer="off" aria-hidden="true">
      <span className={`${styles.blob} ${styles.blobA}`} />
      <span className={`${styles.blob} ${styles.blobB}`} />
      <span className={`${styles.blob} ${styles.blobC}`} />
      <span className={styles.ribbon} />
      <span className={styles.dots} />
      <span className={styles.halo} data-halo />
      <span className={styles.spot} data-spot />
      <span className={styles.veil} />
      <span className={styles.grain} />
      <span className={styles.fade} />
    </div>
  )
}
