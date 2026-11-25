import assert from 'node:assert/strict'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const read = (name) => readFileSync(resolve(root, name), 'utf8')
const about = read('src/components/sections/home/AboutSection.jsx')
const aboutCSS = read('src/components/sections/home/AboutSection.module.css')
const btnCSS = read('src/components/ui/Button.module.css')
const tokens = read('src/styles/tokens.css')
const backCSS = read('src/components/layout/BackToTop.module.css')
const backJSX = read('src/components/layout/BackToTop.jsx')

test('About photo is a new local, sufficiently sized asset, not leadership portraits', () => {
  const f = resolve(root, 'public/images/about/team-collaboration.webp')
  assert.ok(existsSync(f))
  assert.ok(statSync(f).size > 50000)
  assert.match(about, /className=\{styles\.teamPhoto\}/)
  assert.match(about, /Illustrative image of two professionals collaborating/)
  assert.doesNotMatch(about, /teamContent|styles\.portraits|managingDirector/)
})

test('About animation replay works on return and does not disable reduced motion', () => {
  assert.doesNotMatch(about, /<Reveal[^>]*\bonce\b/)
  const reveal = read('src/components/ui/Reveal.jsx')
  assert.match(reveal, /if \(!entry\.isIntersecting && shown\.current\)/)
  assert.match(reveal, /setVisible\(false\)/)
  assert.match(reveal, /setReplay\(true\)/)
  assert.match(read('src/components/ui/Reveal.module.css'), /prefers-reduced-motion: reduce/)
})

test('About uses warm near-white in light mode and original charcoal in dark mode', () => {
  assert.match(aboutCSS, /#fdfefe 0%, #fafcff 54%, #ffffff 100%/)
  assert.match(aboutCSS, /:global\(:root\[data-theme='dark'\]\) \.section/)
  assert.match(aboutCSS, /background: var\(--color-bg\);/)
  assert.doesNotMatch(about, /statementBrand|teecoms-mark-(light|dark)/)
})

test('Primary blue buttons use common cobalt gradient; DI variant remains separate', () => {
  assert.equal((tokens.match(/--gradient-button-bg:/g) || []).length, 2)
  assert.match(btnCSS, /\.button\[data-variant='primary'\]/)
  assert.match(btnCSS, /--btn-bg: var\(--gradient-button-bg\)/)
  assert.match(btnCSS, /\.button\[data-variant='di'\]/)
})

test('Back-to-top control and arrow are smaller in both viewports', () => {
  assert.match(backCSS, /width: 2\.7rem/)
  assert.match(backCSS, /width: 2\.5rem/)
  assert.match(backJSX, /<ArrowUp size=\{18\}/)
})
