"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { NotificationType } from "@/app/types/notification";
import { NotificationsDirectModalProps } from "./Notifications.types";

export function DirectModal({
  isOpen,
  onClose,
  targetUserId,
  onSubmit,
  isSubmitting,
}: NotificationsDirectModalProps) {
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.dashboardNotifications.direct;
  const types = translations.dashboardNotifications.types;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("SYSTEM");

  const notificationTypes: { value: NotificationType; label: string }[] = [
    { value: "SYSTEM", label: types.SYSTEM },
    { value: "BROADCAST", label: types.BROADCAST },
    { value: "ORDER_UPDATED", label: types.ORDER_UPDATED },
    { value: "PAYMENT_SUCCESS", label: types.PAYMENT_SUCCESS },
    { value: "PAYMENT_FAILED", label: types.PAYMENT_FAILED },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, message, type });
    setTitle("");
    setMessage("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-surface-xl border border-surface-200 overflow-hidden"
          >
            <div className="p-6 border-b border-surface-100 bg-surface-50/50">
              <h3 className="heading-md text-surface-900">{t.modalTitle}</h3>
              <p className="text-sm text-surface-500 mt-1">
                {t.modalSubtitle.replace("{{id}}", String(targetUserId))}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">
                  {t.formType}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as NotificationType)}
                  className="surface-input w-full appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
                >
                  {notificationTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">
                  {t.formTitle}
                </label>
                <input
                  required
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="surface-input w-full"
                  placeholder={t.titlePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1.5">
                  {t.formMessage}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="surface-input w-full resize-none"
                  placeholder={t.messagePlaceholder}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="surface-btn-secondary flex-1"
                >
                  {translations.dashboardNotifications.history.delete.cancel}
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="surface-btn-primary flex-[2]"
                >
                  {isSubmitting ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    t.formSubmit
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
