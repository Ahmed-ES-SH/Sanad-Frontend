'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { Socket } from 'socket.io-client';
import {
  Notification,
  NotificationListResponse,
  NotificationPreferences,
  NotificationState,
  NotificationAction,
  ServerToClientEvents,
  ClientToServerEvents,
} from '@/app/types/notification';
import {
  fetchNotificationsApi,
  fetchUnreadCountApi,
  markAsReadApi,
  markAllAsReadApi,
  deleteNotificationApi,
  fetchPreferencesApi,
  updatePreferencesApi,
} from '@/app/actions/notificationActions';
import {
  createNotificationSocket,
  disconnectNotificationSocket,
} from '@/app/helpers/notificationSocket';

// ============================================================================
// Initial State
// ============================================================================

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  preferences: null,
  isLoading: false,
  isSocketConnected: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

// ============================================================================
// Reducer
// ============================================================================

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'SET_NOTIFICATIONS': {
      const { data, total, page, limit } = action.payload;
      return {
        ...state,
        notifications: data,
        pagination: { page, limit, total },
        isLoading: false,
        error: null,
      };
    }

    case 'ADD_NOTIFICATION': {
      const newNotification = action.payload;
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }

    case 'MARK_AS_READ': {
      const notificationId = action.payload;
      const notification = state.notifications.find((n) => n.id === notificationId);
      if (!notification || notification.isRead) return state;

      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }

    case 'MARK_ALL_AS_READ': {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        })),
        unreadCount: 0,
      };
    }

    case 'DELETE_NOTIFICATION': {
      const notificationId = action.payload;
      const notification = state.notifications.find((n) => n.id === notificationId);
      if (!notification) return state;

      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount: notification.isRead
          ? state.unreadCount
          : Math.max(0, state.unreadCount - 1),
      };
    }

    case 'SET_UNREAD_COUNT': {
      return {
        ...state,
        unreadCount: action.payload,
      };
    }

    case 'SET_PREFERENCES': {
      return {
        ...state,
        preferences: action.payload,
        error: null,
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case 'SET_SOCKET_STATUS': {
      return {
        ...state,
        isSocketConnected: action.payload,
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }

    case 'UPDATE_PAGINATION': {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };
    }

    default:
      return state;
  }
}

// ============================================================================
// Context Type
// ============================================================================

export interface NotificationContextType {
  // State
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  isSocketConnected: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number };

  // Data fetching
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  fetchPreferences: () => Promise<void>;

  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;

  // Socket
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// ============================================================================
// Notification Provider Component
// ============================================================================

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      disconnectNotificationSocket(socketRef.current);
      socketRef.current = null;
      dispatch({ type: 'SET_SOCKET_STATUS', payload: false });
      return;
    }

    // Get token from cookie (client-side)
    const token = getAuthToken();
    if (!token) return;

    const socket = createNotificationSocket(token);
    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      dispatch({ type: 'SET_SOCKET_STATUS', payload: true });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'SET_SOCKET_STATUS', payload: false });
    });

    socket.on('connect_error', (error) => {
      console.error('Notification socket connection error:', error.message);
      dispatch({ type: 'SET_SOCKET_STATUS', payload: false });
    });

    // Real-time notification events
    socket.on('notification:new', (notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    });

    socket.on('notification:read', ({ notificationId }) => {
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    });

    socket.on('notification:read_all', () => {
      dispatch({ type: 'MARK_ALL_AS_READ' });
    });

    socket.on('notification:count', ({ unreadCount }) => {
      dispatch({ type: 'SET_UNREAD_COUNT', payload: unreadCount });
    });

    socket.on('notification:delete', ({ notificationId }) => {
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    });

    // Cleanup on unmount or auth change
    return () => {
      socket.offAny();
      disconnectNotificationSocket(socket);
    };
  }, [isAuthenticated, user]);

  // Helper function to get auth token from cookie
  function getAuthToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(^|;)sanad_auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[2]) : null;
  }

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (page = 1, limit = 20) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await fetchNotificationsApi(page, limit);
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response as NotificationListResponse });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
        dispatch({ type: 'SET_ERROR', payload: message });
      }
    },
    []
  );

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetchUnreadCountApi();
      const { unreadCount } = response as { unreadCount: number };
      dispatch({ type: 'SET_UNREAD_COUNT', payload: unreadCount });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    try {
      const response = await fetchPreferencesApi();
      dispatch({ type: 'SET_PREFERENCES', payload: response as NotificationPreferences });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch preferences';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  }, []);

  // Mark as read
  const markAsRead = useCallback(
    async (notificationId: string) => {
      // Optimistic update
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });

      try {
        await markAsReadApi(notificationId);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        // Rollback could be implemented here
      }
    },
    []
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    dispatch({ type: 'MARK_ALL_AS_READ' });

    try {
      await markAllAsReadApi();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      // Rollback could be implemented here
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      // Optimistic update
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });

      try {
        await deleteNotificationApi(notificationId);
      } catch (error) {
        console.error('Failed to delete notification:', error);
        // Rollback could be implemented here
      }
    },
    []
  );

  // Update preferences
  const updatePreferences = useCallback(
    async (prefs: Partial<NotificationPreferences>) => {
      try {
        const response = await updatePreferencesApi(prefs);
        dispatch({ type: 'SET_PREFERENCES', payload: response as NotificationPreferences });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update preferences';
        dispatch({ type: 'SET_ERROR', payload: message });
      }
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        preferences: state.preferences,
        isLoading: state.isLoading,
        isSocketConnected: state.isSocketConnected,
        error: state.error,
        pagination: state.pagination,
        fetchNotifications,
        fetchUnreadCount,
        fetchPreferences,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updatePreferences,
        socket: socketRef.current,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// ============================================================================
// Notification Hook
// ============================================================================

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
}
