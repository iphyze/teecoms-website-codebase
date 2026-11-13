# Teecoms website changelog

## 2026-11-07 — D1: DigitalInvoice documentation foundation

- Added a strict build-time Markdown/front-matter loader, HTML renderer, TOC heading extraction, and documented syntax for callouts, HTTP method badges, and proposed SLA figures.
- Added reusable documentation layout, header band, responsive sticky/collapsible contents, copy helpers, cards, samples, diagram and download components, along with light/dark CSS Modules and print rules.
- Added the `/developers/` foundation route and intentionally incomplete documentation topic cards. The page has `noindex` until D7; D2–D6 documentation pages are not yet published.
- Added the permanent Developers link to header navigation and legal/developer footer column. Fixed section links from sub-pages and restricted section scroll-spy to the homepage.
- Added static-export-compatible sitemap/robots metadata. Sitemap excludes draft, planned and foundation documentation pages.
- Declared pinned `marked@18.0.14`. The npm registry was unreachable here; no package-lock file was synthesized and no full Next.js build or browser visual validation is claimed. The next developer must run `npm install`, commit the regenerated lockfile, then run `npm run build`.
- Confirmed that NRS production submission remains licence-gated; no licence, certification, approved SLA, or NRS clearance is asserted in the foundation content.

## 2026-11-07 — D2: DigitalInvoice Service Level Agreement draft

- Added the permanent `/sla/` static-export route and a Markdown source containing a 17-part SLA (document control through signature blocks), followed by a management sign-off checklist.
- Documented clearly that all offered service figures are **proposed and not effective** pending Teecoms management/legal review and execution. Applied the existing `{{proposed:...}}` styling to availability, maintenance, response/resolution targets, escalation, NRS queueing, backup/retention, recovery and credit figures.
- Stated current NRS MBS status accurately: integration sandbox-ready, live submission disabled until licensing; all submission targets apply **only after licensed production go-live**. No ISO/IEC 27001 certification or completed independent VAPT is claimed.
- Added build-time conditional documentation blocks (`::::draft` / `::::approved`) and inline wording (`{{draft:...}}` / `{{approved:...}}`) so switching the SLA front-matter `status` does not leave draft notices in the approved page.
- Preserved a single page H1: when Markdown starts with the same title as the page header, the duplicate Markdown heading is omitted from rendered HTML.
- In draft mode, `/sla/` has `noindex`, is omitted from the sitemap, and offers **no** PDF download even though the planned signed PDF filename is in front matter. On approval, the version becomes `1.0`, proposed markers and draft-only wording disappear, and the signed download becomes visible.
- Added approved-state build gates: confirmed effective date, local PDF with `%PDF-` signature and no remaining visible `[CONFIRM:]` placeholders. A successful build does **not** itself verify signatures; management must review the signed PDF manually.
- No third-party dependencies added. Full Next.js build was **not run** here because the local project has no installed `node_modules` and the npm registry was inaccessible. Source and Markdown structure were checked locally; browser/print review is still required.

---

## D3 — Public DigitalInvoice API documentation (2026-11-07)

- Added the statically exported `/developers/api/` page (`src/app/developers/api/page.js`) using the D1 documentation renderer, responsive TOC, theme-aware styling, copyable code and print layout.
- Added `src/content/docs/api.md` version 1.0, reviewed against the supplied current PHP router, ERP OAuth/security modules, integration routes, invoice workflows, NRS readiness implementation and test notes. Includes all nine read-only ERP v1 resources, OAuth client credential/token grant, strict browser-only management endpoints, HMAC-signed outbound webhook events, filters, response envelopes and verified limits.
- Clarified that ERP feature flags and deployment readiness are separate from route implementation. The API host and sandbox URL are explicitly unconfirmed; external NRS production submission is disabled, and local readiness cannot be represented as official NRS validation.
- Added static, accessible local SVG diagrams for invoice state transitions and the **future-only** NRS MBS flow.
- Added a versioned download at `public/docs/digitalinvoice-api-documentation-v1.0.pdf`. This document is a portable snapshot of the source Markdown and must be regenerated after any content edits.
- Existing static sitemap automatically discovers published API documentation; existing SLA remains draft/noindex. No changes to other routes, to external-system configuration or to dependencies.
- Validation performed: PHP route cross-check, SVG XML parse, JavaScript syntax check, Markdown structure checks and PDF rendering/inspection. Full Next.js static build still requires installing D1 dependencies locally; no production reachability or API acceptance test was performed.

