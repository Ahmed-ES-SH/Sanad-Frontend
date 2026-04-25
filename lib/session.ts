const AUTH_COOKIE_NAME = "sanad_auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function getServerCookieStore() {
  const { cookies } = await import("next/headers");
  return cookies();
}

// Server-side function for App Router
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await getServerCookieStore();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

// Client-safe function for browser/CSR - returns null on server
export function getClientAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^|;)\s*sanad_auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[2]) : null;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await getServerCookieStore();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function deleteAuthCookie() {
  const cookieStore = await getServerCookieStore();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
