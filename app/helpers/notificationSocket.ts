import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/app/types/notification";
import { SOCKET_CONFIG } from "@/app/constants/notifications";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || "http://localhost:5000";

/**
 * Creates a Socket.IO connection for real-time notifications.
 * @param token - JWT authentication token
 * @returns Configured Socket.IO instance
 */
export function createNotificationSocket(token: string): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(BACKEND_URL, {
    auth: {
      token,
    },
    transports: SOCKET_CONFIG.TRANSPORTS,
    reconnection: SOCKET_CONFIG.RECONNECTION,
    reconnectionDelay: SOCKET_CONFIG.RECONNECTION_DELAY,
    reconnectionDelayMax: SOCKET_CONFIG.RECONNECTION_DELAY_MAX,
    reconnectionAttempts: SOCKET_CONFIG.RECONNECTION_ATTEMPTS,
  });
}

/**
 * Disconnects and cleans up a Socket.IO connection.
 * @param socket - Socket.IO instance to disconnect
 */
export function disconnectNotificationSocket(socket: Socket | null): void {
  if (socket) {
    socket.disconnect();
  }
}
