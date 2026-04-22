"use client";
import { instance as axios } from "@/lib/axios";
import { ENDPOINTS } from "@/app/constants/notifications";
import {
  NotificationListResponse,
  UnreadCountResponse,
  MarkAllReadResponse,
  BroadcastResponse,
  NotificationPreferences,
  SendNotificationFormData,
  BroadcastNotificationFormData,
  UpdatePreferencesFormData,
} from "@/app/types/notification";

/**
 * Error handling wrapper to provide retries and token expiration detection
 */
async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  retries = 1,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.response) {
      const statusCode = error.response.status;
      // Handle token expiration
      if (statusCode === 401) {
        if (typeof window !== "undefined") {
          // Could trigger a global event, context update, or direct redirect
          // window.location.href = "/login";
        }
      }

      // Retry logic for Server Errors or Network issues
      if (statusCode >= 500 && retries > 0) {
        console.warn(
          `API request failed with status ${statusCode}. Retrying...`,
        );
        // Add a small delay before retrying
        await new Promise((res) => setTimeout(res, 1000));
        return withErrorHandling(apiCall, retries - 1);
      }
    } else if (error.request && retries > 0) {
      // Network error (no response)
      console.warn(`API request failed (network error). Retrying...`);
      await new Promise((res) => setTimeout(res, 1000));
      return withErrorHandling(apiCall, retries - 1);
    }

    // Throw the backend error message if available, otherwise the axios error
    throw error.response?.data || error;
  }
}

// ----------------------------------------------------------------------------
// USER ENDPOINTS
// ----------------------------------------------------------------------------

export async function fetchNotifications(
  page: number = 1,
  limit: number = 10,
): Promise<NotificationListResponse> {
  return withErrorHandling(async () => {
    const res = await axios.get<NotificationListResponse>(
      ENDPOINTS.LIST(page, limit),
    );
    return res.data;
  });
}

export async function fetchUnreadCount(): Promise<UnreadCountResponse> {
  return withErrorHandling(async () => {
    const res = await axios.get<UnreadCountResponse>(ENDPOINTS.UNREAD_COUNT);
    return res.data;
  });
}

export async function markAsRead(id: string): Promise<{ success: boolean }> {
  return withErrorHandling(async () => {
    const res = await axios.patch<{ success: boolean }>(
      ENDPOINTS.MARK_AS_READ(id),
    );
    return res.data;
  });
}

export async function markAllAsRead(): Promise<MarkAllReadResponse> {
  return withErrorHandling(async () => {
    const res = await axios.patch<MarkAllReadResponse>(
      ENDPOINTS.MARK_ALL_AS_READ,
    );
    return res.data;
  });
}

export async function deleteNotification(
  id: string,
): Promise<{ success: boolean }> {
  return withErrorHandling(async () => {
    const res = await axios.delete<{ success: boolean }>(ENDPOINTS.DELETE(id));
    return res.data;
  });
}

export async function fetchPreferences(): Promise<NotificationPreferences> {
  return withErrorHandling(async () => {
    const res = await axios.get<NotificationPreferences>(ENDPOINTS.PREFERENCES);
    return res.data;
  });
}

export async function updatePreferences(
  prefs: UpdatePreferencesFormData,
): Promise<NotificationPreferences> {
  return withErrorHandling(async () => {
    const res = await axios.patch<NotificationPreferences>(
      ENDPOINTS.PREFERENCES,
      prefs,
    );
    return res.data;
  });
}

// ----------------------------------------------------------------------------
// ADMIN ENDPOINTS
// ----------------------------------------------------------------------------

export async function adminFetchNotifications(
  page: number = 1,
  limit: number = 10,
): Promise<NotificationListResponse> {
  return withErrorHandling(async () => {
    const res = await axios.get<NotificationListResponse>(
      ENDPOINTS.ADMIN_LIST(page, limit),
    );
    return res.data;
  });
}

export async function sendNotification(
  data: SendNotificationFormData,
): Promise<{ success: boolean }> {
  return withErrorHandling(async () => {
    const res = await axios.post<{ success: boolean }>(
      ENDPOINTS.ADMIN_SEND,
      data,
    );
    return res.data;
  });
}

export async function broadcastNotification(
  data: BroadcastNotificationFormData,
): Promise<BroadcastResponse> {
  return withErrorHandling(async () => {
    const res = await axios.post<BroadcastResponse>(
      ENDPOINTS.ADMIN_BROADCAST,
      data,
    );
    return res.data;
  });
}

export async function adminDeleteNotification(
  id: string,
): Promise<{ success: boolean }> {
  return withErrorHandling(async () => {
    const res = await axios.delete<{ success: boolean }>(
      ENDPOINTS.ADMIN_DELETE(id),
    );
    return res.data;
  });
}
