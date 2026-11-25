---
title: DigitalInvoice Service Level Agreement
description: Service commitments, support, incident handling, security, backup and recovery objectives and service credits for DigitalInvoice by Teecoms Integrated Solutions Limited.
version: 1.0
effective: 2026-11-27
updated: 2026-11-25
status: approved
pdf: /docs/teecoms-digitalinvoice-sla-v1.0.pdf
---

# DigitalInvoice Service Level Agreement

## 1. Document control

| Document control | Details |
| --- | --- |
| Provider | Teecoms Integrated Solutions Limited (RC 1100464) |
| Product | DigitalInvoice |
| Document version | 1.0 |
| Effective date | **27 November 2026** |
| Document owner | Teecoms Integrated Solutions Limited — Operations and Service Management |
| Review cycle | Annual, and following a material service or regulatory change |
| Approval status | **Approved by Teecoms management; published 25 November 2026** |
## 2. Parties and purpose

This Service Level Agreement ("SLA") is between **Teecoms Integrated Solutions Limited** ("Teecoms", "we", "us" or "Service Provider"), incorporated in Nigeria with RC 1100464 and whose office is at No. 12 Olayiwola Liasu Street, Polar Bed, along Sadiku Road, off Oshodi–Apapa Expressway, Lagos, Nigeria, and **the organisation that subscribes to DigitalInvoice, as identified in its DigitalInvoice account or order form** ("Customer").

This SLA sets out service availability, support, incident handling, Customer-data protection, backups, recovery objectives and service credits for **DigitalInvoice**. It applies to each **active paid subscription from 27 November 2026**, or the subscription start date if later. The Customer accepts the SLA by subscribing to or renewing DigitalInvoice, or by signing an order form that references this SLA.

If terms conflict, the order of precedence is **(1) a signed order form or master agreement, (2) this SLA, and (3) the DigitalInvoice terms of service**, subject to mandatory applicable law.
## 3. Definitions

| Term | Meaning |
| --- | --- |
| Availability | The percentage of the relevant calendar month during which the production DigitalInvoice application and applicable core API services are accessible and able to perform their core functions, subject to the exclusions in section 5. |
| Downtime | A verified period when a covered production service is unavailable because of an incident within Teecoms' reasonable control. A planned NRS outage alone does not establish DigitalInvoice downtime. |
| Scheduled Maintenance | Announced maintenance performed in the agreed maintenance window, excluded from the Availability calculation. |
| Incident | An unplanned interruption, security event or material reduction in the quality of a covered service. |
| Severity | The classification of an Incident's impact under the matrix in section 7. |
| Response Time | Time from receipt of a properly logged incident to the first substantive response acknowledging and commencing assessment; not necessarily a solution. |
| Resolution Time | Time from receipt of the incident to restoration of the affected service or delivery of an agreed lasting resolution; a temporary workaround is separately identified. |
| RPO | Recovery Point Objective: maximum tolerable age of data restored after a qualifying disaster. |
| RTO | Recovery Time Objective: target time to restore covered functionality following declaration of a qualifying disaster. |
| Service Credit | A credit against an eligible future subscription invoice, calculated under section 13. |
| NRS MBS | Nigeria Revenue Service Merchant Buyer Solution e-invoicing flow and its external systems. |
| IRN | Invoice Reference Number returned by the authorised NRS system, when applicable. |
| CSID | Cryptographic Stamp Identifier returned by the authorised NRS system, when applicable. |
| WAT | West Africa Time (UTC+01:00). |
## 4. Scope of services

The covered DigitalInvoice platform provides, subject to the Customer's subscribed plan and permissions: organisation and user administration; customer and product/service records; invoices and approval workflows; credit notes; proforma invoices; delivery notes; payment recording and receipts; VAT and compliance reporting; secure customer document access; and supported integration interfaces for authorised ERP clients.

The built NRS MBS integration includes invoice preparation and validation, a submission queue and a sandbox-gated connection. **It is not a live NRS service today**. The NRS-specific targets in section 6 take effect **only after MBS licensing, production configuration, acceptance testing and an expressly communicated production go-live date**.

This SLA does not cover downtime solely caused by Customer-managed devices, networks or internet service; Customer misconfiguration or unauthorised use; an external NRS MBS outage; third-party payment gateways, email providers or other external platforms; force majeure; or periods of agreed Scheduled Maintenance. Teecoms remains responsible for the parts of DigitalInvoice it controls, including the reasonable handling of relevant third-party failures and restoration once dependencies recover.
## 5. Service availability and maintenance

