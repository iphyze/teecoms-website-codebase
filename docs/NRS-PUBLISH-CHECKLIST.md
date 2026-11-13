# DigitalInvoice documentation — D8 publication and NRS submission checklist

**Owner:** Teecoms Integrated Solutions Limited  
**Prepared:** 7 November 2026; **NRS v1.1 review:** 13 November 2026  
**Scope:** Teecoms documentation website, not the DigitalInvoice API or NRS production activation.  
**Site domain:** **[CONFIRM: actual public Teecoms HTTPS domain]**. Never use `localhost`, the DigitalInvoice API hostname, or a guessed domain in an NRS portal field.

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
| NRS v1.1 alignment | `/developers/nrs-alignment/` | Published technical review | Read the gap list: this is not certification or an implementation sign-off |
| Service Level Agreement | `/sla/` | **Draft** | Management/legal approval, executed PDF, confirmed details, `status: approved`, rebuild |

**Blocking:** A draft SLA is not an executed SLA. The sample gallery is now source-marked `published` after all 16 files were confirmed in the archive; production reachability remains untested. Do not submit the final SLA link as if the agreement were approved. NRS production submissions and official verification remain licence-gated.

### Source checks before changing status

- Verify that the corrected D5 generator was rerun and its new PDFs/PNGs were recopied into **the Teecoms website's** `public/docs/samples/`, not just generated in the DigitalInvoice application. Each of the 8 documents needs a corresponding PDF and PNG, 16 total. Open all PDFs; check the actual wording in the *files*, not only the website cards.
- Keep fictional example names/amounts and explicit **MOCK** IRN/CSID/QR descriptions. Do not replace them with customer records or pretend they were issued by NRS.
- The sample Markdown is now `status: published`, and the static build guards against missing/corrupt sample pairs. Retain its fictional/test-data disclaimers and check PDF/PNG previews on the actual deployed host.
- For the SLA follow the complete signed-approval process in the D2 section of `docs/BUILD-GUIDE.md`: resolve required `[CONFIRM]` values, finalise terms, sign/approve, put the real signed PDF at the versioned path, set the agreed effective date, and switch `status: approved`. Never generate a fake signature or treat `noindex` as access control.
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

The checker verifies exported HTML/canonical metadata, sitemap and robots, versioned PDF/JSON/CSV/SVG files, sample file signatures when published, approved SLA PDF when required, and the presence of the PHP mailer's access guard. It uses only Node built-ins; no extra dependency is introduced. An exit code other than zero means **do not deploy that output**.

For an NRS submission gate, after resolving approval blockers:

```powershell
node scripts/verify-docs-release.mjs local --nrs
```

The `--nrs` flag requires the samples page to be published, the SLA to be approved, and the API source to contain no `[CONFIRM: ...]` placeholders. This is a deployment-readiness guard, **not** a guarantee of regulator acceptance.

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
  developers/nrs-alignment/index.html
  sla/index.html
  docs/digitalinvoice-api-documentation-v1.1.pdf
  docs/digitalinvoice-invoice-schema-v1.0.json
  docs/digitalinvoice-field-mapping-v1.0.csv
  docs/sample-payloads/                 (6 JSON files)
  docs/samples/                         (8 PDFs + 8 PNGs when copied)
  docs/diagrams/                        (SVGs + Mermaid sources)
  docs/digitalinvoice-architecture-v1.0.pdf
  docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf
  docs/teecoms-digitalinvoice-sla-v1.0.pdf  (ONLY when signed/approved)
  sitemap.xml
  robots.txt
  api/contact.php                       (existing PHP contact endpoint)
  api/.htaccess                         (access control for server-only mail configuration)
