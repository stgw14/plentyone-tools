/**
 * Contacts Tool Definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const contactsTools: Tool[] = [
  {
    name: "plenty_list_contacts",
    description: "List contacts with optional filtering and pagination.",
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
            "Include related data (comma-separated, e.g., 'addresses,orders')",
        },
        email: {
          type: "string",
          description: "Filter by email address",
        },
        name: {
          type: "string",
          description: "Filter by name",
        },
        contactId: {
          type: "integer",
          description: "Filter by contact ID",
        },
        typeId: {
          type: "integer",
          description: "Filter by contact type ID",
        },
        updatedAtFrom: {
          type: "string",
          description:
            "Filter contacts updated after this date (ISO 8601 format)",
        },
      },
      required: [],
    },
  },
  {
    name: "plenty_get_contact",
    description: "Get a single contact by ID.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: {
          type: "integer",
          description: "The contact ID",
        },
        with: {
          type: "string",
          description:
            "Include related data (comma-separated, e.g., 'addresses,orders')",
        },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_get_contact_addresses",
    description: "Get all addresses for a specific contact.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: {
          type: "integer",
          description: "The contact ID",
        },
      },
      required: ["contactId"],
    },
  },
  {
    name: "plenty_create_contact_address",
    description: "Create a new address for a specific contact.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: {
          type: "integer",
          description: "The contact ID",
        },
        name1: {
          type: "string",
          description: "Name line 1 (e.g., company name or full name)",
        },
        name2: {
          type: "string",
          description: "Name line 2 (e.g., first name)",
        },
        name3: {
          type: "string",
          description: "Name line 3 (e.g., last name)",
        },
        address1: {
          type: "string",
          description: "Address line 1 (e.g., street)",
        },
        address2: {
          type: "string",
          description: "Address line 2 (e.g., house number)",
        },
        address3: {
          type: "string",
          description: "Address line 3 (additional info)",
        },
        postalCode: {
          type: "string",
          description: "Postal/ZIP code",
        },
        town: {
          type: "string",
          description: "City/Town",
        },
        countryId: {
          type: "integer",
          description: "Country ID",
        },
        typeId: {
          type: "integer",
          description: "Address type ID (1=invoice, 2=delivery)",
        },
      },
      required: ["contactId", "countryId"],
    },
  },
  {
    name: "plenty_get_contact_orders",
    description: "Get all orders for a specific contact.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: {
          type: "integer",
          description: "The contact ID",
        },
      },
      required: ["contactId"],
    },
  },
];
