'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Reveal.module.css'

/**
 * Animates its content into view when it enters the viewport, and replays
 * when the visitor scrolls back to it.
 *
 * as       element to render (default 'div')
 * delay    extra delay in ms
 * stagger  true: direct children animate one after another, 70ms apart
 * from     'up' (default) | 'left' | 'right' | 'scale'
 * once     true: animate the first time only (no replay)
 *
 * Replays are designed to stay calm:
 * - content resets only once it is completely off-screen, so nothing
 *   fades out while visible;
 * - 'up' reveals follow the scroll direction: rising from below when
 *   scrolling down, settling from above when scrolling back up;
 * - replays are shorter and quicker than the first entrance.
 * Reduced-motion visitors see content immediately and it stays put.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  stagger = false,
  from = 'up',
  once = false,
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null)
  const shown = useRef(false)
  const [visible, setVisible] = useState(false)
  const [enter, setEnter] = useState('below')
  const [replay, setReplay] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (
      !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const viewport = entry.rootBounds?.height || window.innerHeight
        // 15% of the element, or half the screen for very tall elements
        const enough = entry.intersectionRatio >= 0.15 || entry.intersectionRect.height >= viewport * 0.5

        if (entry.isIntersecting && enough) {
          shown.current = true
          setVisible(true)
          if (once) observer.disconnect()
          return
        }

        // Fully off-screen: reset, and remember which side it will return from
        if (!entry.isIntersecting && shown.current) {
          setEnter(entry.boundingClientRect.top < 0 ? 'above' : 'below')
          setReplay(true)
          setVisible(false)
        }
      },
      { threshold: [0, 0.15, 0.5], rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-visible={visible}
      data-stagger={stagger || undefined}
      data-from={from}
      data-enter={enter}
      data-replay={replay || undefined}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
