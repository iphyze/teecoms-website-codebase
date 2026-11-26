> **Current NRS resubmission guidance (25 November 2026):** The former public NRS v1.1 gap-analysis route and PDF were withdrawn. Any historical steps below naming `/developers/nrs-alignment/` are superseded. Follow the final checklist at `docs/NRS-PUBLISH-CHECKLIST.md` and remove the withdrawn route/PDF from the source and deployed web root. The public replacement is `/developers/timeline/`.

# Teecoms website: build guide

How to finish the single-page Teecoms website, section by section, so it matches the approved design previews. Written so any developer or AI coding assistant can pick it up.

**Read first:** `AGENTS.md`. This project uses Next.js 16.3.3; read the matching guide in `node_modules/next/dist/docs/` before writing Next-specific code.

---

## 1. Where things stand

| Area | Status | Files |
|---|---|---|
| Design tokens (light + dark), font, base CSS | Done | `src/styles/tokens.css`, `src/styles/globals.css`, `src/assets/fonts/` |
| Theme switching (no flash, follows OS) | Done | `src/contexts/ThemeContext.jsx`, inline script in `src/app/layout.js` |
| Logos (Teecoms + DigitalInvoice, SVG) | Done | `public/images/brand/`, `public/images/digitalinvoice/`, `src/components/brand/BrandLogo.jsx` |
| Header (always visible, frosted glass, scroll-spy, mobile menu) | Done | `src/components/layout/Header.jsx` + `.module.css` |
| Hero slider (4 slides, Productivity Flow hero redesign) | Done | `src/components/sections/home/HeroSlider.jsx`, `HeroVisual.jsx` + CSS modules |
| Buttons | Done | `src/components/ui/Button.jsx` + `.module.css` |
| Scroll reveal (motion system, section 3) | Done | `src/components/ui/Reveal.jsx` + `.module.css` |
| Small headings | Done | `src/components/ui/Eyebrow.jsx` + `.module.css` |
| About (section 5.1) | Done; use it as the pattern for the rest | `src/components/sections/home/AboutSection.jsx` + `.module.css`, `aboutContent` in `home.content.js` |
| Services (section 5.2) | Done | `src/components/sections/home/ServicesSection.jsx` + `.module.css`, `servicesContent` in `home.content.js` |
| DigitalInvoice (section 5.3) | Done | `src/components/sections/home/DigitalInvoiceSection.jsx`, `digitalinvoice/` (screens + `DeviceStage`), `src/components/devices/` (`Laptop`, `Phone`) |
| Why Choose Teecoms | Done | `src/components/sections/home/WhySection.jsx` + `.module.css`, `whyContent` in `home.content.js` |
| Our Leadership | Done | `src/components/sections/home/TeamSection.jsx` + `.module.css`, `teamContent` in `home.content.js` |
| Corporate Commitments | Done | `src/components/sections/home/CommitmentsSection.jsx` + `.module.css`, `commitmentsContent` in `home.content.js` |
| Final call to action | Done | `src/components/sections/home/CtaSection.jsx` + `.module.css`, `ctaContent` in `home.content.js` |
| Contact | Done | `src/components/sections/home/ContactSection.jsx`, `ContactForm.jsx` + CSS modules, `contactContent`, `site.contact` |
| Footer | Done | `src/components/layout/Footer.jsx` + `.module.css`, `footerContent` in `home.content.js` |

**Visual reference for everything still to build:**

- `design/previews/*.png` are the approved section images.
- `design/comps.html` + `design/comps.css` are the same designs as working HTML/CSS. Open `design/comps.html` through a local server (`npx serve .` from the repo root) and inspect any element for exact spacing, sizes and colours.
- `design/build-comps.mjs` regenerates `comps.html` (`node design/build-comps.mjs`).

The comps are a **reference, not production code**. Port each section into React components using the rules below.

---

## 2. Rules that apply to every section

1. **Colours only from tokens.** Use `var(--color-…)`, never raw hex in components, except the DigitalInvoice gradient and the always-navy bands, which already have tokens (`--gradient-di`, `--gradient-band`, `--color-band*`). Every token has a dark-mode value, so following this rule makes dark mode work automatically.
2. **One font:** Plus Jakarta Sans via `var(--font-sans)`. Headings use weight 800 (h2) or 700 (h3). Body text is 400/500.
3. **Plus Jakarta has a narrow space.** Headings already get `word-spacing: 0.06em` from `globals.css`. Any new large text with negative letter-spacing needs the same compensation.
4. **Numbers, amounts and invoice IDs** get the `num` class (tabular figures). Use the `₦` character directly; the font includes it.
5. **Buttons:** always `<Button>` from `src/components/ui/Button.jsx`:
   - `variant="primary"` is Teecoms blue, the main action.
   - `variant="di"` is green, for DigitalInvoice actions only.
   - `variant="outline"` is the secondary action on page backgrounds.
   - `variant="glass"` is the secondary action on navy bands.
   - `size="sm"` is for compact places (header, footer).
   - Only hero CTAs use `shine`.
6. **Small headings (eyebrows):** always `<Eyebrow>` from `src/components/ui/Eyebrow.jsx`: `tone="brand"` (default) on page backgrounds, `tone="light"` on navy bands, `tone="di"` in the DigitalInvoice section.
7. **Corner radius:**
   - 10px: buttons and inputs.
   - `--radius-lg` (20px): cards.
   - `--radius-xl` (28px): large panels.
   - `--radius-leaf`: DigitalInvoice surfaces only.
8. **Section spacing:** `padding-block: var(--section-y)`. Alternate backgrounds:
   - `--color-bg`: About, Why Choose Us, Contact.
   - `--color-surface` with top and bottom borders: Services, Team.
   - DigitalInvoice tint: DigitalInvoice.
   - Navy band: Commitments, Footer.
9. **Section ids must match the nav:** `about`, `services`, `digitalinvoice`, `team`, `contact`. Scroll-spy and smooth scrolling depend on them. Extra sections use `why`, `commitments` and `cta`.
10. **Copy lives in `src/content/home.content.js`.** Add each section's text there from the approved copy document. Do not rewrite the wording.
11. **Accessibility:**
    - Each section has one `h2`.
    - Icons are `aria-hidden`.
    - Interactive elements show a focus ring (global `:focus-visible`).
    - Test with the keyboard.
12. **CSS Modules** per component (`Component.module.css`), like the existing code. Avoid global class names except utilities in `globals.css` (`container`, `num`, `sr-only`, `on-light-only`, `on-dark-only`).

---

### Shared horizontal alignment (25 November 2026)

- **One grid for the entire site:** `--container: 92.5rem` (1480px), `--gutter: clamp(1.5rem, 3.75vw, 4.25rem)` and `--content-width` live in `src/styles/tokens.css`.
- `src/styles/globals.css` applies `--content-width` to `.container`. The header uses `.container` directly; `HeroSlider.module.css` uses the same variable for its slide and carousel controls. This aligns the outer edges of About, Services, DigitalInvoice, Why, Team, Commitments, CTA, Contact, Developers/SLA pages and the footer with the header.
- The mobile gutter is 1rem through 640px, matching the existing mobile header/hero. At widths above 640px the fluid gutter applies; content is capped at 1480px on wide desktops. No section should duplicate these values in a CSS Module.
- Internal text measures and card padding **remain component-specific** for readability. Full-bleed backgrounds and the About marquee still cover the viewport; only their contained content uses the shared grid. Print documents use their `@page` margins rather than the screen gutter.
- When changing the spacing system, test at 360, 390, 640, 768, 1024, 1280, 1366 and 1920px. Compare the left/right edges of the header logo, section containers, docs layout and footer; also verify there is no horizontal scrolling.

## 3. Motion system (build this first)

Every section uses one shared scroll-reveal component, so all motion has the same feel. Effects animate only `opacity` and `transform`, play once, and are skipped for visitors who prefer reduced motion.

**Status: built.** The code below is what's in the repo; it's kept here for reference.

### 3.1 `src/components/ui/Reveal.jsx`

```jsx
'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Reveal.module.css'

/**
 * Fades and lifts its content into view once, when it first enters the viewport.
 * as      element to render (default 'div')
 * delay   extra delay in ms
 * stagger true: direct children animate one after another (70ms apart)
 * from    'up' (default) | 'left' | 'right' | 'scale'
 */
export default function Reveal({ as: Tag = 'div', delay = 0, stagger = false, from = 'up', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-visible={visible}
      data-stagger={stagger || undefined}
      data-from={from}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
```

### 3.2 `src/components/ui/Reveal.module.css`

```css
.reveal:not([data-stagger]),
.reveal[data-stagger] > * {
  opacity: 0;
  transform: translate3d(0, 1.5rem, 0);
  transition:
    opacity 700ms var(--ease-out),
    transform 800ms var(--ease-out);
  transition-delay: var(--reveal-delay, 0ms);
}

.reveal[data-from='left']:not([data-stagger]) { transform: translate3d(-2rem, 0, 0); }
.reveal[data-from='right']:not([data-stagger]) { transform: translate3d(2rem, 0, 0); }
.reveal[data-from='scale']:not([data-stagger]) { transform: scale(0.96); }

/* Children appear 70ms apart (up to 8), after the container's own delay */
.reveal[data-stagger] > :nth-child(1) { transition-delay: calc(var(--reveal-delay) + 0ms); }
.reveal[data-stagger] > :nth-child(2) { transition-delay: calc(var(--reveal-delay) + 70ms); }
.reveal[data-stagger] > :nth-child(3) { transition-delay: calc(var(--reveal-delay) + 140ms); }
.reveal[data-stagger] > :nth-child(4) { transition-delay: calc(var(--reveal-delay) + 210ms); }
.reveal[data-stagger] > :nth-child(5) { transition-delay: calc(var(--reveal-delay) + 280ms); }
.reveal[data-stagger] > :nth-child(6) { transition-delay: calc(var(--reveal-delay) + 350ms); }
.reveal[data-stagger] > :nth-child(7) { transition-delay: calc(var(--reveal-delay) + 420ms); }
.reveal[data-stagger] > :nth-child(8) { transition-delay: calc(var(--reveal-delay) + 490ms); }

.reveal[data-visible='true']:not([data-stagger]),
.reveal[data-visible='true'][data-stagger] > * {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal:not([data-stagger]),
  .reveal[data-stagger] > * {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

**Fallback:** if the observer is unavailable (very old browsers), content would stay hidden. Add this inside `Reveal`'s effect: `if (!('IntersectionObserver' in window)) { setVisible(true); return }`.

### 3.3 Motion rules

- **Durations:** 700–800ms for entrances; 160–280ms for hover. Use the `--ease-out` token.
- **One heading reveal per section:** the eyebrow and h2 reveal together, the intro paragraph 100ms later, then the grid with `stagger`.
- **A card that reveals and also lifts on hover needs two elements.** Put `Reveal stagger` on the list, so each `li` gets the reveal transition, and put the hover transform and transition on an inner `div` inside the `li`. If both live on one element, the hover `transition` overrides the reveal's stagger delays and every card pops in at once. See `ServicesSection.jsx`.
- **Hover on cards:**
  - Lift with `translateY(-4px)`.
  - Use a stronger border and `--shadow-lg`.
  - The icon tile fills with `--color-primary`.
  - Only on `@media (hover: hover)`.
- **Continuous (looping) animations are only allowed for** the hero, the DigitalInvoice devices' gentle float, and the CTA phone float. Pause loops when off-screen: copy the `IntersectionObserver` + `--loop-state` pattern in `HeroSlider.jsx`.
- **Never animate** `width`, `height`, `top`, `left`, `margin`, `box-shadow` on scroll, or `filter` in loops. Use `transform`/`opacity`, or `scaleX`/`scaleY` for bars.
- **Blur:** don't use `backdrop-filter` over moving content. The header is the one exception.

### 3.4 Replays when scrolling back

`Reveal` replays its animation each time a section comes back into view (the code in 3.1–3.2 above shows the original first-time-only version; the current source in `src/components/ui/Reveal.jsx` is authoritative). Three rules keep replays professional:

- **Reset only when fully off-screen**, so content never fades out while it can still be seen.
- **Follow the scroll direction:** `from="up"` content rises from below when scrolling down, and settles from above when scrolling back up (`data-enter`).
- **Replays are calmer than the first entrance:** 0.9rem travel and 560ms instead of 1.5rem and 800ms, with a tighter stagger (`data-replay`).

CSS keyed to `[data-visible='true']` (DigitalInvoice chart bars, Commitments icon pulse) replays automatically. Pass `once` to keep a one-time entrance, for example for anything that would be distracting on repeat.

---

## 4. Smooth scrolling

### 4.1 Already in place (keep it)

- `globals.css` sets `scroll-behavior: smooth` (only when reduced motion is not requested) and `scroll-padding-top: calc(var(--header-h) + 1rem)`, so anchor links glide and stop below the fixed header.
- `Header.jsx` stays fixed and visible at all scroll positions. A translucent, backdrop-blurred header adapts to the light/dark theme and becomes slightly more opaque after scrolling. Scroll-spy continues to highlight the active section.

### 4.2 Optional: inertial smooth scroll with Lenis (desktop wheel feel)

Add this only if the client wants the "buttery" wheel scrolling seen on premium sites. Native scrolling is already smooth for anchors.

1. Install an exact version: run `npm view lenis time --json`, pick the newest release published at least two weeks ago, and install it pinned (`npm install lenis@<version> --save-exact`).
2. Create `src/components/layout/SmoothScroll.jsx`:

```jsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return undefined // keep native scrolling on touch and for reduced motion

    document.documentElement.style.scrollBehavior = 'auto' // Lenis handles smoothing; avoid double easing
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    // In-page anchors: glide with Lenis and stop below the fixed header
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return
      event.preventDefault()
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) * 16 || 72
      lenis.scrollTo(target, { offset: -(header + 16), duration: 1.1 })
      history.replaceState(null, '', link.getAttribute('href'))
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onClick)
      lenis.destroy()
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])
  return null
}
```

3. Render `<SmoothScroll />` once in `src/app/layout.js`, inside `<ThemeProvider>`.
4. **Integration notes:**
   - Add `html.lenis, html.lenis body { height: auto; }` to `globals.css`.
   - When the mobile menu is open, call `lenis.stop()` and then `lenis.start()` when it closes. Expose the instance through a small context, or check `document.body.style.overflow`.
   - Header frosted-glass opacity, floating Back to Top button, and scroll-spy keep working, because Lenis moves the real scroll position.
5. Before adding Lenis, check the version's API in `node_modules/lenis/README.md`.

---

### 4.3 Shared navigation and scrolling polish (built)

- **Persistent frosted-glass header:** `Header.jsx` never hides while scrolling. On both the hero and page sections it uses a real 28px `backdrop-filter` blur over theme-aware translucent glass: pale glass with navy text in light mode, deep navy glass with light text in dark mode. It becomes slightly more opaque after scrolling, and has opaque accessibility and browser fallbacks. The theme-aware logo, theme toggle, mobile menu and scroll-spy stay intact.
- **Theme-aware scrollbar:** `globals.css` styles the scrollbar with the brand's blue and navy shades. Its tokens adapt automatically to the current theme; Firefox receives standards-based colours and width.
- **Floating Back to Top:** `src/components/layout/BackToTop.jsx` and its CSS Module render a circular button above the page. It appears after scrolling more than `max(480px, 65vh)`, scrolls smoothly to the top, honours reduced-motion preferences, and is removed from keyboard focus while hidden. Rendered once in `page.js`, below the footer.
- Both the fixed header and the floating button remain beneath the full-screen mobile menu overlay. No new dependencies were added.

---

## 5. Section specs

For each section:

1. Add its copy to `home.content.js`.
2. Create `src/components/sections/home/<Name>Section.jsx` + `.module.css`.
3. Replace its stub in `page.js`.
4. Compare against its preview image in both themes and at 390, 768, 1024 and 1440px wide.

### 5.1 About (`#about`): `AboutSection.jsx`