```

The approved SLA's PDF is intentionally absent until it exists and has been reviewed. `public/docs/samples/` is an *input* to the build; verify the corresponding output under `out/docs/samples/` after building. The build-time environment is baked into HTML, including canonical URLs: **changing `.env` after building does not fix an existing export**.

## 3. Deploy using cPanel

1. Confirm the exact domain, DNS, active SSL/TLS certificate and document root in cPanel. Use the web root for the actual Teecoms domain (often `public_html/` for the primary domain; addon/subdomains can differ). **Do not guess the root.**
2. Backup the currently serving site and its existing PHP contact/mailer setup. Preserve a tested rollback archive *privately* before replacing the public website.
3. Upload **the contents of `out/`**, not the `out` directory itself, to the correct document root. Preserve the `developers/`, `sla/`, `docs/` and `api/` directory structures. Apache must serve `index.html` at trailing-slash URLs such as `/developers/api/`; verify that in a private window. Do not deploy project sources (`src/`, `node_modules/`, database dumps, backend archives or development `.env` files).
4. Confirm `public/api/.htaccess` has been copied as `out/api/.htaccess` and remains active after upload. The Teecoms build may generate **`out/api/env.php` containing SMTP credentials**; this must be handled as a confidential server-side file, not shared in a downloadable site archive or public repository. Confirm the host executes PHP and **cannot serve PHP source code or mailer settings as plain text**. Prefer managing secrets outside the public web root if supported by your hosting arrangements.
5. Verify any existing `index.html`/`.htaccess` rules do not redirect clean documentation routes to the homepage or an authentication screen. If `https://domain/developers/api/` is 404, check the document root, uploaded `developers/api/index.html` and Apache directory-index configuration before introducing rewrite rules.
6. Verify the contact form separately (PHP version, SMTP transport, anti-spam token and actual test delivery). A successful static docs check does not prove the contact form works.
7. Keep the last functioning deployment and its configuration available for quick rollback. Do not delete the old versioned document downloads that NRS or existing users may have bookmarked.

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
curl.exe -I "$site/developers/nrs-alignment/"
curl.exe -I "$site/sla/"
curl.exe -I "$site/docs/digitalinvoice-api-documentation-v1.1.pdf"
curl.exe -I "$site/docs/digitalinvoice-invoice-schema-v1.0.json"
curl.exe -I "$site/docs/digitalinvoice-field-mapping-v1.0.csv"
curl.exe -I "$site/docs/digitalinvoice-architecture-v1.0.pdf"
curl.exe -I "$site/docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf"
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
| Service Level Agreement | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/sla/` | `/docs/teecoms-digitalinvoice-sla-v1.0.pdf` **only after signing** |
| API documentation | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/api/` | `/docs/digitalinvoice-api-documentation-v1.1.pdf` |
| Data structure / schema | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/data-structure/` | `/docs/digitalinvoice-invoice-schema-v1.0.json`, `/docs/digitalinvoice-field-mapping-v1.0.csv` |
| Visual PDF samples | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/samples/` | Individual fictional sample PDFs on the gallery |
| System architecture | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/architecture/` | `/docs/digitalinvoice-architecture-v1.0.pdf` |
| Security and compliance overview | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/security/` | Page content and supporting diagrams |
| NRS v1.1 alignment review | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/nrs-alignment/` | `/docs/digitalinvoice-nrs-v1.1-alignment-review-2026-11.pdf` — **technical gap assessment only** |
| Developer index / optional extra link | `https://YOUR-VERIFIED-TEECOMS-DOMAIN/developers/` | Links to all published evidence |

In the NRS portal, use **the page URLs** where the field requests a link, and the corresponding versioned files where it specifically asks for a direct document URL. Do not send a localhost URL or draft/unsigned SLA as an executed agreement. Portal field names and acceptance rules should be checked against your current NRS account/rejection notice; this checklist does not assert those current field names.

## 6. Final manual sign-off record

- [ ] Verified real domain, API origin and support contact; no misleading placeholders in submitted API documentation
- [ ] Management/legal approval and executed SLA PDF (or an explicitly accepted alternative confirmed by NRS)
- [ ] Eight current sample PDFs and eight corresponding PNGs visually inspected and published
- [ ] API PDF, schema JSON, mapping CSV, fixtures, A3 architecture PDF and SVGs open publicly
- [ ] NRS licence / production integration described accurately; no false accreditation or validation claims
- [ ] Static `npm run build` successful in the Teecoms project
- [ ] `verify-docs-release.mjs local --nrs` passed
- [ ] cPanel upload correctly placed inside actual site document root; server-side mail secrets protected
- [ ] `verify-docs-release.mjs live https://EXACT-DOMAIN --nrs` passed
- [ ] Real phone/mobile-data and private-browser test passed; no login required
- [ ] HTTPS certificate, canonical URLs, sitemap, robots, download MIME and browser print checked
- [ ] Screenshots/release date, reviewer, URLs and rollback location recorded privately

