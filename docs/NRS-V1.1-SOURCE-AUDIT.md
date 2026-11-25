> **Internal historical record — 25 November 2026:** Public NRS gap-analysis content was withdrawn. Its retained private text is in `docs/internal/NRS-V1.1-ALIGNMENT-REVIEW.md`. Any older references below to a public alignment page or PDF describe past releases, not current publication instructions.

# NRS MBS v1.1 source and implementation audit — 13 November 2026

## Evidence examined
- Official NRS v1.1 invoice schema: https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema?version=1.1
- Official System Integrator duties: https://einvoice.nrs.gov.ng/serivce-providers/system-integrators
- Official service-level reference: https://einvoice.nrs.gov.ng/serivce-level-agreement
- Official developer introduction: https://einvoice.nrs.gov.ng/docs/introduction?version=1.1
- Additional official sources: https://einvoice.nrs.gov.ng/changelog ; https://einvoice.nrs.gov.ng/docs/authentication ; https://einvoice.nrs.gov.ng/docs/system-integrator/generate-irn
- User-supplied Teecoms website archive dated 13 November 2026.
- Previously supplied DigitalInvoice PHP backend archive dated 7 November 2026 (NOT a current production snapshot); SQL structure from the same timeframe.

## Implementation findings

| NRS requirement | Source proof | Status |
| --- | --- | --- |
| UBL-style JSON invoice model / local validation | `includes/firsUblAdapter.php`, `schemas/nrs-ubl-v1.1-local.schema.json` | Local only; NRS sandbox acceptance not evidenced |
| Four invoice kinds | Local validator/schema recognise B2B/B2C/B2G/G2B, but `invoices.firs_transaction_type` is B2B/B2C only | B2G/G2B product flow absent |
| April 2026 `PARTIAL` payment | `firsUblAdapter.php` maps `partially_paid` -> `PARTIAL` | Local mapping exists; NRS payment update unverified |
| April 2026 quantity-code resource | `nrsClient.php` maps `quantity_codes` -> `invoice-quantity-codes` | Client registry only; sync not demonstrated |
| February 2026 tax categories | Generic tax category payloads and VAT setup | Tax-specific calculation/protocol unverified |
| Invoice identifiers | `nrsIrnFromIssuedInvoice` validates 8-character service ID, alphanumeric invoice number and YYYY-MM-DD date | Code exists; actual approval format with hyphens needs NRS-safe design and test |
| NRS API authentication | `nrsSandboxCurl` sets x-api-key and secret header and is subject to sandbox gate | Sandbox-gated, no live submission |
| NRS signing and stamp | `nrsEndpoint('sign')`, `nrsMockValidateSignConfirm` | Remote sandbox operation described; no verified local ECDSA/JAdES signer |
| Source identity fields | `organizations`, `organization_compliance_profiles`, invoice snapshots | Some required classification and original-credit dates are missing in current extraction |
| B2C regulatory reporting | `nrs_submission_queue`, offline dry-run worker | Scheduling metadata only; not live NRS reporting |
| Audit, MFA, ERP integration | Activity log; MFA, OAuth client credentials; signed webhooks | Code-reviewed; independent deployment/pen test unverified |
| SLA template alignment | Current public NRS SI/APP reference lists 99.9%, 24/7 support; Teecoms management-approved subscriber SLA (effective 27 Nov 2026) specifies 99.5%, staffed hours and critical 24/7 on-call | Separate NRS service-provider expectations may require stronger commitments; subscriber SLA approval is not NRS approval |

## Content changes delivered
- New published `/developers/nrs-alignment/` page, footer and hub link, and versioned technical review PDF.
- API reference updated to documentation v1.1 with newer official requirements and correct separation of ERP OAuth versus NRS API key/secret; new API PDF v1.1, retaining v1.0 as a prior snapshot.
- Invoice data-structure and security documentation updated to explain new payment, quantity, tax, invoice-kind and signature duties. **Local schema and generated fixtures remain byte-for-byte unchanged** because source backend was not modified.
- Source-archive PDF sample gallery marked published after checking all 8 PDFs and 8 PNGs exist and have correct signatures. Actual external deployment still requires checking.
- General Teecoms contact details populated from the company's previously published contact panel; no dedicated staffed support line was asserted.
- **Updated 25 November 2026:** The standard subscriber SLA was approved by management (published 25 November, effective 27 November 2026). Historical NRS 2024 reference dates remain NRS-only dates, not Teecoms dates.

