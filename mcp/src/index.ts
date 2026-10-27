#!/usr/bin/env node

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { filterPII } from "./utils/pii-filter.js";
import { config } from "./core/client.js";
import { tools } from "./tools/index.js";
import { handleToolCall } from "./handlers/index.js";


// ============================================================================
// Server Setup
// ============================================================================

// ============================================================================
// Server & Handler Registration
// ============================================================================

const SERVER_NAME = "plentyone-mcp-server";
const SERVER_VERSION = "1.3.0";

function createMcpServer(): Server {
  return new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );
}

function registerHandlers(s: Server): void {
  s.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  s.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleToolCall(name, (args as Record<string, unknown>) || {});
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(filterPII(result), null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });
}

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  if (!config.baseUrl || !config.username || !config.password) {
    console.error("Missing required environment variables:");
    console.error("  PLENTYONE_BASE_URL");
    console.error("  PLENTYONE_USERNAME");
    console.error("  PLENTYONE_PASSWORD");
    process.exit(1);
  }

  const mode = (process.env.MCP_TRANSPORT ?? "stdio").toLowerCase();

  if (mode === "http") {
    const port = parseInt(process.env.MCP_PORT ?? "3102", 10);
    const host = process.env.MCP_HOST ?? "0.0.0.0";

    const transports = new Map<string, StreamableHTTPServerTransport>();

    const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
        return;
      }

      if (url.pathname !== "/mcp") {
        res.writeHead(404).end("Not Found");
        return;
      }

      // Existing session
      const sessionId = req.headers["mcp-session-id"] as string | undefined;
      if (sessionId && transports.has(sessionId)) {
        const transport = transports.get(sessionId)!;
        await transport.handleRequest(req, res);
        return;
      }

      if (sessionId && !transports.has(sessionId)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Session not found" }));
        return;
      }

      // New session
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          transports.delete(transport.sessionId);
        }
      };

      const sessionServer = createMcpServer();
      registerHandlers(sessionServer);
      await sessionServer.connect(transport);
      await transport.handleRequest(req, res);

      if (transport.sessionId) {
        transports.set(transport.sessionId, transport);
      }
    });

    httpServer.listen(port, host, () => {
      console.error(`plentyONE MCP Server v${SERVER_VERSION} running on http://${host}:${port}/mcp`);
    });
  } else {
    const server = createMcpServer();
    registerHandlers(server);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`plentyONE MCP Server v${SERVER_VERSION} started (stdio)`);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
