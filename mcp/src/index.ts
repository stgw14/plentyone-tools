#!/usr/bin/env node

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { filterPII } from "./utils/pii-filter.js";

// ============================================================================
// Configuration
// ============================================================================

const config = {
  baseUrl: process.env.PLENTYONE_BASE_URL || "",
  username: process.env.PLENTYONE_USERNAME || "",
  password: process.env.PLENTYONE_PASSWORD || "",
};

// ============================================================================
// Token Management
// ============================================================================

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let tokenData: TokenData | null = null;

async function ensureAuthenticated(): Promise<string> {
  if (!tokenData || Date.now() >= tokenData.expiresAt - 60000) {
    if (tokenData?.refreshToken) {
      try {
        await refreshAccessToken();
      } catch {
        await login();
      }
    } else {
      await login();
    }
  }
  return tokenData!.accessToken;
}

async function login(): Promise<void> {
  const response = await fetch(`${config.baseUrl}/rest/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: config.username,
      password: config.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const data = await response.json();
  tokenData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + (data.expiresIn || 86400) * 1000,
  };
}

async function refreshAccessToken(): Promise<void> {
  const response = await fetch(`${config.baseUrl}/rest/login/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData!.accessToken}`,
    },
    body: JSON.stringify({ refresh_token: tokenData!.refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  tokenData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || tokenData!.refreshToken,
    expiresAt: Date.now() + (data.expiresIn || 86400) * 1000,
  };
}

// ============================================================================
// API Helper
// ============================================================================

async function apiRequest(
  method: string,
  endpoint: string,
  body?: unknown,
  queryParams?: Record<string, string | number | boolean | undefined>
): Promise<unknown> {
  const token = await ensureAuthenticated();

  let url = `${config.baseUrl}${endpoint}`;
  if (queryParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// Tool Definitions (50 tools)
// ============================================================================

const tools: Tool[] = [
  // --- Authentication (4) ---
  {
    name: "plenty_login",
    description: "Login to plentyONE and get access token",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_logout",
    description: "Logout from plentyONE and invalidate token",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_refresh_token",
    description: "Refresh the access token",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_get_authorized_user",
    description: "Get information about the currently authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // --- Contacts (4) ---
  {
    name: "plenty_list_contacts",
    description: "List contacts with optional filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page (max 250)" },
        name: { type: "string", description: "Filter by name" },
        email: { type: "string", description: "Filter by email" },
        contactType: { type: "number", description: "Filter by contact type ID" },
        countryId: { type: "number", description: "Filter by country ID" },
      },
    },
  },
  {
    name: "plenty_get_contact",
    description: "Get a specific contact by ID",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_addresses",
    description: "Get addresses for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_orders",
    description: "Get orders for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["contactId"],
    },
  },

  // --- Items (5) ---
  {
    name: "plenty_search_items",
    description: "Search items with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        name: { type: "string", description: "Filter by name" },
        flagOne: { type: "number", description: "Filter by flag 1" },
        flagTwo: { type: "number", description: "Filter by flag 2" },
      },
    },
  },
  {
    name: "plenty_get_item",
    description: "Get a specific item by ID",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
      },
      required: ["itemId"],
    },
  },
  {
    name: "plenty_list_variations",
    description: "List variations for an item",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        isActive: { type: "boolean", description: "Filter by active status" },
      },
      required: ["itemId"],
    },
  },
  {
    name: "plenty_get_variation",
    description: "Get a specific variation by ID",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_barcodes",
    description: "List barcode types (GTIN, UPC, etc.)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "plenty_list_variation_barcodes",
    description: "List barcodes for a specific variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },

  // --- Orders (6) ---
  {
    name: "plenty_search_orders",
    description: "Search orders with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        statusFrom: { type: "number", description: "Status range start" },
        statusTo: { type: "number", description: "Status range end" },
        orderType: { type: "string", description: "Order type" },
        contactId: { type: "number", description: "Filter by contact ID" },
        referrerId: { type: "number", description: "Filter by referrer ID" },
        createdAtFrom: { type: "string", description: "Created from (ISO date)" },
        createdAtTo: { type: "string", description: "Created to (ISO date)" },
      },
    },
  },
  {
    name: "plenty_get_order",
    description: "Get a specific order by ID",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_items",
    description: "Get items for an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_addresses",
    description: "Get addresses for an order by relation type (1=billing, 2=delivery)",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
        relationTypeId: { type: "number", description: "Address relation type (1=billing, 2=delivery)" },
      },
      required: ["orderId", "relationTypeId"],
    },
  },
  {
    name: "plenty_get_order_documents",
    description: "Get documents for an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_shipping",
    description: "Get shipping information for an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },

  // --- Stock (4) ---
  {
    name: "plenty_list_stock",
    description: "List stock with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        variationId: { type: "number", description: "Filter by variation ID" },
        warehouseId: { type: "number", description: "Filter by warehouse ID" },
      },
    },
  },
  {
    name: "plenty_get_warehouse_stock",
    description: "Get stock for a specific warehouse",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: { type: "number", description: "Warehouse ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["warehouseId"],
    },
  },
  {
    name: "plenty_list_warehouses",
    description: "List all warehouses",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "plenty_get_warehouse",
    description: "Get a specific warehouse by ID",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: { type: "number", description: "Warehouse ID" },
      },
      required: ["warehouseId"],
    },
  },

  // --- Categories (3) ---
  {
    name: "plenty_list_categories",
    description: "List categories with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        parentId: { type: "number", description: "Filter by parent category ID" },
        type: { type: "string", description: "Category type (item, container, content, blog)" },
        lang: { type: "string", description: "Language code (e.g., de, en)" },
      },
    },
  },
  {
    name: "plenty_get_category",
    description: "Get a specific category by ID",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: { type: "number", description: "Category ID" },
        lang: { type: "string", description: "Language code" },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "plenty_get_category_branch",
    description: "Get the branch (path from root) for a category",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: { type: "number", description: "Category ID" },
      },
      required: ["categoryId"],
    },
  },

  // --- Payments (4) ---
  {
    name: "plenty_list_payments",
    description: "List payments with filters",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        orderId: { type: "number", description: "Filter by order ID" },
        paymentMethodId: { type: "number", description: "Filter by payment method ID" },
      },
    },
  },
  {
    name: "plenty_get_payment",
    description: "Get a specific payment by ID",
    inputSchema: {
      type: "object",
      properties: {
        paymentId: { type: "number", description: "Payment ID" },
      },
      required: ["paymentId"],
    },
  },
  {
    name: "plenty_list_payment_methods",
    description: "List all payment methods",
    inputSchema: {
      type: "object",
      properties: {
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_payment_properties",
    description: "Get properties for a payment",
    inputSchema: {
      type: "object",
      properties: {
        paymentId: { type: "number", description: "Payment ID" },
      },
      required: ["paymentId"],
    },
  },

  // --- Attributes (3) ---
  {
    name: "plenty_list_attributes",
    description: "List item attributes (e.g., size, color)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_attribute",
    description: "Get a specific attribute by ID",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "Attribute ID" },
      },
      required: ["attributeId"],
    },
  },
  {
    name: "plenty_list_attribute_values",
    description: "List values for an attribute",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "Attribute ID" },
      },
      required: ["attributeId"],
    },
  },
  {
    name: "plenty_get_attribute_names",
    description:
      "Get multilingual names of an attribute (e.g., DE='Farbe', EN='Color'). Returns the official translated names used in the shop frontend.",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "The attribute ID" },
      },
      required: ["attributeId"],
    },
  },
  {
    name: "plenty_get_attribute_value_names",
    description:
      "Get multilingual names of an attribute value (e.g., DE='rosa (015)', EN='candy-pink (015)'). Returns the official translated names, which may differ from the backendName or comment fields.",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: { type: "number", description: "The attribute ID (parent attribute)" },
        valueId: { type: "number", description: "The attribute value ID" },
      },
      required: ["attributeId", "valueId"],
    },
  },

  // --- Sales Prices (2) ---
  {
    name: "plenty_list_sales_prices",
    description: "List sales price configurations",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_sales_price",
    description: "Get a specific sales price by ID",
    inputSchema: {
      type: "object",
      properties: {
        salesPriceId: { type: "number", description: "Sales price ID" },
      },
      required: ["salesPriceId"],
    },
  },

  // --- Properties (3) ---
  {
    name: "plenty_list_properties",
    description: "List item properties",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_property",
    description: "Get a specific property by ID",
    inputSchema: {
      type: "object",
      properties: {
        propertyId: { type: "number", description: "Property ID" },
      },
      required: ["propertyId"],
    },
  },
  {
    name: "plenty_list_property_groups",
    description: "List property groups",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },

  // --- Tags (2) ---
  {
    name: "plenty_list_tags",
    description: "List tags",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_tag",
    description: "Get a specific tag by ID",
    inputSchema: {
      type: "object",
      properties: {
        tagId: { type: "number", description: "Tag ID" },
      },
      required: ["tagId"],
    },
  },

  // --- VAT (1) ---
  {
    name: "plenty_list_vat_configurations",
    description: "List VAT configurations",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },

  // --- Accounts (4) ---
  {
    name: "plenty_list_accounts",
    description: "List accounts (companies)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_account",
    description: "Get a specific account by ID",
    inputSchema: {
      type: "object",
      properties: {
        accountId: { type: "number", description: "Account ID" },
      },
      required: ["accountId"],
    },
  },
  {
    name: "plenty_list_contact_classes",
    description: "List contact classes (customer groups)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "plenty_list_contact_types",
    description: "List contact types",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // --- Order Meta (2) ---
  {
    name: "plenty_list_order_statuses",
    description: "List order statuses",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_list_order_referrers",
    description: "List order referrers (sales channels)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // --- Countries (1) ---
  {
    name: "plenty_list_countries",
    description: "List countries",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        active: { type: "boolean", description: "Filter by active status" },
      },
    },
  },

  // --- Item Images (1) ---
  {
    name: "plenty_list_item_images",
    description: "List images for an item",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
      },
      required: ["itemId"],
    },
  },

  // ============================================================================
  // NEW TOOLS - Added based on OpenAPI v2 specification
  // ============================================================================

  // --- Variations Extended (7) ---
  {
    name: "plenty_search_variations",
    description: "Search variations with filters (global search across all items)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
        id: { type: "number", description: "Filter by variation ID" },
        itemId: { type: "number", description: "Filter by item ID" },
        isMain: { type: "boolean", description: "Filter main variations only" },
        isActive: { type: "boolean", description: "Filter active variations only" },
        barcode: { type: "string", description: "Filter by barcode" },
        numberExact: { type: "string", description: "Filter by exact variation number" },
        sku: { type: "string", description: "Filter by SKU" },
        supplierId: { type: "number", description: "Filter by supplier ID" },
      },
    },
  },
  {
    name: "plenty_get_variation_stock",
    description: "Get stock of a variation per warehouse",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_sales_prices",
    description: "List sales prices linked to a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_categories",
    description: "List categories linked to a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_suppliers",
    description: "List suppliers for a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_variation_warehouses",
    description: "List warehouses linked to a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_get_variation_descriptions",
    description: "Get product texts/descriptions for a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
      },
      required: ["itemId", "variationId"],
    },
  },

  // --- Stock Movements (2) ---
  {
    name: "plenty_list_variation_stock_movements",
    description: "List stock movements for a variation",
    inputSchema: {
      type: "object",
      properties: {
        itemId: { type: "number", description: "Item ID" },
        variationId: { type: "number", description: "Variation ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_warehouse_stock_movements",
    description: "List stock movements for a warehouse",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: { type: "number", description: "Warehouse ID" },
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
      required: ["warehouseId"],
    },
  },

  // --- Orders Extended (3) ---
  {
    name: "plenty_get_order_dates",
    description: "Get all dates of an order (created, paid, shipped, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_status_history",
    description: "Get status change history of an order",
    inputSchema: {
      type: "object",
      properties: {
        orderId: { type: "number", description: "Order ID" },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_list_shipping_countries",
    description: "List shipping countries",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // --- Contacts Extended (3) ---
  {
    name: "plenty_get_contact_banks",
    description: "List bank accounts for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_related_data",
    description: "Get related data for a contact (addresses, options, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_order_summary",
    description: "Get order summary for a contact",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "number", description: "Contact ID" },
      },
      required: ["contactId"],
    },
  },

  // --- Manufacturers (2) ---
  {
    name: "plenty_list_manufacturers",
    description: "List manufacturers",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_manufacturer",
    description: "Get a manufacturer by ID",
    inputSchema: {
      type: "object",
      properties: {
        manufacturerId: { type: "number", description: "Manufacturer ID" },
      },
      required: ["manufacturerId"],
    },
  },

  // --- Units (2) ---
  {
    name: "plenty_list_units",
    description: "List units (piece, kg, liter, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_get_unit",
    description: "Get a unit by ID",
    inputSchema: {
      type: "object",
      properties: {
        unitId: { type: "number", description: "Unit ID" },
      },
      required: ["unitId"],
    },
  },

  // --- Shipping Profiles (2) ---
  {
    name: "plenty_list_shipping_presets",
    description: "List shipping profiles (presets)",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
  {
    name: "plenty_list_item_shipping_profiles",
    description: "List shipping profiles linked to items",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number" },
        itemsPerPage: { type: "number", description: "Items per page" },
      },
    },
  },
];

// ============================================================================
// Tool Handlers
// ============================================================================

async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    // --- Authentication ---
    case "plenty_login":
      await login();
      return { success: true, message: "Login successful" };

    case "plenty_logout":
      tokenData = null;
      return { success: true, message: "Logout successful" };

    case "plenty_refresh_token":
      await refreshAccessToken();
      return { success: true, message: "Token refreshed" };

    case "plenty_get_authorized_user":
      return apiRequest("GET", "/rest/authorized_user");

    // --- Contacts ---
    case "plenty_list_contacts":
      return apiRequest("GET", "/rest/accounts/contacts", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        name: args.name as string,
        email: args.email as string,
        contactType: args.contactType as number,
        countryId: args.countryId as number,
      });

    case "plenty_get_contact":
      return apiRequest("GET", `/rest/accounts/contacts/${args.contactId}`);

    case "plenty_get_contact_addresses":
      return apiRequest(
        "GET",
        `/rest/accounts/contacts/${args.contactId}/addresses`
      );

    case "plenty_get_contact_orders":
      return apiRequest(
        "GET",
        `/rest/orders/contacts/${args.contactId}`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    // --- Items ---
    case "plenty_search_items":
      return apiRequest("GET", "/rest/items", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        name: args.name as string,
        flagOne: args.flagOne as number,
        flagTwo: args.flagTwo as number,
      });

    case "plenty_get_item":
      return apiRequest("GET", `/rest/items/${args.itemId}`);

    case "plenty_list_variations":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
          isActive: args.isActive as boolean,
        }
      );

    case "plenty_get_variation":
      return apiRequest("GET", `/rest/items/${args.itemId}/variations/${args.variationId}`);

    case "plenty_list_barcodes":
      return apiRequest("GET", "/rest/items/barcodes");

    case "plenty_list_variation_barcodes":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_barcodes`
      );

    // --- Orders ---
    case "plenty_search_orders":
      return apiRequest("GET", "/rest/orders", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        statusFrom: args.statusFrom as number,
        statusTo: args.statusTo as number,
        orderType: args.orderType as string,
        contactId: args.contactId as number,
        referrerId: args.referrerId as number,
        createdAtFrom: args.createdAtFrom as string,
        createdAtTo: args.createdAtTo as string,
      });

    case "plenty_get_order":
      return apiRequest("GET", `/rest/orders/${args.orderId}`);

    case "plenty_get_order_items":
      return apiRequest("GET", `/rest/orders/${args.orderId}/items`);

    case "plenty_get_order_addresses":
      return apiRequest("GET", `/rest/orders/${args.orderId}/addresses/${args.relationTypeId}`);

    case "plenty_get_order_documents":
      return apiRequest("GET", `/rest/orders/${args.orderId}/documents`);

    case "plenty_get_order_shipping":
      return apiRequest(
        "GET",
        `/rest/orders/${args.orderId}/shipping/packages`
      );

    // --- Stock ---
    case "plenty_list_stock":
      return apiRequest("GET", "/rest/stockmanagement/stock", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        variationId: args.variationId as number,
        warehouseId: args.warehouseId as number,
      });

    case "plenty_get_warehouse_stock":
      return apiRequest(
        "GET",
        `/rest/stockmanagement/warehouses/${args.warehouseId}/stock`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    case "plenty_list_warehouses":
      return apiRequest("GET", "/rest/stockmanagement/warehouses");

    case "plenty_get_warehouse":
      return apiRequest(
        "GET",
        `/rest/stockmanagement/warehouses/${args.warehouseId}`
      );

    // --- Categories ---
    case "plenty_list_categories":
      return apiRequest("GET", "/rest/categories", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        parentId: args.parentId as number,
        type: args.type as string,
        lang: args.lang as string,
      });

    case "plenty_get_category":
      return apiRequest("GET", `/rest/categories/${args.categoryId}`, undefined, {
        lang: args.lang as string,
      });

    case "plenty_get_category_branch":
      return apiRequest("GET", `/rest/category_branches/${args.categoryId}`);

    // --- Payments ---
    case "plenty_list_payments":
      return apiRequest("GET", "/rest/payments", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        orderId: args.orderId as number,
        paymentMethodId: args.paymentMethodId as number,
      });

    case "plenty_get_payment":
      return apiRequest("GET", `/rest/payments/${args.paymentId}`);

    case "plenty_list_payment_methods":
      return apiRequest("GET", "/rest/payments/methods", undefined, {
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_payment_properties":
      return apiRequest("GET", `/rest/payments/${args.paymentId}/properties`);

    // --- Attributes ---
    case "plenty_list_attributes":
      return apiRequest("GET", "/rest/items/attributes", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_attribute":
      return apiRequest("GET", `/rest/items/attributes/${args.attributeId}`);

    case "plenty_list_attribute_values":
      return apiRequest(
        "GET",
        `/rest/items/attributes/${args.attributeId}/values`
      );

    case "plenty_get_attribute_names":
      return apiRequest(
        "GET",
        `/rest/items/attributes/${args.attributeId}/names`
      );

    case "plenty_get_attribute_value_names":
      return apiRequest(
        "GET",
        `/rest/items/attribute_values/${args.valueId}/names`
      );

    // --- Sales Prices ---
    case "plenty_list_sales_prices":
      return apiRequest("GET", "/rest/items/sales_prices", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_sales_price":
      return apiRequest(
        "GET",
        `/rest/items/sales_prices/${args.salesPriceId}`
      );

    // --- Properties ---
    case "plenty_list_properties":
      return apiRequest("GET", "/rest/items/properties", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_property":
      return apiRequest("GET", `/rest/items/properties/${args.propertyId}`);

    case "plenty_list_property_groups":
      return apiRequest("GET", "/rest/items/property_groups", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    // --- Tags ---
    case "plenty_list_tags":
      return apiRequest("GET", "/rest/tags", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_tag":
      return apiRequest("GET", `/rest/tags/${args.tagId}`);

    // --- VAT ---
    case "plenty_list_vat_configurations":
      return apiRequest("GET", "/rest/vat", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    // --- Accounts ---
    case "plenty_list_accounts":
      return apiRequest("GET", "/rest/accounts", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_account":
      return apiRequest("GET", `/rest/accounts/${args.accountId}`);

    case "plenty_list_contact_classes":
      return apiRequest("GET", "/rest/accounts/contacts/classes");

    case "plenty_list_contact_types":
      return apiRequest("GET", "/rest/accounts/contacts/types");

    // --- Order Meta ---
    case "plenty_list_order_statuses":
      return apiRequest("GET", "/rest/orders/statuses", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_list_order_referrers":
      return apiRequest("GET", "/rest/orders/referrers");

    // --- Countries ---
    case "plenty_list_countries":
      return apiRequest("GET", "/rest/orders/shipping/countries", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        active: args.active as boolean,
      });

    // --- Item Images ---
    case "plenty_list_item_images":
      return apiRequest("GET", `/rest/items/${args.itemId}/images`);

    // ========================================================================
    // NEW TOOL HANDLERS - Added based on OpenAPI v2 specification
    // ========================================================================

    // --- Variations Extended ---
    case "plenty_search_variations":
      return apiRequest("GET", "/rest/items/variations", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
        id: args.id as number,
        itemId: args.itemId as number,
        isMain: args.isMain as boolean,
        isActive: args.isActive as boolean,
        barcode: args.barcode as string,
        numberExact: args.numberExact as string,
        sku: args.sku as string,
        supplierId: args.supplierId as number,
      });

    case "plenty_get_variation_stock":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/stock`
      );

    case "plenty_list_variation_sales_prices":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_sales_prices`
      );

    case "plenty_list_variation_categories":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_categories`
      );

    case "plenty_list_variation_suppliers":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_suppliers`
      );

    case "plenty_list_variation_warehouses":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/variation_warehouses`
      );

    case "plenty_get_variation_descriptions":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/descriptions`
      );

    // --- Stock Movements ---
    case "plenty_list_variation_stock_movements":
      return apiRequest(
        "GET",
        `/rest/items/${args.itemId}/variations/${args.variationId}/stock/movements`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    case "plenty_list_warehouse_stock_movements":
      return apiRequest(
        "GET",
        `/rest/stockmanagement/warehouses/${args.warehouseId}/stock/movements`,
        undefined,
        {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
        }
      );

    // --- Orders Extended ---
    case "plenty_get_order_dates":
      return apiRequest("GET", `/rest/orders/${args.orderId}/dates`);

    case "plenty_get_order_status_history":
      return apiRequest("GET", `/rest/orders/${args.orderId}/status-history`);

    case "plenty_list_shipping_countries":
      return apiRequest("GET", "/rest/orders/shipping/countries");

    // --- Contacts Extended ---
    case "plenty_get_contact_banks":
      return apiRequest(
        "GET",
        `/rest/accounts/contacts/${args.contactId}/banks`
      );

    case "plenty_get_contact_related_data":
      return apiRequest(
        "GET",
        `/rest/accounts/contacts/${args.contactId}/related_data`
      );

    case "plenty_get_contact_order_summary":
      return apiRequest(
        "GET",
        `/rest/accounts/order_summaries/contacts/${args.contactId}`
      );

    // --- Manufacturers ---
    case "plenty_list_manufacturers":
      return apiRequest("GET", "/rest/items/manufacturers", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_manufacturer":
      return apiRequest(
        "GET",
        `/rest/items/manufacturers/${args.manufacturerId}`
      );

    // --- Units ---
    case "plenty_list_units":
      return apiRequest("GET", "/rest/items/units", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_get_unit":
      return apiRequest("GET", `/rest/items/units/${args.unitId}`);

    // --- Shipping Profiles ---
    case "plenty_list_shipping_presets":
      return apiRequest("GET", "/rest/orders/shipping/presets", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    case "plenty_list_item_shipping_profiles":
      return apiRequest("GET", "/rest/items/item_shipping_profiles", undefined, {
        page: args.page as number,
        itemsPerPage: args.itemsPerPage as number,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================================================
// Server Setup
// ============================================================================

// ============================================================================
// Server & Handler Registration
// ============================================================================

const SERVER_NAME = "plentyone-mcp-server";
const SERVER_VERSION = "1.3.0";

function createMcpServer(): Server {
  return new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );
}

function registerHandlers(s: Server): void {
  s.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  s.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleToolCall(name, (args as Record<string, unknown>) || {});
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(filterPII(result), null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });
}

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  if (!config.baseUrl || !config.username || !config.password) {
    console.error("Missing required environment variables:");
    console.error("  PLENTYONE_BASE_URL");
    console.error("  PLENTYONE_USERNAME");
    console.error("  PLENTYONE_PASSWORD");
    process.exit(1);
  }

  const mode = (process.env.MCP_TRANSPORT ?? "stdio").toLowerCase();

  if (mode === "http") {
    const port = parseInt(process.env.MCP_PORT ?? "3102", 10);
    const host = process.env.MCP_HOST ?? "0.0.0.0";

    const transports = new Map<string, StreamableHTTPServerTransport>();

    const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
        return;
      }

      if (url.pathname !== "/mcp") {
        res.writeHead(404).end("Not Found");
        return;
      }

      // Existing session
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      if (sessionId && transports.has(sessionId)) {
        const transport = transports.get(sessionId)!;
        await transport.handleRequest(req, res);
        return;
      }

      if (sessionId && !transports.has(sessionId)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Session not found" }));
        return;
      }

      // New session
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          transports.delete(transport.sessionId);
        }
      };

      const sessionServer = createMcpServer();
      registerHandlers(sessionServer);
      await sessionServer.connect(transport);
      await transport.handleRequest(req, res);

      if (transport.sessionId) {
        transports.set(transport.sessionId, transport);
      }
    });

    httpServer.listen(port, host, () => {
      console.error(`plentyONE MCP Server v${SERVER_VERSION} running on http://${host}:${port}/mcp`);
    });
  } else {
    const server = createMcpServer();
    registerHandlers(server);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`plentyONE MCP Server v${SERVER_VERSION} started (stdio)`);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
