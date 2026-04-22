"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { Notification, NotificationType } from "@/app/types/notification";
import { useNotification } from "@/app/context/NotificationContext";

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Icon mapping for notification types
const typeIcons: Record<NotificationType, React.ReactNode> = {
  ORDER_UPDATED: <FiBell className="w-5 h-5" />,
  PAYMENT_SUCCESS: <FiCheck className="w-5 h-5" />,
  PAYMENT_FAILED: <FiClock className="w-5 h-5" />,
  SYSTEM: <FiBell className="w-5 h-5" />,
  BROADCAST: <FiBell className="w-5 h-5" />,
};

// Color mapping for notification types
const typeColors: Record<NotificationType, string> = {
  ORDER_UPDATED: "bg-blue-50 text-blue-600",
  PAYMENT_SUCCESS: "bg-green-50 text-green-600",
  PAYMENT_FAILED: "bg-red-50 text-red-600",
  SYSTEM: "bg-purple-50 text-purple-600",
  BROADCAST: "bg-amber-50 text-amber-600",
};

const NotificationItem = React.memo(
  ({ notification, onRead, onDelete }: NotificationItemProps) => {
    const { markAsRead, deleteNotification } = useNotification();
    const handleRead = async () => {
      if (!notification.isRead && onRead) {
        onRead(notification.id);
      } else if (!notification.isRead) {
        await markAsRead(notification.id);
      }
    };

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onDelete) {
        onDelete(notification.id);
      } else {
        await deleteNotification(notification.id);
      }
    };

    const formatRelativeTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleRead}
        className={`relative p-4 border-b border-surface-100 cursor-pointer transition-colors duration-200 hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${
          !notification.isRead ? "bg-blue-50/50" : "bg-white"
        }`}
        role="listitem"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRead();
          }
        }}
        aria-label={`Notification: ${notification.title}`}
        aria-read={notification.isRead}
      >
        {/* Unread indicator */}
        {!notification.isRead && (
          <div
            className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"
            aria-hidden="true"
          />
        )}

        <div className="flex gap-3">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              typeColors[notification.type]
            }`}
            aria-hidden="true"
          >
            {typeIcons[notification.type]}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold text-surface-900 truncate ${
                    !notification.isRead ? "font-bold" : ""
                  }`}
                >
                  {notification.title}
                </h4>
                <p className="text-sm text-surface-600 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={handleDelete}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(e as any);
                    }
                  }}
                  className="p-1.5 text-surface-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Delete notification"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" aria-hidden="true" />
                </button>
                {!notification.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRead();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRead();
                      }
                    }}
                    className="p-1.5 text-surface-400 hover:text-green-500 rounded-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Mark as read"
                    title="Mark as read"
                  >
                    <FiCheck className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-2">
              <div
                className="flex items-center gap-1 text-xs text-surface-500"
                aria-label={`Received ${formatRelativeTime(notification.createdAt)}`}
              >
                <FiClock className="w-3 h-3" aria-hidden="true" />
                <span>{formatRelativeTime(notification.createdAt)}</span>
              </div>
              {notification.isRead && notification.readAt && (
                <div
                  className="flex items-center gap-1 text-xs text-green-600"
                  aria-label="Status: Read"
                >
                  <FiCheck className="w-3 h-3" aria-hidden="true" />
                  <span>Read</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors">
                <span aria-hidden="true">View details</span>
                <FiArrowRight className="w-3 h-3" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

NotificationItem.displayName = "NotificationItem";
export default NotificationItem;
