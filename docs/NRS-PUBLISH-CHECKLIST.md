# DigitalInvoice documentation — D8 publication and NRS submission checklist

**Owner:** Teecoms Integrated Solutions Limited  
**Prepared:** 7 November 2026; **NRS v1.1 review:** 13 November 2026  
**Scope:** Teecoms documentation website, not the DigitalInvoice API or NRS production activation.  
**Site domain:** `https://teecomsintegratedsolutions.ng/` (confirm this host serves the newest deploy before submission). Never use `localhost` or the API hostname in an NRS portal page-link field.

This is an **operator checklist**, not evidence that deployment, management approval, NRS acceptance, penetration testing or live production integration has occurred.

## 1. Release status and hard gates

| Page | Path | Supplied D7 state | Requirement before presenting as final NRS evidence |
| --- | --- | --- | --- |
| Developers hub | `/developers/` | Published | Publicly reachable, no login, correct links |
| API documentation | `/developers/api/` | Published; v1.1 documentation update | API hostname is provided to authorised clients during provisioning; verify live origin and updated PDF |
| Data structure | `/developers/data-structure/` | Published | JSON Schema, mapping CSV and six JSON examples reachable; source caveats preserved |
| Visual PDF samples | `/developers/samples/` | **Published in source**; all 8 PDF/PNG pairs present | Verify each PDF/PNG visually and confirm public links before submitting |
| Architecture | `/developers/architecture/` | Published | All four diagrams legible in both themes; A3 PDF downloadable |
| Security | `/developers/security/` | Published; v1.1 JAdES/ECDSA boundary clarified | Check factual claims against deployed controls and keep planned assurances clearly labelled |
| Implementation timeline | `/developers/timeline/` | Published | Milestones, ownership, dependency-driven targets, A4 PDF and Gantt SVG legible |
| Service Level Agreement | `/sla/` | **Approved; effective 27 November 2026** | Confirm published terms, public URL and approval evidence. Optional print PDF available after generation |

**Publication update (25 November 2026):** Management approved the standard SLA with an effective date of **27 November 2026**. The gallery is published in source. Production reachability, the genuine ISO certificate PDF, the optional print-copy SLA PDF, and NRS service-provider accreditation must be independently checked. NRS production submissions remain licence-gated.

### Source checks before changing status

- Verify that the corrected D5 generator was rerun and its new PDFs/PNGs were recopied into **the Teecoms website's** `public/docs/samples/`, not just generated in the DigitalInvoice application. Each of the 8 documents needs a corresponding PDF and PNG, 16 total. Open all PDFs; check the actual wording in the *files*, not only the website cards.
- Keep fictional example names/amounts and explicit **MOCK** IRN/CSID/QR descriptions. Do not replace them with customer records or pretend they were issued by NRS.
- The sample Markdown is now `status: published`, and the static build guards against missing/corrupt sample pairs. Retain its fictional/test-data disclaimers and check PDF/PNG previews on the actual deployed host.
- For the SLA, management has approved online subscription acceptance; `src/content/docs/sla.md` is `status: approved`, `effective: 2026-11-27`. Its print PDF is **optional for normal publication** and only linked when present with a valid PDF signature. Generate it from the live HTML using Chrome Print → Save as PDF, then rebuild. The strict NRS check requires the print PDF and the original ISO certificate PDF; neither must be fabricated.
- Verify API integration URLs and support details from the real deployment. Keep missing or planned assurance statements honest. Confirm any required official NRS schema or code-list details separately; the published local projection is not an official NRS-certified schema.

## 2. Build and inspect the static export

Run in the **Teecoms website root** (in this project, the directory with `next.config.mjs` and `src/app/developers/`). This is distinct from the DigitalInvoice app's sample-generator root, regardless of what those folders are named on Windows.

```powershell
# Set these in your production environment / .env.production before building.
# Example placeholder ONLY: substitute the exact confirmed HTTPS Teecoms origin.
$env:NEXT_PUBLIC_SITE_URL = 'https://YOUR-VERIFIED-TEECOMS-DOMAIN'

npm install
npm run build
node scripts/verify-docs-release.mjs local
```

The checker verifies exported HTML/canonical metadata, sitemap and robots, versioned PDF/JSON/CSV/SVG files, sample file signatures, and the PHP mailer's access guard. The SLA print PDF is included in the final packaging; the genuine ISO certificate must be copied from the organisation’s issued document. Both are required by the strict NRS gate. It uses only Node built-ins; no extra dependency is introduced. An exit code other than zero means **do not deploy that output**.

For an NRS submission gate, after resolving approval blockers:

```powershell
node scripts/verify-docs-release.mjs local --nrs
```

