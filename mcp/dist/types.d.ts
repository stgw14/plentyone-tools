/**
 * Shared type definitions for plentyONE MCP Server
 */
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresAt?: number;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export interface PaginationParams {
    page?: number;
    itemsPerPage?: number;
}
export interface DateRangeParams {
    createdAtFrom?: string;
    createdAtTo?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
}
//# sourceMappingURL=types.d.ts.map