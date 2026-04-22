import { NotificationType } from "@/app/types/notification";
import { NOTIFICATIONS_ENDPOINTS } from "./endpoints";

export const NOTIFICATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  ORDER_UPDATED: "Order Update",
  PAYMENT_SUCCESS: "Payment Successful",
  PAYMENT_FAILED: "Payment Failed",
  SYSTEM: "System Alert",
  BROADCAST: "Announcement",
};

export const SOCKET_CONFIG = {
  RECONNECTION: true,
  RECONNECTION_DELAY: 1000,
  RECONNECTION_DELAY_MAX: 5000,
  RECONNECTION_ATTEMPTS: 5,
  TRANSPORTS: ["websocket"] as const,
};

// Re-export endpoints for convenience
export const ENDPOINTS = NOTIFICATIONS_ENDPOINTS;
