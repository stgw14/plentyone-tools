# plentyONE API Client for Google Apps Script

A plentyONE ERP API client library for Google Apps Script.
Designed for use with Google Workspace Studio agents.

🇯🇵 [日本語版 README](README.ja.md)

## 📁 File Structure

```
gas/
├── src/
│   ├── PlentyOneApi.gs    # Authentication & HTTP client
│   ├── ContactsApi.gs     # Contacts API
│   ├── ItemsApi.gs        # Items API
│   ├── OrdersApi.gs       # Orders API
│   ├── StockApi.gs        # Stock API
│   └── Config.gs          # Configuration & test helpers
├── appsscript.json        # GAS manifest
├── .clasp.json.example    # clasp configuration template
├── .claspignore           # clasp ignore file
└── README.md
```

## 🚀 Setup

### Prerequisites

- Node.js 18+ installed
- Google account with Apps Script access

### 1. Install clasp

[clasp](https://github.com/google/clasp) is Google's official CLI for Apps Script development.

```bash
npm install -g @google/clasp
```

### 2. Enable Apps Script API

1. Visit [Google Apps Script Settings](https://script.google.com/home/usersettings)
2. Enable "Google Apps Script API"

### 3. Login to Google

```bash
clasp login
```

This opens a browser for Google authentication.

### 4. Create GAS Project

```bash
cd gas

# Option A: Create new project
clasp create-script --title "plentyONE API Client" --rootDir ./src

# Option B: Clone existing project (if you already have one)
# cp .clasp.json.example .clasp.json
# Edit .clasp.json with your scriptId
```

### 5. Push Code

```bash
clasp push
```

Verify with:
```bash
clasp open-script  # Opens GAS editor in browser
```

### 6. Configure Credentials

In the GAS editor:

1. Open `Config.gs`
2. Edit the `setupPlentyOneConfig()` function:

```javascript
props.setProperties({
  'PLENTYONE_BASE_URL': 'https://your-shop.plentymarkets-cloud01.com',
  'PLENTYONE_USERNAME': 'your_api_username',
  'PLENTYONE_PASSWORD': 'your_api_password'
});
```

3. Run `setupPlentyOneConfig()` (one time only)
4. Run `checkPlentyOneConfig()` to verify

### 7. Test Connection

Run `testPlentyOneConnection()` in the GAS editor.

Expected output:
```
✅ Login successful
✅ User info retrieved
✅ Items retrieved
✅ Logout complete
```

## 📖 Available Functions

### Authentication

| Function | Description |
|----------|-------------|
| `plentyLogin()` | Login to plentyONE |
| `plentyLogout()` | Logout |
| `plentyCheckAuth()` | Check authentication status |
| `plentyGetAuthorizedUser()` | Get current user info |

### Contacts

| Function | Description | Workspace Studio |
|----------|-------------|:---:|
| `plentyListContacts(params)` | List contacts | |
| `plentyGetContact(contactId)` | Get contact details | |
| `plentyGetContactAddresses(contactId)` | Get contact addresses | |
| `plentyGetContactOrders(contactId)` | Get contact orders | |
| `plentySearchContact(query)` | Search contacts (auto-detect ID/email/name) | ⭐ |
| `plentyGetContactSummary(contactId)` | Get contact summary | ⭐ |

### Items

| Function | Description | Workspace Studio |
|----------|-------------|:---:|
| `plentySearchItems(params)` | Search items | |
| `plentyGetItem(itemId)` | Get item details | |
| `plentyListVariations(itemId)` | List variations | |
| `plentyGetVariation(itemId, variationId)` | Get variation details | |
| `plentyListBarcodes()` | List barcodes | |
| `plentySearchProduct(query, lang)` | Search products (auto-detect) | ⭐ |
| `plentyGetProductDetail(itemId, lang)` | Get full product info | ⭐ |

### Orders

| Function | Description | Workspace Studio |
|----------|-------------|:---:|
| `plentySearchOrders(params)` | Search orders | |
| `plentyGetOrder(orderId)` | Get order details | |
| `plentyGetOrderItems(orderId)` | Get order items | |
| `plentyGetOrderAddresses(orderId)` | Get order addresses | |
| `plentyGetOrderDocuments(orderId)` | Get order documents | |
| `plentyGetOrderShipping(orderId)` | Get shipping info | |
| `plentyGetTodayOrders()` | Get today's orders | |
| `plentyGetRecentOrders(days)` | Get recent orders | |
| `plentyGetPendingShipmentOrders()` | Get pending shipment orders | |
| `plentySearchOrder(query)` | Search orders (ID/date/keyword) | ⭐ |
| `plentyGetOrderDetail(orderId)` | Get full order info | ⭐ |
| `plentyGetOrderSummary(days)` | Get order statistics | ⭐ |

### Stock

| Function | Description | Workspace Studio |
|----------|-------------|:---:|
| `plentyListStock(params)` | List stock | |
| `plentyGetVariationStock(variationId)` | Get variation stock | |
| `plentyListWarehouses()` | List warehouses | |
| `plentyGetWarehouse(warehouseId)` | Get warehouse details | |
| `plentyGetWarehouseStock(warehouseId)` | Get warehouse stock | |
| `plentyListWarehouseLocations(warehouseId)` | List warehouse locations | |
| `plentyGetStockMovements(params)` | Get stock movements | |
| `plentySearchStock(query)` | Search stock | ⭐ |
| `plentyGetStockSummary()` | Get stock summary | ⭐ |
| `plentyGetLowStockAlert(threshold)` | Get low stock alerts | ⭐ |
| `plentyGetTodayStockMovements()` | Get today's stock movements | ⭐ |

## 🤖 Workspace Studio Integration

Functions marked with ⭐ are designed for Workspace Studio agents.
They accept natural language queries and return structured data.

### Recommended Agent Prompt

```
You are a plentyONE ERP data assistant.
When users ask questions, call the registered custom steps (Google Apps Script functions)
to retrieve ERP data and respond clearly.

Example queries:
- "How many orders today?" → plentyGetTodayOrders()
- "Order #12345 details" → plentyGetOrderDetail(12345)
- "Customer info for Tanaka" → plentySearchContact("Tanaka")
- "Tabi Sneaker stock?" → plentySearchStock("Tabi Sneaker")
- "Pending shipments" → plentyGetPendingShipmentOrders()
- "This week's order summary" → plentyGetOrderSummary(7)
```

## 🔧 Development

### Pull Changes from GAS

```bash
clasp pull
```

### Push Changes to GAS

```bash
clasp push
```

### Open GAS Editor

```bash
clasp open-script
```

## 📝 License

Internal use only - Knitido GmbH
