'use client'

import { useEffect } from 'react'

/** A single delegated listener for all pre-rendered Markdown code blocks. */
export default function DocsCodeCopy() {
  useEffect(() => {
    const handleClick = async (event) => {
      const button = event.target.closest?.('.docs-code-copy')
      if (!button) return
      const code = button.closest('.docs-code')?.querySelector('pre code')
      if (!code) return
      try {
        await navigator.clipboard.writeText(code.textContent)
        button.textContent = 'Copied'
      } catch {
        button.textContent = 'Copy unavailable'
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
  return null
}