**Status: built.** Read `AboutSection.jsx` before starting another section; it shows how to combine content, `Reveal`, `Eyebrow`, `Button` and CSS Modules.

**Reference:** `design/previews/01-about-light.png`, `.about` and `.mv` in `comps.css`.

- **Layout:**
  - Two columns (1fr / 0.9fr, gap up to 6rem), vertically centred.
  - Left column: eyebrow "Who we are", the h2 (max 16ch), the first paragraph as a lead (`--text-lead`, ink colour), three body paragraphs, and an outline button "Discover Our Expertise" linking to `#services`.
  - Right column: the navy "Our expertise" panel (`--gradient-band`, `--radius-xl`), listing 7 expertise rows with icons: Server, Cloud, ShieldCheck, Code2, MonitorCog, Workflow, Compass. It has a faint Teecoms mark watermark in the bottom right (`teecoms-mark-dark.webp`, opacity 0.07). A white "Public & private sector" chip with a Landmark icon overlaps the panel's bottom-left edge.
  - Below the two columns, Mission and Vision cards side by side. Mission is on the surface colour with a Target icon. Vision is on the navy gradient with an Eye icon. Each card has a small label, an h3 and a paragraph.
- **Mobile:** single column; the chip sits under the panel; Mission and Vision stack.
- **Motion:**
  - The copy reveals `from="left"`.
  - The panel reveals `from="right"` with a 150ms delay, and its list rows stagger.
  - The chip reveals `scale` at 500ms.
  - The Mission/Vision cards stagger.

### 5.2 Services (`#services`): `ServicesSection.jsx`

**Current reference:** the approved photo-led Option 2 (26 November 2026), described in the Services section below. The earlier `02-services-light.png` / `-dark.png` and `.svc-grid` are historical references only.

- Use a photographic split introduction, with the original headline, eyebrow and intro copy, followed by a numbered service catalogue.
- All eight service titles, icons, taglines and descriptions remain sourced from `servicesContent`; each card expands to reveal the full description and original contact actions.
- Use blue/slate/neutral accents only, the shared container, tokens, buttons and repeatable reveal animation. Do not introduce a new logo or change other sections.

### 5.3 DigitalInvoice (`#digitalinvoice`): `DigitalInvoiceSection.jsx`

**Status: built.** The device screens recreate the real DigitalInvoice app (its source was reviewed): the sidebar (Dashboard, Sales, Payments, Reports + organisation card), the app's own metric cards and colour tones (Approved invoices, Collections received, Outstanding balance, Overdue receivables), the "Invoices and collections" chart (blue invoiced area + teal collected bars), real invoice statuses (Approved, Pending approval, Draft), and the invoice document layout with VAT 7.5%, "Share secure link" (customer portal) and PDF actions. Sample figures are internally consistent (outstanding = approved − collected; the same invoice total appears on the laptop, phone and toast). Keep them consistent if you edit them.

- **Reusable devices for the CTA section:** `<Phone><InvoiceScreen /></Phone>` from `src/components/devices/Phone.jsx` and `.../digitalinvoice/InvoiceScreen.jsx`. Wrap looping float animations in `DeviceStage` so they pause off-screen.
- **"Explore DigitalInvoice" link:** set `NEXT_PUBLIC_DIGITALINVOICE_URL` in `.env.local` to the live product website. While empty, the button scrolls to the feature list (`#digitalinvoice-features`).
- **Screen text scales with the device** (`font-size` in `cqw` on a size-container screen), so the screens stay proportional at every width.

**Reference:** `03-digitalinvoice-light.png` / `-dark.png`, `m-digitalinvoice.png` (mobile), `.di-hero`, `.devices`, `.laptop`, `.phone` in `comps.css`.

- **Background:** `--color-bg` with soft green and blue radial tints (`.sec.di`).
- **Top area:** two columns (0.85fr / 1.15fr).
  - Left: the full DigitalInvoice logo (`<BrandLogo brand="digitalinvoice" height={60} />`), the green eyebrow "Innovation by Teecoms", the h2 "Introducing DigitalInvoice", and the sub-heading "Simplifying Invoicing. Supporting Business Growth." in `--color-di-ink`, weight 700.
  - Then the supporting paragraphs, plus buttons "Explore DigitalInvoice" (`di`, using the live product URL) and "Request a Product Demo" (`outline`, using the demo URL with `#contact` fallback). Social icons belong only in the footer, beneath its DigitalInvoice button. Only verified URL destinations become interactive.
- **Devices (right column):** create reusable components first:
  - `src/components/devices/Laptop.jsx` is a lid with bezel and camera dot, a 16:10 screen and a silver base; port `.laptop`, `.lid`, `.cam`, `.screen` and `.base`. Its children render inside the screen.
  - `src/components/devices/Phone.jsx` is a 9:19 frame with Dynamic Island; port `.phone`, `.phone-screen` and `.island`.
  - `src/components/sections/home/digitalinvoice/DashboardScreen.jsx` is the laptop content: a sidebar (Dashboard active, Invoices, Customers, Reports, Settings), a "Welcome back" bar with a "New invoice" button, 3 KPI cards, a trend bar chart, a status donut (`conic-gradient`) and 2 invoice rows.
  - `.../InvoiceScreen.jsx` is the phone content: the amount-due card on `--gradient-di` with a "Paid" badge, 3 line items and a "Share invoice" button.
  - The phone overlaps the laptop's bottom right (28% width). A "Payment received" toast overlaps the laptop's bottom left.
  - All figures are sample data. The content uses theme tokens, so screens switch between light and dark with the site.
- **Feature row:** the title "What DigitalInvoice Brings to Your Business", then 4 cards with `--radius-leaf` and green-to-blue gradient icon tiles (FileText, Receipt, Eye, BarChart3).
- **Product expansion (reference art dated 16 October 2026):** after the four existing features and before the closing strip, include three compact product-specific blocks:
  1. A navy, on-brand e-invoicing context panel discussing invoice data, review and regulatory readiness. **Do not** assert NITDA certification or NRS connectivity without product-team verification.
  2. A grid of example software systems (Sage, QuickBooks, Dynamics, Oracle, Odoo, Custom APIs) for compatibility conversations. These **are not** advertised as proven integrations or vendor partnerships.
  3. Eight industry billing-use-case tiles (finance, manufacturing, oil and gas, healthcare, retail, government, education and professional services). This is not a customer/sector count.
  The reference also contains 500+ businesses, 5M+ invoices and 99.9% uptime claims; these were **not added** because no supporting evidence was provided. Reuse section tokens and existing `Reveal` rather than duplicating the Teecoms corporate Services section, product devices or final CTA. Copy belongs under `digitalInvoiceContent` in `src/content/home.content.js`.
- **Closing strip:** a mint panel with "Built for Businesses Ready to Work Smarter." and its sentence on the left, and a `di` button "Request a Product Demo" on the right.
- **Motion:**
  - The laptop rises in (`translateY(2rem)` → 0, 900ms).
  - The phone slides in from the right at 250ms.
  - The toast pops (`scale(0.9)` → 1) at 700ms.
  - Chart bars grow (`scaleY` from 0, staggered 60ms) once the laptop is visible.
  - Then the phone and toast float gently (`translateY` ±6px, 6s loop, paused off-screen).
  - The feature cards stagger.
- **Mobile:** the devices go below the copy; the laptop is full width and the phone 34%; the feature cards are 1 column.
- **Optional:** reuse `Laptop` + `Phone` in hero slide 4 (`HeroVisual.jsx`, `DigitalInvoiceVisual`) in place of the dashboard card.

### 5.4 Why Choose Teecoms (`#why`): `WhySection.jsx`

**Reference:** `04-why-light.png`, `.why` and `.values`.

- **Layout:** two columns (0.8fr / 1.2fr).
  - Left: the eyebrow "The Teecoms advantage", the h2, a lead paragraph and a second paragraph. The left column is `position: sticky; top: 7rem` on desktop.
  - Right: a 2-column list of the 8 values separated by hairlines (not cards, so it reads differently from Services). Each value has an icon tile, an h3 and a paragraph.
  - **Icons:** Lightbulb, BadgeCheck, Users, Scale, Award, Lock, Handshake, Leaf.
- **Mobile:** the heading is no longer sticky, and the values are 1 column.
- **Motion:** the values `stagger`; the icon tile scales from 0.8 to 1 as each value appears.

**Status: built.** The section follows the two-column, hairline-separated values preview with sticky copy and staggered icon tiles.

### 5.5 Our Leadership (`#team`): `TeamSection.jsx`

**Reference:** `05-team-light.png`, `.team-grid` and `.person`.

- **Header row:** split header like Services.
- **Grid:** 5 columns on desktop, 3 under 1100px, 2 under 560px.
- **Each card:** a photo area (4:4.4 ratio), name (h3), role in primary blue and a description.
- **Photos:** add them as `public/images/team/<firstname-lastname>.webp`, 800×880, faces centred, with a consistent background. Until then, show initials on the navy radial gradient as in the preview. Use `<img loading="lazy" decoding="async">` with width and height set.
- **Hover:** the photo zooms to `scale(1.04)` inside its frame (overflow hidden) over 600ms.
- **Motion:** the cards `stagger`.

**Status: built.** Five leadership profiles render in the approved responsive grid, with initials placeholders until approved photos are provided.

### 5.6 Corporate Commitments (`#commitments`): `CommitmentsSection.jsx`

**Reference:** `06-commitments-light.png`, `.band` and `.commit`.

- **Background:** a navy band (`--gradient-band`) in both themes.
- **Header:** split header with the light eyebrow.
- **Cards:** three, translucent on the navy. Each has an icon tile (ClipboardCheck, HardHat, FileLock2), a white h3, a light-blue tagline and a muted paragraph.
- **Motion:** the cards `stagger`; the icon tiles get a soft pulse ring once on reveal.

