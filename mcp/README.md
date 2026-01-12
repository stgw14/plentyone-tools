# plentyONE MCP Server

A Model Context Protocol (MCP) server for accessing plentyONE ERP API from Claude Desktop, Claude Code, and other MCP-compatible AI assistants.

🇯🇵 [日本語版 README](README.ja.md)

## Features

**50 tools** across 15 categories for comprehensive plentyONE ERP integration.

| Category | Tools | Description |
|----------|-------|-------------|
| Authentication | 4 | Login, logout, token refresh, user info |
| Contacts | 4 | List, get, addresses, orders |
| Items | 6 | Search, get, variations, barcode types, variation barcodes |
| Orders | 6 | Search, get, items, addresses, documents, shipping |
| Stock | 4 | List, warehouse stock, warehouses |
| Categories | 3 | List, get, branch |
| Payments | 4 | List, get, methods, properties |
| Attributes | 3 | List, get, values (size, color, etc.) |
| Sales Prices | 2 | List, get price configurations |
| Properties | 3 | List, get, groups |
| Tags | 2 | List, get |
| VAT | 1 | List configurations |
| Accounts | 4 | List, get, contact classes/types |
| Order Meta | 2 | Statuses, referrers |
| Countries | 1 | List countries |
| Item Images | 1 | List images for item |

## Quick Start

### Installation

```bash
cd mcp
npm install
npm run build
```

### Claude Code Configuration

Add the MCP server using the `claude mcp add` command:

```bash
claude mcp add plentyone \
  -e PLENTYONE_BASE_URL=https://your-shop.plentymarkets-cloud01.com \
  -e PLENTYONE_USERNAME=your_api_username \
  -e PLENTYONE_PASSWORD=your_api_password \
  -- node /path/to/plentyone-tools/mcp/dist/index.js
```

Verify installation:

```bash
claude mcp list
```

### Claude Desktop Configuration

Add to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "plentyone": {
      "command": "node",
      "args": ["/path/to/plentyone-tools/mcp/dist/index.js"],
      "env": {
        "PLENTYONE_BASE_URL": "https://your-shop.plentymarkets-cloud01.com",
        "PLENTYONE_USERNAME": "your_api_username",
        "PLENTYONE_PASSWORD": "your_api_password"
      }
    }
  }
}
```

See `claude_desktop_config.example.json` for a complete example.

### Gemini CLI Configuration

Add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "plentyone": {
      "command": "node",
      "args": ["/path/to/plentyone-tools/mcp/dist/index.js"],
      "env": {
        "PLENTYONE_BASE_URL": "https://your-shop.plentymarkets-cloud01.com",
        "PLENTYONE_USERNAME": "your_api_username",
        "PLENTYONE_PASSWORD": "your_api_password"
      }
    }
  }
}
```

## Tool Reference

### Authentication (4 tools)

| Tool | Description |
|------|-------------|
| `plenty_login` | Login to plentyONE and get access token |
| `plenty_logout` | Logout and invalidate token |
| `plenty_refresh_token` | Refresh the access token |
| `plenty_get_authorized_user` | Get current user info |

### Contacts (4 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_contacts` | List contacts with filters (name, email, type, country) |
| `plenty_get_contact` | Get contact by ID |
| `plenty_get_contact_addresses` | Get addresses for a contact |
| `plenty_get_contact_orders` | Get orders for a contact |

### Items (6 tools)

| Tool | Description |
|------|-------------|
| `plenty_search_items` | Search items with filters |
| `plenty_get_item` | Get item by ID |
| `plenty_list_variations` | List variations for an item |
| `plenty_get_variation` | Get variation by ID |
| `plenty_list_barcodes` | List barcode types (GTIN, UPC, etc.) |
| `plenty_list_variation_barcodes` | List barcodes for a specific variation |

### Orders (6 tools)

| Tool | Description |
|------|-------------|
| `plenty_search_orders` | Search orders with filters |
| `plenty_get_order` | Get order by ID |
| `plenty_get_order_items` | Get items for an order |
| `plenty_get_order_addresses` | Get addresses for an order |
| `plenty_get_order_documents` | Get documents for an order |
| `plenty_get_order_shipping` | Get shipping info for an order |

### Stock (4 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_stock` | List stock with filters |
| `plenty_get_warehouse_stock` | Get stock for a warehouse |
| `plenty_list_warehouses` | List all warehouses |
| `plenty_get_warehouse` | Get warehouse by ID |

### Categories (3 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_categories` | List categories with filters |
| `plenty_get_category` | Get category by ID |
| `plenty_get_category_branch` | Get category branch (path from root) |

### Payments (4 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_payments` | List payments with filters |
| `plenty_get_payment` | Get payment by ID |
| `plenty_list_payment_methods` | List payment methods |
| `plenty_get_payment_properties` | Get payment properties |

### Attributes (3 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_attributes` | List item attributes (size, color, etc.) |
| `plenty_get_attribute` | Get attribute by ID |
| `plenty_list_attribute_values` | List values for an attribute |

### Sales Prices (2 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_sales_prices` | List sales price configurations |
| `plenty_get_sales_price` | Get sales price by ID |

### Properties (3 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_properties` | List item properties |
| `plenty_get_property` | Get property by ID |
| `plenty_list_property_groups` | List property groups |

### Tags (2 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_tags` | List tags |
| `plenty_get_tag` | Get tag by ID |

### VAT (1 tool)

| Tool | Description |
|------|-------------|
| `plenty_list_vat_configurations` | List VAT configurations |

### Accounts (4 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_accounts` | List accounts (companies) |
| `plenty_get_account` | Get account by ID |
| `plenty_list_contact_classes` | List contact classes (customer groups) |
| `plenty_list_contact_types` | List contact types |

### Order Meta (2 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_order_statuses` | List order statuses |
| `plenty_list_order_referrers` | List order referrers (sales channels) |

### Countries (1 tool)

| Tool | Description |
|------|-------------|
| `plenty_list_countries` | List countries |

### Item Images (1 tool)

| Tool | Description |
|------|-------------|
| `plenty_list_item_images` | List images for an item |

## Usage Examples

```
User: Search for contacts named "Müller"
Assistant: [calls plenty_list_contacts with name="Müller"]

User: Show me the stock in warehouse 1
Assistant: [calls plenty_get_warehouse_stock with warehouseId=1]

User: What orders were placed today?
Assistant: [calls plenty_search_orders with createdAtFrom="2026-01-11"]

User: List all payment methods
Assistant: [calls plenty_list_payment_methods]

User: Show me all size and color attributes
Assistant: [calls plenty_list_attributes]
```

## Changelog

### v1.2.0 (2026-01-11)
- Added 17 new tools for Attributes, Sales Prices, Properties, Tags, VAT, Accounts, Order Meta, Countries, Item Images
- Removed 3 non-functional tools (shipping_profiles, warehouse_locations, stock_movements)
- **Total: 50 tools** (v1.1.0: 33 → v1.2.0: 50)

### v1.1.0
- Added Categories (3 tools), Payments (4 tools)
- Modular architecture refactoring
- **Total: 33 tools** (v1.0.0: 25 → v1.1.0: 33)

### v1.0.0
- Initial release
- Authentication, Contacts, Items, Orders, Stock
- **Total: 25 tools**

## Development

```bash
# Watch mode
npm run dev

# Build
npm run build

# Run
npm start
```

## License

MIT
