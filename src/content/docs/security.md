---
title: Security and compliance overview
description: A source-reviewed overview of DigitalInvoice's authentication, authorisation, encryption, audit and NRS assurance status.
version: 1.1
effective:
updated: 2026-11-25
status: published
pdf:
---

# Security and compliance overview

## Scope, evidence and assurance status

This overview describes security mechanisms identified in the DigitalInvoice application code reviewed in November 2026, including the **13 November 2026 NRS Phase 5 backend/admin changes**. Source review demonstrates implemented controls, but is **not** a production penetration test, deployment audit or NRS licence. The ISO/IEC 27001:2022 management-system certification described below is separate from application penetration testing and NRS accreditation. Actual production TLS configuration, hosting provider, data location and backup evidence still require deployment-level verification.

:::warning Accreditation status
Teecoms Integrated Solutions Limited **is certified to ISO/IEC 27001:2022** for its Information Security Management System (certificate SCK/05/TIS/26/23/9804). **No NRS MBS production licence, completed independent DigitalInvoice VAPT or live NRS production connection is claimed.** NRS production submission remains blocked until authorised licensing and review.
:::

## ISO/IEC 27001:2022 certification

Teecoms Integrated Solutions Limited **is certified to ISO/IEC 27001:2022** for its Information Security Management System (ISMS). Certificate SCK/05/TIS/26/23/9804 was issued by SCK Certifications Pvt. Ltd.; its validity is subject to surveillance audits. Certificate information can be checked through the issuer and the IAF CertSearch register. Certification of the organisation's ISMS is **not** itself proof that DigitalInvoice has passed an independent penetration test or received an NRS MBS production licence.

| Certificate detail | Certificate information |
| --- | --- |
| Certified organisation | Teecoms Integrated Solutions Limited, No. 12 Olayiwola Liasu Street, Polar Bed, along Sadiku Road off Oshodi Apapa Expressway, Lagos, Nigeria |
| Standard | ISO/IEC 27001:2022 — Information Security Management System |
| Certificate | **SCK/05/TIS/26/23/9804** |
| Issuing body | **SCK Certifications Pvt. Ltd.** |
| Initial registration | **20 November 2026** |
| First surveillance | **20 October 2027** |
| Second surveillance | **20 October 2028** |
| Expiry | **19 November 2029**, subject to successful surveillance audits |
| Statement of Applicability | SOA/TIS/Ver.1.0/Rev.00, dated 10.07.2026 |

**Certified scope:**

> Provision of IT Infrastructure and Connectivity Services, Software and Application Development, Design and Development of Computer Hardware and Software, Scientific, E-Invoicing and Technological Services, Cloud and Hosting Services, Cybersecurity and Technology Assurance, Managed ICT Services, Digital Transformation and Technology Advisory, Project Implementation Support, and ICT Training and Capacity Building

