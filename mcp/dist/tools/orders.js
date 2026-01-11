/**
 * Orders Tool Definitions
 */
export const ordersTools = [
    {
        name: "plenty_search_orders",
        description: "Search for orders with optional filtering and pagination.",
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
                    description: "Include related data (comma-separated, e.g., 'addresses,orderItems,documents')",
                },
                statusFrom: {
                    type: "number",
                    description: "Filter by minimum order status",
                },
                statusTo: {
                    type: "number",
                    description: "Filter by maximum order status",
                },
                createdAtFrom: {
                    type: "string",
                    description: "Filter orders created after this date (ISO 8601 format)",
                },
                createdAtTo: {
                    type: "string",
                    description: "Filter orders created before this date (ISO 8601 format)",
                },
                plentyId: {
                    type: "integer",
                    description: "Filter by plenty ID (client/shop)",
                },
            },
            required: [],
        },
    },
    {
        name: "plenty_get_order",
        description: "Get a single order by ID.",
        inputSchema: {
            type: "object",
            properties: {
                orderId: {
                    type: "integer",
                    description: "The order ID",
                },
                with: {
                    type: "string",
                    description: "Include related data (comma-separated, e.g., 'addresses,orderItems,documents')",
                },
            },
            required: ["orderId"],
        },
    },
    {
        name: "plenty_get_order_items",
        description: "Get all items of a specific order.",
        inputSchema: {
            type: "object",
            properties: {
                orderId: {
                    type: "integer",
                    description: "The order ID",
                },
            },
            required: ["orderId"],
        },
    },
    {
        name: "plenty_get_order_addresses",
        description: "Get all addresses of a specific order (billing, delivery, etc.).",
        inputSchema: {
            type: "object",
            properties: {
                orderId: {
                    type: "integer",
                    description: "The order ID",
                },
            },
            required: ["orderId"],
        },
    },
    {
        name: "plenty_get_order_documents",
        description: "Get all documents of a specific order (invoices, delivery notes, etc.).",
        inputSchema: {
            type: "object",
            properties: {
                orderId: {
                    type: "integer",
                    description: "The order ID",
                },
            },
            required: ["orderId"],
        },
    },
    {
        name: "plenty_get_order_shipping",
        description: "Get shipping packages of a specific order.",
        inputSchema: {
            type: "object",
            properties: {
                orderId: {
                    type: "integer",
                    description: "The order ID",
                },
            },
            required: ["orderId"],
        },
    },
];
//# sourceMappingURL=orders.js.map