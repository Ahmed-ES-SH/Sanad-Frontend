"use client";

import { useState, useEffect, useCallback } from "react";
import { FiBell } from "react-icons/fi";
import { BiHistory } from "react-icons/bi";
import { FiSend, FiRadio } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import ConfirmModal from "@/app/_components/_global/ConfirmModal";
import {
  NotificationsTab,
} from "./Notifications.types";
import { BroadcastTab } from "./BroadcastTab";
import { DirectTab } from "./DirectTab";
import { HistoryTab } from "./HistoryTab";
import { BroadcastModal } from "./BroadcastModal";
import { DirectModal } from "./DirectModal";
import {
  adminFetchNotifications,
  sendDirectNotification,
  sendBroadcastNotification,
  adminDeleteNotification,
} from "@/lib/api/notifications";
import { Notification } from "@/app/types/notification";

export default function NotificationsClient() {
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.dashboardNotifications;

  const [activeTab, setActiveTab] = useState<NotificationsTab>("broadcast");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selection state
  const [selectedBroadcastUsers, setSelectedBroadcastUsers] = useState<number[]>([]);
  const [selectedDirectUser, setSelectedDirectUser] = useState<number[]>([]);

  // History state
  const [history, setHistory] = useState<Notification[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showDirectModal, setShowDirectModal] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await adminFetchNotifications(1, 50);
      setHistory(res.data);
    } catch (error: any) {
      toast.error(error.message || t.history.error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [t.history.error]);

  useEffect(() => {
    if (activeTab === "history") {
      void loadHistory();
    }
  }, [activeTab, loadHistory]);

  // Handle direct modal auto-open
  useEffect(() => {
    if (selectedDirectUser.length > 0 && activeTab === "direct") {
      setShowDirectModal(true);
    }
  }, [selectedDirectUser, activeTab]);

  const handleBroadcastSubmit = async (data: { title: string; message: string }) => {
    if (selectedBroadcastUsers.length === 0) {
      toast.error(t.validation.usersRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      await sendBroadcastNotification({
        ...data,
        targetUserIds: selectedBroadcastUsers.map(String),
      });
      toast.success(t.broadcast.success);
      setSelectedBroadcastUsers([]);
      setShowBroadcastModal(false);
      if (activeTab === "history") void loadHistory();
    } catch (error: any) {
      toast.error(error.message || t.broadcast.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectSubmit = async (data: { title: string; message: string; type: any }) => {
    if (selectedDirectUser.length === 0) {
      toast.error(t.validation.userRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      await sendDirectNotification({
        ...data,
        userId: selectedDirectUser[0],
      });
      toast.success(t.direct.success);
      setSelectedDirectUser([]);
      setShowDirectModal(false);
      if (activeTab === "history") void loadHistory();
    } catch (error: any) {
      toast.error(error.message || t.direct.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await adminDeleteNotification(pendingDelete);
      toast.success(t.history.delete.success);
      setHistory((prev) => prev.filter((n) => n.id !== pendingDelete));
    } catch (error: any) {
      toast.error(error.message || t.history.delete.error);
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-lg font-display text-surface-900 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <FiBell className="w-6 h-6" />
          </div>
          {t.title}
        </h1>
        <p className="text-surface-500 mt-1 body">
          {t.subtitle}
        </p>
      </div>

      <div className="surface-card overflow-hidden w-full">
        <div className="flex border-b border-surface-200 bg-surface-50/50">
          {[
            { id: "broadcast", label: t.tabs.broadcast, icon: FiRadio },
            { id: "direct", label: t.tabs.direct, icon: FiSend },
            { id: "history", label: t.tabs.history, icon: BiHistory },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as NotificationsTab)}
              className={`flex-1 py-4 text-sm font-semibold transition-all relative flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-surface-500 hover:text-surface-700 hover:bg-surface-100/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "broadcast" && (
              <BroadcastTab
                key="broadcast"
                selectedUsers={selectedBroadcastUsers}
                onSelectionChange={setSelectedBroadcastUsers}
                onNext={() => {
                  if (selectedBroadcastUsers.length === 0) {
                    toast.error(t.validation.usersRequired);
                    return;
                  }
                  setShowBroadcastModal(true);
                }}
              />
            )}

            {activeTab === "direct" && (
              <DirectTab
                key="direct"
                selectedUser={selectedDirectUser}
                onSelectionChange={setSelectedDirectUser}
              />
            )}

            {activeTab === "history" && (
              <HistoryTab
                key="history"
                history={history}
                isLoading={isLoadingHistory}
                onDelete={setPendingDelete}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <BroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        selectedUsersCount={selectedBroadcastUsers.length}
        onSubmit={handleBroadcastSubmit}
        isSubmitting={isSubmitting}
      />

      <DirectModal
        isOpen={showDirectModal}
        onClose={() => {
          setShowDirectModal(false);
          setSelectedDirectUser([]);
        }}
        targetUserId={selectedDirectUser[0]}
        onSubmit={handleDirectSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        open={!!pendingDelete}
        title={t.history.delete.title}
        description={t.history.delete.description}
        confirmLabel={t.history.delete.confirm}
        cancelLabel={t.history.delete.cancel}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
