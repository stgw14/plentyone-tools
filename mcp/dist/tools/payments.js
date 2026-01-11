/**
 * Payments Tool Definitions
 */
export const paymentsTools = [
    {
        name: "plenty_list_payments",
        description: "List payments with optional filtering and pagination.",
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
                orderId: {
                    type: "integer",
                    description: "Filter by order ID",
                },
                transactionType: {
                    type: "integer",
                    description: "Filter by transaction type",
                },
                createdAtFrom: {
                    type: "string",
                    description: "Filter payments created after this date (ISO 8601 format)",
                },
                createdAtTo: {
                    type: "string",
                    description: "Filter payments created before this date (ISO 8601 format)",
                },
            },
            required: [],
        },
    },
    {
        name: "plenty_get_payment",
        description: "Get a single payment by ID.",
        inputSchema: {
            type: "object",
            properties: {
                paymentId: {
                    type: "integer",
                    description: "The payment ID",
                },
            },
            required: ["paymentId"],
        },
    },
    {
        name: "plenty_list_payment_methods",
        description: "List all available payment methods.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "plenty_get_payment_properties",
        description: "Get properties of a specific payment.",
        inputSchema: {
            type: "object",
            properties: {
                paymentId: {
                    type: "integer",
                    description: "The payment ID",
                },
            },
            required: ["paymentId"],
        },
    },
];
//# sourceMappingURL=payments.js.map