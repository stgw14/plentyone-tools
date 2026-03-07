/**
 * Attributes Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const attributesTools: Tool[] = [
  {
    name: "plenty_list_attributes",
    description:
      "List item attributes (e.g., size, color). Attributes define variation options.",
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
            "Include related data (comma-separated, e.g., 'names,values')",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_attribute",
    description: "Get a single attribute by ID with its details.",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: {
          type: "integer",
          description: "The attribute ID",
        },
        with: {
          type: "string",
          description:
            "Include related data (comma-separated, e.g., 'names,values')",
        },
      },
      required: ["attributeId"],
    },
  },
  {
    name: "plenty_list_attribute_values",
    description:
      "List values of a specific attribute (e.g., all sizes for 'Size' attribute).",
    inputSchema: {
      type: "object",
      properties: {
        attributeId: {
          type: "integer",
          description: "The attribute ID",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated, e.g., 'names')",
        },
      },
      required: ["attributeId"],
    },
  },
];