| Measure | Service commitment |
| --- | --- |
| Monthly production Availability target | 99.5% per calendar month |
| Scheduled maintenance window | Sundays, 00:00–04:00 WAT |
| Advance notice of Scheduled Maintenance | At least 72 hours where practicable |
| Emergency maintenance | As much advance notice as reasonably practicable, with post-event communication |

**Measurement.** Monthly Availability is calculated as `(eligible service minutes − verified Downtime minutes) ÷ eligible service minutes × 100`, rounded to two decimal places. Eligible service minutes are the minutes in the calendar month less periods falling within the exclusions in section 4. The monitored endpoints are `https://app.teecomsintegratedsolutions.ng/` and `https://api.teecomsintegratedsolutions.ng/digitalinvoice-server/api/plans`. External monitoring is scheduled **once per minute**. For the purpose of this SLA, a Downtime incident is recognised after **two consecutive failed monitoring checks** (at least two consecutive one-minute intervals), confirmed against application and incident records. Teecoms will investigate credible Customer evidence of service interruption. Only intervals when a covered core service is unavailable count as Downtime.

Maintenance notices will be delivered through the product, email or Customer notice channels, identifying expected impact and duration where reasonably possible. Emergency security fixes may occur outside the maintenance window. The parties may document variations in a signed agreement.
## 6. NRS MBS submission service levels — effective only from production go-live

:::info Licence-gated obligation
The following operational targets are **commitments that apply only after licensed production go-live**, not a description of current submissions or NRS-validated invoices. NRS MBS availability, acceptance decisions, identifier generation and regulator processing time are outside Teecoms' control.
:::

| Workflow | Service target following licensed production go-live |
| --- | --- |
| B2B clearance | Queue an approved B2B invoice for clearance within 5 minutes of approval, provided it satisfies mandatory validation. |
| B2C reporting | Report an eligible B2C invoice within 1 hour of the relevant approval/issue event; in all cases follow the applicable NRS reporting requirement, including any 24-hour statutory reporting deadline applicable at licensed production go-live. |
| Dependency outage | Retry eligible failed submissions with backoff for up to 24 hours, subject to configured retry limits and NRS rules. |
| Failed-submission alert | Generate an operational alert within 15 minutes of a detected failed submission requiring intervention. |
| Returned identifiers | Display an NRS-issued IRN, CSID and QR information, where supplied and verified, within 5 minutes of receiving and processing a successful NRS response. |

DigitalInvoice will retain a submission state, queue attempt history and applicable NRS response evidence, and provide a means to reconcile failed, pending and accepted states. Invoice approval or queueing **must not** be described as clearance. The Service Provider will distinguish errors arising within DigitalInvoice from errors, rejections and unavailability attributable to NRS. No numerical external NRS uptime or processing guarantee is made.
## 7. Support and incident management

Staffed support hours are **Monday–Friday 08:00–18:00 WAT and Saturday 09:00–14:00 WAT**. Severity 1 monitoring and on-call escalation operate **24/7**. Outside staffed hours, report Severity 1 by calling **+2347038020088** (the designated 24/7 Severity 1 line) **and** emailing **info@teecomsintegratedsolutions.ng** with **SEVERITY 1** in the subject. The on-call engineer will acknowledge within the Severity 1 response target.

| Severity | Typical impact | First response target | Workaround / resolution target |
| --- | --- | --- | --- |
| 1 — Critical | Production service down for all users, or licensed NRS submission failing for all affected users due to DigitalInvoice. | 30 minutes | Workaround 4 hours; resolution 24 hours |
| 2 — High | Major supported feature materially impaired with widespread customer impact. | 2 hours | Resolution 1 business day |
| 3 — Medium | Limited or minor issue with a practical workaround available. | 8 business hours | Resolution 5 business days |
| 4 — Low | General question, enhancement or routine service request. | 2 business days | Review and schedule, where accepted, in a future release; no fixed completion guarantee |

Incidents may be reported using section 16's support channels. An acknowledgement will include a reference or other traceable record, preliminary classification and next steps. Severity may be revised when verified impact changes. **Business days** are Monday–Friday, excluding Nigerian public holidays declared by the Federal Government. Severity 2–4 response and resolution clocks operate during staffed hours only; clocks pause while awaiting requested Customer information or access, or during a confirmed third-party/NRS outage, with the pause recorded and communicated.