---

## D4 — Public invoice data structure, schema, mapping and fictional fixtures (2026-11-07)

- Added `/developers/data-structure/` with the shared static documentation layout, verified front matter (`status: published`, `version: 1.0`), field traceability, code-list caveats, financial reconciliation rules, sample download links and explicit NRS licence disclaimers.
- Published an **unchanged copy** of the backend's `schemas/nrs-ubl-v1.1-local.schema.json` as `public/docs/digitalinvoice-invoice-schema-v1.0.json`. This is a **DigitalInvoice local Draft 2020-12 schema projection** and is not an official, NRS-certified or remotely validated schema. Documentation filename v1.0 and NRS profile v1.1 are distinct version identifiers.
- Published a revised, source-reviewed **54-row** `public/docs/digitalinvoice-field-mapping-v1.0.csv`. The older backend source mapping referenced live buyer master-data location fields; this CSV uses the newer `invoices.customer_*_snapshot` columns actually referenced by `firsLocalInvoicePayload` and confirmed in the supplied November 2026 SQL dump. The CSV additionally flags unpopulated goods/service category fields and the credit-note source-date limitation.
- Copied **six generated test fixtures byte-for-byte** from `tests/generated_fixtures` into `public/docs/sample-payloads/` with versioned names. They cover B2B multi-line/discount/VAT, B2C simplified, credit note, VAT exempt, mixed tax categories and two-level discount. No production customer records, live NRS identifiers, secret tokens or user-specific database data were published.
- Kept the Developers hub in **foundation/noindex** status pending D7, while making cards for published routes and the draft SLA linkable based on the underlying document status. Updated the hub's provisional text to stop describing already-published API and schema pages as upcoming.
- Did not modify the PHP backend, database, migrations, NRS client configuration, sample fixture contents, existing API document or SLA terms. No new npm dependencies.
- Local tests: JSON Schema draft validity; all six published fixture copies validated against the source schema; hash comparison to source fixtures; CSV field mapping references checked against database schema; Markdown/route and package-link checks. A full Next.js build and live NRS acceptance require the deployer's environment and licensed access.

---

## 2026-11-07 — Documentation PDF path validation fix (post-D4)

- Fixed `src/lib/docs/index.js` front-matter validation rejecting valid versioned PDF filenames such as `/docs/digitalinvoice-api-documentation-v1.0.pdf`. The old filename character class did not allow the period in `v1.0`.
- The validation now accepts safe dot-separated filename segments below `/docs/`, including version suffixes, without permitting `..` traversal, absolute/external URLs, backslashes, query strings or unsafe directory names.
- No API content, SLA approvals, source data, routing or PDF assets were changed.
- Verified both existing API and draft-SLA front matter, including regression checks for valid versioned filenames and rejected unsafe paths; full Next.js build must still be run in the developer's environment.

---

## 2026-11-07 — D5: Fictional visual PDF samples and gallery (pending generation)