**Deployment date/time (WAT):** __________________  
**Reviewer:** __________________  
**Public host:** __________________  
**Result / outstanding items:** __________________

**Do not mark D8 as publicly deployed or NRS-submitted merely because this checklist or verification script has been delivered.**


## 7. NRS public v1.1 review (13 November 2026)

The new [NRS alignment page](/developers/nrs-alignment/) and versioned PDF document the official API v1.1 changes through April 2026 and identify the remaining implementation gaps. Read `docs/NRS-V1.1-SOURCE-AUDIT.md` before submitting a claim of compliance. The review compares the **7 November 2026 supplied DigitalInvoice backend** with the **13 November 2026 public NRS source**, not a later live system.

- Do **not** state that B2G/G2B are available merely because the local schema accepts the enum. The current invoice workflow supports B2B/B2C.
- `PARTIAL` and quantity-code endpoint wiring exist in the reviewed backend, but licensed NRS payment updates, official resource synchronisation and production sender do not. The 2026 tax-category additions have not been demonstrated end to end.
- The NRS SI guidance describes ECDSA/JAdES; DigitalInvoice's signed ERP webhooks are HMAC and **not equivalent**. An authoritative signing design and security verification remain to be delivered.
- The NRS SLA template's 99.9% uptime / 24/7 response model is **different** from the unsigned Teecoms draft's 99.5% / staffed-hours proposal. Do not silently replace it without the people and operational systems needed to honour it.
- NRS's published template dates of October 2024 must **not** be reused as Teecoms agreement or review dates. The real SLA effective date follows actual approval/execution.
- The contact address `info@teecomsintegratedsolutions.ng` and telephone `+2347038020088` are drawn from the Teecoms contact details previously displayed publicly. Verify reachability before NRS submission; do not claim a dedicated staffed hotline is live.

The `--nrs` verifier continues to **fail until the SLA is genuinely approved**. This is intentional. Never weaken it to bypass legal or regulatory sign-off.

## Phase 5 technical-status note — 13 November 2026

The Teecoms public API and alignment documents now describe the **separate** DigitalInvoice NRS Phase 5 backend/admin code. Deployment of the documentation does not deploy the Phase 5 application package. Before relying on the updated descriptions, confirm the corresponding Phase 5 PHP/admin changed files were installed and pass their offline tests in the DigitalInvoice application.

- **Implemented in code only:** authenticated NRS sandbox reference synchronisation, official-code preflight, approved B2B/B2C invoice sandbox `/validate` route, public ECDSA certificate inspection, readiness blockers and redacted sandbox/readiness audit summaries.
- **Not evidenced:** real official resource sync, accepted NRS sandbox test, JAdES signature generation, protected HSM/KMS signer, licence, production sender, NRS-confirmed invoice clearance or production IRN/CSID/QR.
- **Still blocking:** hyphenated approved invoice numbers requiring persisted collision-safe aliases; incomplete goods/service classifications and historical snapshots; B2G/G2B workflows, payment updates and NRS response reconciliation.
- **Sample assets:** Keep the same eight fictional PDF/PNG pairs and six local UBL JSON fixtures; Phase 5 did not change their generators or validate them remotely. Never relabel mock verification fields as NRS-issued evidence.
- **SLA/approval:** Continue to label `/sla/` as draft until genuinely executed; do not backdate approval or enable production transport through a documentation publication action.

After rebuilding Teecoms, run the local release-verifier command and independently open the updated v1.1 API and alignment PDFs from the public HTTPS website. The test measures **static-site publication**, not NRS interoperability or licensing.