**Progress updates:** Severity 1, at least every **1 hour** until restored; Severity 2, every **4 business hours**; Severity 3, on material progress and at least every **2 business days**; Severity 4, when status changes.

Resolution targets are objectives rather than unconditional assurances where investigation is impeded by Customer information, an external provider or an NRS rejection. Such dependencies will be documented and communicated, without misclassifying a controllable DigitalInvoice failure as third-party downtime.
## 8. Escalation matrix

Escalations are coordinated through the support desk, **info@teecomsintegratedsolutions.ng / +2347038020088**, using Teecoms' controlled internal escalation directory. Individual staff telephone numbers and email addresses are not published.

| Level | Responsible role | Trigger / action | Contact |
| --- | --- | --- | --- |
| L1 | Teecoms support desk | Initial logging, triage, communications and troubleshooting | Official support channels above |
| L2 | CTO — Azuka Adoh | Severity 1 unresolved after **2 hours** | Escalated internally through the support desk |
| L3 | Operations Manager — Ayotunde Odusanya | Severity 1 without a workaround after **4 hours**, or Severity 2 unresolved beyond **1 business day** | Escalated internally through the support desk |
| L4 | Managing Director — Babalola Oluwatobi Samuel | Severity 1 unresolved after **8 hours**, a repeat Severity 1 within 30 days, or any confirmed personal data breach | Escalated internally through the support desk |

The support desk remains responsible for incident coordination and Customer updates throughout escalation.
## 9. Security and data protection

DigitalInvoice's security architecture includes organisation-scoped role-based access, password hashing, JWT-backed browser sessions with CSRF controls, sign-in throttling, authenticator-based MFA and recovery codes, hashed access tokens, audit records, signed integration webhooks and authenticated encryption for supported secrets. **Production application and API traffic must use HTTPS with TLS 1.2 or higher and HTTP Strict Transport Security (HSTS)**. This is an operating requirement; an independent SSL Labs rating has not been supplied and no rating is asserted here.

The Customer is the controller of its business and personal data; Teecoms acts as processor only to deliver DigitalInvoice, subject to applicable laws and agreed processing terms. Records are retained for the **subscription term**. When the subscription ends, the Customer has **90 days** to export its data; subsequently, Teecoms deletes it within **30 days**, except records that must be retained by law (including applicable tax and accounting records). Backup copies age out under section 10. Data-processing terms are available on request at **info@teecomsintegratedsolutions.ng**. Teecoms restricts access to authorised personnel with a legitimate need and requires confidentiality from personnel and contractors.

The parties will comply with applicable obligations under the **Nigeria Data Protection Act 2023** and relevant guidance of the Nigeria Data Protection Commission (NDPC). Where a personal data breach occurs, Teecoms will inform affected Customers without undue delay and provide information to support required notifications. **Where Teecoms itself is legally required to notify the NDPC, it shall do so within 72 hours** of becoming aware of a notifiable personal data breach, subject to applicable statutory provisions. The parties will cooperate on investigation, remediation and notices to affected data subjects.

Teecoms' Information Security Management System is **certified to ISO/IEC 27001:2022** (certificate **SCK/05/TIS/26/23/9804**, issued by **SCK Certifications Pvt. Ltd.**, expiry **19 November 2029**, conditional on successful surveillance audits), with a scope including software and application development, e-invoicing, cloud and hosting services. Independent DigitalInvoice vulnerability assessment and penetration testing (**VAPT**) is **in progress**; the report will be made available to Customers on request when complete. **No NRS MBS production accreditation is claimed.** See the [security and certification overview](/developers/security/) for further information.
## 10. Backup, disaster recovery and business continuity

| Control | Operating commitment |
| --- | --- |
| Full database/application data backup | Daily at 01:00 WAT |
| Incremental backup | Hourly |
| Daily backup retention | 30 days |
| Monthly backup retention | 12 months |
| Backup protection | Encrypted at rest and during transfer, with access restricted to authorised operators |
| Restore testing | Quarterly |
| Recovery Point Objective (RPO) | 1 hour |
| Recovery Time Objective (RTO) | 4 hours after declaration of a qualifying disaster |

DigitalInvoice is hosted with a **commercial managed hosting provider** under contract with Teecoms; the hosting location is available to Customers on request. Backup copies are kept separate from the production server. Quarterly restore tests are recorded in Teecoms' ISMS records. **Recovery plan owner: CTO, Azuka Adoh.** Recovery targets apply to qualifying Teecoms-controlled disasters and do not override external NRS service restoration times.
## 11. Change management

