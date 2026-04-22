// Re-export from new location for backward compatibility
export {
  UserOrdersPage as default,
  formatOrderId,
  formatDate,
  formatAmount,
} from "@/app/_components/_userdashboard/_userOrders";

// Types
export type { UserOrdersPageProps } from "@/app/_components/_userdashboard/_userOrders/page.types";

export type {
  OrderCardProps,
  OrderCardStatusStyles,
} from "@/app/_components/_userdashboard/_userOrders/OrderCard.types";

export type {
  PaginationBarProps,
  PaginationLabels,
} from "@/app/_components/_userdashboard/_userOrders/PaginationBar.types";

// Also re-export the constants that were previously exported
export {
  STATUS_API_TO_T_KEY,
  FILTER_KEY_TO_STATUS,
} from "@/app/_components/_userdashboard/_userOrders/page.types";
