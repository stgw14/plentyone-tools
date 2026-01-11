/**
 * Authentication Tool Definitions
 */
export const authTools = [
    {
        name: "plenty_login",
        description: "Authenticate with plentyONE and obtain access tokens. Must be called before using other tools.",
        inputSchema: {
            type: "object",
            properties: {
                username: {
                    type: "string",
                    description: "Username (optional, uses environment variable if not provided)",
                },
                password: {
                    type: "string",
                    description: "Password (optional, uses environment variable if not provided)",
                },
            },
            required: [],
        },
    },
    {
        name: "plenty_logout",
        description: "Log out from plentyONE and clear the current session.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "plenty_refresh_token",
        description: "Refresh the access token using the refresh token.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "plenty_get_authorized_user",
        description: "Get information about the currently authenticated user.",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
];
//# sourceMappingURL=auth.js.map