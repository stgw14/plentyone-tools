# plentyONE MCP Server

MCP (Model Context Protocol) Server for plentyONE REST API. Enables AI assistants like Claude to interact with plentyONE ERP systems.

## Features

- **Authentication**: Login, logout, token refresh, and user info
- **Contacts**: List, get, addresses, and orders for contacts
- **Items**: Search items, variations, and barcodes
- **Orders**: Search orders, items, addresses, documents, and shipping
- **Stock**: Stock levels, warehouses, locations, and movements
- **Categories**: List, get, and category branches
- **Payments**: List payments, methods, and properties

## Installation

```bash
npm install
npm run build
```

## Configuration

Set the following environment variables:

```bash
export PLENTYONE_BASE_URL="https://your-shop.plentymarkets-cloud01.com"
export PLENTYONE_USERNAME="your-username"
export PLENTYONE_PASSWORD="your-password"
```

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "plentyone": {
      "command": "node",
      "args": ["/path/to/plentyone-mcp-server/dist/index.js"],
      "env": {
        "PLENTYONE_BASE_URL": "https://your-shop.plentymarkets-cloud01.com",
        "PLENTYONE_USERNAME": "your-username",
        "PLENTYONE_PASSWORD": "your-password"
      }
    }
  }
}
```

## Available Tools (32 total)

### Authentication (4 tools)
| Tool | Description |
|------|-------------|
| `plenty_login` | Authenticate and obtain access tokens |
| `plenty_logout` | Log out and clear session |
| `plenty_refresh_token` | Refresh the access token |
| `plenty_get_authorized_user` | Get current user info |

### Contacts (5 tools)
| Tool | Description |
|------|-------------|
| `plenty_list_contacts` | List contacts with filters |
| `plenty_get_contact` | Get a contact by ID |
| `plenty_get_contact_addresses` | Get addresses for a contact |
| `plenty_create_contact_address` | Create a new address for a contact |
| `plenty_get_contact_orders` | Get orders for a contact |

### Items (5 tools)
| Tool | Description |
|------|-------------|
| `plenty_search_items` | Search items with filters |
| `plenty_get_item` | Get an item by ID |
| `plenty_list_variations` | List variations for an item |
| `plenty_get_variation` | Get a specific variation |
| `plenty_list_barcodes` | List all barcodes |

### Orders (6 tools)
| Tool | Description |
|------|-------------|
| `plenty_search_orders` | Search orders with filters |
| `plenty_get_order` | Get an order by ID |
| `plenty_get_order_items` | Get items in an order |
| `plenty_get_order_addresses` | Get addresses for an order |
| `plenty_get_order_documents` | Get documents for an order |
| `plenty_get_order_shipping` | Get shipping info for an order |

### Stock (6 tools)
| Tool | Description |
|------|-------------|
| `plenty_list_stock` | List stock entries with filters |
| `plenty_get_warehouse_stock` | Get stock for a warehouse |
| `plenty_list_warehouses` | List all warehouses |
| `plenty_get_warehouse` | Get a warehouse by ID |
| `plenty_list_warehouse_locations` | List locations in a warehouse |
| `plenty_get_stock_movements` | Get stock movement history |

### Categories (3 tools)
| Tool | Description |
|------|-------------|
| `plenty_list_categories` | List categories with filters |
| `plenty_get_category` | Get a category by ID |
| `plenty_get_category_branch` | Get category path from root |

### Payments (4 tools)
| Tool | Description |
|------|-------------|
| `plenty_list_payments` | List payments with filters |
| `plenty_get_payment` | Get a payment by ID |
| `plenty_list_payment_methods` | List payment methods |
| `plenty_get_payment_properties` | Get payment properties |

## Project Structure

```
src/
├── index.ts           # Server entry point
├── types.ts           # Shared type definitions
├── config.ts          # Configuration
├── http-client.ts     # HTTP client with auth
├── tools/
│   ├── index.ts       # Tools aggregation
│   ├── auth.ts        # Authentication tools
│   ├── contacts.ts    # Contacts tools
│   ├── items.ts       # Items tools
│   ├── orders.ts      # Orders tools
│   ├── stock.ts       # Stock tools
│   ├── categories.ts  # Categories tools
│   └── payments.ts    # Payments tools
└── handlers/
    ├── index.ts       # Handlers aggregation
    ├── auth.ts        # Authentication handlers
    ├── contacts.ts    # Contacts handlers
    ├── items.ts       # Items handlers
    ├── orders.ts      # Orders handlers
    ├── stock.ts       # Stock handlers
    ├── categories.ts  # Categories handlers
    └── payments.ts    # Payments handlers
```

## Example Usage

```
User: Log in to plentyONE
Assistant: [calls plenty_login]

User: Show me the last 10 orders
Assistant: [calls plenty_search_orders with itemsPerPage=10]

User: What's the stock level for variation 12345?
Assistant: [calls plenty_list_stock with variationId=12345]

User: List all payment methods
Assistant: [calls plenty_list_payment_methods]
```

## Development

```bash
# Watch mode for development
npm run dev

# Build
npm run build

# Run
npm start
```

## License

MIT
