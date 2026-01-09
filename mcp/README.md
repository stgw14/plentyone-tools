# plentyONE MCP Server

A Model Context Protocol (MCP) server for accessing plentyONE ERP API from Claude Desktop and other MCP-compatible AI assistants.

🇯🇵 [日本語版 README](README.ja.md)

## 🚀 Quick Start

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

## 🔧 Available Tools (25 total)

### Authentication (4 tools)

| Tool | Description |
|------|-------------|
| `plenty_login` | Authenticate with plentyONE |
| `plenty_logout` | Logout and clear session |
| `plenty_refresh_token` | Refresh access token |
| `plenty_get_authorized_user` | Get current user info |

### Contacts (4 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_contacts` | List contacts with filtering (email, name, type, date) |
| `plenty_get_contact` | Get contact by ID with related data |
| `plenty_get_contact_addresses` | Get all addresses for a contact |
| `plenty_get_contact_orders` | Get order history for a contact |

### Items (5 tools)

| Tool | Description |
|------|-------------|
| `plenty_search_items` | Search items by name, ID, with pagination |
| `plenty_get_item` | Get item details by ID |
| `plenty_list_variations` | List all variations for an item |
| `plenty_get_variation` | Get specific variation by item ID and variation ID |
| `plenty_list_barcodes` | List all barcodes |

### Orders (6 tools)

| Tool | Description |
|------|-------------|
| `plenty_search_orders` | Search orders with filtering (status, date, plentyId) |
| `plenty_get_order` | Get order by ID with related data |
| `plenty_get_order_items` | Get order line items |
| `plenty_get_order_addresses` | Get billing/shipping addresses |
| `plenty_get_order_documents` | Get invoices, delivery notes, etc. |
| `plenty_get_order_shipping` | Get shipping packages and tracking |

### Stock (6 tools)

| Tool | Description |
|------|-------------|
| `plenty_list_stock` | List stock entries with filtering |
| `plenty_get_warehouse_stock` | Get stock for a specific warehouse |
| `plenty_list_warehouses` | List all warehouses |
| `plenty_get_warehouse` | Get warehouse details by ID |
| `plenty_list_warehouse_locations` | List storage locations in a warehouse |
| `plenty_get_stock_movements` | Get stock movement history |

## 📖 Usage Examples

Once configured, you can ask Claude:

- "Login to plentyONE and show me today's orders"
- "Search for customer with email customer@example.com"
- "What's the stock level for variation 1234?"
- "Show me orders from the last 7 days"
- "List all warehouses"

## 🔧 Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Project Structure

```
mcp/
├── src/
│   └── index.ts           # Main server implementation
├── dist/                   # Compiled output
├── package.json
├── tsconfig.json
└── claude_desktop_config.example.json
```

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLENTYONE_BASE_URL` | Yes | plentyONE API base URL |
| `PLENTYONE_USERNAME` | Yes | API username |
| `PLENTYONE_PASSWORD` | Yes | API password |

## 🔒 Security Notes

- Access tokens are stored in memory and expire with the session
- Automatic token refresh on 401 responses
- Never commit credentials to version control

## 📝 License

Internal use only - Knitido GmbH
