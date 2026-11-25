---
title: DigitalInvoice implementation timeline
description: Completed delivery milestones, accountable owners, assurance activities and target schedule for NRS MBS onboarding and production go-live.
version: 1.0
effective:
updated: 2026-11-25
status: published
pdf: /docs/digitalinvoice-implementation-timeline-v1.0.pdf
---

# DigitalInvoice implementation timeline

## Programme overview

DigitalInvoice is Teecoms Integrated Solutions Limited's electronic invoicing platform. This timeline summarises the platform development milestones, security assurance programme and planned steps towards authorised NRS MBS integration. The programme is sponsored by Teecoms management, with technical delivery led by the CTO.

**Status as at 25 November 2026:** The invoicing application, local UBL-style invoice preparation, ERP integration interface, authentication safeguards and developer reference materials are implemented. Teecoms Integrated Solutions Limited **is certified to ISO/IEC 27001:2022** (initial registration **20 November 2026**; [certificate details](/developers/security/)). The DigitalInvoice independent VAPT is **in progress**. NRS production submission remains disabled pending onboarding, successful interoperability testing and production licensing.

:::info How to interpret the dates
**Completed** identifies milestones documented in the project's October/November 2026 records; for some earlier development work, a precise original start date was not separately recorded. **Target** identifies a planned milestone, not a regulatory approval or guaranteed launch date. **NRS-dependent** activities start only after the relevant NRS authorisation and credentials are issued. The indicative windows in the chart move if those external dates change.
:::

## Milestone register

| Phase | Activities / deliverable | Accountable owner | Start | End / milestone | Status |
| --- | --- | --- | --- | --- | --- |
| Platform build and redesign | React application, PHP API, invoice workflows, administration and responsive design | Azuka Adoh, CTO | October 2026 (documented work) | 16 Oct 2026 (design milestone recorded) | **Completed** |
| UBL/NRS invoice preparation | Local UBL-style adapter, invoice examples, monetary checks, preflight and controlled sandbox code paths | Azuka Adoh, CTO | Before Nov 2026 (start not separately recorded) | Documented by 7 Nov 2026; Phase 5 update 13 Nov | **Implemented locally** |
| ERP integration interface | OAuth 2.0 client credentials, scoped read API and signed outbound webhooks | Azuka Adoh, CTO | Before Nov 2026 (start not separately recorded) | Documented 7 Nov 2026 | **Completed in code** |
| MFA and security hardening | TOTP, recovery codes, session controls and admin recovery safeguards | Azuka Adoh, CTO | 7 Nov 2026 | 13 Nov 2026 | **Completed in code** |
| Subscription and payments hardening | Paystack verification, onboarding resume, checkout reconciliation and payment-exception handling | Tolulope Babalola, Finance and Administration; CTO | 14 Nov 2026 (recorded batch) | Nov 2026 implementation batches | **Completed in code; external validation ongoing** |
| Developer documentation | API, schema, samples, architecture, security and implementation documentation | Azuka Adoh, CTO | 7 Nov 2026 | 25 Nov 2026 revision | **Published** |
| ISO/IEC 27001:2022 certification | ISMS certification, certificate SCK/05/TIS/26/23/9804 | Babalola Oluwatobi Samuel, MD | 20 Nov 2026 | 20 Nov 2026 | **Certified** |
| Subscriber SLA | Management approval of v1.0; standard subscriber service terms | Babalola Oluwatobi Samuel, MD | 25 Nov 2026 | Effective 27 Nov 2026 | **Approved** |
| Independent VAPT – fieldwork | Independent DigitalInvoice application testing | Azuka Adoh, CTO | In progress | **18 Dec 2026** | **Target** |
| Independent VAPT – report | Findings, severity ratings and remediation plan | Azuka Adoh, CTO | After fieldwork | **31 Dec 2026** | **Target** |
| VAPT remediation and retest | Resolve findings; obtain independent retest evidence | Azuka Adoh, CTO | Jan 2027 | **22 Jan 2027** | **Target** |
| NRS onboarding approval and credentials | Complete NRS review and receive authorised sandbox access | Tolulope Babalola, Finance and Administration; NRS | Application underway | **Date controlled by NRS** | **NRS-dependent** |
| Sandbox interoperability | Reference sync, `/validate`, signing responsibility, IRN/CSID/QR evidence, confirmation, B2C reporting and exception handling | Azuka Adoh, CTO | On receipt of credentials | **Four weeks after credentials** | **Target; NRS-dependent** |
| Pilot user acceptance testing | Pilot invoice, payment, reporting and exception-path acceptance tests | Ayotunde Odusanya, Operations Manager | After sandbox acceptance | Before go-live | **Target** |
| Production licence and readiness | Authorised production access, security evidence, operational and commercial acceptance | Tolulope Babalola, Finance and Administration; MD | After required approvals | **Before go-live; NRS-controlled** | **NRS-dependent** |
| Production go-live | Controlled launch after NRS licence, VAPT/retest and pilot UAT | Babalola Oluwatobi Samuel, MD | Q1 2027 target window | **31 Mar 2027 latest target** | **Target, conditional** |
| Hypercare | Enhanced monitoring, rapid support and controlled incident escalation | Ayotunde Odusanya, Operations Manager | On actual go-live date | **30 days after go-live** | **Target** |
| ISO surveillance | First annual ISO/IEC 27001 surveillance audit | Babalola Oluwatobi Samuel, MD | 20 Oct 2027 | **20 Oct 2027** | **Scheduled; subject to audit** |

