/** Resolve home section fragments when navigation originates on another route. */
export function resolveSiteHref(href, isHome = false) {
  if (typeof href !== 'string') return '/'
  return href.startsWith('#') && !isHome ? `/${href}` : href
}
