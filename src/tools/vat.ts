/**
 * VAT Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const vatTools: Tool[] = [
  {
    name: "plenty_list_vat_configurations",
    description:
      "List VAT configurations. Each configuration defines VAT rates for a specific country and location.",
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
];
