/**
 * Countries Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const countriesTools: Tool[] = [
  {
    name: "plenty_list_countries",
    description:
      "List countries with their IDs and settings. Useful for debugging and address validation.",
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
        active: {
          type: "boolean",
          description: "Filter by active status (true/false)",
        },
      },
      required: [],
    },
  },
];
