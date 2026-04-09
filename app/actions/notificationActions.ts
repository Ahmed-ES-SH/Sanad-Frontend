import { NOTIFICATIONS_ENDPOINTS } from "@/app/constants/endpoints";
import { clientApiRequest } from "@/lib/client-api";

// ============================================================================
// USER-FACING NOTIFICATION API FUNCTIONS
// ============================================================================

/**
 * Fetches paginated notifications for the authenticated user.
 * GET /api/notifications?page=1&limit=20
 */
export async function fetchNotificationsApi(page = 1, limit = 20) {
  return clientApiRequest(NOTIFICATIONS_ENDPOINTS.LIST(page, limit), "GET");
}

/**
 * Fetches the unread notification count for the authenticated user.
 * GET /api/notifications/unread-count
 */
export async function fetchUnreadCountApi() {
  return clientApiRequest(NOTIFICATIONS_ENDPOINTS.UNREAD_COUNT, "GET");
}

/**
 * Marks a single notification as read.
 * PATCH /api/notifications/:id/read
 */
export async function markAsReadApi(notificationId: string) {
  return clientApiRequest(
    NOTIFICATIONS_ENDPOINTS.MARK_AS_READ(notificationId),
    "PATCH"
  );
}

/**
 * Marks all notifications as read.
 * PATCH /api/notifications/read-all
 */
export async function markAllAsReadApi() {
  return clientApiRequest(NOTIFICATIONS_ENDPOINTS.MARK_ALL_AS_READ, "PATCH");
}

/**
 * Deletes a notification (soft delete).
 * DELETE /api/notifications/:id
 */
export async function deleteNotificationApi(notificationId: string) {
  return clientApiRequest(NOTIFICATIONS_ENDPOINTS.DELETE(notificationId), "DELETE");
}

/**
 * Fetches notification preferences.
 * GET /api/notifications/preferences
 */
export async function fetchPreferencesApi() {
  return clientApiRequest(NOTIFICATIONS_ENDPOINTS.PREFERENCES, "GET");
}

/**
 * Updates notification preferences.
 * PATCH /api/notifications/preferences
 */
export async function updatePreferencesApi(
  preferences: {
    orderNotifications?: boolean;
    paymentNotifications?: boolean;
    systemNotifications?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
  }
) {
  const params = new URLSearchParams();
  Object.entries(preferences).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  const endpoint = `${NOTIFICATIONS_ENDPOINTS.PREFERENCES}?${params.toString()}`;
  return clientApiRequest(endpoint, "PATCH");
}

// ============================================================================
// ADMIN NOTIFICATION API FUNCTIONS
// ============================================================================

/**
 * Sends a notification to a specific user (admin only).
 * POST /api/admin/notifications/send
 */
export async function sendNotificationApi(payload: {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}) {
  return clientApiRequest(NOTIFICATIONS_ENDPOINTS.ADMIN_SEND, "POST", payload);
}

/**
 * Broadcasts a notification to users (admin only).
 * POST /api/admin/notifications/broadcast
 */
export async function broadcastNotificationApi(payload: {
  title: string;
  message: string;
  targetUserIds?: string[];
  data?: Record<string, unknown>;
}) {
  return clientApiRequest(
    NOTIFICATIONS_ENDPOINTS.ADMIN_BROADCAST,
    "POST",
    payload
  );
}

/**
 * Fetches all notifications paginated (admin only).
 * GET /api/admin/notifications?page=1&limit=20
 */
export async function fetchAdminNotificationsApi(page = 1, limit = 20) {
  return clientApiRequest(
    NOTIFICATIONS_ENDPOINTS.ADMIN_LIST(page, limit),
    "GET"
  );
}

/**
 * Hard deletes a notification (admin only).
 * DELETE /api/admin/notifications/:id
 */
export async function adminDeleteNotificationApi(notificationId: string) {
  return clientApiRequest(
    NOTIFICATIONS_ENDPOINTS.ADMIN_DELETE(notificationId),
    "DELETE"
  );
}
