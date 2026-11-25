---
title: System architecture and data flow
description: DigitalInvoice application architecture, security trust boundaries, ERP integration and licence-gated NRS transaction flows.
version: 1.1
effective:
updated: 2026-11-25
status: published
pdf: /docs/digitalinvoice-architecture-v1.0.pdf
---

# System architecture and data flow

## Scope and deployment status

DigitalInvoice is a multi-organisation invoicing application. Its browser-based React interface communicates with a PHP API backed by a relational database. It includes invoices, approvals, credit notes, payments and supporting documents. A separate, scoped ERP integration API and outbound webhook service allow authorised business applications to read records and receive event notifications.

:::info How to read the diagrams
**Implemented** indicates a path or control present in the reviewed application source, not independent verification of a live deployment. **Sandbox-gated** indicates an optional NRS request path which requires explicit server-side approval and authorised credentials. **Future / licence-gated** indicates a process described by the MBS model which is **not** an enabled production transport in DigitalInvoice. Sequence diagrams of NRS exchanges are target workflows, **not** evidence of successful clearance, signing, transmission or receipt.
:::

The diagrams are public system-design overviews. They intentionally omit credentials, private network addresses, infrastructure topology, internal file paths and customer records. They are based on the DigitalInvoice service and document generator, including **Phase 5 changes reviewed 13 November 2026**. Hosting provider, geographical data location and independent production verification remain unconfirmed.

## Layered system and trust boundaries

![Layered DigitalInvoice system architecture: browsers, PHP API, database, ERP applications, third-party providers and licence-gated NRS service](/docs/diagrams/digitalinvoice-system-architecture-v1.0.svg)

The **browser boundary** separates end-user devices from the application API. Browser requests use HTTPS in production and protected session cookies, with CSRF checks for state-changing operations. The **integration boundary** separates external ERP clients, whose short-lived bearer tokens are scoped to one organisation, from browser sessions. The **data boundary** encloses the API's database access, organisation-scoped records, audit events and selected AES-256-GCM-encrypted secrets. The **third-party boundary** covers external services: Google identity verification, Paystack payment processing, email delivery and approved webhook receivers. The **NRS boundary** is separate and remains licence-gated for production.

| Connection | Purpose | Implemented protection / limitation |
| --- | --- | --- |
| Browser ↔ DigitalInvoice API | Invoices, approvals and account access | HTTPS requirement outside local mode, Secure/HttpOnly session cookies where applicable, JWT session binding, CSRF checks and role/organisation checks |
| ERP client → integration API | Read-only customer, invoice, item, credit-note, payment and NRS status data | HTTPS deployment requirement, OAuth 2.0 client credentials, short-lived hashed bearer tokens, scopes and organisation boundaries |
| API ↔ database | Application state and job/outbox records | Parameterised SQL, role and tenant checks; AES-256-GCM for designated secrets; database-at-rest disk encryption **not verified** |
| API → ERP webhook receiver | Event notifications | Public HTTPS destination, DNS/IP checks, HMAC-SHA256 signed payload, queued delivery and retry logic |
| API ↔ Paystack | Subscription payments and callbacks | HTTPS provider requests and signature validation of inbound Paystack webhooks |
| Browser / API ↔ Google | Optional Google sign-in | Google ID token verification by the server; accounts and MFA policy still enforced |
| API → email service | Verification, notifications, document delivery | Authenticated SMTP over SSL/TLS (port 465) to Teecoms' mail server `mail.teecomsintegratedsolutions.ng`; outbound mail is DKIM-signed for `teecomsintegratedsolutions.ng` |
| API → NRS MBS sandbox | Authorised reference synchronisation and approved-invoice `/validate` testing | Explicit sandbox flag, approved HTTPS host, credential gate, TLS peer verification, official-code preflight and redacted audit summaries; **no successful external test evidenced** |
| API → NRS MBS production | Future clearance, reporting and transmission | **Not enabled:** requires licence, testing, independent review and a separate production integration |

## B2B clearance — target sequence

![Target B2B clearance sequence: approved invoice, local UBL validation, NRS validation, sign, confirm, exchange and acknowledgement](/docs/diagrams/digitalinvoice-b2b-clearance-v1.0.svg)

The implemented system creates, approves and locally validates invoices and can prepare a UBL-style JSON projection. **Phase 5 adds authenticated sandbox reference synchronisation, official-code checks and an explicit approved-invoice sandbox `/validate` request.** The NRS client also defines sandbox-only operations for signing, confirmation and transmission, but **there is no connected production orchestrator** linking an approved invoice to a licensed B2B clearance process.

In the target B2B flow, an approved invoice is validated against business data and reference codes; an authorised service submits the structured document for NRS validation and signing; an authenticated response supplies IRN, CSID and QR evidence; the invoice is confirmed and delivered to the buyer; and the relevant transmission/acknowledgement steps are completed in accordance with the authorised MBS role. These steps are **future / licence-gated**, not current production events. DigitalInvoice does not generate or publish fake official evidence.

