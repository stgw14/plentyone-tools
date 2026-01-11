/**
 * HTTP Client for plentyONE REST API
 * Handles authentication, token refresh, and API requests
 */
import { AuthTokens, ApiResponse } from "./types.js";
/**
 * Get current auth tokens
 */
export declare function getAuthTokens(): AuthTokens | null;
/**
 * Set auth tokens
 */
export declare function setAuthTokens(tokens: AuthTokens | null): void;
/**
 * Clear auth tokens (logout)
 */
export declare function clearAuthTokens(): void;
/**
 * Make an API request to plentyONE
 */
export declare function makeRequest<T>(endpoint: string, options?: {
    method?: string;
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
    requiresAuth?: boolean;
}): Promise<ApiResponse<T>>;
/**
 * Refresh the access token
 */
export declare function refreshAccessToken(): Promise<ApiResponse<AuthTokens>>;
//# sourceMappingURL=http-client.d.ts.map