[Download ISO/IEC 27001:2022 certificate](/docs/teecoms-iso-iec-27001-2022-certificate.pdf) · Verify the record using [SCK Certifications](https://www.sckcerts.com/) and the [IAF CertSearch](https://www.iafcertsearch.org/). The download link is enabled only when the source certificate PDF is present and valid at build time.

**Independent DigitalInvoice VAPT:** In progress. A signed assessment and retest report will be made available when complete. This status does not constitute a completed independent assessment.

## Identity and authentication

### Browser sessions and CSRF protection

DigitalInvoice uses signed **JWT access tokens** within browser session cookies, paired with rotating refresh-session records. The server binds access tokens to database-backed sessions and checks expiry, account state and authentication version. Access and refresh cookies are `HttpOnly`; cookie `Secure` defaults on outside local/development mode and SameSite is configurable. Cross-site request forgery checks compare a request token against a CSRF cookie for state-changing requests. Session idle and absolute timeouts are configurable.

Passwords are stored using PHP's `password_hash` / `password_verify` scheme (`PASSWORD_DEFAULT`, **bcrypt in the supplied PHP 8.2 runtime**). Password reset flows use time-limited, hashed reset tokens; the exact algorithm can evolve with the PHP runtime. No plaintext-password retention is claimed.

### Multi-factor authentication

Authenticator-based MFA implements **six-digit TOTP** with 30-second steps and HMAC-SHA1, corresponding to the RFC 6238 family of algorithms. Secrets are encrypted before storage using AES-256-GCM; one-time recovery codes are stored as hashes. The verifier rejects replay of already-used TOTP time steps and limits sensitive operations. MFA enforcement is enabled by default for privileged owner, administrator and platform-admin accounts (including active platform staff), subject to the configured policy start, grace period and explicit policy switches. Users who require enrolment may access only a restricted self-service set of routes until setup is complete.

### Google sign-in and machine credentials

Optional Google sign-in verifies a Google-signed ID token server-side, including the intended client audience, and respects account linking and MFA policy. ERP integrations use a **separate OAuth 2.0 client-credentials flow**. The client secret and issued bearer tokens are represented by SHA-256 digests in the database, not recoverable plaintext tokens. Tokens have configurable short lifetimes (five to fifteen minutes in the reviewed code), are limited to granted read scopes and are bound to an enabled organisation. ERP bearer tokens do not grant the external NRS production write interface.

## Access control and tenant isolation

Application requests apply organisation membership, user roles, permissions and subscription/feature entitlements. Protected requests check whether the user and organisation remain active and reject stale authentication versions. ERP data reads resolve organisation identity from the authenticated client token, instead of trusting a caller-supplied organisation ID. Webhook administration is restricted to organisation owners and administrators. Database queries generally use prepared SQL statements and include organisation-level constraints for affected records.

:::info Important limitation
These are controls observed in source code. A complete tenant-isolation audit, database permission review and adversarial authorisation test in the deployed environment have **not** been supplied as completed evidence.
:::

## Transport security and integration boundaries

Production-mode API requests require **HTTPS** by default; secure responses include HSTS when the server recognises HTTPS (`max-age=15552000; includeSubDomains`). Other configured response headers include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` and no-store cache directives. Browser CORS origins are restricted by the server's configured allowlist. The minimum TLS version, certificate renewal, edge proxy headers and actual public-site HSTS behaviour must be checked at deployment; **TLS 1.2+ has not been independently proven by source review alone**.

Outbound ERP webhooks use **public HTTPS hosts on port 443**, validate resolved IPv4 addresses against non-public ranges, disable redirects, and pin DNS resolution for a request. Each payload is signed using **HMAC-SHA256** over the timestamp and raw JSON body; downstream receivers should validate the signature and apply a timestamp tolerance to resist replay. Deliveries use database-backed outbox records with status and retry handling. Inbound Paystack callbacks require provider signature verification. The API exchanges data with configured email and payment services; provider assurances and region controls are not certified by this document.

## Secrets, encryption and token handling

Designated integration credentials and MFA authenticator seeds use **AES-256-GCM authenticated encryption**, with per-record nonces and authenticated associated data. The backend contains key-version and rotation utilities for these encrypted fields. Passwords are one-way hashed; ERP client secrets, bearer tokens and certain single-use tokens are SHA-256 hashed before persistence. Session cookies and scope restrictions reduce exposure of reusable credentials. The code does **not** establish that every database column, server disk, backup, or third-party copy is encrypted at rest.

The NRS sandbox client requires an explicitly enabled sandbox state, a server-allowlisted HTTPS hostname, appropriate credentials, peer-certificate verification and a server-side feature flag. Phase 5 adds **single-catalogue authenticated resource synchronisation** and permission-controlled approved-invoice sandbox validation, both under that gate. It does **not** provide a general production submission channel or accept arbitrary endpoints. Failed catalogue responses preserve the old cache. Phase 5 audit entries for readiness/sandbox operations retain digests, counts and status metadata rather than copying invoice payloads, customer PII or credentials into the API log.

## Auditability, document evidence and availability

DigitalInvoice logs relevant account, invoice, payment, subscription and integration actions with event metadata. ERP webhook events and delivery attempts have persistent outbox/history records. The NRS queue stores due times, retry-plan metadata, dry-run events and overdue markers for simplified B2C invoices. **The NRS queue worker is offline-only today**: dry-running does not transmit documents or generate genuine IRN/CSID/QR evidence. The PDF/document evidence adapter only exposes verified production credentials when the corresponding production confirmation record is complete.

Implemented data structures support audit trails, but retention duration, independent log monitoring, central SIEM, backup schedules, restore tests, incident-response drills, RPO/RTO and 24/7 operational staffing are **not verified by the supplied code**. The [approved SLA](/sla/) takes effect on **27 November 2026**; stated service objectives are contractual commitments from the applicable commencement date, not independent evidence that the controls have already been exercised or verified.

## Data protection and Nigerian regulatory alignment

DigitalInvoice's privacy and security design should be assessed against the **Nigeria Data Protection Act 2023 (NDPA)** and applicable NRS e-invoicing requirements. Customer and invoice records can contain personal and business information, and processing must follow approved lawful purposes, appropriate access controls, processor agreements, retention policies and rights-handling procedures. This page makes **no independent claim of NDPA certification or completed regulatory compliance assessment**.

Data controller/processor responsibilities, privacy notices, international transfers, data hosting location, retention periods, backup storage, breach-notification procedures and any required regulator notifications remain subject to organisation policy, legal review and contract confirmation. The notification timetable in the [SLA](/sla/) is a contractual requirement from its effective date; it is not evidence that an incident-response exercise has already been completed.

## Assurance programme and unresolved items

| Item | Status at 25 November 2026 | Next evidence needed |
| --- | --- | --- |
| MFA, JWT/CSRF, role enforcement and scoped ERP access | Implemented in reviewed source | Independent deployment and negative-path verification |
| Encrypted MFA seeds and selected NRS/integration credentials | Implemented in reviewed source | Key custody, rotation and disaster-recovery evidence |
| HTTPS/HSTS policy in API source | Implemented conditionally | Production TLS report and response-header review |
| NRS client and invoice preflight | Local validation, authenticated sandbox sync path, official-code preflight and gated sandbox `/validate` route implemented | Real authorised resource responses and sandbox validation; correct historical invoice fields and IRN aliases |
| ECDSA certificate inspection | X.509 public-key/curve, validity and fingerprint inspection implemented; **no signing** | Approved HSM/KMS custody, JAdES interoperability, NRS certificate enrolment and real signing tests |
| NRS clearance, reporting and production IRN/CSID/QR | **Licence-gated / not live**; activation preflight always leaves sending disabled | NRS authorisation, production worker and verified production responses |
| Independent DigitalInvoice VAPT | **In progress** | Signed report, remediation and retest letter to be available on completion |
| ISO/IEC 27001 certification | **Certified: ISO/IEC 27001:2022, certificate SCK/05/TIS/26/23/9804, valid to 19 Nov 2029 subject to surveillance** | [Certificate (download)](/docs/teecoms-iso-iec-27001-2022-certificate.pdf) · verify at [sckcerts.com](https://www.sckcerts.com/) / [iafcertsearch.org](https://www.iafcertsearch.org/) |
| Hosting provider, geographic data location and backup controls | **Not independently evidenced** | Hosting agreements, region and restore evidence |
| Business continuity, incident handling and privacy governance | **Operational evidence pending** | Approved policies, owners, exercises and records |

## NRS signing, JAdES and ECDSA boundary

NRS's [System Integrator guidance](https://einvoice.nrs.gov.ng/serivce-providers/system-integrators) describes cryptographic signing based on **ECDSA** and **JAdES** for JSON e-invoices. **HMAC-SHA256 ERP webhook signatures are not NRS JAdES signatures.** The sandbox client defines a *remote* `sign` operation, and Phase 5 adds **ECDSA X.509 certificate inspection** (curve, dates, fingerprint) plus advisory checks for HSM/KMS custody, independent JAdES testing and NRS certificate enrolment. **No signing service, JAdES message or non-exportable production key-custody integration is provided by these checks.**

Production activation depends on an agreed division of responsibility between the System Integrator, an authorised Access Point Provider and NRS, together with authorised credentials, certificate enrolment, signature interoperability tests, replay protection and auditable confirmation evidence. The [implementation timeline](/developers/timeline/) describes the testing and licensing dependencies.


## Reporting concerns and related documents

For security or privacy concerns, use the verified contact options on the [Teecoms contact page](/#contact); use **info@teecomsintegratedsolutions.ng** or **+2347038020088** for initial security reporting; a dedicated staffed security mailbox has not been verified. Do not include credentials, token values or customer personal data in a public report.

Read the [system architecture](/developers/architecture/) for trust boundaries, [API documentation](/developers/api/) for OAuth and webhooks, [invoice schema](/developers/data-structure/) for the local UBL-style mapping, and [the approved SLA](/sla/) for service terms effective 27 November 2026.

**Documentation revision — 25 November 2026:** Recorded Teecoms' ISO/IEC 27001:2022 certification particulars and DigitalInvoice VAPT as in progress. Phase 5 sandbox and signing-readiness boundaries remain unchanged; NRS production licensing is still pending.
