# Teecoms Integrated Solutions — Website

Single-page Next.js static-export site for Teecoms, featuring the DigitalInvoice flagship product.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The deployable static site is generated in `out/`.

## Design system

- Tokens (colours, type scale, spacing, motion) for light and dark modes: `src/styles/tokens.css`
- Font: Plus Jakarta Sans, self-hosted in `src/assets/fonts` (shared with the DigitalInvoice app)
- Brand logos: `public/images/brand` (Teecoms) and `public/images/digitalinvoice`
- Theme: follows the visitor's OS setting until they choose one; stored under `teecoms-theme`
