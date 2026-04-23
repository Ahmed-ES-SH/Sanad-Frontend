"use client";

import { motion } from "framer-motion";
import { FiRadio } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { UserSelectionTable } from "./UserSelectionTable";
import { NotificationsBroadcastTabProps } from "./Notifications.types";

export function BroadcastTab({
  selectedUsers,
  onSelectionChange,
  onNext,
}: NotificationsBroadcastTabProps) {
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.dashboardNotifications.broadcast;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 w-full"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col">
          <h2 className="heading-sm text-surface-900">{t.title}</h2>
          <p className="text-sm text-surface-500">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSelectionChange([])}
            className="text-xs font-bold text-surface-400 hover:text-accent-rose transition-colors uppercase tracking-wider"
          >
            {t.clear}
          </button>
          <button onClick={onNext} className="surface-btn-primary px-8">
            {t.next}
          </button>
        </div>
      </div>

      <div className="border border-surface-200 rounded-2xl overflow-hidden bg-white shadow-sm min-h-[400px]">
        <UserSelectionTable
          selectedUsers={selectedUsers}
          onSelectionChange={onSelectionChange}
          mode="multiple"
        />
      </div>
    </motion.div>
  );
}
