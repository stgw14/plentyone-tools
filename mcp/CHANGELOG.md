# Changelog

## [1.3.0] - 2026-01-12

### Added - 21 New Tools (OpenAPI v2 Specification)

Based on official plentymarkets OpenAPI v2 specification, added 21 new read-only tools.

#### Variations Extended (7 tools)
| Tool | Endpoint | Description |
|------|----------|-------------|
| `plenty_search_variations` | `GET /rest/items/variations` | Global variation search with filters |
| `plenty_get_variation_stock` | `GET /rest/items/{id}/variations/{variationId}/stock` | Stock per warehouse |
| `plenty_list_variation_sales_prices` | `GET /rest/items/{id}/variations/{variationId}/variation_sales_prices` | Sales prices |
| `plenty_list_variation_categories` | `GET /rest/items/{id}/variations/{variationId}/variation_categories` | Linked categories |
| `plenty_list_variation_suppliers` | `GET /rest/items/{id}/variations/{variationId}/variation_suppliers` | Linked suppliers |
| `plenty_list_variation_warehouses` | `GET /rest/items/{id}/variations/{variationId}/variation_warehouses` | Linked warehouses |
| `plenty_get_variation_descriptions` | `GET /rest/items/{id}/variations/{variationId}/descriptions` | Product texts |

#### Stock Movements (2 tools)
| Tool | Endpoint | Description |
|------|----------|-------------|
| `plenty_list_variation_stock_movements` | `GET /rest/items/{id}/variations/{variationId}/stock/movements` | Variation stock history |
| `plenty_list_warehouse_stock_movements` | `GET /rest/stockmanagement/warehouses/{warehouseId}/stock/movements` | Warehouse stock history |

#### Orders Extended (3 tools)
| Tool | Endpoint | Description |
|------|----------|-------------|
| `plenty_get_order_dates` | `GET /rest/orders/{orderId}/dates` | Order dates (created, paid, shipped) |
| `plenty_get_order_status_history` | `GET /rest/orders/{orderId}/status-history` | Status change history |
| `plenty_list_shipping_countries` | `GET /rest/orders/shipping/countries` | Shipping countries |

#### Contacts Extended (3 tools)
| Tool | Endpoint | Description |
|------|----------|-------------|
| `plenty_get_contact_banks` | `GET /rest/accounts/contacts/{contactId}/banks` | Bank accounts |
| `plenty_get_contact_related_data` | `GET /rest/accounts/contacts/{contactId}/related_data` | Related data |
| `plenty_get_contact_order_summary` | `GET /rest/accounts/order_summaries/contacts/{contactId}` | Order summary |

#### Manufacturers (2 tools)
| Tool | Endpoint | Description |
|------|----------|-------------|
| `plenty_list_manufacturers` | `GET /rest/items/manufacturers` | List manufacturers |
| `plenty_get_manufacturer` | `GET /rest/items/manufacturers/{id}` | Get manufacturer |

#### Units (2 tools)
| Tool | Endpoint | Description |
|------|----------|-------------|
| `plenty_list_units` | `GET /rest/items/units` | List units |
| `plenty_get_unit` | `GET /rest/items/units/{id}` | Get unit |

#### Shipping Profiles (2 tools)
| Tool | Endpoint | Description |
|------|----------|-------------|
| `plenty_list_shipping_presets` | `GET /rest/orders/shipping/presets` | Shipping profiles |
| `plenty_list_item_shipping_profiles` | `GET /rest/items/item_shipping_profiles` | Item shipping profiles |

### Summary

- **Total tools: 71** (50 existing + 21 new)
- All endpoints verified against OpenAPI v2 specification

---

## [1.2.1] - 2026-01-11

### Fixed - OpenAPI Specification Compliance

This release fixes multiple API endpoint paths to match the official plentyONE/plentymarkets OpenAPI v2 specification.

#### Endpoint Fixes

| Tool | Before (Incorrect) | After (Correct) |
|------|-------------------|-----------------|
| `plenty_get_contact_orders` | `/rest/orders?contactId={id}` | `/rest/orders/contacts/{contactId}` |
| `plenty_get_category_branch` | `/rest/categories/{id}/branch` | `/rest/category_branches/{id}` |
| `plenty_get_order_addresses` | `/rest/orders/{orderId}/addresses` | `/rest/orders/{orderId}/addresses/{relationTypeId}` |

#### Parameter Changes

- **`plenty_get_order_addresses`**: Added required `relationTypeId` parameter
  - `1` = Billing/Invoice address
  - `2` = Delivery address

#### Added

- OpenAPI v2 specification file included in `docs/openapi/plentymarkets_openapi_v2.json` for reference

### Previously Fixed in 1.2.0

- `plenty_get_variation`: Added `itemId` parameter, changed path to `/rest/items/{itemId}/variations/{variationId}`
- `plenty_list_variation_barcodes`: Added `itemId` parameter, changed path to `/rest/items/{itemId}/variations/{variationId}/variation_barcodes`

---

## Development Notes

### API Documentation Sources

- **Official OpenAPI Spec**: https://github.com/plentymarkets/api-doc
- **Developer Docs**: https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html
- **Tutorials**: https://developers.plentymarkets.com/en-gb/developers/main/rest-api-guides/

### Key Learnings

1. Always reference the official OpenAPI specification before implementing endpoints
2. Pay attention to path parameters vs query parameters
3. Some endpoints require additional parameters not obvious from the URL pattern
4. Variation endpoints require `itemId` in addition to `variationId`