The `--nrs` flag requires published samples, an approved SLA, the real ISO certificate PDF, the matching SLA print PDF, the timeline PDF, and no internal gap-analysis links or API publication placeholders. This is a deployment-readiness guard, **not** a guarantee of regulator acceptance.

### Expected layout under `out/`

```text
out/
  index.html
  developers/index.html
  developers/api/index.html
  developers/data-structure/index.html
  developers/samples/index.html
  developers/architecture/index.html
  developers/security/index.html
  developers/timeline/index.html
  sla/index.html
  docs/digitalinvoice-api-documentation-v1.1.pdf
  docs/digitalinvoice-invoice-schema-v1.0.json
  docs/digitalinvoice-field-mapping-v1.0.csv
  docs/sample-payloads/                 (6 JSON files)
  docs/samples/                         (8 PDFs + 8 PNGs when copied)
  docs/diagrams/                        (SVGs + Mermaid sources)
  docs/digitalinvoice-architecture-v1.0.pdf
  docs/digitalinvoice-implementation-timeline-v1.0.pdf
  docs/teecoms-digitalinvoice-sla-v1.0.pdf  (optional print copy; mandatory for --nrs)
  docs/teecoms-iso-iec-27001-2022-certificate.pdf (original certificate; mandatory for --nrs)
  sitemap.xml
  robots.txt
  api/contact.php                       (existing PHP contact endpoint)
  api/.htaccess                         (access control for server-only mail configuration)
```

The approved SLA's PDF must reproduce the approved 17-section online terms; the current final package contains an A4 print copy for review. Do not substitute a modified agreement. `public/docs/samples/` is an *input* to the build; verify the corresponding output under `out/docs/samples/` after building. The build-time environment is baked into HTML, including canonical URLs: **changing `.env` after building does not fix an existing export**.

## 3. Deploy using cPanel

1. Confirm the exact domain, DNS, active SSL/TLS certificate and document root in cPanel. Use the web root for the actual Teecoms domain (often `public_html/` for the primary domain; addon/subdomains can differ). **Do not guess the root.**
2. Backup the currently serving site and its existing PHP contact/mailer setup. Preserve a tested rollback archive *privately* before replacing the public website.
3. Upload **the contents of `out/`**, not the `out` directory itself, to the correct document root. Preserve the `developers/`, `sla/`, `docs/` and `api/` directory structures. Apache must serve `index.html` at trailing-slash URLs such as `/developers/api/`; verify that in a private window. Do not deploy project sources (`src/`, `node_modules/`, database dumps, backend archives or development `.env` files).
4. Confirm `public/api/.htaccess` has been copied as `out/api/.htaccess` and remains active after upload. The Teecoms build may generate **`out/api/env.php` containing SMTP credentials**; this must be handled as a confidential server-side file, not shared in a downloadable site archive or public repository. Confirm the host executes PHP and **cannot serve PHP source code or mailer settings as plain text**. Prefer managing secrets outside the public web root if supported by your hosting arrangements.
5. Verify any existing `index.html`/`.htaccess` rules do not redirect clean documentation routes to the homepage or an authentication screen. If `https://domain/developers/api/` is 404, check the document root, uploaded `developers/api/index.html` and Apache directory-index configuration before introducing rewrite rules.
6. Verify the contact form separately (PHP version, SMTP transport, anti-spam token and actual test delivery). A successful static docs check does not prove the contact form works.
7. Keep the last functioning deployment and its configuration available for quick rollback. Preserve other historically valid downloads; **remove the withdrawn internal NRS review PDF and route** even if they were previously published.

## 4. Verify **external**, unauthenticated reachability

Run from a different network, ideally a private/incognito browser on mobile data, **not** just `localhost` or the hosting server. Set the verified origin before running:

```powershell
$site = 'https://YOUR-VERIFIED-TEECOMS-DOMAIN'

# Windows PowerShell: use curl.exe explicitly, not its curl alias.
curl.exe -I "$site/developers/"
curl.exe -I "$site/developers/api/"
curl.exe -I "$site/developers/data-structure/"
curl.exe -I "$site/developers/samples/"
curl.exe -I "$site/developers/architecture/"
curl.exe -I "$site/developers/security/"
curl.exe -I "$site/developers/timeline/"
curl.exe -I "$site/sla/"
curl.exe -I "$site/docs/digitalinvoice-api-documentation-v1.1.pdf"
curl.exe -I "$site/docs/digitalinvoice-invoice-schema-v1.0.json"
curl.exe -I "$site/docs/digitalinvoice-field-mapping-v1.0.csv"
curl.exe -I "$site/docs/digitalinvoice-architecture-v1.0.pdf"
curl.exe -I "$site/docs/digitalinvoice-implementation-timeline-v1.0.pdf"
```

