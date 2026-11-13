'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Wraps the device mockups and pauses their idle float animation while the
 * stage is off-screen (sets --loop-state through data-loops).
 */
export default function DeviceStage({ className = '', label, children }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} role="img" aria-label={label} data-loops={inView ? 'running' : 'paused'}>
      {children}
    </div>
  )
}
