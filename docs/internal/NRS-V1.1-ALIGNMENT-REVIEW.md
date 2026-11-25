# Internal NRS v1.1 alignment review — 25 November 2026

**Internal working document. Not for publication, indexing, or submission as a public assurance statement.**

This file preserves the assessment previously displayed at `/developers/nrs-alignment/` for internal technical planning. Some references to the former public page or download are retained as historical context; the live site no longer exposes either resource.

---


# NRS MBS v1.1 alignment review

:::warning Scope of this review
This is a **technical compatibility review**, not evidence of NRS certification, a completed accreditation assessment, production connectivity or successful regulator validation. The application-side findings include the **13 November 2026 Phase 5 backend/admin update**, reviewed from the supplied source and offline test suite; they are not a claim about a newer production deployment. NRS requirements are based on the public official pages reviewed **13 November 2026**. Items marked **Gap**, **Planned** or **Requires verification** are not implemented/verified assurances.
:::

## Official documentation and latest changes

The official documentation displays **API v1.1**. The published [API changelog](https://einvoice.nrs.gov.ng/changelog) contains entries for **April 2026**, **February 2026**, **December 2025**, **November 2025**, **October 2025** and **April 2025**. Its announced updates are described as optional for an initial three-month period after their respective release dates; integrators must check the latest effective requirements and official code lists before connecting. An additional cross-border schema is announced but its implementation timeline remains pending.

| Source | Why it matters |
| --- | --- |
| [NRS v1.1 introduction](https://einvoice.nrs.gov.ng/docs/introduction?version=1.1) | Documentation version and integration overview |
| [NRS invoice schema](https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema?version=1.1) | UBL invoice fields and `/api/v1/invoice/validate` requirements |
| [NRS API changelog](https://einvoice.nrs.gov.ng/changelog) | New classifications, taxes, payment status and quantity resources |
| [System Integrator responsibilities](https://einvoice.nrs.gov.ng/serivce-providers/system-integrators) | ERP mapping, secure transmission, digital signatures and audit |
| [NRS service-level reference](https://einvoice.nrs.gov.ng/serivce-level-agreement) | Reference service levels for service providers; not an executed Teecoms contract |
| [NRS authentication](https://einvoice.nrs.gov.ng/docs/authentication) | NRS `x-api-key` and `x-api-secret` headers; distinct from DigitalInvoice ERP OAuth |
| [IRN construction guide](https://einvoice.nrs.gov.ng/docs/system-integrator/generate-irn) | Invoice number, NRS-assigned service ID and issue date |

## Requirement-by-requirement crosswalk

| NRS requirement / update | DigitalInvoice source finding | Current status and action |
| --- | --- | --- |
| UBL JSON/XML interoperability; validate endpoint | PHP UBL-style JSON projection, local schema, official-code preflight and gated sandbox `/validate` browser route are implemented; XML output is not evidenced | **Partial:** authorised remote sandbox acceptance has not been demonstrated; local schema is **not** the official NRS schema |
| Business ID and IRN | Code requires an NRS-assigned business UUID and service ID and can construct an IRN from invoice number, service ID and issue date | **Licence-gated:** valid identifiers cannot be invented; confirm invoice-number format and assigned credentials |
| Invoice kinds: B2B, B2C, B2G, G2B (Dec 2025) | Local schema and validator recognise all four; current invoice UI/database selection and queue cover B2B/B2C only | **Gap:** B2G and G2B are **not** end-to-end workflow support |
| Payment-status update `PARTIAL` (Apr 2026) | Local adapter maps `partially_paid` to `PARTIAL` and schema admits it | **Partial:** mapping exists; NRS `/update` payment reporting from the live workflow is not implemented/verified |
| Quantity-code resource (Apr 2026) | Phase 5 implements authenticated sandbox reference sync and `synced`-only preflight for `quantity_codes` and eight other catalogues | **Implemented in code, unverified externally:** no proof that real provider catalogues were retrieved or that historical invoice codes match |
| Tax categories `Withholding_Tax`, `Stamp_Duty`, `Exempted` (Feb 2026) | Generic tax-category projection and a local VAT-focused setup exist | **Gap:** no evidence that these three tax categories are configured, calculated and validated end to end; do not map them blindly |
| Buyer incorporation number fallback (Oct 2025) | Buyer TIN fields exist; no verified rule for the official incorporation-number fallback or foreign buyer scenarios | **Requires verification:** normalise and validate against current NRS rules with actual taxpayer data |
| Supplier and buyer state/LGA (Apr 2025) | Database has NRS location snapshots; Phase 5 supports authenticated `states`/`lgas` sync and comparison against `synced` codes | **Partial:** live catalogue sync and historical field completeness have not been evidenced |
| IRN generation format | `nrsIrnFromIssuedInvoice` enforces alphanumeric invoice number, 8-character service ID and date; Phase 5 rejects issued values such as `INV-000001` before a sandbox call | **Blocking gap:** design a persisted collision-safe NRS alias and reconciliation, not silent punctuation stripping |
| NRS authentication | Sandbox client sends `x-api-key` plus `x-api-secret` (configurable documented alternative), only to the approved sandbox host | **Sandbox-controlled:** no public credentials or production submission |
| Cryptographic stamp/signing; ECDSA/JAdES | Phase 5 inspects ECDSA X.509 public certificates and reports certificate/HSM/JAdES/enrolment readiness; the client retains a sandbox `sign` operation | **Gap:** no functioning JAdES signer, protected signing service or NRS certificate enrolment evidence |
| Signing, confirmation, transmission and fiscal reporting | Local queue and offline dry-run worker exist; Phase 5 production readiness review always reports `production_submission_enabled: false` | **Licence-gated:** no production worker, clearance or NRS-confirmed IRN/CSID/QR |
| Audit trails and role-based access | Organisation-scoped workflows, audit activity records, webhook logs, and MFA exist | **Implemented in supplied code;** independent operational testing is still needed |
| SLA service levels | Management-approved Teecoms subscriber SLA effective 27 Nov 2026: 99.5% monthly availability, staffed support hours and Severity 1 on-call | **Alignment gap:** NRS SI/APP reference lists 99.9%, 24/7 support and faster incident targets; do not claim equivalence without separate NRS approval |

:::info Payment and classification precision
The **local JSON Schema accepting a value is not proof that the DigitalInvoice product can originate, manage, report and reconcile that transaction with NRS**. Similarly, a now-implemented authenticated sync route does not mean current official data was actually fetched or cached on the deployed service. Local `ready` and `submitted`-like labels cannot be used as evidence of an NRS response.
:::

## Phase 5 implementation delta — what changed

| Capability | Implemented in the 13 November 2026 source | Evidence still required |
| --- | --- | --- |
| Authenticated code-list sync | Platform permission/CSRF-protected `Sync NRS` action for nine supported sandbox catalogues; invalid provider responses preserve the old cache | Saved approved sandbox credentials, successful authorised fetches and comparison to current official code lists |
| Approved-invoice code checks | `official_code_preflight` rejects missing or manual catalogues, invalid quantity/HS/service/tax/location values | Complete frozen invoice snapshots and real synced lists for all required codes |
| NRS sandbox validation | Separate `invoices.approve`-restricted `/firs/sandbox-invoice-validate` operation calls sandbox `/validate` only after local checks | Official sandbox request/response acceptance and permission/CSRF tests in staging; no response is production clearance |
| Certificate and activation review | Inspects ECDSA X.509 certificate public information and reports HSM/KMS, JAdES, enrolment and production authorisation gaps | Approved signer, independent interoperability testing, NRS-issued certificate/credentials and licensed production worker |
| Audit payload minimisation | Readiness and sandbox operation logs store metadata, counts and digests instead of full invoice/customer payloads | Production configuration review, log-access tests and retention evidence |

:::warning External test result has not been supplied
The Phase 5 offline unit suites passed in the implementation delivery. No authenticated NRS sandbox response, accreditation, signature, production transaction or regulator acceptance was included. The rollout must remain fail-closed.
:::

## Mandatory fields and numerical consistency

The [NRS v1.1 invoice schema](https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema?version=1.1) identifies `BusinessID`, `IRN`, `IssueDate`, `InvoiceTypeCode`, `InvoiceKind`, document and tax currency, supplier party, tax total, legal monetary total and invoice lines as core invoice data. The DigitalInvoice local schema maps these with **snake_case JSON** fields. The official API, not this local JSON Schema, remains the acceptance authority.

Amounts are represented as decimal financial values and reconciled in integer kobo in the PHP adapter. NRS monetary totals require accurate line-extension, tax-exclusive, tax-inclusive and payable calculations. The existing downloadable examples remain **fictional local fixtures**, not NRS-validated examples; no stored database values or real customer details are exported.

The downloaded [DigitalInvoice invoice schema](/docs/digitalinvoice-invoice-schema-v1.0.json), [field mapping](/docs/digitalinvoice-field-mapping-v1.0.csv) and [sample payloads](/developers/data-structure/) are local versioned artifacts. **Do not replace them with invented fields or numbers simply to make them resemble an official response.**

## Service-level comparison and management decision

The [NRS published SI/APP template](https://einvoice.nrs.gov.ng/serivce-level-agreement) lists **99.9% availability**, **24/7 support**, critical response **30 minutes** / resolution **1 hour**, high-priority response **1 hour** / resolution **4 hours**, and normal response **4 hours** / resolution **8 hours**. Its visible reference dates are **1 October 2024** (effective) and **10 October 2024** (updated). These dates belong **to NRS's template**, not Teecoms' agreement.

The [Teecoms SLA](/sla/) is **approved for publication**, with effect from **27 November 2026**. Its 99.5% availability commitment does **not** automatically satisfy NRS's separate SI/APP 99.9% reference template; service-provider category and any distinct NRS commitments must still be confirmed during accreditation. Teecoms reports ISO/IEC 27001:2022 ISMS certification (**SCK/05/TIS/26/23/9804**, [certificate](/docs/teecoms-iso-iec-27001-2022-certificate.pdf)) as **obtained**. Independent DigitalInvoice **VAPT remains in progress**. Neither establishes live NRS production accreditation.

## Pre-production blockers and ownership

1. **Integration engineering:** Complete the required B2G/G2B workflows and new tax/identification rules; run authenticated code-list sync with approved credentials; repair invoice classification and historic snapshots; design persistent collision-safe NRS invoice aliases; implement payment-update and response reconciliation.
2. **Signing and security:** Assign SI/APP signing responsibilities, provision approved HSM/KMS custody, implement/test JAdES and certificate enrolment, and validate recovery/revocation. The Phase 5 public-certificate inspector is not a signer. VAPT is in progress; describe it as complete only after the signed final report and retest letter are available.
3. **Regulatory access and testing:** Obtain authorised NRS sandbox and applicable service-provider credentials; test actual reference sync and B2B/B2C validation with approved test invoices; then sign/confirm/report, error/retry, IRN/CSID/QR and reconciliation scenarios before any independently reviewed production activation.
4. **Service operations:** Assess the approved SLA against NRS's separate service-provider reference and retain evidence of support coverage, hosting, backup/restore and operational controls. Verify hosting/data region, encryption-in-transit and actual backup/restore performance from deployment evidence.
5. **Publishing:** Confirm the exact production website/API origin, test all [documentation downloads](/developers/), and supply the NRS portal with public links only after the required approvals.

:::warning Dates and approval evidence
Original technical review: **13 November 2026**; service/certification update: **25 November 2026**. A 2024 example date in the NRS template or fictional tests does **not** authorize backdating a Teecoms agreement, pretending a 2025 security audit happened, or listing an unapproved production service as active. The SLA was approved by management on 25 November 2026 and takes effect on 27 November 2026; these dates must not be confused with NRS's template dates.
:::

## Documentation update record

**13 November 2026 — v1.1 alignment review, Phase 5 revision:** Added the verified backend/admin source delta for guarded sandbox sync, official-code preflight, approved-invoice sandbox validation, certificate inspection and fail-closed production review. Earlier source gaps are retained where no actual production feature or external evidence exists. This remains a technical comparison, **not a regulatory approval or legal opinion**.

**25 November 2026 — certification and SLA publication update:** Management-approved standard SLA dated 27 November 2026; ISO/IEC 27001:2022 certificate particulars recorded; independent VAPT still in progress, and NRS production accreditation remains pending.