- Added a development-only generator **to the DigitalInvoice frontend**, not the website frontend. It bundles the current `documentModels.js` and `pdf.jsx` using pinned `esbuild@0.25.12`, renders four fictional document types in two states (8 PDFs), and uses Poppler to create 8 PNG previews of those exact PDFs. Updated the DigitalInvoice frontend `package.json` and `package-lock.json` without changing production document rendering code.
- Protected the production-only NRS evidence gate: the generator substitutes a separate mock panel **only in its temporary bundle** and visibly labels the illustrative IRN, CSID and QR as **MOCK / NOT ISSUED OR VALIDATED BY NRS**. Its QR encodes an explicit mock-only text string. The script never loads database or private API records, or contacts the NRS service.
- Added a new `/developers/samples/` route, controlled Markdown page, a versioned eight-pair manifest, a responsive gallery, and pending-safe sample card previews. The page begins as `planned`/noindex and is omitted from the sitemap; missing samples never create broken download links.
- Added a **publication gate**: changing the Markdown to `status: published` requires all 8 PDF/PNG pairs to exist and match PDF/PNG magic headers or the static build fails. The published page then becomes indexed and included in the sitemap. Updated the Developers foundation hub to link honestly to the preparation page, without calling the samples published prematurely.
- The generated PDFs and PNGs are **not yet included** in this handoff because the generator must be run in the actual DigitalInvoice frontend environment with npm dependencies and Poppler installed. No end-to-end generation, PDF visual verification, Next.js build or production publication is claimed. Verification and copying instructions are appended to `docs/BUILD-GUIDE.md`.


---

## 2026-11-07 — D5 follow-up: sample-gallery label and button layout correction

- Corrected the underlying shared Teecoms Button label layout with inline flex so SVG icons appear **beside**, and vertically aligned with, text. Existing button structure, theme styling and download behaviour remain unchanged.
- Replaced prominent “not yet submitted to NRS” language in the fictional gallery state labels and the generator's **standard-layout** PDF panel/footer with neutral design-demonstration language. The website now explains the two variants as standard PDF layout and illustrative verification-field layout.
- Kept mock IRN/CSID/QR fields explicitly synthetic and the QR non-verifying. This is a copy/layout change, not a change in NRS approval, compliance claims or actual application integration status.
- Updated development-only generator helpers. PDFs/PNGs already generated on the user's machine must be **regenerated and recopied** to reflect changed text. Production DigitalInvoice document rendering and evidence guards are untouched.
- No new dependencies. Source and stylesheet checks performed locally; production regeneration, browser visual check and full Next.js build remain to be verified in the user's local environment.

---

## D6 — Architecture and security documentation (2026-11-07)

- Added statically rendered public `/developers/architecture/` and `/developers/security/` pages, with descriptive metadata, canonical paths, table-of-contents navigation and links to supporting docs. The existing sitemap includes them automatically while the main Developers hub remains in `foundation`/noindex status for D7.
- Added source-reviewed `architecture.md` describing the React app / PHP API / database, scoped ERP integration, signed webhook outbox, external provider boundaries, sandbox-gated NRS client, offline-only B2C staging queue and target-only B2B clearance, B2C reporting and MBS360 buyer verification.
- Added `security.md` identifying source-supported JWT + CSRF sessions, privileged TOTP MFA, Google ID-token verification, OAuth2 client credentials, organisation isolation, AES-256-GCM for selected secrets, SHA-256 token hashes, audit events, HTTPS/HSTS policy and webhook signatures. Explicitly **no** licence, ISO 27001 certification, completed VAPT, proved TLS floor, verified hosting location or live NRS production integration is claimed.
- Added 4 Mermaid source diagrams, 8 theme-specific SVG diagrams, a public A3 landscape four-page architecture PDF and theme-aware diagram rendering in the docs Markdown pipeline, with enlarge links and light-art print override. No new npm dependencies or changes to DigitalInvoice application code/database.
- Adjusted Developers foundation text to make the newly published architecture and security pages discoverable, without prematurely promoting D7 hub publication status or silently approving D2 SLA terms.
- QA included SVG XML and link checks, PDF vector rendering and visual inspection, source review, and static syntax/style checks. **No full Next.js build or deployed-site verification was performed** in this environment.

## D7 — Completed Developers hub (2026-11-07)

