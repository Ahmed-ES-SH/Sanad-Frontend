import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "@/app/types/notification";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

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
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
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
