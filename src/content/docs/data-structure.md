---
title: Invoice data structure and field mapping
description: DigitalInvoice's locally validated NRS MBS UBL-style JSON projection, database mapping and fictional test payloads.
version: 1.1
effective:
updated: 2026-11-25
status: published
pdf:
---

# Invoice data structure and field mapping

## Overview and integration status

This document describes the **outgoing UBL-style invoice JSON structure** produced by DigitalInvoice's PHP `firsUblPayload` adapter and checked by its local preflight validator. It covers standard B2B invoices, simplified B2C invoices, credit notes, line details, tax and payment amounts, classification codes and database traceability. The model is based on the **NRS MBS invoice-schema v1.1 profile** used by DigitalInvoice.

:::warning Local schema — not an official NRS schema
The downloadable JSON Schema is **DigitalInvoice's own Draft 2020-12 projection**, not a schema exported or certified by NRS. The JSON samples are fictional **generated unit-test fixtures**, not accepted submissions, real customer invoices, NRS-issued IRNs or evidence of clearance. The final NRS specification, official reference data and remote validation remain authoritative.
:::

The adapter and local validation are implemented, but **Teecoms does not yet hold an NRS MBS licence**. Live NRS submission is disabled and no production acceptance, signing or QR response is represented by these files. The [API reference](/developers/api/) explains the separately authenticated ERP integration API, which is not an NRS submission API.

## Downloads

| File | Purpose | Format |
| --- | --- | --- |
| [Invoice JSON Schema v1.0](/docs/digitalinvoice-invoice-schema-v1.0.json) | Exact copy of the backend's local `nrs-ubl-v1.1-local.schema.json` | JSON Schema Draft 2020-12 |
| [Field mapping v1.0](/docs/digitalinvoice-field-mapping-v1.0.csv) | 54 traced mappings, including current database snapshots and implementation gaps | CSV, UTF-8 |
| [B2B invoice fixture](/docs/sample-payloads/digitalinvoice-b2b-multi-line-discount-vat-v1.0.json) | Two invoice lines, standard VAT, header discount | JSON |
| [B2C simplified fixture](/docs/sample-payloads/digitalinvoice-b2c-simplified-v1.0.json) | Simplified transaction kind `B2C` | JSON |
| [Credit-note fixture](/docs/sample-payloads/digitalinvoice-credit-note-v1.0.json) | Credit note (`381`) with a **fictional** original-invoice IRN | JSON |
| [VAT-exempt fixture](/docs/sample-payloads/digitalinvoice-vat-exempt-v1.0.json) | Zero VAT amount with an exempted tax-category test value | JSON |
| [Mixed-tax fixture](/docs/sample-payloads/digitalinvoice-multiple-tax-categories-v1.0.json) | Standard-tax and exempt lines with separate tax subtotals | JSON |
| [Two-level discount fixture](/docs/sample-payloads/digitalinvoice-two-level-discount-v1.0.json) | Line discount plus invoice-level allowance | JSON |

All six JSON examples are **byte-for-byte copies** of DigitalInvoice's `tests/generated_fixtures/*.json` at the documentation revision date. They are not built from records in production customer records. The documentation download filenames are versioned separately from the internal NRS v1.1-style schema profile.

## Structure at a glance

The root is a JSON object. Its fields are grouped below according to the actual adapter and local schema; array notation uses `[]` to indicate one or more entries when provided.

| Section | Key fields | Purpose |
| --- | --- | --- |
| Identity and document | `business_id`, `irn`, `issue_date`, `due_date`, `invoice_type_code`, `invoice_kind` | NRS business identity and invoice identification; locally required values may be unavailable before licensing |
| Currency and references | `document_currency_code`, `tax_currency_code`, `buyer_reference`, `order_reference`, `note`, `payment_status` | Currency, optional business references and payment state |
| Supplier | `accounting_supplier_party` | Registered organisation name, tax ID, contact and structured address |
| Buyer | `accounting_customer_party` | Buyer snapshot, identification, contact and structured address |
| Payment instructions | `payment_means[]` | Mapped payment-means code and optional due date |
| Invoice-level adjustments | `allowance_charge[]` | Invoice-level discount: an allowance with `charge_indicator: false` |
| Tax summary | `tax_total[].tax_amount`, `tax_total[].tax_subtotal[]` | Totals and subtotals grouped by category and tax rate |
| Monetary summary | `legal_monetary_total` | Line extensions, net amount, tax-inclusive amount and payable amount |
| Invoice lines | `invoice_line[]` | Quantity, item, price, line discounts, tax and goods/service classification |
| Credit-note link | `billing_reference[]` | Original invoice IRN, used only by credit notes when available |