Expect **HTTP 200** for the intended final public paths. Check that PDFs actually open and download, the JSON/CSV are downloadable, the images load, and no login, paywall, network restriction or redirect to the homepage is present. Use a browser to test light/dark mode, TOC, mobile layout, keyboard navigation, diagrams, previews, links, and browser print/Save as PDF.

For an automated external check (Node with ordinary internet access):

```powershell
node scripts/verify-docs-release.mjs live https://YOUR-VERIFIED-TEECOMS-DOMAIN
# Only after all NRS-submission blockers are resolved:
node scripts/verify-docs-release.mjs live https://YOUR-VERIFIED-TEECOMS-DOMAIN --nrs
```

The checker requires valid HTTPS, requests pages and expected published files, examines metadata, and attempts to confirm the mailer configuration endpoint is not exposing its source. **Do not consider the check passed if it exits nonzero.** It cannot determine whether the content itself is legally approved or NRS accepted. Its remote check reflects that specific moment only.

### Content and security verification

- The actual host certificate must be valid for the **exact** submitted hostname, with a complete trust chain. The HTTPS scheme in a page URL alone is insufficient evidence of a working certificate.
- `robots.txt` and `sitemap.xml` should open. Draft SLA or planned samples should have `noindex` and be excluded from the sitemap. After their statuses change and you rebuild, verify the published pages appear in the sitemap and have the correct canonical HTTPS URL.
- Check HTTP → HTTPS redirection according to your host policy. Ensure `https://domain/api/env.php` is **not downloadable** and that no SMTP password, API secret, customer list or backend source file is reachable on the public website.
- Save private screenshots of each page, PDF opening, the final URL bar and test results, with test time/date and network. Avoid including authentication tokens or sensitive data in evidence files.

## 5. Exact URLs to provide in the NRS portal

Replace `https://YOUR-VERIFIED-TEECOMS-DOMAIN` with the exact, live domain **only after testing**. The paths below are the actual implemented Teecoms website routes; no live host is yet confirmed.

| Evidence requested | Permanent page URL | Supporting download URL |
| --- | --- | --- |
| Service Level Agreement | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/sla/` | `/docs/teecoms-digitalinvoice-sla-v1.0.pdf` after generating approved print copy |
| API documentation | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/api/` | `/docs/digitalinvoice-api-documentation-v1.1.pdf` |
| Data structure / schema | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/data-structure/` | `/docs/digitalinvoice-invoice-schema-v1.0.json`, `/docs/digitalinvoice-field-mapping-v1.0.csv` |
| Visual PDF samples | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/samples/` | Individual fictional sample PDFs on the gallery |
| System architecture | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/architecture/` | `/docs/digitalinvoice-architecture-v1.0.pdf` |
| Security and compliance overview | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/security/` | Certificate PDF after uploading the original, and verification links |
| Implementation timeline | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/timeline/` | `/docs/digitalinvoice-implementation-timeline-v1.0.pdf` and `/docs/diagrams/digitalinvoice-implementation-timeline-v1.0.svg` |
| Developer index / optional extra link | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/` | Links to all published evidence |

In the NRS portal, use **the page URLs** where the field requests a link, and the corresponding versioned files where it specifically asks for a direct document URL. Do not send a localhost URL or claim an uploaded PDF is signed when it is only a print copy of the online SLA. Portal field names and acceptance rules should be checked against your current NRS account/rejection notice; this checklist does not assert those current field names.

## 6. Final manual sign-off record

- [ ] Verified real domain, API origin and support contact; no misleading placeholders in submitted API documentation
- [ ] Management approval recorded; subscriber SLA effective 27 November 2026; PDF print copy and acceptance method verified if required by NRS
- [ ] Eight current sample PDFs and eight corresponding PNGs visually inspected and published
- [ ] API PDF, schema JSON, mapping CSV, fixtures, A3 architecture PDF, A4 timeline PDF and SVGs open publicly
- [ ] NRS licence / production integration described accurately; no false accreditation or validation claims
- [ ] Withdrawn public NRS review URL and PDF both return 404/410; only the internal `docs/internal/` copy remains
- [ ] Timeline page, dates, owners, target disclaimers and downloadable A4 Gantt checked
- [ ] Static `npm run build` successful in the Teecoms project
- [ ] `verify-docs-release.mjs local --nrs` passed
- [ ] cPanel upload correctly placed inside actual site document root; server-side mail secrets protected
- [ ] `verify-docs-release.mjs live https://EXACT-DOMAIN --nrs` passed
- [ ] Real phone/mobile-data and private-browser test passed; no login required
- [ ] SSL Labs app/API TLS grades, canonical URLs, sitemap, robots, download MIME and browser print checked
- [ ] Original ISO/IEC 27001:2022 certificate PDF uploaded and certificate number/validity independently verified; VAPT remains in progress
- [ ] Screenshots/release date, reviewer, URLs and rollback location recorded privately

