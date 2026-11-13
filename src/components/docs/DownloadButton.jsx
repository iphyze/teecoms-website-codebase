import { Download } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function DownloadButton({ href, children = 'Download', variant = 'outline' }) {
  if (!href || !href.startsWith('/docs/')) return null
  return <Button href={href} variant={variant} size="sm" arrow={false} download><Download size={16} aria-hidden="true" />{children}</Button>
}
