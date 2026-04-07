import { AUTH_ENDPOINTS } from "@/app/constants/endpoints";
import { getAuthCookie } from "@/lib/session";
import {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "@/lib/types/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  public statusCode: number;
  public error?: string;

  constructor(message: string, statusCode: number, error?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.error = error;
  }
}

async function apiClient<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, requiresAuth = false } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (requiresAuth) {
    const token = await getAuthCookie();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Request failed",
        response.status,
        errorData.error,
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError("Network error. Please check your connection.", 0);
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred",
      500,
    );
  }
}

export async function publicRequest<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?:
    | Record<string, unknown>
    | LoginCredentials
    | RegisterCredentials
    | ResetPasswordCredentials,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method,
    body: body as Record<string, unknown>,
  });
}

export async function protectedRequest<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: Record<string, unknown>,
): Promise<T> {
  return apiClient<T>(endpoint, { method, body, requiresAuth: true });
}

export async function logoutBackend(token: string): Promise<void> {
  await apiClient(AUTH_ENDPOINTS.LOGOUT, {
    method: "POST",
    body: { token },
    requiresAuth: true,
  });
}