:::warning Verification evidence is production-only
The document renderer exposes verified IRN, CSID and QR values only when the record is explicitly confirmed in the **production** evidence environment, with a verification timestamp and required fields. Sandbox records and illustrative sample PDFs must never pass this production verification gate.
:::

## B2C reporting — target sequence and 24-hour tracking

![Target B2C reporting sequence with the local 24-hour queue timer and future NRS reporting](/docs/diagrams/digitalinvoice-b2c-reporting-v1.0.svg)

For a simplified B2C invoice, the local queue is created at approval with a due timestamp **24 hours after approval**. The current CLI worker supports **dry runs only**: it records what a connector would attempt, produces local events and flags overdue items, but makes **zero NRS network submissions**. An approved B2C invoice in the local queue is therefore **not** proof it has been reported to NRS.

The future workflow requires an authorised production worker to validate and report eligible B2C invoices within the statutory reporting window, monitor acceptance, handle retries according to safe idempotency rules and alert on failures. Scheduled execution, remote acceptance and production delivery performance have not been verified. The service target in the [approved SLA](/sla/) takes effect only after licensed NRS production go-live; it is not a description of current NRS transmission.

## Buyer QR verification — intended external workflow

![Target buyer verification sequence using a real production QR code and the NRS MBS360 verification experience](/docs/diagrams/digitalinvoice-buyer-verification-v1.0.svg)

The MBS documentation describes a buyer scanning a **genuine NRS-issued QR code** using the external MBS360 verification experience. The verification result comes from the NRS service, not from a DigitalInvoice-local mock QR. DigitalInvoice's production document evidence gate is designed to prevent sandbox-only or fictional identifiers from being displayed as verified production credentials. This diagram describes the **intended external verification journey**; it does not imply Teecoms operates MBS360 or that current sample QR codes are verifiable there.

## Phase 5 controlled sandbox validation path

A privileged platform operator may synchronise one approved code-list catalogue at a time into the local resource cache, where only a verified provider response sets `synced`. Invoice readiness compares the approved document's frozen fields against those cached codes. An authenticated user with `invoices.approve` permission may then invoke the **sandbox-only** validation operation, subject to approved IDs, IRN format, UBL totals, catalogue match and configured HTTPS/credential gates.

The sandbox response is recorded as a **redacted validation-test summary**, without changing the submission queue, adding verified production evidence or signing/transmitting the invoice. Certificate checks and production activation review are separate, advisory safeguards; the production HTTP sender is not implemented. The existing sequence SVGs depict **future end-to-end NRS workflows**, not a Phase 5 operational clearance sequence.

## Diagram legend and downloadable source

| Classification | Meaning |
| --- | --- |
| Implemented | Application-side capability evidenced by source code; deployment is not independently attested |
| Sandbox-gated | Optional NRS network path, enabled only with authorised sandbox configuration |
| Future / licence-gated | Intended post-licence flow, not a live DigitalInvoice NRS operation |
| External service | Provider or buyer-operated component beyond Teecoms' direct service boundary |

The diagrams above are downloadable as SVG by selecting **View full-size diagram** on each illustration. Corresponding editable Mermaid source files are provided for design review: [system architecture](/docs/diagrams/digitalinvoice-system-architecture-v1.0.mmd), [B2B clearance](/docs/diagrams/digitalinvoice-b2b-clearance-v1.0.mmd), [B2C reporting](/docs/diagrams/digitalinvoice-b2c-reporting-v1.0.mmd) and [buyer verification](/docs/diagrams/digitalinvoice-buyer-verification-v1.0.mmd). The [A3 landscape architecture PDF](/docs/digitalinvoice-architecture-v1.0.pdf) contains the four annotated diagrams and status legend.

## NRS v1.1 protocol and signing boundaries

The latest [NRS System Integrator reference](https://einvoice.nrs.gov.ng/serivce-providers/system-integrators) documents ECDSA/JAdES signing expectations. The diagrams above depict **intended post-licence flows**, not proof that a local JAdES signer, an authorised APP exchange or NRS production sender has been deployed. The reviewed PHP client sends NRS `x-api-key` and secret headers only behind an approved sandbox gate; ERP OAuth clients use separate credentials. DigitalInvoice tracks NRS MBS v1.1 guidance for payment status, quantity codes and tax categories; production exchange remains subject to the licensing and testing dependencies in the [implementation timeline](/developers/timeline/).


## Related documentation and changes

The [API documentation](/developers/api/) describes authenticated ERP read access, webhooks and NRS limitations; the [invoice data structure](/developers/data-structure/) describes the local invoice projection, schema and field mapping; the [security overview](/developers/security/) describes application controls and assurance gaps. **Diagram set v1.0 — 7 November 2026:** original target architecture and future workflow diagrams. **Page revision 13 November 2026:** added Phase 5 implemented sandbox controls; the diagrams remain illustrative targets and are not presented as executed regulatory flows. Future diagrams use new, versioned filenames while retaining this page URL.
