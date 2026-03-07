/**
 * Sales Prices Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const salesPricesTools: Tool[] = [
  {
    name: "plenty_list_sales_prices",
    description:
      "List sales price configurations. Sales prices define pricing rules for different customer classes, countries, and referrers.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (default: 1)",
        },
        itemsPerPage: {
          type: "integer",
          description: "Number of items per page (default: 50)",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_sales_price",
    description:
      "Get a single sales price configuration by ID with its details.",
    inputSchema: {
      type: "object",
      properties: {
        salesPriceId: {
          type: "integer",
          description: "The sales price ID",
        },
      },
      required: ["salesPriceId"],
    },
  },
];
