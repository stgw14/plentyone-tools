#!/usr/bin/env node
/**
 * plentyONE MCP Server
 *
 * Provides MCP tools for interacting with the plentyONE REST API.
 * Supports Authentication, Contacts, Items, Orders, Stock, Categories, and Payments.
 *
 * Environment variables required:
 * - PLENTYONE_BASE_URL: Base URL of the plentyONE system (e.g., https://your-shop.plentymarkets-cloud01.com)
 * - PLENTYONE_USERNAME: Username for authentication
 * - PLENTYONE_PASSWORD: Password for authentication
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { allTools } from "./tools/index.js";
import { handleToolCall } from "./handlers/index.js";
// =============================================================================
// Server Setup
// =============================================================================
const server = new Server({
    name: "plentyone-mcp-server",
    version: "1.1.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: allTools };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        const result = await handleToolCall(name, args);
        return {
            content: [
                {
                    type: "text",
                    text: result,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        success: false,
                        error: {
                            code: "TOOL_ERROR",
                            message: error instanceof Error ? error.message : "Unknown error",
                        },
                    }, null, 2),
                },
            ],
        };
    }
});
// =============================================================================
// Main Entry Point
// =============================================================================
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("plentyONE MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map