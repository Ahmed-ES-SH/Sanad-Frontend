"use client";

import { useEffect, useState } from "react";
import { FiLoader, FiCheck, FiBell, FiMail, FiGlobe } from "react-icons/fi";
import { useNotification } from "@/app/context/NotificationContext";

export default function NotificationPreferencesPage() {
  const { preferences, isLoading, error } = useNotification();

  const [localPrefs, setLocalPrefs] = useState({
    orderNotifications: true,
    paymentNotifications: true,
    systemNotifications: true,
    emailEnabled: true,
    pushEnabled: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        orderNotifications: preferences.orderNotifications,
        paymentNotifications: preferences.paymentNotifications,
        systemNotifications: preferences.systemNotifications,
        emailEnabled: preferences.emailEnabled,
        pushEnabled: preferences.pushEnabled,
      });
    }
  }, [preferences]);

  // Toggle preference
  const togglePref = (key: keyof typeof localPrefs) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasChanges(true);
  };

  const prefSections = [
    {
      title: "Notification Types",
      description: "Choose which types of notifications you want to receive",
      items: [
        {
          key: "orderNotifications" as const,
          label: "Order Updates",
          description:
            "Notifications about your order status changes and updates",
          icon: <FiGlobe className="w-5 h-5" />,
        },
        {
          key: "paymentNotifications" as const,
          label: "Payment Notifications",
          description: "Notifications about successful or failed payments",
          icon: <FiCheck className="w-5 h-5" />,
        },
        {
          key: "systemNotifications" as const,
          label: "System Notifications",
          description:
            "Important system updates, maintenance notices, and announcements",
          icon: <FiBell className="w-5 h-5" />,
        },
      ],
    },
    {
      title: "Delivery Methods",
      description: "Choose how you want to receive notifications",
      items: [
        {
          key: "pushEnabled" as const,
          label: "Push Notifications",
          description: "Receive real-time push notifications in your browser",
          icon: <FiBell className="w-5 h-5" />,
        },
        {
          key: "emailEnabled" as const,
          label: "Email Notifications",
          description: "Receive notification summaries via email",
          icon: <FiMail className="w-5 h-5" />,
        },
      ],
    },
  ];

  if (isLoading && !preferences) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-8">
      <div className="c-container max-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-surface-900">
              Notification Preferences
            </h1>
            <p className="text-sm text-surface-600 mt-1">
              Customize how and when you receive notifications
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Preferences Sections */}
        <div className="space-y-6">
          {prefSections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden"
            >
              <div className="p-6 border-b border-surface-200">
                <h2 className="text-lg font-bold text-surface-900">
                  {section.title}
                </h2>
                <p className="text-sm text-surface-600 mt-1">
                  {section.description}
                </p>
              </div>

              <div className="divide-y divide-surface-100">
                {section.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-surface-100 text-surface-600">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-surface-900">
                          {item.label}
                        </h3>
                        <p className="text-sm text-surface-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => togglePref(item.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        localPrefs[item.key] ? "bg-primary" : "bg-surface-300"
                      }`}
                      role="switch"
                      aria-checked={localPrefs[item.key]}
                      aria-label={item.label}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localPrefs[item.key]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="sticky bottom-0 mt-6 bg-white rounded-2xl shadow-sm border border-surface-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-surface-600">
              {hasChanges ? "You have unsaved changes" : "All changes saved"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