### Supplier and buyer parties

Each party contains `party_name`, `tin`, `email`, optional `telephone` and `business_description`, and a `postal_address` object with `street_name`, `city_name`, `postal_zone`, `lga`, `state` and `country`. The local JSON Schema requires the **presence** of the name, TIN, email and postal address keys. Some properties accept JSON `null` in the schema, while the PHP preflight rejects missing values or, for a B2C buyer's TIN/email, records a warning. This distinction matters: **JSON Schema validity alone does not establish preflight readiness**.

Supplier details come from `organizations` and `organization_compliance_profiles`. Buyer fields use invoice snapshot columns, including `customer_city_snapshot`, `customer_nrs_postal_zone_snapshot`, `customer_nrs_state_code_snapshot` and `customer_nrs_lga_code_snapshot`. The current invoice extraction **does not fall back to changed customer master data** for missing historical address codes.

### Invoice lines, classifications and unit prices

Each `invoice_line[]` contains `id`, `invoiced_quantity`, `line_extension_amount`, `discount_amount`, `fee_amount`, `item`, `price` and line-level `tax_total`. The `item` object includes a name, description and seller's item reference; `price` contains `price_amount`, `base_quantity` (currently `1`) and `price_unit`.

A **goods** line includes `hsn_code` and `product_category`; a **service** line includes `isic_code` and `service_category`. The adapter sets the classification-code key based on the stored goods/service type and NRS classification snapshot. The current local invoice extraction does not supply the corresponding `product_category` or `service_category` values; consequently, its strict PHP preflight can block otherwise populated lines. The downloadable fixtures deliberately supply fictional classification values so the adapter's structure can be tested, not to claim valid NRS resource codes.

### Tax totals and monetary totals

The adapter creates a `tax_total` entry holding `tax_amount` and `tax_subtotal[]`; each subtotal has `taxable_amount`, `tax_amount` and `tax_category` (`id`, `percent`). The tax subtotals are grouped by the category identifier and rate from the invoice-line snapshots. Line tax amounts and taxable amounts are based on persisted post-discount figures.

`legal_monetary_total` includes `line_extension_amount`, `tax_exclusive_amount`, `tax_inclusive_amount` and `payable_amount`. Current `payable_amount` matches the full document total; it does not subtract payments already recorded against the invoice.

## Source-to-NRS field mapping

The table below highlights representative mappings. The [complete downloadable CSV](/docs/digitalinvoice-field-mapping-v1.0.csv) contains **54 rows**, including individual supplier and buyer address properties, tax and payment fields, goods/service codes, and credit-note references. `Required` here describes the current PHP preflight or field applicability, not a claim about the authoritative NRS remote validator.

| DigitalInvoice source | Outgoing JSON field | Database column | Requirement |
| --- | --- | --- | --- |
| `nrs_business_id` | `business_id` | `organization_compliance_profiles.nrs_business_id` | Required; NRS-issued UUID |
| `nrs_irn` | `irn` | `invoices.nrs_invoice_identifier` | Required by local preflight; not locally invented |
| `issue_date` | `issue_date` | `invoices.invoice_date` / `credit_notes.credit_note_date` | Required |
| `firs_metadata.invoice_type_code` | `invoice_type_code` | `invoices.firs_invoice_type_code` | Required; supported conversion `380` or `381` |
| `firs_metadata.transaction_type` | `invoice_kind` | `invoices.firs_transaction_type` | Required; currently B2B/B2C |
| `supplier.name`, `supplier.tin` | `accounting_supplier_party.party_name`, `.tin` | `organizations.name`, `.tax_identification_number` | Required |
| `supplier.postal_address` | `accounting_supplier_party.postal_address` | `organizations.*` + `organization_compliance_profiles.nrs_*` | Required by preflight |
| `buyer.name`, `buyer.tin` | `accounting_customer_party.party_name`, `.tin` | `invoices.customer_name_snapshot`, `.customer_tin_snapshot` | Name required; TIN conditional for B2C |
| `buyer.postal_address` | `accounting_customer_party.postal_address` | `invoices.customer_*_snapshot` fields | Required by preflight |
| `firs_metadata.payment_means_code` | `payment_means[].payment_means_code` | `invoices.firs_payment_means_code` | If supported mapping exists |
| `amounts.invoice_discount_amount` | `allowance_charge[].amount` | `invoices.invoice_discount_amount` / `credit_notes.invoice_discount_amount` | When discount exists |
| `items[].taxable_amount`, `.tax_amount` | `tax_total[].tax_subtotal[]` | `invoice_items` / `credit_note_items` tax snapshots | Required |
| `amounts.net_amount` | `legal_monetary_total.tax_exclusive_amount` | `invoices.net_amount` / `credit_notes.net_amount` | Required |
| `amounts.total_amount` | `legal_monetary_total.payable_amount` | `invoices.total_amount` / `credit_notes.total_amount` | Required |
| `items[].quantity`, `.unit_code` | `invoice_line[].invoiced_quantity`, `.price.price_unit` | `invoice_items.quantity`, `.firs_unit_code_snapshot` | Required |
| `items[].classification_code` | `invoice_line[].hsn_code` / `.isic_code` | `invoice_items.nrs_item_classification_snapshot` | Goods / service conditional |
| `items[].product_category` / `.service_category` | `invoice_line[].product_category` / `.service_category` | Not populated by current invoice extraction | Goods / service conditional; gap |
| `source_irn` | `billing_reference[].irn` | Original `invoices.nrs_invoice_identifier` | Credit notes require original NRS IRN |

