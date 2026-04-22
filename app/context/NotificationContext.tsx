"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode, useRef } from "react";
import { NotificationState, NotificationAction, Notification } from "@/app/types/notification";
import { useAuth } from "./AuthContext";
import { createNotificationSocket, disconnectNotificationSocket } from "@/app/helpers/notificationSocket";
import * as api from "@/app/actions/notificationApi";
import { NOTIFICATION_CONSTANTS } from "@/app/constants/notifications";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

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

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload.data,
        pagination: {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        },
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
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
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);

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
      dispatch({ type: "SET_NOTIFICATIONS", payload: res });
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
      if (!token) return;

      const socket = createNotificationSocket(token);
      socketRef.current = socket as unknown as Socket;

      socket.on("connect", () => {
        dispatch({ type: "SET_SOCKET_STATUS", payload: true });
        // Fetch on reconnect or initial connect to ensure sync
        fetchNotifications(1, state.pagination.limit);
        refreshUnreadCount();
      });

      socket.on("disconnect", () => {
        dispatch({ type: "SET_SOCKET_STATUS", payload: false });
      });

      socket.on("notification:new", (notification: Notification) => {
        dispatch({ type: "ADD_NOTIFICATION", payload: notification });
        toast.info(notification.title, {
          description: notification.message,
          action: {
            label: "View",
            onClick: () => {
              if (typeof window !== "undefined") {
                window.location.href = "/en/notifications";
              }
            }
          }
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
        disconnectNotificationSocket(socketRef.current as any);
        socketRef.current = null;
        dispatch({ type: "SET_SOCKET_STATUS", payload: false });
        dispatch({ type: "SET_UNREAD_COUNT", payload: 0 });
      }
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
