/**
 * HTTP Client for plentyONE REST API
 * Handles authentication, token refresh, and API requests
 */
import { config } from "./config.js";
// Token storage (in-memory for this session)
let authTokens = null;
/**
 * Get current auth tokens
 */
export function getAuthTokens() {
    return authTokens;
}
/**
 * Set auth tokens
 */
export function setAuthTokens(tokens) {
    authTokens = tokens;
}
/**
 * Clear auth tokens (logout)
 */
export function clearAuthTokens() {
    authTokens = null;
}
/**
 * Make an API request to plentyONE
 */
export async function makeRequest(endpoint, options = {}) {
    const { method = "GET", body, query, requiresAuth = true } = options;
    // Build URL with query parameters
    let url = `${config.baseUrl}${endpoint}`;
    if (query) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        }
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    // Build headers
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    if (requiresAuth) {
        if (!authTokens) {
            return {
                success: false,
                error: {
                    code: "NOT_AUTHENTICATED",
                    message: "Not authenticated. Please call plenty_login first.",
                },
            };
        }
        headers["Authorization"] = `Bearer ${authTokens.accessToken}`;
    }
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        // Handle 401 - try to refresh token
        if (response.status === 401 && requiresAuth && authTokens?.refreshToken) {
            const refreshResult = await refreshAccessToken();
            if (refreshResult.success) {
                // Retry the original request
                headers["Authorization"] = `Bearer ${authTokens.accessToken}`;
                const retryResponse = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                });
                if (!retryResponse.ok) {
                    const errorData = await retryResponse.json().catch(() => ({}));
                    return {
                        success: false,
                        error: {
                            code: `HTTP_${retryResponse.status}`,
                            message: retryResponse.statusText,
                            details: errorData,
                        },
                    };
                }
                const data = await retryResponse.json();
                return { success: true, data };
            }
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                error: {
                    code: `HTTP_${response.status}`,
                    message: response.statusText,
                    details: errorData,
                },
            };
        }
        const data = await response.json();
        return { success: true, data };
    }
    catch (error) {
        return {
            success: false,
            error: {
                code: "REQUEST_FAILED",
                message: error instanceof Error ? error.message : "Unknown error",
            },
        };
    }
}
/**
 * Refresh the access token
 */
export async function refreshAccessToken() {
    if (!authTokens?.refreshToken) {
        return {
            success: false,
            error: {
                code: "NO_REFRESH_TOKEN",
                message: "No refresh token available",
            },
        };
    }
    const response = await makeRequest("/rest/login/refresh", {
        method: "POST",
        requiresAuth: true,
    });
    if (response.success && response.data) {
        authTokens = {
            ...authTokens,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken || authTokens.refreshToken,
        };
    }
    return response;
}
//# sourceMappingURL=http-client.js.map