**Status: built.** The three-card navy band matches the approved preview, with staggered reveal, once-only icon pulse rings and reduced-motion support.

### 5.7 Final call to action (`#cta`): `CtaSection.jsx`

**Reference:** `07-cta-light.png`, `.cta` and `.cta-phone`.

- **Layout:** a rounded navy panel inside the container (`--radius-xl`), lit by green (top right) and blue (bottom left) glows.
  - Left: the light eyebrow, the h2 (max 16ch), a paragraph, and buttons "Start a Conversation" (primary, linking to `#contact`) and "Explore Our Services" (glass, linking to `#services`).
  - Right: the `Phone` with `InvoiceScreen`, rotated −8° and cropped by the panel's bottom edge.
- **Motion:** the panel reveals `scale`; the phone slides up from 3rem at 300ms, then floats (looping, paused off-screen).
- **Mobile:** the phone is hidden.

**Status: built.** The navy panel uses the approved layout, CTA copy and button variants. The existing phone/invoice preview is reused; its delayed reveal and gentle float respect reduced motion and pause off-screen.

### 5.8 Contact (`#contact`): `ContactSection.jsx` + `ContactForm.jsx`

**Reference:** `08-contact-light.png` / `-dark.png`, `.contact` and `.form`.

- **Left column:** eyebrow, h2, lead paragraph, then 4 contact rows with icon tiles: Company, Email, Telephone and Office location.
  - The copy document still has placeholders for email, phone and address. Show "To be confirmed" in muted italic until the client provides verified details, and **do not invent contact details**. Put them in `src/config/site.js` once confirmed.
- **Right column:** the form card.
  - **Fields** (in this order):
    - Full name: required.
    - Company / Organisation.
    - Business email: required, email format.
    - Phone number: allow `+234` and local formats.
    - Service of interest: `react-select` with the 8 services plus DigitalInvoice and "Other". Use `Controller` from React Hook Form to preserve the submitted string value, client-side preselection, searchable choices and keyboard accessibility; theme all states through CSS variables.
    - Your message: required, minimum 20 characters.
  - Use **react-hook-form** (already installed).
  - Labels sit above inputs. Errors appear under each field in `--color-danger` with `aria-describedby`, saying what's wrong and how to fix it, for example "Enter a valid email address, like name@company.com".
  - Add a hidden honeypot field for spam.
- **Submit:** the full-width primary button "Send Your Enquiry" with a Send icon.
  - While sending, it shows "Sending…" and is disabled.
  - On success, the form is replaced by a confirmation panel ("Enquiry sent. Our team will contact you at {email}.") with a CheckCircle icon.
  - On error, show "Your enquiry wasn't sent. Check your connection and try again, or email us directly." and keep what the visitor typed.
- **Endpoint:** `POST ${process.env.NEXT_PUBLIC_API_BASE_URL}/contact` with a JSON body. This is a static export, so there are no Next API routes. If no endpoint is configured yet, fall back to a `mailto:` link with the fields prefilled.
- **Preselect (optional):** don't use links like `#contact?service=…`. The browser treats the whole string as the element id, so the page won't scroll to `#contact`. If a "Request this service" action is wanted later, have it dispatch a `CustomEvent('teecoms:select-service', { detail: slug })` and scroll to `#contact`; `ContactForm` listens for the event and calls `setValue('service', slug)`.
- **Motion:** the copy reveals `from="left"`, the form `from="right"`. The input focus ring is the primary border plus a 3px soft ring (see `.form-row:first-child .field:first-child input` in `comps.css`).

**Status: built.** The contact section matches the approved light/dark two-column layouts with a validated React Hook Form and a themed, searchable `react-select` dropdown. Contact details remain unconfirmed until supplied through `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE` and `NEXT_PUBLIC_CONTACT_ADDRESS`. Submissions go to `NEXT_PUBLIC_API_BASE_URL/contact` when configured; otherwise a verified email address enables a mailto draft. Without either, the form displays an availability error and preserves the visitor's input. Full live backend delivery requires configuring and testing the endpoint.

### 5.9 Footer: `src/components/layout/Footer.jsx`

**Reference:** `09-footer-light.png`, `.footer`.

- **Background:** a navy band in both themes.
- **Four columns:**
  - Brand: Teecoms dark logo, the tagline in white, and the short description.
  - Quick links.
  - Our services.
  - Flagship product: the compact dark DigitalInvoice logo, its sentence, a glass `sm` button "Explore DigitalInvoice", and five social icon circles beneath it (only verified profile URLs are clickable).
- **Bottom row:** © with the current year (`new Date().getFullYear()`) and "Back to top" linking to `#home`.
- Render it in `page.js` after `</main>`.

**Status: built.** Four-column footer matches the approved preview with responsive two-/one-column layouts, reused Teecoms and DigitalInvoice on-dark logos, keyboard-visible links and dynamic build-year copyright. External DigitalInvoice linking uses `site.digitalInvoiceUrl` when configured and otherwise anchors to the on-page product features. Source syntax and isolated responsive layout checks pass at 320–1440px in tested light/dark views. Full Next.js build is still unverified in this environment because the project dependencies are not locally installed (`sharp` cannot resolve).

---

## 5.10 DigitalInvoice destinations, social icons and `react-select` setup

**Status: implemented in the source; production build still requires dependency installation.**

- Set `NEXT_PUBLIC_DIGITALINVOICE_URL` to the verified product website (the **Explore DigitalInvoice** button uses it; if unset, it scrolls to the local product features).
- Set `NEXT_PUBLIC_DIGITALINVOICE_DEMO_URL` to the product demo scheduling/registration page (both DigitalInvoice demo CTAs and hero slide 4 use it; if unset, these link to `#contact`). Valid external URLs open in a separate tab.
- Set `NEXT_PUBLIC_DIGITALINVOICE_LINKEDIN_URL`, `..._FACEBOOK_URL`, `..._TWITTER_URL`, `..._INSTAGRAM_URL`, and `..._WHATSAPP_URL` to verified accounts. Until configured, circles appear as **non-clickable placeholders**, with no fabricated profile destinations.
- Add these variables to `.env.local` in development; see `.env.example`. Because the site is a static export, `NEXT_PUBLIC_*` values are embedded **at build time**. Rebuild after changing values in production.
- `react-select@5.10.2` is declared in `package.json`. Run `npm install` after applying the changes-only package; this installs the dependency and regenerates `package-lock.json`. The registry was inaccessible from the editing environment, so no fabricated lockfile changes were shipped. **Do not use `npm ci` until the lockfile has been updated.** Commit the generated lockfile in your local project.
- The contact dropdown is searchable and clearable, preserves its `service` string in the POST body, works with service-preselection events, and follows the theme tokens with appropriate keyboard focus/selection styling.

---

## 6. Performance checklist

- Images: WebP, explicit `width`/`height`, `loading="lazy"` below the fold. `npm run build` also compresses images (`scripts/build.mjs`).
- No new animation library is needed: `Reveal` + CSS covers everything. `motion` is installed but only used for `useReducedMotion` in the hero.
- Keep client components small: sections can be server components, with only `Reveal`, `ContactForm`, `Header`, `HeroSlider` and floating-device wrappers as client components.
- Check with Chrome DevTools → Performance: scrolling through the page should show no long tasks (over 50ms) and no layout shifts.

## 7. QA before each delivery

1. `npm run build` passes, and `out/` opens correctly with `npx serve out`.
2. No console errors or warnings in light or dark mode.
3. Widths 390, 768, 1024, 1280 and 1440: no horizontal scroll, and nothing overlaps.
4. Keyboard: Tab through the page; focus is always visible; the mobile menu traps focus and Esc closes it.
5. Reduced motion (DevTools → Rendering → `prefers-reduced-motion`): everything is visible immediately and nothing loops.
6. Every nav link scrolls to its section below the header, and the active nav item updates.
7. Header never disappears during downward scrolling, and the visibly blurred translucent glass adapts to light/dark modes without switching to a hard navy panel at the hero boundary.
8. Scrollbar colours adapt to the theme; the floating Back to Top control appears after scrolling, stays out of the tab order while hidden, and respects reduced motion.
9. Compare each section with its `design/previews` image.

---

## 8. Prompt to paste into another chat system

> You're continuing a Next.js 16 static-export website for Teecoms Integrated Solutions (repo attached). Read `AGENTS.md` and `docs/BUILD-GUIDE.md` first; they're the source of truth. Use only the existing design tokens, `Button`, `BrandLogo` and the `Reveal` motion component described in the guide. Build **[section name]** as specified in section 5 of the guide, matching `design/previews/[image]` and the matching classes in `design/comps.css`, in both light and dark themes. Put all copy in `src/content/home.content.js` exactly as written in the approved copy. Replace the matching `SectionStub` in `src/app/page.js`. Animate only `opacity` and `transform`, and respect reduced motion. When done, run `npm run build`, fix any errors, and list the files you added or changed.

Build in this order: ~~Reveal~~ → ~~About~~ → ~~Services~~ → ~~DigitalInvoice~~ → ~~Why~~ → ~~Team~~ → ~~Commitments~~ → ~~CTA~~ → ~~Contact~~ → ~~Footer~~ → optional Lenis.

---

## UI refinements — navigation, service selector and social placement

- Header stays fixed and transparent above the new theme-aware hero for the first **100px** of page scroll: navy text in light mode and white text in dark mode. The frosted header appears after **100px**. The marketing-page header now aligns with the reduced hero gutters; documentation widths, mobile menu and scroll-spy are unchanged.
- Contact form: `react-select` still supports searching and clearing, but the indicator separator next to the chevron is removed. The menu uses a slim, rounded, theme-aware scrollbar.
- DigitalInvoice social icons appear **only in the footer**, beneath its Explore DigitalInvoice button. The duplicate icon group in the DigitalInvoice product section has been removed. The shared `DigitalInvoiceSocialLinks` component is still used by the footer.
- Delivery note: ensure the previously supplied social-icon build fix is applied (`DigitalInvoiceSocialLinks.jsx` uses inline SVGs rather than non-exported Lucide brand icons).

---

## Homepage hero: Productivity Flow redesign (25 November 2026)

The four-slide hero has been **rebuilt as a centred, full-width product-led presentation**, following the approved Option B direction. Its content contract has not changed: `src/content/home.content.js` remains the single source of truth for every slide eyebrow, title, description, tab name and CTA label/destination. The design reference is a *pattern*, not permission to substitute Dynabase or fictional customer metrics for Teecoms copy.

- **Composition:** eyebrow, large centred heading, original description, a three-part capabilities flow, original CTA pair, then a large editable dashboard-style illustrative panel with two contextual cards. Slide selectors and controls follow the panel.
- **Illustrations:** `HeroVisual.jsx` + `HeroVisual.module.css` render four themed scenes through the same component; their labels are taken from the service terms already on the site. The panels avoid invented adoption statistics, financial values or production-status claims.
- **Themes:** light mode uses airy white/blue surfaces; dark mode uses slate/navy gradients and restrained cyan-blue glows. The full-width abstract ribbon artwork comes from `public/images/hero/flow-light.svg` and `flow-dark.svg`, layered in `HeroSlider.module.css`, with no circular/blob elements. Hero-specific semantic variables live in `HeroSlider.module.css` and `HeroVisual.module.css`, not in page-wide styles.
- **Gutters:** hero and marketing-page header use the same fluid width, `min(100% - 2 * clamp(1.5rem,3.75vw,4.25rem),1480px)`; mobile uses 2rem total exterior space. The extra desktop breathing room and shared alignment replace the previous overly wide hero presentation; docs and SLA layouts are unchanged.
- **Typography:** headings use one continuous scale, `clamp(2.125rem, max(min(8.4vw, 3.1rem), 4.25vw), 4.65rem)`, across all viewports. Descriptions use `clamp(.875rem,.93vw,1rem)` with line-height 1.55 and a 1180px desktop maximum so approved long copy reads in roughly two lines at wide viewports; wrapping is natural on smaller screens (never clamp/truncate the content).
- **Motion:** fade/lift transitions on active slides, line-chart draw-in, capability meters, slow floating contextual cards and a quiet shifting ribbon wash over the static wave SVGs. All loops pause off-screen, in hidden tabs, or when playback is paused; `prefers-reduced-motion` disables them. No pointer-dependent spotlight or decorative parallax tracking is needed.
- **Carousel:** retains Swiper fade, keyboard controls, progress tabs, next/previous and play/pause. Auto-rotation is slightly slower to keep long approved descriptions readable.
- **Cleanup:** remove unused `HeroAurora.jsx` and `HeroAurora.module.css`; the new hero uses its own CSS gradient layers and does not import the old aurora.
- **QA:** test at 1440px, 1280px, 768px, 390px and 360px, light/dark modes, keyboard tabbing, reduced motion, hero carousel and the existing anchor CTAs. The old `design/previews/00-*` images are historical references, not this hero's target layout.

