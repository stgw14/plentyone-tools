/**
 * Shipping Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const shippingTools: Tool[] = [
  {
    name: "plenty_list_shipping_profiles",
    description:
      "List shipping profiles. Shipping profiles define shipping options and costs.",
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
        with: {
          type: "string",
          description:
            "Include related data (comma-separated, e.g., 'names,parcelServicePresetNames')",
        },
      },
      required: [],
    },
  },
];