:::info Source-of-truth correction
An earlier backend CSV described buyer state, LGA and postal-zone data as coming from the **current** customer record. The current `firsLocalInvoicePayload` implementation instead uses **invoice snapshots**, so this published CSV reflects the newer code and SQL structure. Missing historical snapshots must be corrected through a verified data-migration or reissue process, not silently reconstructed from changed customer details.
:::

## Codes and reference data

| Domain | Current adapter / application behaviour | Important limitation |
| --- | --- | --- |
| Invoice type | `commercial_invoice` → `380`; credit note / `credit_invoice` → `381` | The UI catalogue lists more document types, but this adapter does **not** map all of them to official numeric codes |
| Transaction kind | Local invoice options `b2b`, `b2c` → `B2B`, `B2C` | Schema also recognises `B2G` and `G2B`; this does not mean current UI supports them |
| Payment means | `cash` → `10`; `direct_transfer`, `bank_transfer`, `credit_transfer` → `30` | Other locally listed options need official resource mappings; they are **not** silently substituted |
| Tax category | Local standard-VAT fallback is `STANDARD_VAT` | Local placeholders such as `VAT_ZERO`, `VAT_EXEMPT` and `NON_TAXABLE` do not automatically become valid NRS codes |
| Goods/service codes | `hsn_code` for goods, `isic_code` for services | Test-fixture codes such as `00000000` and `0000` are fictional |
| Units | Line `price_unit` from a stored unit-code snapshot | Must be checked against official NRS quantity/unit resources |
| Currency | Uppercase three-letter ISO 4217 format | Current adapter copies invoice currency to tax currency; remote accepted-code catalogue still governs |
| Buyer tax ID / email | Missing B2C values produce a PHP preflight warning | NRS's latest sandbox rule must be checked; warnings are not acceptance guarantees |

The backend includes reference-cache entries for invoice types, payment means, tax categories, currencies, VAT exemptions, HS codes and service codes. **Phase 5 adds authenticated sandbox synchronisation** for invoice types, payment means, tax categories, currencies, quantity codes, HS codes, service codes, states and LGAs. Entries marked `manual_seed` or `pending_license` remain local-only; only an accepted authenticated response may mark an entry `synced`. The previous catalogue is preserved on failed sync. These controls do not prove that official catalogues have actually been fetched on the deployed service.

## NRS v1.1 specification update crosswalk

