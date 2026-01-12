/**
 * Tags Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tagsTools: Tool[] = [
  {
    name: "plenty_list_tags",
    description:
      "List tags. Tags can be linked to items, variations, contacts, orders, etc.",
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
            "Include related data (comma-separated, e.g., 'names,relationship')",
        },
        tagName: {
          type: "string",
          description: "Filter by tag name",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_tag",
    description: "Get a single tag by ID with its details.",
    inputSchema: {
      type: "object",
      properties: {
        tagId: {
          type: "integer",
          description: "The tag ID",
        },
        with: {
          type: "string",
          description:
            "Include related data (comma-separated, e.g., 'names,relationship')",
        },
      },
      required: ["tagId"],
    },
  },
];
