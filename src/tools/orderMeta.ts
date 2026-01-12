/**
 * Order Meta Tool Definitions (Statuses, Referrers)
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const orderMetaTools: Tool[] = [
  {
    name: "plenty_list_order_statuses",
    description:
      "List order statuses. Statuses define the workflow state of orders.",
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
    name: "plenty_list_order_referrers",
    description:
      "List order referrers. Referrers identify the source of orders (e.g., webshop, marketplace, manual).",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