- Published `src/content/docs/developers.md` v1.0 with accurate purpose, resource scope and notice that NRS production capability remains licence-gated. `/developers/` is now eligible for the static sitemap and search indexing.
- Rebuilt the six existing resource cards to show link availability and publication state sourced from each page's current front matter. The draft SLA stays labelled **Draft · management approval pending**. Planned samples remain identified as subject to review even after files are generated.
- Added a semantic, responsive status section distinguishing implemented application and ERP integration, sandbox-controlled NRS preparation and disabled live NRS submission, plus a support panel using configured Teecoms contact details and `/#contact`.
- Centralised the eight PDF/PNG-pair file-header checks into `src/lib/docs/sampleAvailability.js` for both the hub and samples gallery. The samples publication guard remains in place.
- Added accessible focus styles, mobile stacking, token-only light/dark styling and print-friendly card/status layouts. No new dependencies, new API endpoints or changes to DigitalInvoice application source.
- Updated `docs/BUILD-GUIDE.md` with D7 merge and verification steps. The source checks cannot replace the developer's full Next.js build or public-link verification.

---

## D8 — Public release and NRS submission checklist (2026-11-07)

- Added `docs/NRS-PUBLISH-CHECKLIST.md` covering deployment readiness, source-status gates, sample generation audit, executed SLA approval, production environment configuration, Next.js static export, cPanel document-root placement, SSL verification, mailer security, live public-link tests, evidence collection, rollback and exact NRS documentation paths.
- Added dependency-free `scripts/verify-docs-release.mjs` with `local` export checks, `live` HTTPS checks and an optional `--nrs` release gate. Checks include canonical URLs, robots/noindex and sitemap statuses, required versioned PDF/JSON/CSV/SVG assets, PNG/PDF magic headers, secure PHP mail configuration handling, and validation of route/download reachability. The script does not contact NRS or inspect real DigitalInvoice customer data.
- Added route-specific canonical and indexability metadata to `src/app/developers/security/page.js`, matching the other documentation pages. No page structure or design token changes.
- Preserved `samples.md: planned`, `sla.md: draft` and the API `[CONFIRM]` placeholders because no final publication review, signed SLA or verified public deployment details were supplied. The NRS submission gate deliberately fails until these prerequisites are met.
- D8 script and syntax checks were performed locally; **no successful Next.js build, public HTTPS/cPanel test, NRS onboarding approval or external regulator submission is claimed**. Those checks must be performed in the target deployment environment.


---

## 2026-11-07 — Post-D8 site-wide navigation and dark-theme refinement

- Reduced the Teecoms header wordmark from 38px to 34px (30px on narrow
  screens) while increasing the shared header height from 72px to 82px.
- Replaced desktop menu hover background tints with left-origin, animated
  underlines for hover, keyboard focus and active navigation; added a matching
  indicator on mobile. `/sla/` now correctly highlights the Developers group,
  alongside all `/developers/` documentation routes.
- Fixed disappearing docs navigation by making the grid sidebar itself sticky;
  independently scrolling TOC entries remain accessible throughout long pages,
  and the existing mobile collapsible navigation remains non-sticky.
- Set the dark-mode back-to-top arrow to white over a deeper blue button,
  without changing the global accessible primary button text colour.
- Replaced the site's saturated dark navy palette with the calmer slate
  surfaces from the supplied DigitalInvoice app, introducing subtle semantic
  canvas and shared homepage/docs-card gradients in both themes. Updated the
  browser theme-colour metadata to match. No page structure was altered.
- Kept documentation content, SLA approval state, sample source files and
  licence-gated NRS functionality unchanged. No dependencies added.
- Static syntax, CSS parsing, responsive/sticky CSS-rule and contrast checks
  performed; full Next.js build and interactive cross-browser verification
  still require the developer's local installed dependencies.


---

## 2026-11-07 — Developer support contact spacing

- Increased vertical separation between the **Developer support** section title and its card on `/developers/`.
- Refactored the card's email and telephone into a single vertically stacked contact-method group; telephone now displays below email with consistent icon alignment and responsive wrapping.
- Retained the configured contact details, working `mailto:`/`tel:` links, address and existing theme-aware card styling. No dependencies or documentation publication settings changed.

## 2026-11-07 — Static-export build fix and mobile SLA overflow fix (verified)

