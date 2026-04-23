"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode, useRef, useState } from "react";
import { NotificationState, NotificationAction, Notification } from "@/app/types/notification";
import { useAuth } from "./AuthContext";
import { createNotificationSocket, disconnectNotificationSocket } from "@/app/helpers/notificationSocket";
import * as api from "@/app/actions/notificationApi";
import { NOTIFICATION_CONSTANTS } from "@/app/constants/notifications";
import IncomingNotificationPopup from "@/app/_components/_global/IncomingNotificationPopup";

interface NotificationContextType extends NotificationState {
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  preferences: null,
  isLoading: false,
  isSocketConnected: false,
  error: null,
  pagination: {
    page: NOTIFICATION_CONSTANTS.DEFAULT_PAGE,
    limit: NOTIFICATION_CONSTANTS.DEFAULT_LIMIT,
    total: 0,
  },
};

function mergeByNotificationId(
  current: Notification[],
  incoming: Notification[],
): Notification[] {
  const map = new Map<string, Notification>();

  for (const item of current) {
    map.set(item.id, item);
  }

  for (const item of incoming) {
    map.set(item.id, item);
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case "SET_NOTIFICATIONS": {
      const { response, append } = action.payload;
      const notifications = append
        ? mergeByNotificationId(state.notifications, response.data)
        : response.data;

      return {
        ...state,
        notifications,
        pagination: {
          page: response.page,
          limit: response.limit,
          total: response.total,
        },
      };
    }
    case "ADD_NOTIFICATION":
      if (state.notifications.some((n) => n.id === action.payload.id)) {
        return state;
      }

      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "MARK_AS_READ": {
      const wasUnread =
        state.notifications.find((n) => n.id === action.payload)?.isRead ===
        false;

      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      };
    case "DELETE_NOTIFICATION": {
      const isUnread = state.notifications.find((n) => n.id === action.payload)?.isRead === false;
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
        unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }
    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    case "SET_PREFERENCES":
      return { ...state, preferences: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SOCKET_STATUS":
      return { ...state, isSocketConnected: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_PAGINATION":
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    default:
      return state;
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const [popupNotifications, setPopupNotifications] = useState<Notification[]>([]);
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<ReturnType<typeof createNotificationSocket> | null>(null);

  const dismissPopup = useCallback((id: string) => {
    setPopupNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Helper to get token
  const getClientToken = useCallback(() => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(^|;)\s*sanad_auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[2]) : null;
  }, []);

  const fetchNotifications = useCallback(async (page?: number, limit?: number) => {
    if (!isAuthenticated) return;
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    try {
      const p = page || state.pagination.page;
      const l = limit || state.pagination.limit;
      const res = await api.fetchNotifications(p, l);
      dispatch({
        type: "SET_NOTIFICATIONS",
        payload: { response: res, append: p > NOTIFICATION_CONSTANTS.DEFAULT_PAGE },
      });
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to fetch notifications" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated, state.pagination.page, state.pagination.limit]);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.fetchUnreadCount();
      dispatch({ type: "SET_UNREAD_COUNT", payload: res.unreadCount });
    } catch (err: any) {
      console.error("Failed to fetch unread count:", err);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic UI update
    dispatch({ type: "MARK_AS_READ", payload: id });
    try {
      await api.markAsRead(id);
    } catch (err: any) {
      // Revert optimism on error
      fetchNotifications();
      refreshUnreadCount();
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to mark as read" });
    }
  }, [fetchNotifications, refreshUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
    try {
      await api.markAllAsRead();
    } catch (err: any) {
      fetchNotifications();
      refreshUnreadCount();
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to mark all as read" });
    }
  }, [fetchNotifications, refreshUnreadCount]);

  const deleteNotification = useCallback(async (id: string) => {
    dispatch({ type: "DELETE_NOTIFICATION", payload: id });
    try {
      await api.deleteNotification(id);
    } catch (err: any) {
      fetchNotifications();
      refreshUnreadCount();
      dispatch({ type: "SET_ERROR", payload: err.message || "Failed to delete notification" });
    }
  }, [fetchNotifications, refreshUnreadCount]);

  // WebSocket Integration
  useEffect(() => {
    if (isAuthenticated) {
      const token = getClientToken();
      const socket = createNotificationSocket(token || undefined);
      socketRef.current = socket;

      socket.on("connect", () => {
        dispatch({ type: "SET_SOCKET_STATUS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        // Fetch on reconnect or initial connect to ensure sync
        fetchNotifications(1, state.pagination.limit);
        refreshUnreadCount();
      });

      socket.on("disconnect", () => {
        dispatch({ type: "SET_SOCKET_STATUS", payload: false });
      });
      
      socket.on("connect_error", (error: Error) => {
        dispatch({ type: "SET_SOCKET_STATUS", payload: false });
        dispatch({ type: "SET_ERROR", payload: error.message || "Notification socket connection failed" });
      });

      socket.on("notification:new", (notification: Notification) => {
        dispatch({ type: "ADD_NOTIFICATION", payload: notification });
        setPopupNotifications((prev) => {
          if (prev.some((item) => item.id === notification.id)) {
            return prev;
          }
          return [notification, ...prev].slice(0, 10);
        });
      });

      socket.on("notification:read", (data: { notificationId: string }) => {
        dispatch({ type: "MARK_AS_READ", payload: data.notificationId });
      });

      socket.on("notification:read_all", () => {
        dispatch({ type: "MARK_ALL_AS_READ" });
      });

      socket.on("notification:count", (data: { unreadCount: number }) => {
        dispatch({ type: "SET_UNREAD_COUNT", payload: data.unreadCount });
      });

      socket.on("notification:delete", (data: { notificationId: string }) => {
        dispatch({ type: "DELETE_NOTIFICATION", payload: data.notificationId });
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("notification:new");
        socket.off("notification:read");
        socket.off("notification:read_all");
        socket.off("notification:count");
        socket.off("notification:delete");
        disconnectNotificationSocket(socket);
        socketRef.current = null;
      };
    } else {
      // Disconnect if user logs out
      if (socketRef.current) {
        disconnectNotificationSocket(socketRef.current);
        socketRef.current = null;
        dispatch({ type: "SET_SOCKET_STATUS", payload: false });
        dispatch({ type: "SET_UNREAD_COUNT", payload: 0 });
      }
      setPopupNotifications([]);
    }
  }, [isAuthenticated, getClientToken, fetchNotifications, refreshUnreadCount, state.pagination.limit]);

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refreshUnreadCount,
      }}
    >
      {children}
      <IncomingNotificationPopup
        notifications={popupNotifications}
        onDismiss={dismissPopup}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
