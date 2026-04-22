"use client";

import { useState, useEffect } from "react";
import { FiSend, FiRadio, FiLoader, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { NotificationType } from "@/app/types/notification";
import {
  adminFetchNotifications,
  sendNotification,
  broadcastNotification,
  adminDeleteNotification,
} from "@/app/actions/notificationApi";

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<
    "broadcast" | "direct" | "history"
  >("broadcast");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("SYSTEM");
  const [targetUserId, setTargetUserId] = useState("");

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const notificationTypes: { value: NotificationType; label: string }[] = [
    { value: "SYSTEM", label: "System Alert" },
    { value: "BROADCAST", label: "Broadcast" },
    { value: "ORDER_UPDATED", label: "Order Update" },
    { value: "PAYMENT_SUCCESS", label: "Payment Success" },
    { value: "PAYMENT_FAILED", label: "Payment Failed" },
  ];

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message)
      return toast.error("Title and message are required");

    setIsSubmitting(true);
    try {
      await broadcastNotification({ title, message });
      toast.success("Broadcast sent successfully!");
      setTitle("");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send broadcast");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || !targetUserId)
      return toast.error("All fields are required");

    setIsSubmitting(true);
    try {
      await sendNotification({
        userId: Number(targetUserId),
        type,
        title,
        message,
      });
      toast.success("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setTargetUserId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send notification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await adminFetchNotifications(1, 50);
      setHistory(res.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await adminDeleteNotification(id);
      toast.success("Notification deleted");
      setHistory((prev) => prev.filter((n) => n.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete notification");
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Notification Center
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and send system-wide or direct notifications.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === "broadcast" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <FiRadio className="inline mr-2" /> Broadcast
          </button>
          <button
            onClick={() => setActiveTab("direct")}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === "direct" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <FiSend className="inline mr-2" /> Direct Message
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            History Log
          </button>
        </div>

        <div className="p-6">
          {activeTab === "broadcast" && (
            <form onSubmit={handleBroadcast} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Broadcast Title
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Scheduled Maintenance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Body
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Details about the broadcast..."
                />
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiRadio />
                )}
                Send Broadcast to All Users
              </button>
            </form>
          )}

          {activeTab === "direct" && (
            <form onSubmit={handleSendDirect} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target User ID
                  </label>
                  <input
                    required
                    type="text"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g. 12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as NotificationType)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {notificationTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Notification Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Body
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Details..."
                />
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <FiSend />
                )}
                Send Direct Notification
              </button>
            </form>
          )}

          {activeTab === "history" && (
            <div>
              {isLoadingHistory ? (
                <div className="flex justify-center py-12">
                  <FiLoader className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No notifications found in history.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">User ID</th>
                        <th className="px-4 py-3">Title / Message</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.userId || "ALL (Broadcast)"}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="truncate max-w-xs">{item.message}</p>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
