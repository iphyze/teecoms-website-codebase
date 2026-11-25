---
title: Visual PDF samples
description: Fictional DigitalInvoice PDF examples showing standard layouts and illustrative verification fields.
version: 1.1
effective:
updated: 2026-11-25
status: published
pdf:
---

## Scope and authenticity

These documents demonstrate the layout and data presentation of DigitalInvoice's **own PDF document system**, including business-to-business (B2B) invoices, business-to-consumer (B2C) simplified invoices, credit notes and payment receipts. The downloadable files are built using the document model and PDF templates from the DigitalInvoice application, with fixed **fictional test data**.

:::info Fictional document illustrations
All records, business names and amounts used here are invented for demonstration. The verification-field examples contain explicitly mock IRN, CSID and QR details. They illustrate design and field positioning, **not an official NRS validation or clearance result**.
:::

## Two presentation layouts per document

| Layout | What the PDF displays | Purpose |
| --- | --- | --- |
| **Standard document layout** | The regular DigitalInvoice PDF design with fictional seller, buyer, line, tax and amount details | Show the appearance of each document type |
| **Illustrative verification-field layout** | The same PDF design with mock **IRN**, **CSID** and **QR** fields | Show the intended visual placement of verification details; values are illustrative only |

The demonstration QR contains a mock-only message instead of an official verification reference. The payment receipt illustration refers to a fictional linked invoice. **Phase 5 does not add a signing service, a cleared invoice PDF, or a verified production IRN/CSID/QR**, so these examples and their binary PDFs/PNGs have not been altered to imply such outcomes.

## Documents illustrated

| Document type | Content |
| --- | --- |
| B2B tax invoice | Invoice lines, discount, VAT calculation, totals, business buyer details |
| B2C simplified invoice | Consumer invoice with one VAT-rated line |
| Credit note | Adjustment reason, original invoice reference, negative credit total |
| Payment receipt | Receipt amount, allocation and illustrative invoice reference |

## Visual sample gallery

Eight document cards appear immediately below this section: one for each document type and each of the two layouts. Each example includes a fictional PDF and matching PNG preview, available for download from this gallery. The samples demonstrate presentation and document fields, not NRS acceptance.

:::info File integrity and publication
The eight PDF/PNG pairs are published as illustrative samples. The static site verifies that matching PDF and PNG files are available together, and the examples remain separate from production NRS evidence.
:::

## Phase 5 integration status and sample boundaries

DigitalInvoice's **backend** now has permission-controlled, sandbox-gated reference-code synchronisation, local official-code preflight and an approved-invoice NRS sandbox `/validate` request path. These features are **not document generation features** and have not been independently run against a live authorised NRS sandbox in this review. An accepted sandbox validation response would not amount to signing, clearance, production evidence or a new sample certificate.

The downloadable PDFs and PNG previews remain **eight fictional visual illustrations**, not certificates or proof of tax-authority validation. See the [API documentation](/developers/api/) for sandbox and production integration boundaries.

## Generation and verification

The generator belongs in the DigitalInvoice **application root** containing the PDF templates (`scripts/generate-nrs-samples.mjs`) and runs without API credentials, database access or an NRS network connection. The Teecoms site's `docs/BUILD-GUIDE.md` documents the exact generation command, prerequisites, paths and publication checks.

All examples use fictional data and mock-only verification fields. They are provided so integrators and reviewers can inspect document layouts without handling production customer records or authentic NRS-issued identifiers.

## Related documentation

See the [API documentation](/developers/api/) and [invoice data structure](/developers/data-structure/) for the local integration model, data fields and explicit licence restrictions. The [Service Level Agreement](/sla/) is approved, effective **27 November 2026**; fictional samples are not official NRS validation evidence.
