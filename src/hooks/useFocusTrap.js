'use client'

import { useEffect } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container) => (
  Array.from(container?.querySelectorAll(FOCUSABLE_SELECTOR) || []).filter((element) => {
    if (element.getAttribute('aria-hidden') === 'true') return false
    const style = window.getComputedStyle(element)
    return style.visibility !== 'hidden' && style.display !== 'none' && element.getClientRects().length > 0
  })
)

export const useFocusTrap = ({
  active,
  containerRef,
  initialFocusRef,
  restoreFocusRef,
}) => {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return undefined

    const previouslyFocused = document.activeElement
    const container = containerRef.current
    if (!container) return undefined

    const focusInitialElement = () => {
      const fallback = getFocusableElements(container)[0]
      const target = initialFocusRef?.current || fallback || container
      target?.focus?.({ preventScroll: true })
    }

    const animationFrame = window.requestAnimationFrame(focusInitialElement)

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(container)
      if (!focusable.length) {
        event.preventDefault()
        container.focus?.({ preventScroll: true })
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && (activeElement === first || !container.contains(activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      document.removeEventListener('keydown', handleKeyDown)

      const restoreTarget = restoreFocusRef?.current || previouslyFocused
      if (restoreTarget?.isConnected) {
        restoreTarget.focus?.({ preventScroll: true })
      }
    }
  }, [active, containerRef, initialFocusRef, restoreFocusRef])
}
