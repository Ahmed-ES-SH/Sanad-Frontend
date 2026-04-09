/**
 * Client-side API client for notification actions.
 * This is separate from the server-side api-client.ts which uses next/headers
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export class ClientApiError extends Error {
  public statusCode: number;
  public error?: string;

  constructor(message: string, statusCode: number, error?: string) {
    super(message);
    this.name = "ClientApiError";
    this.statusCode = statusCode;
    this.error = error;
  }
}

/**
 * Gets the JWT token from the client-side cookie.
 */
function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^|;)sanad_auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Makes an authenticated API request from the client side.
 */
export async function clientApiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  const token = getAuthToken();
  if (!token) {
    throw new ClientApiError("Authentication required", 401);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ClientApiError(
        errorData.message || "Request failed",
        response.status,
        errorData.error
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ClientApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ClientApiError("Network error. Please check your connection.", 0);
    }

    throw new ClientApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      500
    );
  }
}
