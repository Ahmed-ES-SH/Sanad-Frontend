import io from "socket.io-client";
import { SOCKET_CONFIG } from "@/app/constants/notifications";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "https://sanad-backend.vercel.app";

/**
 * Creates a Socket.IO connection for real-time notifications.
 * Works with cookie-based auth and optional token fallback.
 * @param token - Optional JWT authentication token
 * @returns Configured Socket.IO instance
 */
export function createNotificationSocket(token?: string) {
  return io(BACKEND_URL, {
    withCredentials: true,
    auth: token ? { token } : undefined,
    query: token ? { token } : undefined,
    transports: [...SOCKET_CONFIG.TRANSPORTS],
    reconnection: SOCKET_CONFIG.RECONNECTION,
    reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
    reconnectionDelayMax: SOCKET_CONFIG.RECONNECTION_DELAY_MAX,
    reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
  } as any);
}

/**
 * Disconnects and cleans up a Socket.IO connection.
 * @param socket - Socket.IO instance to disconnect
 */
export function disconnectNotificationSocket(
  socket: ReturnType<typeof createNotificationSocket> | null,
): void {
  if (socket) {
    socket.disconnect();
  }
}
