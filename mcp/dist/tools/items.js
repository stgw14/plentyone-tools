/**
 * Items Tool Definitions
 */
export const itemsTools = [
    {
        name: "plenty_search_items",
        description: "Search for items with optional filtering and pagination.",
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
                    description: "Include related data (comma-separated)",
                },
                lang: {
                    type: "string",
                    description: "Language code for item texts (e.g., 'de', 'en')",
                },
                name: {
                    type: "string",
                    description: "Filter by item name",
                },
                id: {
                    type: "string",
                    description: "Filter by item ID(s), comma-separated for multiple",
                },
            },
            required: [],
        },
    },
    {
        name: "plenty_get_item",
        description: "Get a single item by ID.",
        inputSchema: {
            type: "object",
            properties: {
                itemId: {
                    type: "integer",
                    description: "The item ID",
                },
                with: {
                    type: "string",
                    description: "Include related data (comma-separated)",
                },
                lang: {
                    type: "string",
                    description: "Language code for item texts (e.g., 'de', 'en')",
                },
            },
            required: ["itemId"],
        },
    },
    {
        name: "plenty_list_variations",
        description: "List all variations for a specific item.",
        inputSchema: {
            type: "object",
            properties: {
                itemId: {
                    type: "integer",
                    description: "The item ID",
                },
                with: {
                    type: "string",
                    description: "Include related data (comma-separated)",
                },
                lang: {
                    type: "string",
                    description: "Language code for variation texts",
                },
            },
            required: ["itemId"],
        },
    },
    {
        name: "plenty_get_variation",
        description: "Get a specific variation by item ID and variation ID.",
        inputSchema: {
            type: "object",
            properties: {
                itemId: {
                    type: "integer",
                    description: "The item ID",
                },
                variationId: {
                    type: "integer",
                    description: "The variation ID",
                },
                with: {
                    type: "string",
                    description: "Include related data (comma-separated)",
                },
                lang: {
                    type: "string",
                    description: "Language code for variation texts",
                },
            },
            required: ["itemId", "variationId"],
        },
    },
    {
        name: "plenty_list_barcodes",
        description: "List all barcodes.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
];
//# sourceMappingURL=items.js.map