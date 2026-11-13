'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import styles from './DocsCopyLink.module.css'

export default function DocsCopyLink() {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button type="button" className={styles.button} onClick={onCopy} aria-label="Copy this document's link">
      {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}
