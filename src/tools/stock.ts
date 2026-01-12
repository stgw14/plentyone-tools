/**
 * Stock Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const stockTools: Tool[] = [
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
          description:
            "Filter stock updated before this date (ISO 8601 format)",
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
];
