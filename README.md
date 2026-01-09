# plentyONE Tools

A collection of tools and clients for integrating with the plentyONE ERP system.

🇯🇵 [日本語版 README](README.ja.md)

## 📁 Structure

```
plentyone-tools/
├── mcp/          # MCP Server (for Claude Desktop / AI assistants)
├── gas/          # Google Apps Script (for Workspace Studio)
└── docs/         # Documentation & reference materials
    ├── openapi/  # plentyONE REST API OpenAPI specification
    └── postman/  # Postman collection & environment
```

## 🔧 Tools

### MCP Server (`mcp/`)

A Model Context Protocol server for accessing plentyONE API from Claude Desktop and other MCP-compatible AI assistants.

**Features (25 tools):**

| Category | Tools |
|----------|-------|
| Authentication | login, logout, token refresh, get authorized user |
| Contacts | list, get by ID, get addresses, get orders |
| Items | search, get by ID, list variations, get variation, list barcodes |
| Orders | search, get by ID, get items, get addresses, get documents, get shipping |
| Stock | list, get warehouse stock, list warehouses, get warehouse, list locations, get movements |

```bash
cd mcp
npm install
npm run build
```

See [mcp/README.md](mcp/README.md) for details.

### Google Apps Script (`gas/`)

A plentyONE API client for Google Apps Script, designed for use with Google Workspace Studio agents.

**Features:** Same as MCP Server, plus Workspace Studio-optimized helper functions.

See [gas/README.md](gas/README.md) for details.

## 📚 Documentation (`docs/`)

### OpenAPI Specification (`docs/openapi/`)

OpenAPI 3.0 specification for plentyONE REST API v2.
Used as the implementation base for both MCP Server and GAS client.

**Source:** [plentymarkets/api-doc](https://github.com/plentymarkets/api-doc) (Official plentyONE repository)

### Postman Collection (`docs/postman/`)

Postman collection and environment files for testing plentyONE REST API.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for MCP Server)
- [clasp](https://github.com/google/clasp) (for Google Apps Script)

### Option 1: MCP Server (Claude Code / Claude Desktop)

```bash
cd mcp
npm install
npm run build

# For Claude Code
claude mcp add plentyone \
  -e PLENTYONE_BASE_URL=https://your-shop.plentymarkets-cloud01.com \
  -e PLENTYONE_USERNAME=your_username \
  -e PLENTYONE_PASSWORD=your_password \
  -- node /path/to/plentyone-tools/mcp/dist/index.js

# For Claude Desktop
# See mcp/claude_desktop_config.example.json
```

### Option 2: Google Apps Script (Workspace Studio)

```bash
# Install clasp globally
npm install -g @google/clasp

# Login to Google
clasp login

# Create GAS project
cd gas
cp .clasp.json.example .clasp.json
clasp create-script --title "plentyONE API Client" --rootDir ./src

# Push code to GAS
clasp push

# Open GAS editor to configure credentials
clasp open-script
```

## ⚙️ Configuration

### plentyONE API Credentials

| Variable | Description |
|----------|-------------|
| `PLENTYONE_BASE_URL` | plentyONE base URL (e.g., `https://xxx.plentymarkets-cloud01.com`) |
| `PLENTYONE_USERNAME` | API username |
| `PLENTYONE_PASSWORD` | API password |

## 🔗 Related Resources

- [plentyONE REST API Documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html)
- [plentymarkets/api-doc](https://github.com/plentymarkets/api-doc) - Official OpenAPI specification
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [Google clasp](https://github.com/google/clasp) - CLI for Google Apps Script

## 📝 License

Internal use only - Knitido GmbH
