/**
 * Authentication Handlers
 */

import { config } from "../config.js";
import { ApiResponse, AuthTokens } from "../types.js";
import {
  makeRequest,
  setAuthTokens,
  clearAuthTokens,
  refreshAccessToken,
} from "../http-client.js";

export async function handleLogin(
  args: Record<string, unknown>
): Promise<ApiResponse> {
  const username = (args.username as string) || config.username;
  const password = (args.password as string) || config.password;

  if (!username || !password) {
    return {
      success: false,
      error: {
        code: "MISSING_CREDENTIALS",
        message:
          "Username and password are required. Provide them as arguments or set PLENTYONE_USERNAME and PLENTYONE_PASSWORD environment variables.",
      },
    };
  }

  if (!config.baseUrl) {
    return {
      success: false,
      error: {
        code: "MISSING_BASE_URL",
        message:
          "Base URL is required. Set PLENTYONE_BASE_URL environment variable.",
      },
    };
  }

  const result = await makeRequest<AuthTokens>("/rest/login", {
    method: "POST",
    body: { username, password },
    requiresAuth: false,
  });

  if (result.success && result.data) {
    const data = result.data as AuthTokens;
    setAuthTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tokenType: data.tokenType || "Bearer",
    });
    return {
      success: true,
      data: {
        message: "Login successful",
        tokenType: data.tokenType || "Bearer",
      },
    };
  }

  return result;
}

export async function handleLogout(): Promise<ApiResponse> {
  const result = await makeRequest("/rest/logout", { method: "POST" });
  if (result.success) {
    clearAuthTokens();
    return { success: true, data: { message: "Logged out successfully" } };
  }
  return result;
}

export async function handleRefreshToken(): Promise<ApiResponse> {
  const result = await refreshAccessToken();
  if (result.success) {
    return {
      success: true,
      data: { message: "Token refreshed successfully" },
    };
  }
  return result;
}

export async function handleGetAuthorizedUser(): Promise<ApiResponse> {
  return makeRequest("/rest/authorized_user");
}
