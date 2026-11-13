---
title: DigitalInvoice Service Level Agreement
description: Proposed service commitments, support arrangements, security measures and recovery objectives for DigitalInvoice, subject to Teecoms management approval.
version: 0.9 (draft for management review)
effective:
updated: 2026-11-13
status: draft
pdf: /docs/teecoms-digitalinvoice-sla-v1.0.pdf
---

# DigitalInvoice Service Level Agreement

## 1. Document control

| Document control | Details |
| --- | --- |
| Provider | Teecoms Integrated Solutions Limited (RC 1100464) |
| Product | DigitalInvoice |
| Document version | {{draft:0.9 — draft for management review}}{{approved:1.0 — approved for execution}} |
| Effective date | **[CONFIRM: date after management approval and execution]** |
| Document owner | Teecoms Integrated Solutions Limited — Operations and Service Management |
| Review cycle | Annual, and following a material service or regulatory change |
| Approval status | {{draft:Draft only — not executed, not binding and not an active service guarantee}}{{approved:Management-approved text; contractual effect is subject to execution by the parties}} |

::::draft
:::warning Management approval required
This document is a proposed agreement, not a signed or effective SLA. All highlighted figures are proposals pending management approval. It must not be represented to NRS, customers or other reviewers as an executed agreement. DigitalInvoice's NRS MBS integration is sandbox-ready, **not licensed for production MBS submissions**, and live NRS submission remains disabled until licensing and production go-live.
:::
::::

## 2. Parties and purpose

