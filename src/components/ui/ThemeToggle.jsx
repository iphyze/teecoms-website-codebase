'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './ThemeToggle.module.css'

const ThemeToggle = ({ className = '', tone = 'auto' }) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={(event) => {
        // Reveal grows from the centre of this button (works for keyboard too)
        const box = event.currentTarget.getBoundingClientRect()
        toggleTheme({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
      }}
      className={`${styles.toggle} ${className}`}
      data-tone={tone}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <span className={styles.icon} data-active={!isDark}>
        <Sun size={18} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className={styles.icon} data-active={isDark}>
        <Moon size={18} strokeWidth={2} aria-hidden="true" />
      </span>
    </button>
  )
}

export default ThemeToggle