## Blockers before claiming full NRS compliance
1. Confirm SI versus APP role and authorised sandbox/production onboarding credentials.
2. Bring all applicable invoice kinds, NRS tax categories, quantity codes and buyer identification rules into actual business workflows; repair known source-to-schema gaps and test with NRS-issued official data.
3. Build/test the required digital signing and transmission design (including ECDSA/JAdES where applicable); independent security review and key management evidence.
4. Verify production-host security, backups, monitoring and operational commitments under the now-approved subscriber SLA. NRS may require a separate provider-grade service commitment. Do not backdate approval, execution or assurance dates.
5. Confirm and configure the actual production Teecoms origin and DigitalInvoice API origin; build, export, test anonymously from mobile data and submit the correct permanent URLs.

## Policy on unresolved information
Historical note: earlier source updates did not infer fictitious approval dates, hosting locations or VAPT completion. On 25 November 2026, Teecoms provided an actual management-approval date and a future effective date of 27 November 2026; those dates supersede earlier SLA-draft statements, while unverified deployment details remain undisclosed.

## 13 November 2026 — Phase 5 backend/admin reconciliation (later source review)

**Additional evidence reviewed:** User-supplied `backend.zip` and `admin.zip` together with the Phase 5 changed-files package; `backend/docs/NRS-PHASE5-INTEGRATION.md`, router entries, sandbox validation, official-code preflight, resource-sync and certificate-readiness source. This update supersedes **only** the earlier source-status findings below, not any unverified provider/network test results.

| Earlier source-audit limitation | Phase 5 code now implements | What it does **not** establish |
| --- | --- | --- |
| Client-only resource registry | Platform-admin/CSRF-controlled authenticated sync for nine resources; HTTP/envelope/code checks; cache retention on failure | That provider catalogues have actually been synced in the deployment; local/manual values are not verified NRS codes |
| No authenticated sandbox validation route | Separate `POST /firs/sandbox-invoice-validate` for approved B2B/B2C invoices with `invoices.approve`, signed-in session/CSRF, local UBL and `synced` code checks | Signing, confirmation, clearance, production IRN/CSID/QR, a production submission worker, or an accepted sandbox response |
| Missing official resource comparison | Readiness result includes `official_code_preflight`: invoice type, currency, payment means, state/LGA, quantity, HS/service and tax codes | Completeness of historical data/classification snapshots or remote provider acceptance |
| No certificate readiness inspection | ECDSA X.509 public-certificate/curve/expiry/fingerprint checks and separate HSM/KMS/JAdES/enrolment blockers | A JAdES signature, secure signing key or regulator certificate approval |
| General launch readiness | Advisory production checks with separate configured production authorisation prerequisites | `production_submission_enabled` remains **false** even if advisory checks pass |
| Local readiness audits duplicated invoice payloads | New readiness and sandbox logs store digests and metadata instead of full customer invoice payloads | An audited retention/deletion policy or a production security assessment |

**Remaining blocking issues:** `INV-000001`-style issued numbers fail alphanumeric IRN preflight and require a collision-safe persisted alias; B2G/G2B product workflows, classification snapshot completeness, NRS payment-update worker, JAdES/HSM and production submission/response orchestration remain incomplete. Large NRS code-list responses above the sandbox transport's 2 MiB limit fail safely. Phase 5 offline test results are **not** evidence of actual NRS sandbox traffic or accreditation.

**Public-document changes:** API reference and v1.1 PDF, invoice data structure, architecture explanatory text, security, sample-gallery narrative, Developers hub and NRS alignment review plus its PDF have been revised to reflect Phase 5. The existing six JSON fixtures, eight visual sample PDF/PNG pairs, invoice JSON Schema, mapping CSV and diagrams remain unchanged: Phase 5 changed backend integration safeguards, not those generated sample outputs. The **management-approved subscriber SLA** is published effective 27 November 2026; **NRS production remains licence-gated**.

## 25 November 2026 — ISMS certification and SLA publication update

Teecoms management supplied ISO/IEC 27001:2022 certificate particulars (`SCK/05/TIS/26/23/9804`, issued by SCK Certifications Pvt. Ltd.; valid through 19 Nov 2029 subject to surveillance), and approved the standard SLA on 25 Nov with effect from 27 Nov 2026. The original PDF was **not** included in the website ZIP or current turn attachments: the certificate must be verified against the original and independently checked via issuer/IAF before relying on it. DigitalInvoice VAPT is in progress, not complete. Subscriber SLA approval, source code checks and ISMS certification do **not** establish NRS production licensing or operational acceptance.
