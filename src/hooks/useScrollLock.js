'use client'

import { useEffect } from 'react'

// Locks page scroll while a full-screen layer (mobile menu, dialog) is open.
// Pads the body by the scrollbar width so the layout doesn't jump on desktop.
export const useScrollLock = (locked) => {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return undefined

    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    const previous = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      overscroll: body.style.overscrollBehavior,
      htmlOverflow: documentElement.style.overflow,
    }

    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'contain'
    documentElement.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
      body.style.overscrollBehavior = previous.overscroll
      documentElement.style.overflow = previous.htmlOverflow
    }
  }, [locked])
}