---

## Theme switching

Switching between light and dark is handled in `src/contexts/ThemeContext.jsx`:

- **The whole page changes in one frame.** While switching, the `theme-instant` class turns off every element's own colour transition. Don't reintroduce per-element colour fades on theme change: fading ~1,800 elements separately froze the page for about 900ms, and gradients (which can't fade) jumped ahead of solid colours, so parts of the page looked late.
- **The reveal** uses the browser's View Transitions: the new theme expands in a circle from the toggle button (480ms), drawn as one GPU-composited image. Browsers without View Transitions, visitors with reduced motion, and OS-triggered theme changes get an instant, clean swap.
- **New theme buttons** should call `toggleTheme({ x, y })` with the button's centre so the reveal grows from it.

---

## Contact form emails

Enquiries are handled by a PHP mailer that ships with the static site (`public/api/contact.php`, copied to `out/api/` on build). It needs PHP 8.1+ on the host (standard on cPanel). It emails the enquiry to your inbox (Reply-To: the visitor) and sends the visitor a branded confirmation (`public/api/lib/templates.php`), via SMTP with PHPMailer 6.9.1.

### Setup through `.env`

1. Add the mailer settings to the project's `.env` (all names and comments are in `.env.example`): `CONTACT_TO`, `CONTACT_FROM_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and optionally the spam and Turnstile settings.
2. Run `npm run build`. The last step (`scripts/write-mailer-env.mjs`) writes those values into `out/api/env.php`. It's a PHP file on purpose: requesting it in a browser runs it and prints nothing, on any server, whereas a plain `.env` in the web root could be downloaded where `.htaccess` isn't honoured. `out/` is git-ignored.
3. Upload `out/` as usual and send a test enquiry.

**Changing settings without rebuilding:** values are read in this order, later ones winning: the generated `env.php`, then a `.env` file placed above the web root (for example `/home/youraccount/.env` beside `public_html`), then real environment variables set in the hosting panel. Never give mail secrets a `NEXT_PUBLIC_` prefix; those are bundled into the browser JavaScript.

If `SMTP_HOST`, `CONTACT_FROM_EMAIL` or `CONTACT_TO` is missing, the build prints a warning and the form shows its error message instead of pretending to send.

### Spam protection

Checks run in this order. Suspected bots receive a normal "ok" reply and nothing is sent, so they learn nothing; the server error log records each drop and its reason.

1. **Rate limit:** `CONTACT_RATE_LIMIT_MAX` submissions per `CONTACT_RATE_LIMIT_WINDOW` seconds per IP (default 5 per 10 minutes), answered with HTTP 429.
2. **Honeypot:** the off-screen `website` field that only bots fill in.
3. **Signed one-time token:** the form fetches `contact.php?action=token` on load and posts it back. Bots posting straight to the endpoint have no valid token (HTTP 400). Forms sent less than `CONTACT_MIN_SECONDS` (default 3) after the token was issued are dropped, and each token is accepted once, marked used only after a successful send so a visitor can retry if sending fails. If a token has expired (tab left open over 2 hours), the form fetches a new one and retries automatically.
4. **Optional Cloudflare Turnstile:** set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to turn it on. The widget is usually invisible (`interaction-only`) and is verified on the server.
5. **Validation:** the same rules as the form (HTTP 422).
6. **Content checks:** more than 3 links in the message, any link in the name or company, or HTML/BBCode links.
7. **Duplicates:** the same email and message within 24 hours.

### Troubleshooting sending (send_failed / HTTP 500)

If the form shows its error message and the response says `send_failed`, PHP is running and the settings loaded, but the mail server refused the email.

1. Set `CONTACT_DIAGNOSTICS_KEY` to a long random string in `.env`, rebuild and upload.
2. Open `https://your-domain/api/contact.php?action=diagnose&key=THAT_STRING`. It checks, in order: PHP and extensions, where the settings came from, the port/security pairing, the sender address, the DNS lookup, whether the port is reachable, whether the server certificate matches `SMTP_HOST`, and the SMTP login (without sending). Each failure includes a fix. Add `&send=1` to also send a test email to `CONTACT_TO`.
3. Common fixes:
   - **Certificate name mismatch** (most common on cPanel): set `SMTP_HOST` to the name the certificate is issued to, which the report shows (usually the server hostname). As a last resort, set `SMTP_VERIFY_PEER=false`.
   - **Port not reachable:** the host blocks outgoing SMTP. Try 587 with `tls` or 465 with `ssl`, try `SMTP_HOST=localhost`, or set `CONTACT_TRANSPORT=mail`.
   - **Login rejected (535 Incorrect authentication data):** use the full email address as `SMTP_USERNAME`. Compare the password length shown in the report (and in the build log) with your real password. Check that the login works in webmail with the same address and password. If in doubt, reset the mailbox password in cPanel (Email Accounts > Manage). The mailbox must be a real mailbox, not just a forwarder. After repeated failures the host may temporarily block logins from the server's IP.
   - **Passwords with `$` or `#`:** Next.js would normally change these (`$name` is treated as a variable, ` #` starts a comment). `scripts/write-mailer-env.mjs` reads mailer settings exactly as written, so write the password plainly; the build log notes when it protected a value.
   - **Sender refused:** make `CONTACT_FROM_EMAIL` the same address as `SMTP_USERNAME`.
4. Clear `CONTACT_DIAGNOSTICS_KEY` (and `CONTACT_DEBUG`) once it works, then rebuild.

`CONTACT_DEBUG=true` makes failed sends include the mail server's reason in the response and the browser console. The SMTP password is never shown in either.

### Local testing (npm run dev)

The Next.js dev server can't run PHP; posting to `/api/contact.php` directly returns **405 Method Not Allowed**. In development, `next.config.mjs` forwards that one path to PHP's built-in server instead:

1. Put the mail settings in `.env` or `.env.local` (`.env.local` wins, as in Next.js).
2. Terminal 1: `npm run dev`
3. Terminal 2: `npm run dev:php` (runs `php -S 127.0.0.1:8000 -t public`; needs PHP 8.1+ on your PATH)
4. Submit the form at http://localhost:3000. PHP reads the project's `.env` files directly.

If PHP isn't running, the form shows its error message and the browser console explains what to start. To use another PHP address, set `CONTACT_DEV_PHP_URL`.

**PHP on Windows:** install PHP 8.3 (for example `winget install PHP.PHP.8.3`, or use the `php` folder from XAMPP/Laragon and add it to PATH). In `php.ini`, enable `extension=openssl` (needed for SSL/TLS SMTP) and `extension=mbstring`. If there's no `php.ini`, copy `php.ini-development` to `php.ini` first. Check with `php -m`.

---

## About section: Pillars layout (current)

`AboutSection.jsx` now uses the approved Pillars design, replacing the two-column layout in section 5.1: a centred introduction; three linked pillars (Technology, People, Processes from `aboutContent.pillars`) that reveal one after another and lift on hover; the closing line and button; a full-width expertise ribbon; then Mission and Vision. The ribbon scrolls only while on screen (it uses `Reveal`'s `data-visible`), pauses on hover, and becomes static wrapped rows with reduced motion. The second copy of the ribbon list is `aria-hidden`, so screen readers hear the list once.

---

## Services section: photo-led catalogue (current)

The selected Option 2 replaces the former Explorer with a photo-led editorial introduction and eight individually expandable service cards.

- **Introduction:** a rounded two-column band using `--gradient-band`, with an illustrative photo on the left and the original approved copy on the right. The image takes 44% of the available two-column width, with 56% reserved for copy; its original aspect ratio is preserved. The words “Technology Solutions” use a light blue italic underline accent, shared with the About headline (“Built” and “Your Business”) and catalogue heading (“Technology Services”); no green UI accents or extra logos are used. At 800px and below, the image stacks above the copy. The photo is a clean crop of the selected design concept, stored locally as `public/images/services/technology-collaboration.webp` (508×356). It is illustrative, not a representation of actual employees.
- **Catalogue:** the existing eight services in the original order, numbered 01–08, with title, tagline, icon and accessible “Learn more” button. Four columns at 1200px and wider, two from 561–1199px, and one at 560px and below. The cards use a near-white to off-white fill in light mode and a soft slate-to-charcoal fill in dark mode, with subtle existing shadow tokens. Collapsed cards use equal-height grid rows on tablets and desktops; an expanded card uses its natural height.
- **Interaction:** initially collapsed. Activating a card smoothly slides open its own labelled region with the full approved body, “Discuss this service” and “Or ask about anything else”; activating it again slides it closed. Only one detail is open at a time. The panel transitions between 0fr and 1fr using the shared 280ms motion token; closed panels are inert and hidden from assistive technology. Equal-height rows return after the closing transition, not during it. Reduced motion skips the transition. Buttons retain 44px touch targets, `aria-expanded`/`aria-controls` and native Enter/Space activation. Arrow Up/Down, Home and End move focus between card controls.
- **Navigation:** the introductory button links to `#service-offerings`. The original section ID `#services` and closing CTA destination remain unchanged; the closing CTA uses the shared primary blue button. “Discuss this service” dispatches `teecoms:select-service` with the exact service title and links to `#contact`, preserving the existing ContactForm preselection.
- **Motion and themes:** independent `Reveal` instances replay as the section is revisited; card lift, details entrance and icon rotation respect reduced motion. All colour choices inherit existing band, primary, ink and surface tokens. The refinements are scoped to Services and the About headline; the global theme, header, hero, other product accents and existing shared controls remain unchanged.


---

## Team portraits and office address

- **Portraits** live in `public/images/team/` as 800×880 WebP (29–52 KB each), matched to the people in the company profile: `babalola-oluwatobi-samuel`, `azuka-adoh`, `ayotunde-odusanya`, `tolulope-babalola`, `juliet-onyinyechi-ugochukwu`. Each member in `teamContent` (`src/content/home.content.js`) has `image: '/images/team/<file>.webp'`; without an image the card falls back to initials.
- Photos are cropped from the top of the original (keeping the full head) and shown with `object-position: 50% 18%`, so the landscape desktop frame shows faces rather than jackets. To replace a portrait, export at 800×880 with the head near the top third.
- **Office address** (verified): No. 12 Olayiwola Liasu Street, Polar Bed, along Sadiku Road, off Oshodi–Apapa Expressway, Lagos. It's the default in `src/config/site.js` (`contact.address`) and shows in the Contact section; `NEXT_PUBLIC_CONTACT_ADDRESS` in `.env` overrides it.

---

## DigitalInvoice documentation programme — D1 foundation (2026-11-07)

This section supplements the existing homepage design guide without replacing any of its layout patterns.

### Pages and publishing stages

- `/developers/` is the D1 foundation page. It is deliberately marked `foundation` and `noindex` until the finished hub goes live in D7.
- `/sla/` (D2), `/developers/api/` (D3), `/developers/data-structure/` (D4), `/developers/samples/` (D5), and `/developers/architecture/` and `/developers/security/` (D6) are **not yet implemented** in D1. Header/footer links reserve these permanent paths; **do not submit them to NRS until each page is published and tested**.
- Every public documentation route uses trailing slashes and must remain stable. Download filenames are versioned under `public/docs/`.
- The SLA must stay `status: draft` and `noindex` until signed off by management. Once approved, change the front matter to `status: approved`, place the approved PDF in `public/docs/`, and rebuild.

### Source format

Markdown files live in `src/content/docs/<slug>.md`. The strict front matter accepts `title`, `description`, `version`, `effective`, `updated`, `status`, `pdf`. Required: title, description, version, updated, status. Optional empty `effective` and `pdf` are allowed. Supported statuses are `foundation`, `planned`, `draft`, `published`, `approved`. The PDF field, when present, must be an absolute local URL like `/docs/digitalinvoice-api-documentation-v1.0.pdf`.

`src/lib/docs/index.js` loads files on the build server only; `src/lib/docs/markdown.js` renders them with pinned `marked@18.0.14`. Raw HTML is escaped, links are protocol-checked, and the TOC is generated from `##` and `###` Markdown headings. The built HTML is injected into a trusted layout at build time. No server code or private source is served to visitors. Do not add runtime CMS features to the static-export site.

Custom Markdown conventions (no HTML required):

```md
:::info Optional heading
Some explanatory content.
:::

:::warning
This action is not currently available.
:::

:::planned
Future work, not a current guarantee.
:::

[[METHOD:POST]] /example/path

{{proposed:99.5%}}
```

`[[METHOD:GET]]`, `POST`, `PUT`, `PATCH`, and `DELETE` are supported as coloured labels. `{{proposed:...}}` renders a highlighted, accessible proposal marker for documents whose status is not `approved`. At `status: approved` the same text renders without draft styling. Do not use the proposal marker on figures that are already legally binding.

Fenced code blocks have a client-side copy button; the client script registers one delegated click handler for the entire page. Data tables are keyboard-scrollable on mobile. Images should reference files under `public/docs/` and have meaningful alt text. Diagram components can open their local SVGs in a new tab.

### Layout and navigation

- `DocsLayout` renders the existing `Header`, the Docs header band, responsive table of contents, semantic article, `Footer`, and `BackToTop`.
- On documents, `Header` shows the theme-aware glass immediately. The homepage alone uses the scroll-dependent glass reveal and section IntersectionObserver. Section anchors are routed to `/#...` from docs pages, and both brands link to `/`.
- `Footer` accepts `isHome` (passed by `src/app/page.js`) and automatically resolves section anchors to homepage URLs for documentation routes. Its fifth column lists permanent legal/developer links; unpublished destinations are planned until D2–D6.
- Docs headings use `scroll-margin-top` to avoid the fixed header; the left TOC is sticky on desktop and is a keyboard-operated collapsible panel below 881px. Light/dark tokens come from `src/styles/tokens.css`.
- `src/styles/docs-print.css` removes navigation, buttons and footer when printing. The article CSS preserves tables and diagrams. Browser Save as PDF can serve as a fallback; official download files are prepared and reviewed in their respective later stages.
- The sitemap includes only published/approved pages whose content files exist. The draft/foundation content has `robots: noindex`. `robots.js` allows crawling so engines can see this directive rather than blocking it.

### Setup and verification

1. Run `npm install` from the Teecoms repository to fetch pinned `marked@18.0.14` and regenerate `package-lock.json`; commit the resulting lockfile. **The D1 handoff intentionally does not fabricate a lockfile**: the package registry was unreachable in the editing environment. The inherited lockfile also predates some package changes; prefer `npm install` over `npm ci` the first time.
2. Set `NEXT_PUBLIC_SITE_URL` to the confirmed https Teecoms domain in your deployment environment before building. The local fallback is only for development.
3. Run `npm run build`. Check `out/developers/index.html`, `out/robots.txt`, and `out/sitemap.xml` and confirm that future unimplemented pages do not appear in the sitemap.
4. Visit `/` and `/developers/` in 320px, 768px and desktop widths, in light/dark mode. Verify header active navigation, all homepage section links from the document route, mobile menu keyboard handling, TOC anchors, print preview, and any new browser console warnings.
5. No PHP or Next server runtime is required for these pages after export. The existing PHP contact endpoint remains separate.

---

## DigitalInvoice documentation programme — D2 SLA draft (2026-11-07)

### Route and source

- `/sla/` is generated statically from `src/content/docs/sla.md` by `src/app/sla/page.js`, using the shared `DocsLayout`, `DocsHeader` and `DocsToc` from D1.
- The published-page header displays the version, last update, status and copy-link button; the existing two-column layout, light/dark tokens, responsive contents panel and print styles apply automatically.
- In D2 the status is **`draft`** and the whole document is **not contractually binding**. The numbered clauses include all 17 contractual sections (including document control and signatures), plus a draft-only "Items to confirm before publishing" checklist.
- Every **proposed** numeric commitment is wrapped with `{{proposed:VALUE}}` and is highlighted with the standard proposed-figure tooltip in draft mode. Statutory timeframes, fixed company facts and observed code capabilities are not represented as proposed figures.

### Approved-state switch and publication safeguards

The SLA uses **one status flag**, `status: draft | approved`, in its front matter to control draft/approved presentation. The shared renderer recognises:

- `{{proposed:99.5%}}`: proposed highlight and accessible explanation in draft; plain figure when approved.
- `{{draft:Text for draft}}{{approved:Text for approved}}`: display the appropriate wording without runtime JavaScript. For short text only; HTML is escaped.
- A draft-only Markdown block using a **four-colon fence**, while inner three-colon callouts remain supported:

  ```md
  ::::draft
  :::warning Management approval required
  This block appears only while status is draft.
  :::
  ::::
  ```

- `::::approved` in the same syntax: render the enclosed Markdown only when status is approved.
- The optional initial Markdown `#` title (matching front matter exactly) is present for Markdown portability, but omitted from rendered article HTML because `DocsHeader` already renders the accessible page H1.

In draft mode, the banner remains visible and `docsMetadata()` emits **`noindex`**; `sitemap.js` omits the route. The planned signed PDF path is already written in `pdf:` but **DocsHeader does not show its download button** in draft mode. `robots.js` continues allowing the route to be crawled so crawlers can see the `noindex` page meta tag.

**Do not change the status before review.** To publish an approved SLA:

1. Obtain management and legal approval of all draft figures and terms, including SLA exclusions, credit calculations, incident clock rules, third-party NRS responsibilities, backup policies and escalation contacts.
2. Replace every visible `[CONFIRM: ...]` placeholder in `sla.md`; have all signatories review and execute the actual agreement. A company-wide standard SLA may need an appropriate customer acceptance mechanism instead of an individual Customer signature block; obtain legal direction.
3. Set `effective:` in front matter to the real agreed date, save the genuinely executed **signed PDF** as `public/docs/teecoms-digitalinvoice-sla-v1.0.pdf` (or update the versioned `pdf:` path to the verified actual file).
4. Switch **only** `status: draft` to `status: approved` to turn off draft styling, draft-only clauses and proposal markers. The displayed version automatically becomes `1.0`.
5. Build. The build rejects an approved SLA without an effective date, a PDF path, an actual file beginning with `%PDF-`, or with unresolved `[CONFIRM:]` markers in visible Markdown output. This is a publication safety check, **not** a substitute for verifying the signatures or contents of that PDF.
6. Verify the page visually in both themes, mobile and desktop, inspect the generated HTML (`out/sla/index.html`) for only one visible H1 and the correct `noindex`/indexing setting, then verify that the downloadable PDF is the signed, approved version and is reachable externally over HTTPS.
7. Ensure the `/sla/` route is included in the published sitemap only after approval and the `NEXT_PUBLIC_SITE_URL` build environment is configured with the correct Teecoms domain.

### D2 verification and limitations

- The supplied source has placeholders for operational/legal facts that have not been confirmed: support contact, on-call coverage, monitored endpoints, contract parties, data processing, hosting/data location, backup evidence and recovery plan. Resolve them rather than silently presenting them as existing operational guarantees.
- NRS-specific service levels are **future obligations contingent on MBS licensing and production go-live**; NRS third-party availability is excluded. Neither the NRS licence nor ISO/IEC 27001 certification nor completed independent VAPT is claimed.
- Run `npm install` first if D1 dependencies are not installed, then `npm run build`, and confirm `out/sla/index.html`, sitemap exclusion, draft noindex, no draft PDF button, TOC sections, tooltip readability, contrast and browser Save as PDF. The D2 handoff was not able to run the full Next.js build or visual checks due to missing dependencies/network access.
- After approval, rebuild and verify the inverse: indexed page, sitemap inclusion, signed PDF button, all draft-only notices removed and no proposed-figure highlights.

---

## DigitalInvoice documentation programme — D3 API reference (2026-11-07)

### Added files and route

- `src/app/developers/api/page.js` exports `/developers/api/` statically using `getDocumentation('api')`, shared `DocsLayout` and `docsMetadata` (canonical and Open Graph metadata included).
- `src/content/docs/api.md` is the **single textual source of truth**; front matter `status: published`, `version: 1.0`, `updated: 2026-11-07`, `pdf: /docs/digitalinvoice-api-documentation-v1.0.pdf`.
- Public downloads: `public/docs/digitalinvoice-api-documentation-v1.0.pdf`, `public/docs/digitalinvoice-api-invoice-lifecycle-v1.0.svg`, and `public/docs/digitalinvoice-api-nrs-flow-v1.0.svg`. The source Markdown includes both Mermaid diagram definitions as copyable code and accessible static SVG equivalents.
- D1 sitemap logic automatically adds the published page; the homepage Developers hub remains in foundation/noindex until D7, and the SLA remains draft/noindex until approved. All site URLs use trailing slashes.

### Verified integration contract boundaries

- The ERP API is **read-only**: `POST /oauth/token` (OAuth 2.0 client credentials) and nine `GET /integrations/v1/*` read routes. OAuth tokens must not be used for browser-session management or invoice modification. Browser management endpoints under `/integrations/clients`, `/integrations/webhooks`, and `/integrations/webhooks/deliveries` require an owner/admin **session with CSRF**.
- Webhook event types, HMAC signature headers, raw-body signing format, retry behaviour and feature gates are derived from the supplied backend's integration handlers and services, **not** assumed production capability.
- Set/verify the actual **public API origin and mounted base path** before sending live examples to integrators. The docs intentionally carry `[CONFIRM: ...]` placeholders and do not identify `api.digitalinvoice.ng` as a deployed address. The examples read `API_BASE_URL` and dummy credential variables, never stored secrets.
- NRS is explicitly licence-gated. A local queue or readiness status, sandbox test or sample IRN/QR **must never** be presented as a production NRS result. The data schema page `/developers/data-structure/` is scheduled for D4 and is not part of this handoff.
- This versioned downloadable PDF is a rendered snapshot. When updating `api.md`, **regenerate the PDF from the updated approved text**, check it visually, and only then deploy both together. The API documentation version is distinct from ERP path version `v1`.

### Install, build and publication verification

1. Start from the Teecoms codebase **already updated with D1 and D2**, and copy only the files in the D3 ZIP to matching relative paths. No dependencies were added in D3.
2. Run `npm install` if the D1 `marked` dependency and regenerated package lockfile are still missing; then `npm run build`. Verify `out/developers/api/index.html` and the three files in `out/docs/`.
3. Open `/developers/api/` at desktop and mobile widths in **both themes**; inspect the TOC, HTTP method badges, SVG readability, code-copy buttons, tables, keyboard navigation and browser print preview. Check only one visible page H1, canonical metadata, and the public sitemap's API entry.
4. Download the PDF and check all pages and example content, including the NRS licence disclaimer. Check the URL and PDF directly in an unauthenticated/incognito browser on an independent connection.
5. Before submitting to NRS or sharing curl examples, confirm the correct API hostname/base path, TLS certificate, staging availability, integration enablement, support address, and current management-approved SLA. Do not claim to have passed live or NRS validation based on a successful static docs build.

### Test limitations

The D3 editing environment did not have the complete Teecoms `node_modules` and therefore **could not run `npm run build`**. All JavaScript, SVG and Markdown/PDF checks reported in the handoff are offline checks, not browser or live HTTP API tests.

---

## DigitalInvoice documentation programme — D4 invoice data structure (2026-11-07)

### New page and static downloads

- `/developers/data-structure/`: `src/app/developers/data-structure/page.js` renders `src/content/docs/data-structure.md` using the existing `DocsLayout`, responsive TOC, metadata and print rules. `status: published` automatically includes this route in the public sitemap; no change to `sitemap.js` is needed.
- `public/docs/digitalinvoice-invoice-schema-v1.0.json`: exact bytes copied from the backend `schemas/nrs-ubl-v1.1-local.schema.json` **as supplied**. It is a *local draft 2020-12 JSON Schema projection*, **not an official NRS published schema**. Preserve the internal NRS profile identifier and do not relabel it as certification or clearance.
- `public/docs/digitalinvoice-field-mapping-v1.0.csv`: updated 54-row mapping based on the current backend adapter, current integration-service extraction and supplied DB dump. This is intentionally **not** a byte-for-byte copy of the backend's older `schemas/NRS-UBL-FIELD-MAPPING.csv`, which references an obsolete live-customer-code fallback.
- Six full fictional JSON payloads in `public/docs/sample-payloads/`: `digitalinvoice-b2b-multi-line-discount-vat-v1.0.json`, `digitalinvoice-b2c-simplified-v1.0.json`, `digitalinvoice-credit-note-v1.0.json`, `digitalinvoice-vat-exempt-v1.0.json`, `digitalinvoice-multiple-tax-categories-v1.0.json`, and `digitalinvoice-two-level-discount-v1.0.json`. Each is copied **without changing the JSON body** from the corresponding backend `tests/generated_fixtures/*.json`.
- `src/app/developers/page.js` now makes topic cards linkable when the corresponding Markdown has `published`, `approved` or `draft` status. The SLA remains linked **as a draft**, and the hub itself remains `foundation`/noindex until D7. The provisional `src/content/docs/developers.md` is updated to acknowledge the released resources.

### Critical source limitations (verify before production)

1. The local schema JSON's structural requirements differ from **PHP preflight** business rules in `firsUblValidate`. In particular, B2C buyer email/TIN omissions may yield warnings during PHP preflight; schema structure alone is not proof of remote acceptance.
2. `firsLocalInvoicePayload` now uses `invoices.customer_city_snapshot`, `customer_nrs_postal_zone_snapshot`, `customer_nrs_state_code_snapshot` and `customer_nrs_lga_code_snapshot`. It does not backfill missing issued-invoice codes from today's customer master data. The D4 CSV reflects these exact fields rather than outdated source CSV notes.
3. Goods and service `product_category`/`service_category` are accepted by `firsUblPayload`, but are **not** supplied by `firsLocalInvoicePayload` from a persisted column; real invoice lines will be blocked by strict classification preflight until a verified source is implemented.
4. The credit-note preview's source issue-date lookup references `credit_notes.invoice_date`, a column absent from the supplied database schema. The download fixture contains a fictional complete `billing_reference`; do not infer that the current database path always supplies a correct source issue date. The backend must be reviewed before production NRS submission.
5. Sample codes, IDs, IRNs, tax categories and addresses are fictional testing values. Never state that they were issued or accepted by NRS; never replace them with real customer data from `digitalinvoice_db.sql` merely for demonstration. Live submission remains disabled pending licensing.

### Verification checklist

1. Extract the D4-only ZIP **over the Teecoms project already updated through D3**. Do not replace `node_modules` or the whole application. No new dependencies are introduced by D4.
2. Run `npm install` if D1's dependency lockfile is not current, then `npm run build`. Confirm `out/developers/data-structure/index.html`, `out/docs/digitalinvoice-invoice-schema-v1.0.json`, the mapping CSV and all six files in `out/docs/sample-payloads/` exist. The build must include the new route in `out/sitemap.xml`; the SLA stays noindex/omitted until approval.
3. Open the page in light/dark mode at phone/tablet/desktop widths. Verify TOC scrolling, long-table horizontal scrolling, downloadable JSON/CSV, section headings, keyboard navigation, print output and no errors in the console. The full Next.js build and visual-browser checks must be performed in your environment; do not treat offline syntax tests as a build.
4. Run the backend's optional offline schema test, from the **actual backend project root**, after installing `jsonschema` (optional Python test dependency): `python3 tests/nrs_ubl_jsonschema.py`. It checks the source schema and six generated fixtures. For the published copies, compare checksums and validate all six against the published schema to detect accidental modification.
5. Before uploading evidence to NRS, verify the official current MBS schema/code lists, the real API hostname, correct invoice and credit-note mapping, and sandbox/credential availability. The downloadable local schema and fictional fixtures alone do not demonstrate regulatory acceptance.
6. On future schema or mapping changes, publish updated versioned download filenames, update **all** links in `data-structure.md`, retest the fixtures and record the change. Keep the page URL `/developers/data-structure/` permanent.

---

## Documentation PDF links — versioned filenames (post-D4 fix, 2026-11-07)

The optional `pdf:` front-matter value must be a local absolute URL under `/docs/`, ending in `.pdf`. Versioned filenames with dots are supported, for example `pdf: /docs/digitalinvoice-api-documentation-v1.0.pdf` and `pdf: /docs/teecoms-digitalinvoice-sla-v1.0.pdf`. Subdirectories beneath `/docs/` may use only letters, digits, hyphens and underscores. Dots are allowed in **filename segments** (to support version numbers) but not as directory or relative-traversal segments. External URLs, query/fragment suffixes, backslashes and traversal paths are rejected.

The PDF file goes under `public/docs/` at the matching relative path. The `DocsHeader` download link is only displayed for published or approved documents; in particular the draft SLA still has no PDF download button. For an **approved** SLA the build also requires a real PDF starting with `%PDF-`. The prior validator incorrectly rejected `v1.0.pdf` before pages could render; this has been corrected in `src/lib/docs/index.js`. Re-run `npm run build` and open `/developers/api/` and `/sla/` to confirm.

---

## DigitalInvoice documentation programme — D5 visual PDF samples (2026-11-07)

### Two separate codebases in the D5 archive

The D5 handoff contains **two project roots**. Copy the files under `DIGITALINVOICE_FRONTEND/` into the **latest DigitalInvoice frontend** (the source of truth for PDF presentation). Copy files under `TEECOMS_WEBSITE/` into the **Teecoms site already updated through D4 and the PDF-path fix**. Do not copy one app over the other. The ZIP contains only the added/modified files; existing PDF templates, front-end font assets and website layout files are *not duplicated*.

### Why the generator is separate from production

- `scripts/generate-nrs-samples.mjs` compiles the actual `src/components/documents/documentModels.js` and `src/components/documents/pdf.jsx` for **development-only Node execution**, keeping both the existing document model and the visual PDF template as the source. Four small deterministic fictional records are in `scripts/nrsSampleFixtures.mjs`; they do not use SQL data, APIs or external network calls.
- The existing `src/components/nrs/NrsPdfEvidence.jsx` has a **production-only verified-evidence guard**. Do **not** disable or weaken it. A temporary esbuild alias replaces that evidence component *inside the generator's temporary bundle only*, with `scripts/nrsSampleEvidence.jsx`. The mock renderer visibly marks IRN, CSID and QR as not NRS-issued/validated. The generator never supplies `verified: true` or `environment: production` to the application.
- `esbuild@0.25.12` is added as a **pinned frontend dev dependency** (already present as a Vite transitive dependency in the supplied lockfile). `npm run samples:nrs` is added; regular Vite builds and the production app need no additional imports, runtime bundles or modifications.
- The PNG previews are rasterizations of the **generated PDFs** using Poppler `pdftoppm`, not independently hand-designed example images. On Windows, install Poppler and put the directory containing `pdftoppm.exe` on PATH, or set the environment variable `PDFTOPPM_BIN` to its full executable path. On Linux, Poppler is typically available through the distribution's `poppler-utils` package. This is a developer machine prerequisite, not a web runtime dependency.

### Exact generation command

Open a terminal **in the DigitalInvoice frontend root** (the one whose `package.json` names `digital-invoicing`):

```sh
npm install
npm run samples:nrs
```

The generator verifies the Poppler executable, checks fixture totals, generates **eight PDF files and eight first-page PNG previews**, checks `%PDF-` and PNG magic headers, and writes to `generated-nrs-samples/` by default. It also writes `README.txt` and `samples-manifest.json`. The `generated-nrs-samples/` directory is **not** a build or source directory and should not be included in production Vite output.

Alternatively, the **single generator command** can write directly to a dedicated Teecoms public samples directory:

```sh
npm run samples:nrs -- --out "C:/xampp/htdocs/teecoms-frontend/public/docs/samples"
```

Change that absolute path to your actual Teecoms project directory. If you use the default output, copy the eight `.pdf` and eight `.png` files into **Teecoms** `public/docs/samples/`, preserving all generated filenames. Do not rename them, edit the mock QR contents, or upload the generated `README.txt` / manifest unless wanted for internal review.

### Eight required sample pairs

There are **four document types** (`b2b-tax-invoice`, `b2c-simplified-invoice`, `credit-note`, `payment-receipt`), each with two states (`current`, `mock-post-validation`), all suffixed `-v1.0`. Example filenames:

- `digitalinvoice-b2b-tax-invoice-current-v1.0.pdf` and `.png`
- `digitalinvoice-b2b-tax-invoice-mock-post-validation-v1.0.pdf` and `.png`

The gallery manifest in `src/content/docs/sampleManifest.js` lists the remaining filenames and must stay synchronized with `scripts/generate-nrs-samples.mjs`. All eight PDFs and eight previews must be manually inspected before publication. Check legibility, tax totals, standard-layout labels, mock-only banners and obvious fictional names. For **payment receipts**, the mock post-validation view only illustrates *linked-invoice* NRS evidence placement — it does not represent a receipt as an NRS-cleared document.

### Publish the gallery safely

1. In Teecoms, open `/developers/samples/`. With `src/content/docs/samples.md` initially set to `status: planned`, it is accessible as a preparation page but has `noindex` and is excluded from the public sitemap. The Developers hub links to this preparation page with a status label. Missing PDFs/PNGs never receive active download links.
2. Generate/copy the eight complete PDF/PNG pairs. Run `npm install` if the D1 `marked` dependency is missing, then `npm run build` **from the Teecoms root**. The statically exported page's cards should now display previews and download links.
3. Inspect **all eight** PDFs and their PNG previews in a PDF viewer/browser, in both Teecoms themes and at phone/desktop widths. Check accessible alt text, previews, button navigation, print layout, sample labels and the absence of live NRS credentials/data. No generated mock QR code is a genuine NRS verification code.
4. **Only after verification**, change the first lines of `src/content/docs/samples.md` from `status: planned` to `status: published`, and rebuild. A server-side publication gate fails the build if even one required PDF or PNG is missing or has a corrupt file signature. The published route is then automatically eligible for sitemap inclusion and search indexing.
5. Confirm `out/developers/samples/index.html`, `out/docs/samples/*.pdf`, `out/docs/samples/*.png` are present. Test `/developers/samples/` and every file URL in an incognito browser over HTTPS from a different connection before using the page URL in the NRS application.

### Known limitations and scope

- These are **layout demonstrations**, not proof of connection to the NRS service, an approved licence, completed sandbox clearance or issued IRNs/CSIDs.
- The script uses only fictional test records, not the backend's generated UBL JSON fixtures (those are separately published under D4); their purposes differ. Currency math is checked to the kobo, but render/preview output must still be visually checked on the actual developer machine.
- Poppler and frontend npm dependencies were **not installed** in the D5 editing environment. The generator was source-reviewed and its fixture arithmetic tested, but no claim is made that the end-to-end generator, PNG conversion or Teecoms static build was executed here. Please share any `npm run samples:nrs` or `npm run build` errors for correction.


## D5 follow-up — Icon alignment and sample-label refresh (2026-11-07)

The shared Teecoms button label now uses a single horizontal, vertically centred flex row for icons and text. This corrects the Download sample PDF button without changing its structure or the existing download URL.

The sample gallery now uses **Standard document layout** and **Illustrative verification-field layout** labels. The first represents normal fictional document presentation; the second uses conspicuously mock IRN/CSID/QR fields. We removed the prominent unsubmitted-state wording from the **sample-gallery presentation and generated PDFs**. We did **not** change the real application's NRS evidence checks, integration availability, or factual statements in the API and compliance documentation.

**Important — regenerate the PDFs.** Updating only the website does not change the contents of PDFs already copied to `public/docs/samples/`. The generator changes are located under `DIGITALINVOICE_APP/` in this patch, and should be copied into your actual DigitalInvoice application root. On the current Windows installation this is `C:\react\projects\All Digital Invoice\backend`, which contains the `digital-invoicing` package and `src/components/documents/pdf.jsx`. These new files replace only the generator helpers, not the production PDF renderer.

In that folder, run `npm run samples:nrs` again. Then copy all 8 regenerated PDFs and all 8 PNG previews from `generated-nrs-samples/` to the **Teecoms** website `public/docs/samples/`, replacing the old versions. Stop and restart the Teecoms development server; for a release run `npm run build` and verify the export. Inspect at least one PDF of each type and both layout variants to confirm the new wording appears and the mock evidence is plainly identified. If your sample page is already marked `status: published`, **keep that existing front-matter value** when merging `src/content/docs/samples.md` instead of resetting it to `planned`.

## D6 — System architecture and security pages (2026-11-07)

### Added public routes and evidence

- `/developers/architecture/` — `src/content/docs/architecture.md`, published v1.0. Four architecture / sequence illustrations are embedded at build time using a narrowly scoped `docsDiagram` Markdown block recogniser for repository-owned `![description](/docs/diagrams/*.svg)` source lines. It emits accessible, clickable `<figure>` elements with the standard SVG and a `-dark.svg` companion. CSS swaps the artwork to match `data-theme`; print output always uses the light artwork. The resulting HTML is static; no runtime Mermaid, external iframe or diagram JavaScript is loaded.
- `/developers/security/` — `src/content/docs/security.md`, published v1.0. This is **a source-reviewed control overview, not a certification, independent penetration test or audited deployment statement**. Hosting/provider/location, assurance dates, production TLS profile and backup evidence remain unconfirmed. The source-backed NRS production restriction must not be removed simply to improve marketing wording.
- `public/docs/diagrams/` — four versioned `.mmd` **Mermaid source** files and eight companion `.svg` assets (light and dark). Sources describe the same conceptual flows as their curated SVG drawings; the SVGs were designed separately for visual clarity and **are not claimed to be automatic Mermaid CLI exports**. If editing the flow, update both the Mermaid file and BOTH SVG variants, check the semantics and keep a consistent legend.
- `public/docs/digitalinvoice-architecture-v1.0.pdf` — four-page **A3 landscape** printable snapshot with one diagram per page, evidence/status notes, no customer data and no private API addresses.

### Source and accuracy checks

Review the current application backend, not only this document, before publishing subsequent revisions:

- Browser JWT/cookies, CSRF and HTTPS/HSTS: `includes/security.php`, `includes/authMiddleware.php`, `.htaccess`.
- MFA and privileged policy: `includes/mfaService.php`, `includes/mfaPolicy.php`, `routes/user/mfa.php`.
- At-rest handling of selected secrets: `includes/fieldEncryption.php`, `includes/mfaService.php`, `scripts/rotateEncryptionKeys.php`.
- Machine-scoped ERP access and signed events: `includes/erpOAuthService.php`, `includes/erpWebhookService.php`, `routes/integrations/*`.
- NRS staging, transport gates and production evidence: `includes/nrsSubmissionQueue.php`, `scripts/nrsQueueWorker.php`, `includes/nrsClient.php`, `includes/nrsDocumentEvidence.php`.
- Issuing documents and financial workflow: `routes/invoices/*`, `includes/firsUblAdapter.php`, `includes/firsReadinessChecks.php`, payment/credit-note routes and generated fixture tests.
- External identity and payments: `routes/auth/google.php`, `routes/webhooks/paystack.php`.

The reviewed source **does not** connect its dry-run NRS queue worker to a licensed NRS production sender. Under no circumstances should diagrams portray the future clearance/reporting workflow as already sending or accepted. NRS sandbox access, if configured, is not licensing or live production verification. The evidence adapter only displays confirmed production evidence; mock sample QR codes must not be described as official.

### Validation, printing and publication

1. After merging, run `npm install` (if not already installed), `npm run dev` and inspect `/developers/architecture/` and `/developers/security/` at desktop/mobile sizes in light and dark themes. Check all four light and four dark illustrations, the full-size links and keyboard focus.
2. Run `npm run build`, which uses the project's existing static-export process; verify `out/developers/architecture/index.html`, `out/developers/security/index.html`, `out/docs/digitalinvoice-architecture-v1.0.pdf` and all `out/docs/diagrams/*.svg` / `*.mmd` files.
3. Open the A3 PDF in a PDF reader and inspect **all four pages** at full size. For browser printing of the Markdown pages, check clean page breaks and no clipped diagrams; the specific architecture PDF remains the preferred large-format download.
4. Verify public HTTPS reachability, `Content-Type` and downloading from another network before submitting URLs in the NRS portal. Do not submit `/developers/` as the final landing page until D7 publishes its finished content; the new architecture and security pages have their own permanent routes.
5. Review the provider/location fields, assurance status, legal text and NRS licence status before external publication. The Teecoms management team must approve factual security assertions; the draft SLA is **not** a substitute for production evidence.

**Build honesty:** D6 authoring performed static source and PDF/diagram checks in this environment. The full Next.js build requires the project's own dependencies and must be run by the developer. No independent VAPT, live NRS test or production-site security assessment was carried out during this documentation step.

## D7 — Developers hub finalisation (2026-11-07)

### Published hub and resource cards

The permanent `/developers/` landing page is now `status: published`, `version: 1.0` in `src/content/docs/developers.md`. Its public URL is automatically included in `src/app/sitemap.js` and eligible for indexing via `docsMetadata()`. The page reuses `DocsLayout` and the existing Teecoms header, footer, theme tokens, static Markdown rendering and TOC; no new runtime or npm dependencies were introduced.

There are six document cards sourced from `src/content/docs/navigation.js` and each target page's own Markdown front matter. A card says **Published** only when its page says `status: published`, and the **SLA** remains explicitly marked **Draft · management approval pending** until management approval and the signed PDF checks succeed. The samples card reports publication review pending, or how many PDF/PNG pairs are available, while `samples.md` is `status: planned`. All existing documentation pages may be opened for review; their status labels are not claims of external NRS approval.

`src/lib/docs/sampleAvailability.js` is the single build-time source for PDF/PNG sample existence and magic-header checks. It is used by both `/developers/` and `/developers/samples/`. The gallery retains its build-failure guard against publishing eight incomplete PDF/PNG pairs. These checks only establish file presence, **not content correctness or NRS clearance**.

The hub includes an implementation status section with accurate separation of **implemented application / ERP features**, **sandbox-controlled NRS capability** and **licence-gated production submission**. Do not change this into a claim of live production NRS readiness without verified production evidence and licensing.

### Contact and approval details

The support panel directs visitors to the already-existing Teecoms contact section at `/#contact` and displays the site's `site.contact` email/telephone only when those values are configured and well-formed. The address is inherited from `site.contact.address`. Do not hardcode the unconfirmed DigitalInvoice support email or phone from the draft SLA into the hub.

### Merge, verify and publish

1. Apply D7 **after D6** using the ZIP's repository-relative paths. It changes the reusable `DocsCard` styles and uses a shared sample-check helper. It does **not** overwrite `src/content/docs/samples.md` or regenerate any invoice PDFs. Keep `samples.md` status `published` if you have manually inspected all eight updated samples, otherwise keep `planned`.
2. In the Teecoms project run `npm install` as needed and `npm run dev`. Check `/developers/` at desktop and mobile widths in both light and dark themes. Confirm the header breadcrumb, card links and status labels, status section, support address/optional contact methods and collapsible on-page contents are readable and keyboard accessible.
3. Run `npm run build` and confirm `out/developers/index.html`, `out/sitemap.xml`, and each referenced docs page. A successful static export does **not** prove public reachability, independent assurance or NRS submission capability.
4. Verify the **SLA draft remains `noindex` and excluded from the sitemap**, while `/developers/` is indexed. If the samples page is still `planned`, it remains excluded from the sitemap even though it is accessible through its preparation card.
5. Inspect all Download links and fictional sample labels. Confirm no old unsubmitted-state text is present in the regenerated D5 PDFs and any mock IRN/CSID/QR remains clearly identified as mock. Confirm email/telephone and production URLs before public release.

**Test limitations:** D7 source-level checks do not replace `npm run build`, mobile-browser testing or externally verifying the actual cPanel deployment. D8 will cover publication and reachability checks.

---

## D8 — Publication, cPanel deployment, and NRS review readiness (2026-11-07)

The step-by-step deployment, verification and reviewer-link reference is now **`docs/NRS-PUBLISH-CHECKLIST.md`**. Follow it before putting documentation URLs into the NRS portal. It supersedes any earlier step's statement that a page is ready solely because it was built or had its source checked.

### Release checks (no extra dependencies)

```powershell
# Build from the Teecoms website project root, not the DigitalInvoice app root.
npm install
npm run build
node scripts/verify-docs-release.mjs local

# Once samples are published, SLA is signed/approved, and API URLs confirmed:
node scripts/verify-docs-release.mjs local --nrs

# After cPanel deployment, substitute the actual verified HTTPS Teecoms host:
node scripts/verify-docs-release.mjs live https://YOUR-VERIFIED-TEECOMS-DOMAIN
node scripts/verify-docs-release.mjs live https://YOUR-VERIFIED-TEECOMS-DOMAIN --nrs
```

`local` verifies `out/` page exports, canonical HTTPS URLs, draft/noindex metadata, sitemap entries, published download files and basic private-file controls. `live` tests unauthenticated HTTPS requests and content signatures from the machine running the command. Both report warnings and failures; failure exits nonzero. `--nrs` additionally requires `samples.md` to be `published`, `sla.md` to be `approved`, and API documentation placeholders to be resolved. **These checks are not a certificate, a legal-signature verification, or evidence of NRS acceptance.** The script reads the current local Markdown status to determine which URLs and downloads ought to exist; run it against the same revision you deployed.

D8 also corrects `src/app/developers/security/page.js` to export the same route-specific `docsMetadata` as every other docs page. This prevents the security route from inheriting generic site metadata without its own canonical URL and indexing status.

### Remaining approval blockers at D8 handoff

- `src/content/docs/samples.md` in the supplied D7 codebase is still `status: planned` even though sample files were later generated on the user's computer. Do not change it programmatically without inspecting all updated PDFs/PNGs and recopying them into the Teecoms project.
- `src/content/docs/sla.md` remains `status: draft`; no executed management-approved SLA was supplied. D2 approval and signed-PDF safeguards remain in effect.
- `src/content/docs/api.md` still identifies the production API origin, sandbox address and support contact as unconfirmed. Confirm actual deployment facts or accurately state that the corresponding service is not currently offered.
- No final public Teecoms domain has been independently verified, and no cPanel deployment, public HTTPS tests or NRS portal submission were performed in this development environment. Use the exact domain you control, not example placeholders.

The D8 package contains only the changed/new Teecoms website files. It does **not** include a site-wide export, confidential mail settings, database files, backend project or personal data.


## Post-D8 UI refinement — header, document navigation and dark theme (2026-11-07)

This is a UI-only change set and does **not** change documentation publication status,
PDFs, NRS licensing claims or the D8 verification gates.

- `src/components/layout/Header.jsx` / `Header.module.css`: smaller desktop logo,
  extra header breathing room (shared `--header-h`), left-to-right animated
  navigation underline on hover, focus and active. The Developers link stays
  active for `/developers/*` and `/sla/`, on desktop and the mobile menu.
- `src/components/docs/DocsLayout.module.css` / `DocsToc.module.css`: the
  sidebar grid item is sticky below the fixed header for the article's full
  height; long TOCs scroll **inside** the sticky area. Mobile uses the existing
  collapsible TOC, not a fixed overlay. Anchor offsets follow `--header-h`.
- `src/components/layout/BackToTop.module.css`: dark-theme button keeps a
  white arrow against a darker, accessible blue surface.
- `src/styles/tokens.css` / `globals.css`, `src/app/layout.js` and homepage/docs
  card CSS: dark background and surface colours follow the supplied DigitalInvoice app's
  slate/navy palette. Muted canvas/card gradients replace the saturated navy
  fills. The light theme keeps its previous colour tokens.

After extracting only these changed files into the Teecoms project:

```powershell
npm run dev
# Visit /, /developers/, /developers/api/, /developers/samples/, and /sla/
# Test header/nav on hover and keyboard focus, long TOC at deep scroll,
# light/dark switch, back-to-top arrow, and mobile 880px breakpoint.
npm run build
node scripts/verify-docs-release.mjs local
```

For live publication, follow `docs/NRS-PUBLISH-CHECKLIST.md`. The stricter
`--nrs` gate will still block an unsigned SLA or unpublished sample set.


## Post-D8 Developer support spacing refinement (2026-11-07)

The `/developers/` support section now has a deliberate gap between the **Developer support** heading and its gradient-filled contact card. In `src/app/developers/page.js`, the verified site email and phone are presented as separate stacked contact links using the shared `site.contact` values. Each link preserves its `mailto:` or `tel:` action and associated icon; address text remains below the two contact methods.

The layout is controlled in `src/app/developers/page.module.css` by `.support`, `.contactMethods`, `.contactLink` and `.address`. No content, theme tokens, status/approval logic, external integrations or contact configuration were changed.

**Local verification:** run `npm run dev`, visit `/developers/` in light/dark modes and mobile/desktop, and confirm the support heading has breathing room, the phone appears on its own row below the email, and long email addresses wrap without overlapping icons. Run `npm run build` for production verification. This change set was checked for JSX and CSS structure but was not built against a complete local dependency installation.


## NRS v1.1 alignment update — 13 November 2026

This addendum supersedes **older D3–D8 publication-state notes** without rewriting historical release instructions.

- Added `/developers/nrs-alignment/` (source `src/content/docs/nrs-alignment.md`, build route `src/app/developers/nrs-alignment/page.js`). It renders through the same server-only Markdown/DocsLayout pipeline and follows existing light/dark, print and sticky TOC styles. Its technical crosswalk is **not** a licensing/assurance certificate.
- Download new `public/docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf`. The API download now points to `public/docs/digitalinvoice-api-documentation-v1.1.pdf`. The previous `v1.0` API PDF remains in `public/docs/` as a historical document and should not be substituted for the new link.
- `src/content/docs/api.md`, `data-structure.md`, `samples.md`, `security.md`, `architecture.md`, `developers.md` now bear the 13 November 2026 review date. **This is a document review date, not an SLA effective date or independent code audit date.**
- The sample gallery is now marked published after confirming **8 PDFs + 8 PNGs** in the source archive. Keep the D5 generator's fictional labels/mock identifiers unchanged; verify all 16 files and public downloads after every build.
- `src/config/site.js` contains the general public email and telephone previously shown on Teecoms contact UI as fallback; production `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_CONTACT_PHONE` can override. Test the contacts before NRS submission. Never publish an unknown API hostname or infer a hosting region from an email domain.
- SLA remains in draft. Do not set a date before actual approval/signature (NRS's 2024 template dates are **not** Teecoms dates). Do not set `status: approved` or install an unsigned PDF. The NRS strict release gate remains intentionally blocked until properly executed.
- `npm run build` remains the supported static-export workflow; run `node scripts/verify-docs-release.mjs local`, then `node scripts/verify-docs-release.mjs live https://YOUR-CONFIRMED-TEECOMS-DOMAIN` after deployment. Both verify the new page/PDF. `--nrs` adds approval gates and should not be bypassed.
- The supplied backend used for the compatibility assessment is dated **7 November 2026**. The uploaded Teecoms website is dated **13 November 2026**. Any newer actual backend must be audited separately before claiming feature implementation. See `docs/NRS-V1.1-SOURCE-AUDIT.md` and `docs/NRS-PUBLISH-CHECKLIST.md`.

## NRS Phase 5 — documentation synchronisation (13 November 2026)

This optional Teecoms-only changed-files bundle revises the public docs to match the **separate** DigitalInvoice Phase 5 backend/admin delivery. Install the backend/admin package in the DigitalInvoice application under its own reviewed rollout instructions; copying documentation into Teecoms does **not** install an NRS feature.

1. Merge this bundle into the **Teecoms Next.js source root** (`src/content/docs/`, `public/docs/`, `docs/`), preserving your current source, approved status fields and environment files. **Do not deploy the PHP/backend or React admin ZIP through the Teecoms static documentation site.**
2. Verify the two updated PDFs exist at `public/docs/digitalinvoice-api-documentation-v1.1.pdf` and `public/docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf`. Their download filenames intentionally remain unchanged; version 1.1 is the NRS compatibility reference, with a dated Phase 5 documentation revision.
3. The **eight existing sample PDFs plus eight PNG previews** in `public/docs/samples/` are not regenerated by this batch. They remain fictional layouts. Do not replace their IRN/CSID/QR fields with any unverified sandbox or mock evidence presented as official.
4. Run `npm run build` then `node scripts/verify-docs-release.mjs local`; the build must succeed and the exported `/developers/`, `/developers/api/`, `/developers/data-structure/`, `/developers/samples/`, `/developers/architecture/`, `/developers/security/` and `/developers/nrs-alignment/` pages must exist. Check downloadable PDFs in `out/docs/`. The SLA remains a draft warning until genuinely executed.
5. After cPanel publication, run `node scripts/verify-docs-release.mjs live https://teecomsintegratedsolutions.ng` and open every updated page/PDF on a device outside your local network. A passing site-release test validates **documentation availability**, not NRS production compliance.

**Phase 5 boundaries:** Authenticated sandbox reference-sync and validation code paths are implemented but their successful NRS responses are not evidenced in these sources. Signing-readiness inspection does not sign; the production sender remains absent and disabled; issued hyphenated invoice numbers, missing classifications, payment updates and B2G/G2B workflows still block full completion. See `docs/NRS-V1.1-SOURCE-AUDIT.md`.

## Approved subscriber SLA and ISO/IEC 27001:2022 update — 25 November 2026

This section **supersedes** historical D2/D8 notes that required a signed customer-specific PDF before the SLA could become `approved`.

1. `src/content/docs/sla.md` is the **management-approved standard DigitalInvoice subscriber SLA**, version **1.0**, approved/published **25 November 2026**, **effective 27 November 2026** (or later paid subscription start). It uses online subscription/renewal or a referenced order form for Customer acceptance. There is no fabricated customer signature.
2. The approved HTML publishes at `/sla/` with indexing and a sitemap entry. `getDocumentation('sla')` no longer throws solely because `public/docs/teecoms-digitalinvoice-sla-v1.0.pdf` has not been printed. The *Download PDF* button is available **only after** that PDF exists and starts with `%PDF-`.
3. **Create the PDF print copy:** after launching the page, open `/sla/` in Chrome → Print → Save as PDF → save into `public/docs/teecoms-digitalinvoice-sla-v1.0.pdf` → run `npm run build` again. Review all 17 sections, links, typography and effective date before publishing the print copy. It is a **copy of the approved online SLA**, not an independently signed document.
4. The uploaded 25 November Teecoms source did **not** contain the ISO certificate PDF mentioned in the brief. Do not invent or recreate a certification document. Copy the **original** SCK certificate PDF (certificate `SCK/05/TIS/26/23/9804`) unchanged to `public/docs/teecoms-iso-iec-27001-2022-certificate.pdf` and rebuild. Until a real valid PDF is present, the security and NRS alignment pages display text rather than a broken PDF link. Validate status and surveillance dates using the issuing body and IAF CertSearch independently.
5. The website records management-supplied ISO/IEC 27001:2022 certificate details. **Independent DigitalInvoice VAPT remains in progress**. The certification is an ISMS claim, not an NRS production licence or DigitalInvoice penetration-test certificate. NRS production submission remains disabled.
6. The contact email, telephone and address are configured in `src/config/site.js` (`site.contact.email`, `.phone`, `.address`). The environment variables `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_CONTACT_ADDRESS` override the defaults. The `home.content.js` "To be confirmed" fallback remains in code but should never render while those nonempty defaults are present.
7. Hosting provider/country have **not** been supplied: the SLA uses the neutral managed-hosting/available-on-request language. SSL Labs grades have **not** been supplied and none are asserted. Confirm the 24/7 Severity 1 answer line and the actual one-minute monitoring/backup controls operationally before relying on the new contractual promises.
8. The API and NRS alignment PDFs were refreshed from their 25 November Markdown sources to remove obsolete draft-SLA statements; they are **not** live NRS technical approvals. No independent new backend review is claimed.

From the Teecoms Next.js root:

```powershell
$env:NEXT_PUBLIC_SITE_URL = 'https://teecomsintegratedsolutions.ng'
npm install
npm run build
node scripts/verify-docs-release.mjs local
# After adding both genuine PDFs, the stricter NRS publication gate can run:
node scripts/verify-docs-release.mjs local --nrs
```

Verify `/sla/`, `/developers/`, `/developers/security/`, `/developers/nrs-alignment/` and the homepage in both themes and on mobile. Confirm `/sla/` is indexable and in `out/sitemap.xml`, no draft-only callouts render, and the optional PDF links appear only when the files exist and are valid. After public deployment also run `node scripts/verify-docs-release.mjs live https://teecomsintegratedsolutions.ng`.


## Final NRS resubmission publication changes — 25 November 2026

- **Internal analysis only:** `docs/internal/NRS-V1.1-ALIGNMENT-REVIEW.md` retains the historical NRS version 1.1 comparison. Delete `src/content/docs/nrs-alignment.md`, `src/app/developers/nrs-alignment/page.js`, and `public/docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf`; also remove the corresponding **deployed** `/developers/nrs-alignment/` and PDF. The verifier blocks either public URL or a link to it in any exported page.
- **Public timeline:** `src/content/docs/timeline.md` drives `/developers/timeline/`, with the shared `DocsLayout`, sticky contents, light/dark diagram assets, A4 print styling and valid `status: published` metadata. The published Mermaid source and pre-rendered SVGs are under `public/docs/diagrams/digitalinvoice-implementation-timeline-v1.0.*`; `public/docs/digitalinvoice-implementation-timeline-v1.0.pdf` is the A4 direct-upload copy.
- **Approved SLA PDF:** `public/docs/teecoms-digitalinvoice-sla-v1.0.pdf` is the print copy of the management-approved 17-section online terms. Review it against `/sla/` before publication. The original ISO certificate PDF is **not** included in this source package; preserve/upload the actual issued file at `public/docs/teecoms-iso-iec-27001-2022-certificate.pdf`. Do not use a recreated certificate.
- **Reader-facing wording:** public API, security, architecture, data-structure, sample and hub pages no longer link to the internal crosswalk. The API documents the SLA's 90-day breaking-change notice and support terms; the ISMS certification statement uses **is certified**, while VAPT remains in progress and NRS production submissions remain licence-gated.
- **Rebuild and verify:** in PowerShell, run `Remove-Item -Recurse -Force .next,out -ErrorAction SilentlyContinue`, then `npm run build` and `node scripts/verify-docs-release.mjs local --nrs`. The strict check requires the original ISO certificate in the exported site. A successful local release check is **not** evidence of NRS accreditation or a live compliance test.

---

## Dark palette refresh — 25 November 2026

The website dark mode uses the charcoal/slate + cobalt system referenced from the Dynabase login screen. Adjust its semantic values centrally in `src/styles/tokens.css` instead of applying individual background overrides to new sections. Shared button fills use `--color-button-*` and `--shadow-button`; the feature, service and final CTA background gradients use `--gradient-feature-band`, `--gradient-service-stage` and `--gradient-cta-panel`. The hero preview retains its own dark illustrative palette in `HeroSlider.module.css` and `HeroVisual.module.css`, and the wave image lives at `public/images/hero/flow-dark.svg`.

Test `/` from the first slide through the footer, and `/developers/`, `/developers/api/`, `/developers/security/`, `/developers/timeline/` and `/sla/` in dark mode at 1440px, 1024px and phone widths. Toggle back to light mode and confirm its previous styling remains intact. This colour-only change does not alter documentation publication state or the NRS release checker.


### Header logo and restrained hero background (25 November 2026)

- The fixed header uses `<BrandLogo height={29} priority />`; the mobile menu uses 28px. At phone widths below 480px, the header image is 26px tall. Do not increase the logo back to the earlier 34px without reviewing navigation balance.
- The full-width wave illustrations remain the existing `public/images/hero/flow-light.svg` and `flow-dark.svg`. Their presence is controlled by the existing `.ambient` layer in `HeroSlider.module.css` at low opacity (light `.33`, dark `.32`), rather than adding extra gradients or independent visual overlays in other files.
- The ambient wash loops over 28 seconds, moving less than 1% of its width, and obeys the hero's existing pause-state/reduced-motion protections. Keep background effects quieter than content and cards, in both themes.
- Verify the header and hero in light/dark, at 390, 768, 1280, 1366 and 1920px, and check the four original slide variants and the header after scrolling.


### 2026-11-25 — Hero clarity and mobile follow-up

Copy the updated `src/components/layout/Header.jsx`, `Header.module.css`,
`src/components/sections/home/HeroSlider.module.css`, and
`HeroVisual.module.css` to the same paths in the existing Teecoms frontend.
Do not replace `home.content.js`, other section modules, or theme tokens.

Verify both themes on `/` at desktop (1280–1440px) and narrow phones (320,
360, 390, 590px): no blurred illustration text, no collapsed mobile chart
or vertical card labels, header icons aligned to the right, no three capability
chips on phones, both CTAs in one row, and the light-mode DigitalInvoice
primary CTA in white type. Check the secondary `Request a Demo` button in both
themes and all four carousel slides. Then run `npm run build`; it requires the
existing project dependencies, including `sharp`. This update requires no new
packages, environment variables, database changes, or migrations.

## 25 November 2026 — About section Option 2 and scroll motion

- `src/components/sections/home/AboutSection.jsx` now owns the Option 2 split-media/story layout. Its strings still come entirely from `aboutContent` in `src/content/home.content.js`; the images are existing public `teamContent` portraits. The mockup's numerical metrics and client quotation were not verified, so the current Technology/People/Processes pillars and Teecoms' own closing statement serve those visual roles without invented claims.
- `AboutSection.module.css` is the single source for the responsive layout, green highlights and card transitions. The additional semantic `--color-about-green*` tokens are defined in `src/styles/tokens.css` for both themes.
- The hero's dotted mat is a static `radial-gradient` layer in `HeroSlider.module.css` over the existing restrained light/dark backgrounds. There are no wave SVGs or moving backdrop layers.
- `Reveal.module.css` provides a slightly softer site-wide 850ms eased reveal and stagger. Continue using `Reveal` for scroll entrances and semantic native scrolling for anchors; do not intercept wheel or touch scrolling. Reduced-motion visitors get no transform-based entrances.
- Verify the About section at 320, 390, 768, 1280 and 1440px in both themes, as well as keyboard focus, `prefers-reduced-motion`, hero slide autoplay and the CTA route to `#services`.

## 25 November 2026 — About section image, CTA and replay polish

- The About media now uses the **illustrative** locally served image `public/images/about/team-collaboration.webp`, not the staff portraits also used in the Our Team section. Keep the image local so production does not depend on a third-party image host. The approved About copy remains in `src/content/home.content.js`.
- All blue `Button` components with `variant="primary"` now use the common cobalt gradient from `--gradient-button-bg` and `--gradient-button-hover` in `src/styles/tokens.css`. `di`, `glass`, and `outline` variants must remain visually distinct. Validate text contrast in both theme modes.
- The About section's `Reveal` components intentionally omit `once` so existing intersection-based reset/replay works when visitors return to the section. Verify entering the section, scrolling entirely past each row, and scrolling back to it. Users who prefer reduced motion should not see motion.
- The About statement deliberately has no separate logo mark; the header/footer are the single source of Teecoms brand imagery. The About light background is off-white, while the dark theme keeps the site's charcoal surface.
- The fixed back-to-top button now measures 2.7rem desktop / 2.5rem mobile with an 18px arrow. Test mouse/keyboard and `prefers-reduced-motion`.
- Run `node --test tests/about-story-option2.test.mjs tests/about-polish-followup.test.mjs`, then `npm run build` in the actual Teecoms project before deployment. Do not include generated QA screenshots or test fixture files in the deployment.
