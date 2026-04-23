"use client";

import { motion } from "framer-motion";
import { FiTrash2, FiLoader } from "react-icons/fi";
import { BiHistory } from "react-icons/bi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { NotificationsHistoryTabProps } from "./Notifications.types";

export function HistoryTab({
  history,
  isLoading,
  onDelete,
}: NotificationsHistoryTabProps) {
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.dashboardNotifications.history;
  const types = translations.dashboardNotifications.types;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <FiLoader className="w-10 h-10 animate-spin text-primary" />
        <p className="text-surface-500 font-medium">{t.loading}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-surface-500 flex flex-col items-center gap-3">
        <div className="p-4 bg-surface-50 rounded-full">
          <BiHistory className="w-8 h-8 text-surface-300" />
        </div>
        {t.empty}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-x-auto border border-surface-200 rounded-xl"
    >
      <table className="w-full text-sm text-left text-surface-700">
        <thead className="text-xs text-surface-500 uppercase bg-surface-50/80 font-bold tracking-wider">
          <tr>
            <th scope="col" className="px-6 py-4">
              {t.table.type}
            </th>
            <th scope="col" className="px-6 py-4">
              {t.table.recipient}
            </th>
            <th scope="col" className="px-6 py-4">
              {t.table.content}
            </th>
            <th scope="col" className="px-6 py-4">
              {t.table.date}
            </th>
            <th scope="col" className="px-6 py-4 text-right">
              {t.table.actions}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {history.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-surface-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="surface-badge whitespace-nowrap">
                  {types[item.type] || item.type.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-6 py-4 font-medium text-surface-900">
                {item.userId ? (
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-surface-200 flex items-center justify-center text-[10px]">
                      ID
                    </div>
                    {item.userId}
                  </span>
                ) : (
                  <span className="text-accent-amber font-semibold">
                    {t.table.broadcastRecipient}
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-surface-900 mb-0.5">
                  {item.title}
                </p>
                <p className="text-surface-500 truncate max-w-[200px]">
                  {item.message}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-surface-500">
                {new Date(item.createdAt).toLocaleDateString(local === "ar" ? "ar-SA" : "en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-surface-400 hover:text-accent-rose transition-colors p-2 hover:bg-accent-rose/10 rounded-lg"
                  type="button"
                >
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