**Deployment date/time (WAT):** __________________  
**Reviewer:** __________________  
**Public host:** __________________  
**Result / outstanding items:** __________________

**Do not mark D8 as publicly deployed or NRS-submitted merely because this checklist or verification script has been delivered.**


## 7. Internal NRS v1.1 review (withdrawn from public pages 25 November 2026)

The gap assessment is retained at `docs/internal/NRS-V1.1-ALIGNMENT-REVIEW.md`. This directory is **not** part of the static export. The former public route and download must be deleted from both the source tree and cPanel; their URLs should return HTTP 404/410. Never submit the internal crosswalk as public evidence. The public [implementation timeline](/developers/timeline/) replaces its navigation entry.

- Do **not** state that B2G/G2B are available merely because the local schema accepts the enum. The current invoice workflow supports B2B/B2C.
- `PARTIAL` and quantity-code endpoint wiring exist in the reviewed backend, but licensed NRS payment updates, official resource synchronisation and production sender do not. The 2026 tax-category additions have not been demonstrated end to end.
- The NRS SI guidance describes ECDSA/JAdES; DigitalInvoice's signed ERP webhooks are HMAC and **not equivalent**. An authoritative signing design and security verification remain to be delivered.
- The NRS SLA template's 99.9% uptime / 24/7 response model is **different** from Teecoms' approved 99.5% / staffed-hours agreement. These are not equivalent and NRS may require separate undertakings.
- NRS's published template dates of October 2024 must **not** be reused as Teecoms agreement or review dates. The real SLA effective date follows actual approval/execution.
- The contact address `info@teecomsintegratedsolutions.ng` and telephone `+2347038020088` are drawn from the Teecoms contact details previously displayed publicly. Verify reachability before NRS submission; do not claim a dedicated staffed hotline is live.

The `--nrs` verifier requires the genuine ISO certificate and approved SLA print PDF in addition to the API, architecture and timeline assets, and it rejects withdrawn review links. It remains a technical publication check, not NRS accreditation.

## Phase 5 technical-status note — 13 November 2026

The Teecoms public API and alignment documents now describe the **separate** DigitalInvoice NRS Phase 5 backend/admin code. Deployment of the documentation does not deploy the Phase 5 application package. Before relying on the updated descriptions, confirm the corresponding Phase 5 PHP/admin changed files were installed and pass their offline tests in the DigitalInvoice application.

- **Implemented in code only:** authenticated NRS sandbox reference synchronisation, official-code preflight, approved B2B/B2C invoice sandbox `/validate` route, public ECDSA certificate inspection, readiness blockers and redacted sandbox/readiness audit summaries.
- **Not evidenced:** real official resource sync, accepted NRS sandbox test, JAdES signature generation, protected HSM/KMS signer, licence, production sender, NRS-confirmed invoice clearance or production IRN/CSID/QR.
- **Still blocking:** hyphenated approved invoice numbers requiring persisted collision-safe aliases; incomplete goods/service classifications and historical snapshots; B2G/G2B workflows, payment updates and NRS response reconciliation.
- **Sample assets:** Keep the same eight fictional PDF/PNG pairs and six local UBL JSON fixtures; Phase 5 did not change their generators or validate them remotely. Never relabel mock verification fields as NRS-issued evidence.
- **SLA/approval:** Continue to label `/sla/` as draft until genuinely executed; do not backdate approval or enable production transport through a documentation publication action.

After rebuilding Teecoms, run the local release-verifier command and independently open the updated v1.1 API and alignment PDFs from the public HTTPS website. The test measures **static-site publication**, not NRS interoperability or licensing.

## SLA and ISO publication update — 25 November 2026

- The management-approved, online-accepted SLA is **version 1.0**, effective **27 November 2026**. It is indexed and included in the sitemap after the site is rebuilt. Its download button appears only when the versioned PDF is present and begins with `%PDF-`.
- The ISO/IEC 27001:2022 certificate is **not included in the 25 November source upload**. Copy the real certificate unchanged to `public/docs/teecoms-iso-iec-27001-2022-certificate.pdf`; verify number `SCK/05/TIS/26/23/9804` and audit dates. Until present, download links are suppressed at build time. Never create a replacement facsimile.
- An approved SLA does not mean DigitalInvoice is authorised for NRS MBS production submissions. Independent DigitalInvoice VAPT remains in progress. The NRS portal may impose higher service levels than this subscriber SLA.
