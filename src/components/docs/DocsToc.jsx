'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, List } from 'lucide-react'
import styles from './DocsToc.module.css'

export default function DocsToc({ items = [] }) {
  const [active, setActive] = useState(items[0]?.id || '')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!items.length) return undefined
    let scheduled = false
    const update = () => {
      scheduled = false
      const threshold = 150
      let current = items[0].id
      for (const item of items) {
        const element = document.getElementById(item.id)
        if (element && element.getBoundingClientRect().top <= threshold) current = item.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (scheduled) return
      scheduled = true
      window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  if (!items.length) return null
  return (
    <nav className={styles.nav} aria-label="On this page">
      <button type="button" className={styles.mobileTrigger} aria-expanded={expanded} aria-controls="docs-toc-list" onClick={() => setExpanded((open) => !open)}>
        <List size={17} aria-hidden="true" /><span>On this page</span><ChevronDown size={17} aria-hidden="true" data-expanded={expanded} />
      </button>
      <div className={styles.body} data-expanded={expanded} id="docs-toc-list">
        <p className={styles.heading}>On this page</p>
        <ol className={styles.list}>
          {items.map(({ id, label, depth }) => (
            <li key={id} data-depth={depth}>
              <a href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setExpanded(false)}>{label}</a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
