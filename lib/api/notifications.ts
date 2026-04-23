import { instance } from "@/lib/axios";
import { NOTIFICATIONS_ENDPOINTS } from "@/app/constants/endpoints";
import {
  NotificationListResponse,
  BroadcastResponse,
  SendNotificationFormData,
  BroadcastNotificationFormData,
} from "@/app/types/notification";

/**
 * Admin: Fetch notification history with pagination
 */
export async function adminFetchNotifications(
  page: number = 1,
  limit: number = 10,
): Promise<NotificationListResponse> {
  const res = await instance.get<NotificationListResponse>(
    NOTIFICATIONS_ENDPOINTS.ADMIN_LIST(page, limit),
  );
  return res.data;
}

/**
 * Admin: Send direct notification to a specific user
 */
export async function sendDirectNotification(
  data: SendNotificationFormData,
): Promise<{ success: boolean }> {
  const res = await instance.post<{ success: boolean }>(
    NOTIFICATIONS_ENDPOINTS.ADMIN_SEND,
    data,
  );
  return res.data;
}

/**
 * Admin: Send broadcast notification to multiple users
 */
export async function sendBroadcastNotification(
  data: BroadcastNotificationFormData,
): Promise<BroadcastResponse> {
  const res = await instance.post<BroadcastResponse>(
    NOTIFICATIONS_ENDPOINTS.ADMIN_BROADCAST,
    data,
  );
  return res.data;
}

/**
 * Admin: Delete a notification from history
 */
export async function adminDeleteNotification(
  id: string,
): Promise<{ success: boolean }> {
  const res = await instance.delete<{ success: boolean }>(
    NOTIFICATIONS_ENDPOINTS.ADMIN_DELETE(id),
  );
  return res.data;
}
