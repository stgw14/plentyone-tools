/**
 * Accounts Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const accountsTools: Tool[] = [
  {
    name: "plenty_list_accounts",
    description: "List accounts (companies). Accounts are B2B customer entities.",
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
        companyName: {
          type: "string",
          description: "Filter by company name",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_account",
    description: "Get a single account (company) by ID.",
    inputSchema: {
      type: "object",
      properties: {
        accountId: {
          type: "integer",
          description: "The account ID",
        },
      },
      required: ["accountId"],
    },
  },
  {
    name: "plenty_list_contact_classes",
    description:
      "List contact classes. Contact classes categorize customers (e.g., B2B, B2C, VIP).",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "plenty_list_contact_types",
    description:
      "List contact types. Types classify contacts (e.g., Customer, Supplier, Partner).",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
