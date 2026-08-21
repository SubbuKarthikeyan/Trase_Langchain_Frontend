/**
 * api-client.ts
 * -------------
 * Helper for making authenticated requests to the backend or proxy API.
 * Automatically attaches Authorization: Bearer <accessToken> and retries
 * once on 401 by attempting to refresh the token via /api/auth/refresh.
 */

let currentAccessToken: string | null = null;
let setTokenCallback: ((token: string | null) => void) | null = null;

export function configureApiClient(
  accessToken: string | null,
  updateTokenFn: (token: string | null) => void
) {
  currentAccessToken = accessToken;
  setTokenCallback = updateTokenFn;
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (currentAccessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${currentAccessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If 401 Unauthorized, attempt refresh
  if (response.status === 401) {
    try {
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const newToken = refreshData.access_token;
        currentAccessToken = newToken;
        if (setTokenCallback) {
          setTokenCallback(newToken);
        }

        // Retry original request with new access token
        const retryHeaders = new Headers(options.headers || {});
        retryHeaders.set("Authorization", `Bearer ${newToken}`);
        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    } catch (refreshErr) {
      console.error("Silent token refresh failed:", refreshErr);
    }
  }

  return response;
}