## Visual project schedule

![DigitalInvoice Gantt timeline showing completed development milestones, VAPT targets, conditional NRS onboarding and Q1 2027 go-live, with the October 2027 surveillance audit](/docs/diagrams/digitalinvoice-implementation-timeline-v1.0.svg)

The chart separates recorded work from target periods. The **1 October 2026** chart anchor shows the month of recorded platform work, not a separately verified project start date. **The NRS credential, sandbox, UAT and licence bars are planning illustrations only:** no credential issue date, test completion date or licence approval has been promised by NRS. If access is delayed, the downstream milestones and Q1 2027 go-live target will be reassessed.

Download the [editable Mermaid Gantt source](/docs/diagrams/digitalinvoice-implementation-timeline-v1.0.mmd), use **View full-size diagram** for an SVG, or download the [A4 implementation timeline PDF](/docs/digitalinvoice-implementation-timeline-v1.0.pdf).

## Delivery ownership and governance

| Person | Role | Responsibility |
| --- | --- | --- |
| **Babalola Oluwatobi Samuel** | Managing Director / executive sponsor | Executive approval, strategic oversight and production go-live decision |
| **Azuka Adoh** | Chief Technology Officer | Application delivery, security remediation, NRS sandbox testing and signing integration |
| **Ayotunde Odusanya** | Operations Manager | Service-readiness evidence, pilot UAT, incident processes and 30-day hypercare |
| **Tolulope Babalola** | Finance and Administration | Licensing coordination, commercial arrangements and billing readiness |
| **Juliet Onyinyechi Ugochukwu** | Human Resources | Staffing, awareness, training and role readiness |

## Dependencies and critical path

**Critical path:** NRS onboarding approval and sandbox credentials → successful sandbox interoperability testing → production licence and authorisation → controlled production go-live → 30-day hypercare.

**Parallel assurance path:** independent VAPT fieldwork → report → remediation → retest. Independent assurance evidence and production security readiness must be completed before go-live. Pilot UAT, support staffing, training and any certificate enrolment run alongside these workstreams and also require successful sign-off.

Production NRS clearance, licensed signing responsibilities and genuine NRS-issued identifiers are **not presented as currently operational**. The target Q1 2027 go-live remains conditional on NRS decisions, secure integration testing, VAPT completion and management approval.

## Service and documentation references

For implementation interfaces see the [API documentation](/developers/api/), [invoice data structure](/developers/data-structure/) and [system architecture](/developers/architecture/). The [security overview](/developers/security/) provides ISO certificate particulars and VAPT status. The [approved Service Level Agreement](/sla/) takes effect on **27 November 2026**.
