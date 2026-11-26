import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'
import { servicesContent, contactContent } from '../src/content/home.content.js'

const jsx = readFileSync('src/components/sections/home/ServicesSection.jsx', 'utf8')
const css = readFileSync('src/components/sections/home/ServicesSection.module.css', 'utf8')

test('Services preserves the eight approved services and contact choices', () => {
  assert.equal(servicesContent.items.length, 8)
  for (const item of servicesContent.items) {
    assert.ok(item.title && item.tagline && item.body && item.icon)
    assert.ok(contactContent.serviceOptions.includes(item.title))
  }
  assert.match(jsx, /service\.title/)
  assert.match(jsx, /service\.tagline/)
  assert.match(jsx, /service\.body/)
  assert.match(jsx, /teecoms:select-service/)
  assert.match(jsx, /discuss\(service\.title\)/)
  assert.equal(servicesContent.cta.href, '#contact')
})

test('Photo-led catalogue has a distinct local image and no invented logo or green UI accent', () => {
  assert.ok(existsSync('public/images/services/technology-collaboration.webp'))
  assert.match(jsx, /\/images\/services\/technology-collaboration\.webp/)
  assert.match(jsx, /alt="Illustrative image/)
  assert.doesNotMatch(jsx, /BrandLogo|\/images\/brand\/|\/images\/about\//)
  assert.doesNotMatch(css, /green|--gradient-di/)
  assert.match(css, /var\(--gradient-band\)/)
  assert.match(css, /background: linear-gradient\(145deg, var\(--color-surface-raised\), color-mix\(in srgb, var\(--color-surface-raised\) 70%, var\(--color-bg\)\)\)/)
})

test('Card details are keyboard accessible and responsive without shared style changes', () => {
  assert.match(jsx, /aria-expanded=\{expanded\}/)
  assert.match(jsx, /aria-controls=\{panelId\}/)
  assert.match(jsx, /inert=\{!expanded\}/)
  assert.match(jsx, /aria-hidden=\{!expanded\}/)
  assert.match(jsx, /setActive\(expanded \? null : index\)/)
  assert.match(jsx, /ArrowDown/)
  assert.match(jsx, /ArrowUp/)
  assert.match(jsx, /href="#service-offerings"/)
  assert.match(css, /min-height: 44px/)
  assert.match(css, /repeat\(4, minmax\(0, 1fr\)\)/)
  assert.match(css, /repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(css, /prefers-reduced-motion: reduce/)
  assert.doesNotMatch(jsx, /<Reveal[^>]*\bonce\b/)
})


test('Service details slide open and closed in layout without delaying accessibility', () => {
  assert.match(jsx, /data-expanded=\{expanded\}/)
  assert.match(jsx, /data-has-expanded=\{active !== null \|\| closing !== null\}/)
  assert.match(jsx, /onTransitionEnd=\{\(event\) => finishSlide\(event, index\)\}/)
  assert.doesNotMatch(jsx, /\shidden=\{!expanded\}/)
  assert.match(css, /grid-template-rows: 0fr/)
  assert.match(css, /grid-template-rows: 1fr/)
  assert.match(css, /transition: grid-template-rows var\(--dur-base\)/)
  assert.match(css, /\.detailClip\s*\{[^}]*min-height: 0/)
  assert.match(css, /\.card, \.arrow, \.detail \{ transition: none; \}/)
})

test('Heading refinements preserve approved copy and the closing blue CTA', () => {
  const about = readFileSync('src/components/sections/home/AboutSection.jsx', 'utf8')
  const accents = readFileSync('src/components/ui/HeadingAccent.module.css', 'utf8')
  assert.match(about, /<HeadingAccent title=\{content\.title\} phrases=\{\['Built', 'Your Business'\]\}/)
  assert.match(jsx, /<HeadingAccent title=\{content\.title\} phrases=\{\['Technology Solutions'\]\}/)
  assert.match(jsx, /<HeadingAccent title=\{content\.catalogueTitle\} phrases=\{\['Technology Services'\]\}/)
  assert.match(accents, /font-style: italic/)
  assert.match(accents, /text-decoration-line: underline/)
  assert.match(jsx, /href=\{content\.cta\.href\} variant="primary"/)
  assert.match(css, /grid-template-columns: minmax\(0, 0\.88fr\) minmax\(0, 1\.12fr\)/)
  assert.match(css, /aspect-ratio: 508 \/ 356/)
})