The official [NRS API changelog](https://einvoice.nrs.gov.ng/changelog) records **April 2026**, **February 2026** and **December 2025** additions relevant to this projection:

| Official update | Verified local behaviour | Outstanding condition |
| --- | --- | --- |
| `invoice_kind`: B2C/B2B/B2G/G2B | Local JSON Schema and `firsUblValidate` accept all four; invoice workflow and stored transaction type only permit B2B/B2C | B2G/G2B end-to-end creation, approval, queue and reporting **not implemented** in the current workflow |
| `payment_status: PARTIAL` | PHP UBL adapter maps `partially_paid` to `PARTIAL`; local schema admits the value | Production NRS payment-update sender and acknowledgement reconciliation **not verified** |
| `/resources/invoice-quantity-codes` | Phase 5 supports authenticated sandbox `quantity_codes` synchronisation and compares line `price.price_unit` against the `synced` list | A working provider response and correct codes in historic invoice snapshots still require actual sandbox verification |
| `Withholding_Tax`, `Stamp_Duty`, `Exempted` | Local tax projection is category-aware and fixtures cover VAT/exempt examples | These 2026 tax classes are **not demonstrated as configured/calculated/reportable**; verify official identifiers and treatment |
| Incorporation-number identifier fallback | Buyer TIN snapshot exists | October 2025 NRS fallback-format and ownership checks are **not demonstrated end to end** |
| State/LGA address fields | Invoice snapshots and local postal/state/LGA preflight checks exist; Phase 5 can sync `states` and `lgas` from the approved sandbox | Require real fetched catalogues and auditable historical snapshots |

The NRS [invoice-schema v1.1 reference](https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema?version=1.1) identifies mandatory elements including `BusinessID`, `IRN`, issue date, invoice type and kind, currencies, supplier party, tax totals, monetary totals and invoice lines. Our published schema is a **local snake_case adapter**, not an official NRS-issued JSON Schema. Its `payment_status` enum can include `REJECTED`, but the current adapter only emits `PAID`, `PARTIAL` and `PENDING` from payment records. Schema acceptance is not proof of application workflow coverage.

The [NRS System Integrator requirements](https://einvoice.nrs.gov.ng/serivce-providers/system-integrators) and [invoice schema documentation](https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema?version=1.1) remain authoritative for signing, SI/APP responsibilities and reference-code changes. DigitalInvoice tracks the current v1.1 specifications and updates its local payload mapping as NRS publishes changes.


## Phase 5 official-code preflight — separate from monetary checks

The new `official_code_preflight` readiness result performs an **offline comparison** of the prepared invoice against code lists whose cache status is `synced` from an authenticated NRS sandbox response. It checks invoice type, document currency, payment means, supplier and buyer state/LGA, each invoice-line quantity code, goods HS or services classification, and tax category IDs. Missing classifications and manually entered codes do not count as official verification.

This validation is in addition to, not a replacement for, the local JSON Schema and integer-kobo financial reconciliation below. Only approved B2B/B2C invoice snapshots that pass both local UBL checks and this official-code preflight can be **offered to the separate permission-controlled sandbox `/validate` operation**. An external sandbox request requires authorised credentials and compliant invoice identifiers; no successful NRS sandbox response is included in these downloadable fixtures.

:::warning Issued invoice identifiers are immutable business evidence
The local application may issue invoice numbers such as `INV-000001`, which do not meet the current IRN component check. Phase 5 blocks them instead of removing punctuation. A collision-safe, persisted NRS alias/numbering design and official acceptance testing remain outstanding; do not rewrite issued invoice numbers in sample mappings.
:::

## Validation and kobo reconciliation

The PHP preflight `firsUblValidate` checks identity and format fields, party details, structured addresses, line quantities, goods/service classification, tax categories, credit-note original references and financial equality. The downloaded JSON Schema separately checks structural types, allowed values, object properties and numeric constraints. **Both checks are local. Neither calls NRS.**

### Financial equality rules

All persisted monetary values are decimal amounts with two fractional digits. The adapter converts them to **integer kobo** for arithmetic and equality checks, then emits JSON numeric amounts. The principal rules are:

1. **Line extension** = line gross amount − line discount. The header line extension equals the sum of the invoice-line extensions.
2. **Invoice-level discount** becomes a separate `allowance_charge` item with `charge_indicator: false`; it is not deducted twice from each line.
3. **Tax-exclusive total** = sum of line extensions − invoice-level discount.
4. **Tax-inclusive total** = tax-exclusive total + the header tax amount; the current `payable_amount` equals this tax-inclusive total.
5. **Tax reconciliation:** header tax = sum of line taxes = sum of the tax-subtotal amounts. Tax subtotals are grouped by code and rate.
6. **Database reconciliation:** when original local amounts are supplied, the emitted totals are compared to the document's persisted subtotal, line discount, header discount, net and total fields.

The values below are taken from the unmodified **generated two-level-discount fixture**, not hand-authored invoice data:

| Amount (fictional NGN) | Fixture value |
| --- | ---: |
| Line gross | 300.00 |
| Line discount | 20.00 |
| `line_extension_amount` | 280.00 |
| Invoice-level allowance | 50.00 |
| `tax_exclusive_amount` | 230.00 |
| `tax_total[0].tax_amount` | 17.25 |
| `tax_inclusive_amount` and `payable_amount` | 247.25 |

The local number parser rejects monetary text with more than two fractional digits; line quantity is stored at up to four fractional digits. Do not independently recompute tax from rounded display values if the persisted per-line amounts are authoritative.

### Running the local schema test

To validate the published fixtures against the published *local* JSON Schema, save the schema and JSON files from the links above and run a Draft 2020-12-compatible JSON Schema validator. For reproducible local validation, the DigitalInvoice backend test command is:

```bash
# Requires Python 3 and the optional jsonschema package.
python3 -m pip install jsonschema
python3 tests/nrs_ubl_jsonschema.py
```

The command checks the backend source schema and all six generated fixtures. It is an **offline structural check** and does not perform NRS remote validation.

## Sample payloads — fictional test data

### B2B invoice

[Open the full B2B JSON payload](/docs/sample-payloads/digitalinvoice-b2b-multi-line-discount-vat-v1.0.json). It contains two goods lines, a header-level allowance and the standard-VAT test category. The fixture has `invoice_kind: "B2B"` and `invoice_type_code: "380"`.

### B2C simplified invoice

[Open the full B2C JSON payload](/docs/sample-payloads/digitalinvoice-b2c-simplified-v1.0.json). It has `invoice_kind: "B2C"` and code `380`; the UI's simplified document setting is **not** a separate outgoing `firs_document_type` field in the DigitalInvoice UBL adapter. The fixture retains populated buyer details for test convenience and does **not** establish that every field is mandatory for a real B2C submission.

### Credit note

[Open the full credit-note JSON payload](/docs/sample-payloads/digitalinvoice-credit-note-v1.0.json). It has code `381` and a `billing_reference[]` pointing to a **mock**, fictional source-invoice IRN. Actual credit-note readiness requires the original invoice's genuine NRS IRN; the current credit-note table has no separate NRS IRN column for the credit note itself.

### Other local scenarios

The [VAT-exempt](/docs/sample-payloads/digitalinvoice-vat-exempt-v1.0.json), [mixed-tax](/docs/sample-payloads/digitalinvoice-multiple-tax-categories-v1.0.json) and [two-level discount](/docs/sample-payloads/digitalinvoice-two-level-discount-v1.0.json) fixtures exercise tax buckets and discounts. Their classification and tax-category values are test fixtures, **not** a published catalogue of official NRS values.

:::warning Mock values are not NRS evidence
All sample UUIDs, IRNs, addresses, seller/buyer names, tax identifiers, classification codes and invoice values are synthetic test inputs. No PDF, QR, CSID, NRS validation response or production submission result is included in these JSON fixtures. The [visual PDF gallery](/developers/samples/) now contains eight fictional documents and paired PNG previews.
:::

## Known limitations before production go-live

- **Licensing and sandbox evidence:** the MBS production gate remains closed. Authenticated sandbox catalogue sync and `/validate` code paths exist, but successful provider responses are not evidenced here; NRS-issued IDs, official lists and validated IRNs must not be invented.
- **Goods and services:** category fields required by the PHP preflight are not yet populated in `firsLocalInvoicePayload`; implement and test a verified data source before live submission.
- **Credit notes:** the preview uses the source invoice's IRN if available but currently may not populate the original invoice's issue date in `billing_reference`, because it reads a non-existent `credit_notes.invoice_date` field. Verify and correct this in the backend before production submission; fixture completeness does not resolve it.
- **Older invoice snapshots:** missing historical buyer location codes remain unavailable rather than falling back to current customer data. Reconcile historical records using auditable source evidence.
- **Authoritative acceptance:** Phase 5 checks only officially fetched code lists and offers sandbox validation; actual sandbox interoperability, remote schema changes and NRS response semantics must be tested with authorised credentials, without treating success as clearance.

## Versioning and support

This **documentation version 1.1** reflects the November 2026 backend review, including the **13 November Phase 5 update**, compared with publicly described NRS v1.1 requirements. The downloadable JSON Schema identifies itself as a local projection of **NRS invoice schema v1.1**; these two version numbers serve different purposes. When adapter fields or database mappings change, update this article, regenerate the CSV and samples from the actual backend, validate them, and publish new versioned filenames without changing `/developers/data-structure/`.

For integration guidance see the [API documentation](/developers/api/) and for contractual service terms see the [approved SLA](/sla/). Production and sandbox access is provisioned through authorised integration channels; credentials are never distributed through public documentation.