- **Build fix:** `src/app/robots.js` and `src/app/sitemap.js` now declare `export const dynamic = 'force-static'`. Without it, `npm run build` failed with `output: 'export'` ("export const dynamic … not configured on route /robots.txt"), so no `out/` folder could be produced. Verified: the build now exports all 7 documentation pages, `robots.txt` and `sitemap.xml` (the sitemap correctly omits the draft SLA and the planned samples page).
- **Mobile overflow fix:** `src/components/docs/DocsLayout.module.css` — `.docs-proposed` and `.docs-table-scroll` are now `position: relative`. The absolutely positioned `.sr-only` labels of proposed SLA figures escaped the table scroll boxes and widened the SLA page to 413px on a 390px phone. Verified: no page overflows at 390px or 360px; the 38 screen-reader labels remain.
- **Verified unchanged:** 40 internal links and downloads resolve; the API documentation's 36 endpoint references all exist in the backend route table (no `/platform` routes or file paths); the JSON Schema and six sample payloads are byte-identical to the backend-generated files; every NRS field in the mapping CSV exists in the schema and every database column exists in the migrated database.


## 13 November 2026 — NRS public v1.1 alignment review (website only)

- Compared official NRS invoice-schema v1.1, system-integrator requirements, API changelog and SLA reference to the supplied DigitalInvoice backend (7 November 2026) and Teecoms website (13 November 2026). Added a published technical crosswalk `/developers/nrs-alignment/` with a downloadable 3-page PDF. The crosswalk **does not claim accreditation**.
- Updated API documentation to revision 1.1 with the NRS authentication boundary, April 2026 PARTIAL/quantity-code changes, tax/invoice kinds and ECDSA/JAdES gap. Rebuilt the API reference as `digitalinvoice-api-documentation-v1.1.pdf`; retained the previous `v1.0` PDF as a historical download.
- Corrected obsolete text about D4/D5 not being published, added official NRS source links, and refreshed documentation review dates to 13 November 2026.
- Published the fictional PDF sample gallery after checking eight PDF signatures and eight PNG signatures in the provided website archive. The build still enforces all file pairs.
- Populated the already-public Teecoms general email/phone as fallback contact details. SLA remains a **management-review draft**; NRS 99.9%/24-7 reference differs from the proposed 99.5%/staffed-hours terms. Historical dates from the NRS template are not Teecoms execution dates.
- Updated hub navigation/footer, sitemap, schema slug allowlist, release-verification resource inventory and deployment checklist for the alignment page and new PDF. No DigitalInvoice backend, database, NRS sender or security enforcement files modified.
- Refer to `docs/NRS-V1.1-SOURCE-AUDIT.md` for evidence, gaps and outstanding manual steps.

## 2026-11-13 — Reconcile public documentation with DigitalInvoice NRS Phase 5

- Rechecked the 13 November 2026 backend/admin changes against the existing NRS v1.1 public Teecoms documentation; separated **code implemented** from **authenticated external sandbox testing completed**, which has not been evidenced.
- Documented guarded single-catalogue NRS sandbox synchronisation, `synced`-only resource preflight, approved-invoice sandbox `/validate` route with session/CSRF and invoice permission, non-mutating validation-response handling, ECDSA certificate-readiness inspection and always-disabled production submission.
- Updated `src/content/docs/api.md`, `nrs-alignment.md`, `data-structure.md`, `architecture.md`, `security.md`, `samples.md` and `developers.md`; retained public ERP read-only boundaries and never exposed private platform-management routes as ERP endpoints.
- Refreshed downloadable `digitalinvoice-api-documentation-v1.1.pdf` and `digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf` from the revised public Markdown sources; kept their canonical versioned download paths.
- Preserved all eight original fictional sample PDFs and eight PNGs and the existing six local JSON fixtures **byte-for-byte**: Phase 5 did not alter document templates or generated test fixtures. Clarified that those assets cannot be treated as NRS clearance or production-signed evidence.
- Kept `src/content/docs/sla.md` in draft status. No NRS licence, external sandbox acceptance, JAdES signer, production HTTP sender or signing certificate was fabricated or enabled.
- Added a Phase 5 source-audit delta and updated the deployment/verification notes. This delivery is Teecoms-only documentation: it does **not** install Phase 5 backend/admin changes or grant any production authorisation.
