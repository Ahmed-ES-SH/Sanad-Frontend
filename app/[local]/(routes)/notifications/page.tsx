"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FiLoader, FiCheck, FiFilter } from "react-icons/fi";
import { useNotification } from "@/app/context/NotificationContext";
import { NotificationType } from "@/app/types/notification";
import NotificationItem from "@/app/_components/_global/NotificationItem";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead, isLoading, pagination, fetchNotifications } = useNotification();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAllRead(true);
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      fetchNotifications(pagination.page + 1, pagination.limit);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.isRead) return false;
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    return true;
  });

  const notificationTypes: {
    value: NotificationType | "all";
    label: string;
  }[] = [
    { value: "all", label: "All Types" },
    { value: "ORDER_UPDATED", label: "Orders" },
    { value: "PAYMENT_SUCCESS", label: "Payment Success" },
    { value: "PAYMENT_FAILED", label: "Payment Failed" },
    { value: "SYSTEM", label: "System" },
    { value: "BROADCAST", label: "Broadcast" },
  ];

  return (
    <div className="min-h-screen bg-surface-50 mt-16 py-8">
      <div className="c-container max-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 mb-6">
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-surface-900">
                  Notifications
                </h1>
                <p className="text-sm text-surface-600 mt-1">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllRead}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isMarkingAllRead ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiCheck className="w-4 h-4" />
                  )}
                  <span>Mark all as read</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-surface-100 bg-surface-50">
            <div className="flex flex-wrap gap-3">
              {/* Read/Unread Filter */}
              <div className="flex items-center gap-2">
                <FiFilter className="w-4 h-4 text-surface-500" />
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    filter === "all"
                      ? "bg-primary text-white"
                      : "bg-white text-surface-600 hover:bg-surface-100 border border-surface-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    filter === "unread"
                      ? "bg-primary text-white"
                      : "bg-white text-surface-600 hover:bg-surface-100 border border-surface-200"
                  }`}
                >
                  Unread
                </button>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as NotificationType | "all")
                }
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-surface-200 text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
              >
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200">
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <FiLoader className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-20 h-20 mb-4 rounded-full bg-surface-100 flex items-center justify-center">
                <FiLoader className="w-10 h-10 text-surface-400" />
              </div>
              <h3 className="text-lg font-bold text-surface-900">
                No notifications
              </h3>
              <p className="text-sm text-surface-500 mt-2 max-w-sm">
                {filter === "unread"
                  ? "Great! You have no unread notifications."
                  : "You&apos;re all caught up! We&apos;ll notify you when something arrives."}
              </p>
            </div>
          ) : (
            <div role="list" aria-label="Notifications">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Load More */}
          {filteredNotifications.length > 0 &&
            pagination.page * pagination.limit < pagination.total && (
              <div className="p-4 border-t border-surface-200">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-surface-50 rounded-xl hover:bg-surface-100 disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load more notifications'}
                </button>
              </div>
            )}

          {/* Total count */}
          {filteredNotifications.length > 0 && (
            <div className="p-4 border-t border-surface-200 bg-surface-50">
              <p className="text-xs text-center text-surface-500">
                Showing {filteredNotifications.length} of {pagination.total}{" "}
                notifications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
