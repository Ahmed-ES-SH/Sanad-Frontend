"use client";

import { motion } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { UserSelectionTable } from "./UserSelectionTable";
import { NotificationsDirectTabProps } from "./Notifications.types";

export function DirectTab({
  selectedUser,
  onSelectionChange,
}: NotificationsDirectTabProps) {
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.dashboardNotifications.direct;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 w-full"
    >
      <div className="flex flex-col mb-2">
        <h2 className="heading-sm text-surface-900">{t.title}</h2>
        <p className="text-sm text-surface-500">{t.subtitle}</p>
      </div>

      <div className="border border-surface-200 rounded-2xl overflow-hidden bg-white shadow-sm min-h-[400px]">
        <UserSelectionTable
          selectedUsers={selectedUser}
          onSelectionChange={onSelectionChange}
          mode="single"
        />
      </div>
    </motion.div>
  );
}
