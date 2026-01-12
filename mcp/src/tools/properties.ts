/**
 * Properties Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const propertiesTools: Tool[] = [
  {
    name: "plenty_list_properties",
    description:
      "List item properties. Properties are custom fields for items/variations.",
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
            "Include related data (comma-separated, e.g., 'names,groups')",
        },
        groupId: {
          type: "integer",
          description: "Filter by property group ID",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_property",
    description: "Get a single property by ID with its details.",
    inputSchema: {
      type: "object",
      properties: {
        propertyId: {
          type: "integer",
          description: "The property ID",
        },
        with: {
          type: "string",
          description:
            "Include related data (comma-separated, e.g., 'names,groups')",
        },
      },
      required: ["propertyId"],
    },
  },
  {
    name: "plenty_list_property_groups",
    description: "List property groups. Groups organize related properties.",
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
          description: "Include related data (comma-separated, e.g., 'names')",
        },
      },
      required: [],
    },
  },
];
