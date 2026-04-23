"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { NotificationsBroadcastModalProps } from "./Notifications.types";

export function BroadcastModal({
  isOpen,
  onClose,
  selectedUsersCount,
  onSubmit,
  isSubmitting,
}: NotificationsBroadcastModalProps) {
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.dashboardNotifications.broadcast;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, message });
    // Reset form after successful submission if needed
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
                {t.modalSubtitle.replace("{{count}}", String(selectedUsersCount))}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  rows={6}
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
