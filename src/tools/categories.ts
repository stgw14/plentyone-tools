/**
 * Categories Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const categoriesTools: Tool[] = [
  {
    name: "plenty_list_categories",
    description: "List categories with optional filtering and pagination.",
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
          description:
            "Include related data (comma-separated, e.g., 'details,clients')",
        },
        lang: {
          type: "string",
          description: "Language code for category texts (e.g., 'de', 'en')",
        },
        type: {
          type: "string",
          description: "Filter by category type (item, container, content, blog)",
        },
        parentId: {
          type: "integer",
          description: "Filter by parent category ID",
        },
        plentyId: {
          type: "integer",
          description: "Filter by plenty ID (client/shop)",
        },
        name: {
          type: "string",
          description: "Filter by category name",
        },
        level: {
          type: "integer",
          description: "Filter by category level (depth in tree)",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_category",
    description: "Get a single category by ID.",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: {
          type: "integer",
          description: "The category ID",
        },
        with: {
          type: "string",
          description: "Include related data (comma-separated)",
        },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "plenty_get_category_branch",
    description:
      "Get the category branch (full path from root to the specified category).",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: {
          type: "integer",
          description: "The category ID",
        },
      },
      required: ["categoryId"],
    },
  },
];
