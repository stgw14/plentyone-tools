/**
 * Item Images Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const itemImagesTools: Tool[] = [
  {
    name: "plenty_list_item_images",
    description: "List images for a specific item.",
    inputSchema: {
      type: "object",
      properties: {
        itemId: {
          type: "integer",
          description: "The item ID",
        },
        with: {
          type: "string",
          description:
            "Include related data (comma-separated, e.g., 'names,availabilities')",
        },
      },
      required: ["itemId"],
    },
  },
];