This Service Level Agreement ("SLA") is between **Teecoms Integrated Solutions Limited** ("Teecoms", "we", "us" or "Service Provider"), incorporated in Nigeria with RC number 1100464 and whose office is at No. 12 Olayiwola Liasu Street, Polar Bed, along Sadiku Road, off Oshodi–Apapa Expressway, Lagos, Nigeria, and **[CONFIRM: Customer's full legal name and address]** ("Customer").

The SLA describes service availability, support, incident handling, protection of Customer data, backups, recovery commitments and service credits for **DigitalInvoice**. When executed, it applies alongside the applicable subscription agreement or order form. If provisions conflict, the order of precedence shall be as agreed in the executed contract.

::::draft
Nothing in this draft gives rise to a present service credit or other contractual entitlement.
::::

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

| Measure | {{draft:Proposed commitment}}{{approved:Service commitment}} |
| --- | --- |
| Monthly production Availability target | {{proposed:99.5%}} per calendar month |
| Scheduled maintenance window | Sundays, {{proposed:00:00–04:00 WAT}} |
| Advance notice of Scheduled Maintenance | At least {{proposed:72 hours}} where practicable |
| Emergency maintenance | As much advance notice as reasonably practicable, with post-event communication |

**Measurement.** Monthly Availability will be calculated as `(eligible service minutes − verified Downtime minutes) ÷ eligible service minutes × 100`, rounded to two decimal places. Eligible service minutes are the minutes in the calendar month less periods falling within the agreed exclusions above. Teecoms will use its application/service monitoring records and incident records, and will investigate credible Customer evidence of an interruption. Only periods during which a covered core service is unavailable are counted. The exact monitored endpoints and any minimum outage-detection threshold must be confirmed before execution: **[CONFIRM: monitoring endpoints and measurement threshold]**.

Maintenance will be communicated through the applicable product, email or Customer notice channels, identifying anticipated effect and duration where reasonably possible. Emergency security fixes may take place outside the maintenance window. The parties will document any variation to the Availability calculation in the executed SLA.

### NRS-published SI/APP service level comparison (for management review)

The [NRS service-provider SLA reference](https://einvoice.nrs.gov.ng/serivce-level-agreement) describes **99.9% uptime and 24/7 support**, with critical response **30 minutes** and resolution **1 hour**, high-priority response **1 hour** and resolution **4 hours**, and normal response **4 hours** and resolution **8 hours**. These are the reference's figures, **not verified Teecoms capabilities or automatically binding terms**. They are more demanding than the **99.5%** and limited staffed hours currently proposed here. Management must choose a support/availability model it can operate and evidence before any SI/APP SLA is approved or submitted as executed.

NRS's reference page visibly lists an effective date of **1 October 2024** and last updated **10 October 2024**. Those dates are NRS's **reference dates**, not Teecoms' effective or execution dates. This Teecoms SLA was drafted after those dates; **its effective date cannot truthfully be backdated** to them.


## 6. NRS MBS submission service levels — effective only from production go-live

:::info Licence-gated obligation
The following operational targets are **{{draft:proposals for future licensed production use}}{{approved:commitments that apply only after licensed production go-live}}**, not a description of current submissions or NRS-validated invoices. NRS MBS availability, acceptance decisions, identifier generation and regulator processing time are outside Teecoms' control.
:::

| Workflow | {{draft:Proposed target}}{{approved:Service target}} following licensed production go-live |
| --- | --- |
| B2B clearance | Queue an approved B2B invoice for clearance within {{proposed:5 minutes}} of approval, provided it satisfies mandatory validation. |
| B2C reporting | Report an eligible B2C invoice within {{proposed:1 hour}} of the relevant approval/issue event; in all cases follow the applicable NRS reporting requirement, currently described in the project materials as a 24-hour window (subject to confirmation at go-live). |
| Dependency outage | Retry eligible failed submissions with backoff for up to {{proposed:24 hours}}, subject to configured retry limits and NRS rules. |
| Failed-submission alert | Generate an operational alert within {{proposed:15 minutes}} of a detected failed submission requiring intervention. |
| Returned identifiers | Display an NRS-issued IRN, CSID and QR information, where supplied and verified, within {{proposed:5 minutes}} of receiving and processing a successful NRS response. |

DigitalInvoice will retain a submission state, queue attempt history and applicable NRS response evidence, and provide a means to reconcile failed, pending and accepted states. Invoice approval or queueing **must not** be described as clearance. The Service Provider will distinguish errors arising within DigitalInvoice from errors, rejections and unavailability attributable to NRS. No numerical external NRS uptime or processing guarantee is made.

## 7. Support and incident management

{{draft:Proposed}}{{approved:Agreed}} staffed support hours are **Monday–Friday {{proposed:08:00–18:00 WAT}} and Saturday {{proposed:09:00–14:00 WAT}}**. Severity 1 monitoring is on a {{proposed:24/7}} basis. Continuous monitoring does not by itself mean that a staffed telephone desk is available around the clock; the on-call and out-of-hours acknowledgement arrangements are **[CONFIRM: Severity 1 on-call coverage and contact method]**.

| Severity | Typical impact | First response target | Workaround / resolution target |
| --- | --- | --- | --- |
| 1 — Critical | Production service down for all users, or licensed NRS submission failing for all affected users due to DigitalInvoice. | {{proposed:30 minutes}} | Workaround {{proposed:4 hours}}; resolution {{proposed:24 hours}} |
| 2 — High | Major supported feature materially impaired with widespread customer impact. | {{proposed:2 hours}} | Resolution {{proposed:1 business day}} |
| 3 — Medium | Limited or minor issue with a practical workaround available. | {{proposed:8 business hours}} | Resolution {{proposed:5 business days}} |
| 4 — Low | General question, enhancement or routine service request. | {{proposed:2 business days}} | Review and schedule, where accepted, in a future release; no fixed completion guarantee |

Incidents may be raised through the support channels in section 16. An acknowledgement will include a reference or other traceable record, preliminary classification and next steps. Severity may be revised when the verified impact changes. Response and resolution clocks for Severity 2–4 operate within the agreed staffed support/business hours; **[CONFIRM: definition of business day, holidays and pause conditions]**. Severity 1 clock treatment outside staffed hours is conditional on approval of the on-call arrangement. Teecoms will provide progress updates appropriate to the severity, major changes and restoration, with **[CONFIRM: mandatory update cadence]** to be agreed.

Resolution targets are objectives rather than unconditional assurances where investigation is impeded by Customer information, an external provider or an NRS rejection. Such dependencies will be documented and communicated, without misclassifying a controllable DigitalInvoice failure as third-party downtime.

## 8. Escalation matrix

| Level | Responsible role | Trigger / action | Contact |
| --- | --- | --- | --- |
| L1 | General Teecoms contact desk | Initial logging, triage, communications and routine troubleshooting | **info@teecomsintegratedsolutions.ng / +2347038020088** (dedicated on-call unverified) |
| L2 | CTO — Azuka Adoh | Technical leadership; escalate unresolved Severity 1 at {{proposed:2 hours}} after logging, or sooner if impact warrants | **[CONFIRM: CTO escalation contact]** |
| L3 | Operations Manager — Ayotunde Odusanya | Operational coordination, Customer impact management and resource allocation; escalate if L2 cannot restore the service | **[CONFIRM: Operations Manager escalation contact and trigger]** |
| L4 | Managing Director — Babalola Oluwatobi Samuel | Executive escalation for material sustained incidents or unresolved major service risk | **[CONFIRM: Managing Director escalation contact and trigger]** |

The support desk remains responsible for incident coordination during escalation. Names and roles above are based on the supplied company materials and must be reconfirmed before signature.

## 9. Security and data protection

Teecoms' present DigitalInvoice application design includes role-based access scoped to organisations, password hashing with bcrypt, JWT-based browser sessions with CSRF controls, sign-in throttling, TOTP multi-factor authentication and recovery codes, hashed access tokens, audit records, signed integration webhooks, and AES-256-GCM encryption for supported secrets. Traffic encryption and required transport policies must be verified on the production host before publication of an operational assurance claim: **[CONFIRM: live TLS and hosting security validation]**.

The parties will comply with applicable obligations under the **Nigeria Data Protection Act 2023** and relevant guidance of the Nigeria Data Protection Commission (NDPC). Customer business information and customer-uploaded records remain the Customer's data. Each party's controller/processor responsibilities, retention schedule, permitted processing and sub-processors shall be documented in the applicable data processing terms: **[CONFIRM: data processing agreement and retention schedule]**. Teecoms shall restrict access to authorised personnel with a legitimate operational need and require confidentiality from personnel and contractors.

Where a personal data breach occurs, Teecoms will inform affected Customers without undue delay and provide available information to support any required notifications. **Where Teecoms itself is legally required to notify the NDPC, it shall do so within 72 hours of becoming aware of a notifiable personal data breach**, subject to the applicable statutory provisions. The parties will cooperate on investigations, remedial actions and necessary notices to affected data subjects.

Independent vulnerability assessment and penetration testing (VAPT) and an ISO/IEC 27001 assurance programme are **planned / in progress**. **No VAPT completion, ISO/IEC 27001 certification, or NRS accreditation is claimed** by this SLA. Targets remain **[CONFIRM: VAPT and ISO/IEC 27001 programme dates and scope]**.

## 10. Backup, disaster recovery and business continuity

| Control | {{draft:Proposed operating commitment}}{{approved:Operating commitment}} |
| --- | --- |
| Full database/application data backup | Daily at {{proposed:01:00 WAT}} |
| Incremental backup | {{proposed:Hourly}} |
| Daily backup retention | {{proposed:30 days}} |
| Monthly backup retention | {{proposed:12 months}} |
| Backup protection | Encrypted at rest and during transfer, with access restricted to authorised operators |
| Restore testing | {{proposed:Quarterly}} |
| Recovery Point Objective (RPO) | {{proposed:1 hour}} |
| Recovery Time Objective (RTO) | {{proposed:4 hours}} after declaration of a qualifying disaster |

::::draft
The backup approach, off-site storage arrangements and restore process must be confirmed by management and infrastructure operators before these measures are contractual guarantees.
::::

**[CONFIRM: hosting provider, backup location, restore-test evidence and recovery plan owner]**. Recovery targets are objectives for qualifying disasters affecting Teecoms-controlled systems and do not override external NRS service restoration timeframes.

## 11. Change management

Teecoms will maintain a change record for material production releases and will assess, test and review material changes before release. Where a release is likely to cause an interruption, Customer notice and the maintenance provisions in section 5 apply. Security-critical and emergency changes may be expedited, with an incident or post-change review as appropriate. Material API changes affecting supported integrations will be communicated using the agreed channels and documented version information; **[CONFIRM: API deprecation notice period]**.

## 12. Service reporting

Teecoms proposes to make a monthly service summary available to Customers on request, covering calculated Availability, excluded maintenance windows, material incidents, time to respond/restore, recurring issues and open corrective actions. The parties will confirm the report distribution method and first reporting date: **[CONFIRM: monthly reporting channel and commencement date]**. Incidents relating to NRS will distinguish internal platform failures from failures of the external MBS service.

## 13. Service credits

For a full eligible calendar month after this SLA becomes effective, and only where Downtime is attributable to Teecoms under section 5, the following credit bands {{draft:are proposed}}{{approved:apply}}:

| Verified monthly Availability | {{draft:Proposed Service Credit}}{{approved:Service Credit}} |
| --- | --- |
| {{proposed:99.5%}} or above | No credit |
| Below {{proposed:99.5%}} but at least {{proposed:99.0%}} | {{proposed:5%}} of the applicable monthly service fee |
| Below {{proposed:99.0%}} but at least {{proposed:98.0%}} | {{proposed:10%}} of the applicable monthly service fee |
| Below {{proposed:98.0%}} | {{proposed:25%}} of the applicable monthly service fee |

The aggregate credit cap is {{proposed:25%}} of the applicable monthly service fee for the affected month. Credits are not cash refunds. A Customer seeking a credit must lodge a request, identifying the affected service, dates, evidence and account, within {{proposed:30 days}} after the relevant month ends. Teecoms will verify the claim against monitoring and incident records and communicate its decision. **[CONFIRM: claim processing and credit application timetable]**.

Subject to non-excludable statutory rights and the parties' finally executed contract, the Service Credits are the exclusive contractual remedy specifically for failure to meet the monthly Availability target. No service-credit obligation arises from NRS MBS downtime outside Teecoms' control.

::::draft
No service-credit obligation arises from this draft.
::::

## 14. Customer responsibilities

The Customer shall provide correct and current business, tax and buyer information (including applicable TINs and references), validate invoices before approval, and maintain authorised-user lists and secure credentials. The Customer must not share privileged access, must promptly report suspected misuse or service incidents, and shall maintain suitable internet access, devices and its own internal approval controls. The Customer is responsible for the lawful basis, accuracy and completeness of records it supplies and for coordinating with Teecoms to resolve incomplete or rejected NRS payloads when the production integration becomes operational.

The Customer shall cooperate reasonably with investigations, including providing transaction references and timely feedback, while avoiding transmission of passwords, private keys or secret tokens through ordinary support communications.

## 15. Term, review and amendments

This SLA becomes effective only after management approval and the parties complete the required signature/acceptance process. The effective date is **[CONFIRM: effective date]**. Once in force, the SLA will be reviewed annually and when material product, legal, operational or NRS requirements change. Amendments to material service figures, exclusions or credit arrangements must be documented and communicated in accordance with the executed contract. **[CONFIRM: termination, renewal, priority-of-terms and amendment-notice provisions]**.

## 16. Contact details

| Channel | Details |
| --- | --- |
| Service provider | Teecoms Integrated Solutions Limited (RC 1100464) |
| Registered office / correspondence | No. 12 Olayiwola Liasu Street, Polar Bed, along Sadiku Road, off Oshodi–Apapa Expressway, Lagos, Nigeria |
| General contact email (existing Teecoms website) | **info@teecomsintegratedsolutions.ng**; dedicated SLA support inbox subject to service activation |
| General contact telephone (existing Teecoms website) | **+2347038020088**; out-of-hours emergency hotline subject to staffing approval |
| In-app support | Available where enabled within DigitalInvoice |
| Hosting provider | **[CONFIRM: hosting provider and region]** |
| Primary data location | **[CONFIRM: location, and whether Customer data is stored in Nigeria]** |

A verified support channel will be published only after the designated account is operational and staffed according to the approved support arrangements.

### Contact and operational evidence notes

The general Teecoms website publicly displays **info@teecomsintegratedsolutions.ng** and **+2347038020088**. They are the contact fallbacks pending an approved dedicated DigitalInvoice helpdesk and emergency/on-call arrangement. Escalation to named management remains via the controlled internal escalation directory; personal telephone numbers are not published without consent. Hosting vendor, primary data location, backup provider and the SLA's operational service levels remain subject to documented verification; inventing those details would be inaccurate.


## 17. Signatures

::::draft
This draft is for review only. Signature blocks are provided to facilitate preparation of an executed agreement; no signature is implied.
::::

**For Teecoms Integrated Solutions Limited**

| Signatory | Details |
| --- | --- |
| Name | Babalola Oluwatobi Samuel |
| Capacity | Managing Director |
| Signature | ____________________________________ |
| Date | ____________________________________ |

**For the Customer**

| Signatory | Details |
| --- | --- |
| Customer legal name | **[CONFIRM: customer legal name]** |
| Authorised signatory | **[CONFIRM: name and title]** |
| Signature | ____________________________________ |
| Date | ____________________________________ |

::::draft
## Items to confirm before publishing

The following details must be approved or supplied before this SLA may change from `draft` to `approved` and before a signed PDF is made available:

- Parties: Customer legal name and address; effective date; order-of-precedence, termination, renewal and amendment terms.
- Service measurement: production monitoring endpoints, outage-detection threshold, business-day/holiday and clock-pausing rules.
- Support: live support email and telephone, Severity 1 on-call arrangements, escalation contacts/triggers and incident update cadence.
- Security and compliance: live TLS controls, data processing terms, retention schedule, hosting region and data location, VAPT and ISO/IEC 27001 programme scope/dates.
- Operations: backup locations, restore test evidence, recovery plan owner, API deprecation notice, report channel and commencement date.
- Credits: claim-processing method and credit-application timetable.
- Legal sign-off: approval of **every highlighted proposed service figure**, the draft wording, and customer/service-provider signatures; replacement with a verified signed PDF.

:::warning Publication gate
Do not remove draft status, enable search indexing, publish a signed-SLA download link, or describe the proposed service figures as guaranteed until Teecoms management and legal reviewers have approved the final terms. Any NRS production-specific promise is conditional on MBS licensing and production go-live.
:::
::::
