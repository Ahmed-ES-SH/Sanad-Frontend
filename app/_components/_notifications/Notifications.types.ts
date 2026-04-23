import { NotificationType, Notification } from "@/app/types/notification";

export type NotificationsTab = "broadcast" | "direct" | "history";

export interface NotificationsPageProps {
  local: string;
}

export interface NotificationsTabsProps {
  activeTab: NotificationsTab;
  onTabChange: (tab: NotificationsTab) => void;
}

export interface NotificationsBroadcastTabProps {
  selectedUsers: number[];
  onSelectionChange: (users: number[]) => void;
  onNext: () => void;
}

export interface NotificationsDirectTabProps {
  selectedUser: number[];
  onSelectionChange: (users: number[]) => void;
}

export interface NotificationsHistoryTabProps {
  history: Notification[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export interface NotificationsBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsersCount: number;
  onSubmit: (data: { title: string; message: string }) => Promise<void>;
  isSubmitting: boolean;
}

export interface NotificationsDirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: number;
  onSubmit: (data: { title: string; message: string; type: NotificationType }) => Promise<void>;
  isSubmitting: boolean;
}

export interface NotificationsHistoryTableProps {
  history: Notification[];
  onDelete: (id: string) => void;
}

export interface UserSelectionTableProps {
  selectedUsers: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  mode?: "single" | "multiple";
  maxSelections?: number;
}
