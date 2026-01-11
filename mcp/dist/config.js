/**
 * Configuration for plentyONE MCP Server
 *
 * Environment variables:
 * - PLENTYONE_BASE_URL: Base URL of the plentyONE system
 * - PLENTYONE_USERNAME: Username for authentication
 * - PLENTYONE_PASSWORD: Password for authentication
 */
export const config = {
    baseUrl: process.env.PLENTYONE_BASE_URL || "",
    username: process.env.PLENTYONE_USERNAME || "",
    password: process.env.PLENTYONE_PASSWORD || "",
};
//# sourceMappingURL=config.js.map