import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'

const root = process.cwd()
const text = (path) => readFileSync(resolve(root, path), 'utf8')
const jsx = text('src/components/sections/home/AboutSection.jsx')
const aboutStyles = text('src/components/sections/home/AboutSection.module.css')
const heroStyles = text('src/components/sections/home/HeroSlider.module.css')
const tokens = text('src/styles/tokens.css')
const reveal = text('src/components/ui/Reveal.module.css')
const sourceCopy = text('src/content/home.content.js')

test('About section continues to render approved copy fields rather than illustrative metrics', () => {
  for (const binding of [
    'content.eyebrow', 'content.title', 'content.lead', 'content.paragraphs[1]',
    'content.cta.label', 'content.pillars.map', 'content.expertise.map',
    'content.closing.strong', 'content.closing.rest',
    'mission.label', 'mission.title', 'mission.body',
    'vision.label', 'vision.title', 'vision.body',
  ]) assert.ok(jsx.includes(binding), `Missing ${binding}`)
  assert.ok(sourceCopy.includes('Technology Solutions Built Around Your Business.'))
  assert.ok(!jsx.includes('500+') && !jsx.includes('99%') && !jsx.includes('Chinedu Okafor'))
})

test('About uses a distinct collaborative image and retains the real team portraits elsewhere', () => {
  assert.ok(existsSync(resolve(root, 'public/images/about/team-collaboration.webp')))
  assert.match(jsx, /\/images\/about\/team-collaboration\.webp/)
  assert.doesNotMatch(jsx, /teamContent|managingDirector\.image|operationsManager\.image/)
  for (const name of ['babalola-oluwatobi-samuel.webp', 'ayotunde-odusanya.webp']) {
    assert.ok(existsSync(resolve(root, 'public/images/team', name)))
    assert.ok(sourceCopy.includes(name))
  }
  assert.match(jsx, /content\.closing\.strong/)
})

test('Hero has a static dotted mat with theme-specific contrast and no wave animation', () => {
  assert.match(heroStyles, /\.ambient\s*\{[^}]*radial-gradient\(circle/s)
  assert.match(heroStyles, /\[data-theme='dark'\]\)\s*\.ambient/)
  assert.doesNotMatch(heroStyles, /flow-light\.svg|flow-dark\.svg/)
})

test('Both modes have About accent tokens, responsive layout, and reduced-motion behaviour', () => {
  assert.equal((tokens.match(/--color-about-green:/g) || []).length, 2)
  assert.match(aboutStyles, /@media \(max-width: 740px\)/)
  assert.match(aboutStyles, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(reveal, /--reveal-ease: cubic-bezier/)
  assert.match(reveal, /@media \(prefers-reduced-motion: reduce\)/)
})
