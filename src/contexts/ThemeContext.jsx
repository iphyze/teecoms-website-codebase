'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { THEME_STORAGE_KEY } from '@/config/site'

const ThemeContext = createContext(null)

const readStored = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const setRootTheme = (theme) => {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

/*
  Switching themes:
  - `theme-instant` turns off every element's own colour transition for a
    moment, so the whole page changes in the same frame. (Fading each element
    separately froze the page for ~900ms and let gradients jump ahead of
    solid colours.)
  - With an origin (the toggle button) and View Transitions support, the new
    theme is revealed as one GPU-composited image expanding in a circle from
    the button. Otherwise the swap is instant and clean.
*/
const applyTheme = (theme, origin) => {
  const root = document.documentElement
  if (root.dataset.theme === theme) return

  root.classList.add('theme-instant')
  const release = () => {
    // two frames: the new colours are painted before transitions come back
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-instant')))
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!origin || reduce || typeof document.startViewTransition !== 'function') {
    setRootTheme(theme)
    release()
    return
  }

  const transition = document.startViewTransition(() => setRootTheme(theme))
  transition.ready
    .then(() => {
      const { x, y } = origin
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})
  transition.finished.finally(release)
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

const ThemeProvider = ({ children }) => {
  // The inline script in app/layout.js has already set data-theme before
  // paint. Start from 'light' to match the server render, then sync.
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    setThemeState(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

    // Follow the OS setting until the visitor picks a theme themselves
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (readStored()) return
      const next = systemTheme()
      applyTheme(next)
      setThemeState(next)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  // origin: { x, y } viewport point the reveal grows from (the toggle button)
  const setTheme = useCallback((next, origin) => {
    applyTheme(next, origin)
    setThemeState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Private mode or storage disabled: the choice lasts for this visit only
    }
  }, [])

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: (origin) => setTheme(theme === 'dark' ? 'light' : 'dark', origin),
  }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