Teecoms will maintain a change record for material production releases and assess, test and review material changes before deployment. Where a release is likely to interrupt service, Customer notice and the maintenance provisions in section 5 apply. Security-critical and emergency changes may be expedited, with incident or post-change review as appropriate. Material breaking changes to supported APIs will receive **90 days' advance notice**, except urgent security fixes for which shorter notice may be required and immediate notification will be provided.
## 12. Service reporting

A **monthly service summary** will be emailed **on request** to the Customer's account owner within **10 business days** after the end of the month, beginning with the **December 2026** service report. It will cover calculated Availability, excluded maintenance windows, material incidents, response/restoration times, recurring issues and open corrective actions. NRS incidents will distinguish DigitalInvoice failures from external MBS service failures.
## 13. Service credits

For a full eligible calendar month after this SLA becomes effective, and only where Downtime is attributable to Teecoms under section 5, the following credit bands apply:

| Verified monthly Availability | Service Credit |
| --- | --- |
| 99.5% or above | No credit |
| Below 99.5% but at least 99.0% | **0.5%** of the applicable monthly service fee |
| Below 99.0% but at least 98.0% | **3%** of the applicable monthly service fee |
| Below 98.0% | **4%** of the applicable monthly service fee |

The aggregate credit cap is **4%** of the applicable monthly service fee for the affected month. **Credits are not cash refunds.** A Customer seeking a credit must submit the affected service, dates, evidence and account reference within **30 days** after the relevant month ends. Teecoms will verify the claim against monitoring and incident records and respond within **15 business days**; approved credits will be applied to the next subscription invoice or renewal.

Subject to non-excludable statutory rights and applicable contracts, these Service Credits are the exclusive contractual remedy specifically for failure to meet the monthly Availability target. No service-credit obligation arises solely from NRS MBS downtime outside Teecoms' control.
## 14. Customer responsibilities

The Customer shall provide correct and current business, tax and buyer information (including applicable TINs and references), validate invoices before approval, and maintain authorised-user lists and secure credentials. The Customer must not share privileged access, must promptly report suspected misuse or service incidents, and shall maintain suitable internet access, devices and its own internal approval controls. The Customer is responsible for the lawful basis, accuracy and completeness of records it supplies and for coordinating with Teecoms to resolve incomplete or rejected NRS payloads when the production integration becomes operational.

The Customer shall cooperate reasonably with investigations, including providing transaction references and timely feedback, while avoiding transmission of passwords, private keys or secret tokens through ordinary support communications.
## 15. Term, review and amendments

This SLA takes effect on **27 November 2026**, or, for a Customer whose paid subscription starts later, that subscription's start date. It remains in force for the applicable subscription term and renews with the subscription. It ends when the subscription ends, except that obligations concerning **return/export of Customer data and accrued service credits survive** as needed to give effect to this SLA.

Teecoms will give **30 days' notice** of material changes by emailing the account owner and publishing the change on this page. A shorter notice period applies only where required by law or a regulator, or where an urgent security change is needed. Material changes ordinarily take effect from the **next billing period** following the notice. This SLA will be reviewed annually and following a material product, legal, operational or NRS change. The contractual order of precedence appears in section 2.
## 16. Contact details

| Channel | Details |
| --- | --- |
| Service provider | Teecoms Integrated Solutions Limited (RC 1100464) |
| Registered office / correspondence | No. 12 Olayiwola Liasu Street, Polar Bed, along Sadiku Road, off Oshodi–Apapa Expressway, Lagos, Nigeria |
| Official support email | **info@teecomsintegratedsolutions.ng** |
| Official support telephone | **+2347038020088** |
| Severity 1 out-of-hours | Call **+2347038020088** (designated 24/7 Severity 1 line) and email **info@teecomsintegratedsolutions.ng** with **SEVERITY 1** in the subject |
| In-app support | Available where enabled within DigitalInvoice |
| Hosting provider | A commercial managed hosting provider under contract with Teecoms; details available to Customers on request |
| Primary data location | Available to Customers on request from the official support channels |
## 17. Approval and Customer acceptance

**For Teecoms Integrated Solutions Limited**

| Approval | Details |
| --- | --- |
| Name | Babalola Oluwatobi Samuel |
| Capacity | Managing Director |
| Management approval | **Approved: 25 November 2026** |

**Customer acceptance:** accepted by subscribing to or renewing DigitalInvoice, or by signing an order form that references this SLA.
