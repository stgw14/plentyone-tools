#!/usr/bin/env node

/**
 * plentyONE MCP Server
 * 
 * Provides MCP tools for interacting with the plentyONE REST API.
 * Supports Authentication, Contacts, Items, Orders, and Stock reference endpoints.
 * 
 * Environment variables required:
 * - PLENTYONE_BASE_URL: Base URL of the plentyONE system (e.g., https://your-shop.plentymarkets-cloud01.com)
 * - PLENTYONE_USERNAME: Username for authentication
 * - PLENTYONE_PASSWORD: Password for authentication
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// =============================================================================
// Types
// =============================================================================

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresAt?: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// =============================================================================
// Configuration
// =============================================================================

const config = {
  baseUrl: process.env.PLENTYONE_BASE_URL || "",
  username: process.env.PLENTYONE_USERNAME || "",
  password: process.env.PLENTYONE_PASSWORD || "",
};

// Token storage (in-memory for this session)
let authTokens: AuthTokens | null = null;

// =============================================================================
// HTTP Client
// =============================================================================

async function makeRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
    requiresAuth?: boolean;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, query, requiresAuth = true } = options;

  // Build URL with query parameters
  let url = `${config.baseUrl}${endpoint}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Build headers
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    if (!authTokens) {
      return {
        success: false,
        error: {
          code: "NOT_AUTHENTICATED",
          message: "Not authenticated. Please call plenty_login first.",
        },
      };
    }
    headers["Authorization"] = `Bearer ${authTokens.accessToken}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle 401 - try to refresh token
    if (response.status === 401 && requiresAuth && authTokens?.refreshToken) {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.success) {
        // Retry the original request
        headers["Authorization"] = `Bearer ${authTokens!.accessToken}`;
        const retryResponse = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          return {
            success: false,
            error: {
              code: `HTTP_${retryResponse.status}`,
              message: retryResponse.statusText,
              details: errorData,
            },
          };
        }
        
        const data = await retryResponse.json();
        return { success: true, data };
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: response.statusText,
          details: errorData,
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "REQUEST_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

async function refreshAccessToken(): Promise<ApiResponse<AuthTokens>> {
  if (!authTokens?.refreshToken) {
    return {
      success: false,
      error: {
        code: "NO_REFRESH_TOKEN",
        message: "No refresh token available",
      },
    };
  }

  const response = await makeRequest<AuthTokens>("/rest/login/refresh", {
    method: "POST",
    requiresAuth: true,
  });

  if (response.success && response.data) {
    authTokens = {
      ...authTokens,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken || authTokens.refreshToken,
    };
  }

  return response;
}

// =============================================================================
// Tool Definitions
// =============================================================================

const tools: Tool[] = [
  // --- Authentication ---
  {
    name: "plenty_login",
    description: "Authenticate with plentyONE and obtain access tokens. Must be called before using other tools.",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "Username (optional, uses environment variable if not provided)",
        },
        password: {
          type: "string",
          description: "Password (optional, uses environment variable if not provided)",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_logout",
    description: "Log out from plentyONE and clear the current session.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_refresh_token",
    description: "Refresh the access token using the refresh token.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_get_authorized_user",
    description: "Get information about the currently authenticated user.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // --- Contacts (Reference) ---
  {
    name: "plenty_list_contacts",
    description: "List contacts with optional filtering and pagination.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (default: 1)",
        },
        itemsPerPage: {
          type: "integer",
          description: "Number of items per page (default: 50, max: 250)",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated, e.g., 'addresses,orders')",
        },
        email: {
          type: "string",
          description: "Filter by email address",
        },
        name: {
          type: "string",
          description: "Filter by name",
        },
        contactId: {
          type: "integer",
          description: "Filter by contact ID",
        },
        typeId: {
          type: "integer",
          description: "Filter by contact type ID",
        },
        updatedAtFrom: {
          type: "string",
          description: "Filter contacts updated after this date (ISO 8601 format)",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_contact",
    description: "Get a single contact by ID.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: {
          type: "integer",
          description: "The contact ID",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated, e.g., 'addresses,orders')",
        },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_addresses",
    description: "Get all addresses for a specific contact.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: {
          type: "integer",
          description: "The contact ID",
        },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_orders",
    description: "Get all orders for a specific contact.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: {
          type: "integer",
          description: "The contact ID",
        },
      },
      required: ["contactId"],
    },
  },

  // --- Items (Reference) ---
  {
    name: "plenty_search_items",
    description: "Search for items with optional filtering and pagination.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (default: 1)",
        },
        itemsPerPage: {
          type: "integer",
          description: "Number of items per page (default: 50, max: 250)",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated)",
        },
        lang: {
          type: "string",
          description: "Language code for item texts (e.g., 'de', 'en')",
        },
        name: {
          type: "string",
          description: "Filter by item name",
        },
        id: {
          type: "string",
          description: "Filter by item ID(s), comma-separated for multiple",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_item",
    description: "Get a single item by ID.",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "integer",
          description: "The item ID",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated)",
        },
        lang: {
          type: "string",
          description: "Language code for item texts (e.g., 'de', 'en')",
        },
      },
      required: ["itemId"],
    },
  },
  {
    name: "plenty_list_variations",
    description: "List all variations for a specific item.",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "integer",
          description: "The item ID",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated)",
        },
        lang: {
          type: "string",
          description: "Language code for variation texts",
        },
      },
      required: ["itemId"],
    },
  },
  {
    name: "plenty_get_variation",
    description: "Get a specific variation by item ID and variation ID.",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "integer",
          description: "The item ID",
        },
        variationId: {
          type: "integer",
          description: "The variation ID",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated)",
        },
        lang: {
          type: "string",
          description: "Language code for variation texts",
        },
      },
      required: ["itemId", "variationId"],
    },
  },
  {
    name: "plenty_list_barcodes",
    description: "List all barcodes.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },

  // --- Orders (Reference) ---
  {
    name: "plenty_search_orders",
    description: "Search for orders with optional filtering and pagination.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (default: 1)",
        },
        itemsPerPage: {
          type: "integer",
          description: "Number of items per page (default: 50, max: 250)",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated, e.g., 'addresses,orderItems,documents')",
        },
        statusFrom: {
          type: "number",
          description: "Filter by minimum order status",
        },
        statusTo: {
          type: "number",
          description: "Filter by maximum order status",
        },
        createdAtFrom: {
          type: "string",
          description: "Filter orders created after this date (ISO 8601 format)",
        },
        createdAtTo: {
          type: "string",
          description: "Filter orders created before this date (ISO 8601 format)",
        },
        plentyId: {
          type: "integer",
          description: "Filter by plenty ID (client/shop)",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_order",
    description: "Get a single order by ID.",
    inputSchema: {
      type: "object",
      properties: {
        orderId: {
          type: "integer",
          description: "The order ID",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated, e.g., 'addresses,orderItems,documents')",
        },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_items",
    description: "Get all items of a specific order.",
    inputSchema: {
      type: "object",
      properties: {
        orderId: {
          type: "integer",
          description: "The order ID",
        },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_addresses",
    description: "Get all addresses of a specific order (billing, delivery, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        orderId: {
          type: "integer",
          description: "The order ID",
        },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_documents",
    description: "Get all documents of a specific order (invoices, delivery notes, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        orderId: {
          type: "integer",
          description: "The order ID",
        },
      },
      required: ["orderId"],
    },
  },
  {
    name: "plenty_get_order_shipping",
    description: "Get shipping packages of a specific order.",
    inputSchema: {
      type: "object",
      properties: {
        orderId: {
          type: "integer",
          description: "The order ID",
        },
      },
      required: ["orderId"],
    },
  },

  // --- Stock (Reference) ---
  {
    name: "plenty_list_stock",
    description: "List stock entries with optional filtering and pagination.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (default: 1)",
        },
        itemsPerPage: {
          type: "integer",
          description: "Number of items per page (default: 50, max: 250)",
        },
        variationId: {
          type: "integer",
          description: "Filter by variation ID",
        },
        warehouseId: {
          type: "integer",
          description: "Filter by warehouse ID",
        },
        updatedAtFrom: {
          type: "string",
          description: "Filter stock updated after this date (ISO 8601 format)",
        },
        updatedAtTo: {
          type: "string",
          description: "Filter stock updated before this date (ISO 8601 format)",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_warehouse_stock",
    description: "Get stock for a specific warehouse.",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: {
          type: "integer",
          description: "The warehouse ID",
        },
        page: {
          type: "integer",
          description: "Page number for pagination (default: 1)",
        },
        itemsPerPage: {
          type: "integer",
          description: "Number of items per page (default: 50, max: 250)",
        },
        updatedAtFrom: {
          type: "string",
          description: "Filter stock updated after this date (ISO 8601 format)",
        },
      },
      required: ["warehouseId"],
    },
  },
  {
    name: "plenty_list_warehouses",
    description: "List all warehouses.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_get_warehouse",
    description: "Get a specific warehouse by ID.",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: {
          type: "integer",
          description: "The warehouse ID",
        },
      },
      required: ["warehouseId"],
    },
  },
  {
    name: "plenty_list_warehouse_locations",
    description: "List all storage locations in a warehouse.",
    inputSchema: {
      type: "object",
      properties: {
        warehouseId: {
          type: "integer",
          description: "The warehouse ID",
        },
      },
      required: ["warehouseId"],
    },
  },
  {
    name: "plenty_get_stock_movements",
    description: "Get stock movement history.",
    inputSchema: {
      type: "object",
      properties: {
        variationId: {
          type: "integer",
          description: "Filter by variation ID",
        },
        warehouseId: {
          type: "integer",
          description: "Filter by warehouse ID",
        },
        createdAtFrom: {
          type: "string",
          description: "Filter movements created after this date (ISO 8601 format)",
        },
        createdAtTo: {
          type: "string",
          description: "Filter movements created before this date (ISO 8601 format)",
        },
      },
      required: [],
    },
  },
];

// =============================================================================
// Tool Handlers
// =============================================================================

async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  let result: ApiResponse;

  switch (name) {
    // --- Authentication ---
    case "plenty_login": {
      const username = (args.username as string) || config.username;
      const password = (args.password as string) || config.password;

      if (!username || !password) {
        result = {
          success: false,
          error: {
            code: "MISSING_CREDENTIALS",
            message:
              "Username and password are required. Provide them as arguments or set PLENTYONE_USERNAME and PLENTYONE_PASSWORD environment variables.",
          },
        };
        break;
      }

      if (!config.baseUrl) {
        result = {
          success: false,
          error: {
            code: "MISSING_BASE_URL",
            message:
              "Base URL is required. Set PLENTYONE_BASE_URL environment variable.",
          },
        };
        break;
      }

      result = await makeRequest<AuthTokens>("/rest/login", {
        method: "POST",
        body: { username, password },
        requiresAuth: false,
      });

      if (result.success && result.data) {
        const data = result.data as AuthTokens;
        authTokens = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          tokenType: data.tokenType || "Bearer",
        };
        result = {
          success: true,
          data: {
            message: "Login successful",
            tokenType: authTokens.tokenType,
          },
        };
      }
      break;
    }

    case "plenty_logout": {
      result = await makeRequest("/rest/logout", { method: "POST" });
      if (result.success) {
        authTokens = null;
        result = { success: true, data: { message: "Logged out successfully" } };
      }
      break;
    }

    case "plenty_refresh_token": {
      result = await refreshAccessToken();
      if (result.success) {
        result = {
          success: true,
          data: { message: "Token refreshed successfully" },
        };
      }
      break;
    }

    case "plenty_get_authorized_user": {
      result = await makeRequest("/rest/authorized_user");
      break;
    }

    // --- Contacts ---
    case "plenty_list_contacts": {
      result = await makeRequest("/rest/accounts/contacts", {
        query: {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
          with: args.with as string,
          email: args.email as string,
          name: args.name as string,
          contactId: args.contactId as number,
          typeId: args.typeId as number,
          updatedAtFrom: args.updatedAtFrom as string,
        },
      });
      break;
    }

    case "plenty_get_contact": {
      const contactId = args.contactId as number;
      result = await makeRequest(`/rest/accounts/contacts/${contactId}`, {
        query: {
          with: args.with as string,
        },
      });
      break;
    }

    case "plenty_get_contact_addresses": {
      const contactId = args.contactId as number;
      result = await makeRequest(
        `/rest/accounts/contacts/${contactId}/addresses`
      );
      break;
    }

    case "plenty_get_contact_orders": {
      const contactId = args.contactId as number;
      result = await makeRequest(`/rest/accounts/contacts/${contactId}/orders`);
      break;
    }

    // --- Items ---
    case "plenty_search_items": {
      result = await makeRequest("/rest/items", {
        query: {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
          with: args.with as string,
          lang: args.lang as string,
          name: args.name as string,
          id: args.id as string,
        },
      });
      break;
    }

    case "plenty_get_item": {
      const itemId = args.itemId as number;
      result = await makeRequest(`/rest/items/${itemId}`, {
        query: {
          with: args.with as string,
          lang: args.lang as string,
        },
      });
      break;
    }

    case "plenty_list_variations": {
      const itemId = args.itemId as number;
      result = await makeRequest(`/rest/items/${itemId}/variations`, {
        query: {
          with: args.with as string,
          lang: args.lang as string,
        },
      });
      break;
    }

    case "plenty_get_variation": {
      const itemId = args.itemId as number;
      const variationId = args.variationId as number;
      result = await makeRequest(
        `/rest/items/${itemId}/variations/${variationId}`,
        {
          query: {
            with: args.with as string,
            lang: args.lang as string,
          },
        }
      );
      break;
    }

    case "plenty_list_barcodes": {
      result = await makeRequest("/rest/items/barcodes");
      break;
    }

    // --- Orders ---
    case "plenty_search_orders": {
      result = await makeRequest("/rest/orders", {
        query: {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
          with: args.with as string,
          statusFrom: args.statusFrom as number,
          statusTo: args.statusTo as number,
          createdAtFrom: args.createdAtFrom as string,
          createdAtTo: args.createdAtTo as string,
          plentyId: args.plentyId as number,
        },
      });
      break;
    }

    case "plenty_get_order": {
      const orderId = args.orderId as number;
      result = await makeRequest(`/rest/orders/${orderId}`, {
        query: {
          with: args.with as string,
        },
      });
      break;
    }

    case "plenty_get_order_items": {
      const orderId = args.orderId as number;
      result = await makeRequest(`/rest/orders/${orderId}/items`);
      break;
    }

    case "plenty_get_order_addresses": {
      const orderId = args.orderId as number;
      result = await makeRequest(`/rest/orders/${orderId}/addresses`);
      break;
    }

    case "plenty_get_order_documents": {
      const orderId = args.orderId as number;
      result = await makeRequest(`/rest/orders/${orderId}/documents`);
      break;
    }

    case "plenty_get_order_shipping": {
      const orderId = args.orderId as number;
      result = await makeRequest(`/rest/orders/${orderId}/shipping/packages`);
      break;
    }

    // --- Stock ---
    case "plenty_list_stock": {
      result = await makeRequest("/rest/stockmanagement/stock", {
        query: {
          page: args.page as number,
          itemsPerPage: args.itemsPerPage as number,
          variationId: args.variationId as number,
          warehouseId: args.warehouseId as number,
          updatedAtFrom: args.updatedAtFrom as string,
          updatedAtTo: args.updatedAtTo as string,
        },
      });
      break;
    }

    case "plenty_get_warehouse_stock": {
      const warehouseId = args.warehouseId as number;
      result = await makeRequest(
        `/rest/stockmanagement/warehouses/${warehouseId}/stock`,
        {
          query: {
            page: args.page as number,
            itemsPerPage: args.itemsPerPage as number,
            updatedAtFrom: args.updatedAtFrom as string,
          },
        }
      );
      break;
    }

    case "plenty_list_warehouses": {
      result = await makeRequest("/rest/stockmanagement/warehouses");
      break;
    }

    case "plenty_get_warehouse": {
      const warehouseId = args.warehouseId as number;
      result = await makeRequest(
        `/rest/stockmanagement/warehouses/${warehouseId}`
      );
      break;
    }

    case "plenty_list_warehouse_locations": {
      const warehouseId = args.warehouseId as number;
      result = await makeRequest(
        `/rest/stockmanagement/warehouses/${warehouseId}/locations`
      );
      break;
    }

    case "plenty_get_stock_movements": {
      result = await makeRequest("/rest/stockmanagement/stock/movements", {
        query: {
          variationId: args.variationId as number,
          warehouseId: args.warehouseId as number,
          createdAtFrom: args.createdAtFrom as string,
          createdAtTo: args.createdAtTo as string,
        },
      });
      break;
    }

    default:
      result = {
        success: false,
        error: {
          code: "UNKNOWN_TOOL",
          message: `Unknown tool: ${name}`,
        },
      };
  }

  return JSON.stringify(result, null, 2);
}

// =============================================================================
// Server Setup
// =============================================================================

const server = new Server(
  {
    name: "plenty-one-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleToolCall(name, args as Record<string, unknown>);
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: {
                code: "TOOL_ERROR",
                message:
                  error instanceof Error ? error.message : "Unknown error",
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }
});

// =============================================================================
// Main Entry Point
// =============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("plentyONE MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
