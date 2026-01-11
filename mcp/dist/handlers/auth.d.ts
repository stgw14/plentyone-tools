/**
 * Authentication Handlers
 */
import { ApiResponse } from "../types.js";
export declare function handleLogin(args: Record<string, unknown>): Promise<ApiResponse>;
export declare function handleLogout(): Promise<ApiResponse>;
export declare function handleRefreshToken(): Promise<ApiResponse>;
export declare function handleGetAuthorizedUser(): Promise<ApiResponse>;
//# sourceMappingURL=auth.d.ts.map