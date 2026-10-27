// ============================================================================
// Configuration
// ============================================================================

export const config = {
  baseUrl: process.env.PLENTYONE_BASE_URL || "",
  username: process.env.PLENTYONE_USERNAME || "",
  password: process.env.PLENTYONE_PASSWORD || "",
};

// ============================================================================
// Token Management
// ============================================================================

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let tokenData: TokenData | null = null;

/** Clear the cached token (used by the logout tool). */
export function resetToken(): void {
  tokenData = null;
}

async function ensureAuthenticated(): Promise<string> {
  if (!tokenData || Date.now() >= tokenData.expiresAt - 60000) {
    if (tokenData?.refreshToken) {
      try {
        await refreshAccessToken();
      } catch {
        await login();
      }
    } else {
      await login();
    }
  }
  return tokenData!.accessToken;
}

export async function login(): Promise<void> {
  const response = await fetch(`${config.baseUrl}/rest/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: config.username,
      password: config.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const data = await response.json();
  tokenData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + (data.expiresIn || 86400) * 1000,
  };
}

export async function refreshAccessToken(): Promise<void> {
  const response = await fetch(`${config.baseUrl}/rest/login/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData!.accessToken}`,
    },
    body: JSON.stringify({ refresh_token: tokenData!.refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  tokenData = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || tokenData!.refreshToken,
    expiresAt: Date.now() + (data.expiresIn || 86400) * 1000,
  };
}

// ============================================================================
// API Helper
// ============================================================================

export async function apiRequest(
  method: string,
  endpoint: string,
  body?: unknown,
  queryParams?: Record<string, string | number | boolean | undefined>
): Promise<unknown> {
  const token = await ensureAuthenticated();

  let url = `${config.baseUrl}${endpoint}`;
  if (queryParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  return response.json();
}
