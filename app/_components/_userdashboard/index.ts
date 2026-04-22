// Child components — extracted from UserOrdersPage
export { default as PageHeading } from "./PageHeading";
export { default as OrderInsights } from "./OrderInsights";
export { default as OrderFilters } from "./OrderFilters";
export { default as ResultsInfo } from "./ResultsInfo";
export { default as LoadingState } from "./LoadingState";
export { default as EmptyState } from "./EmptyState";
export { default as OrdersGrid } from "./OrdersGrid";
export { default as NewOrderCTA } from "./NewOrderCTA";
export { default as SupportHub } from "./SupportHub";

// Types
export type { PageHeadingProps } from "./PageHeading.types";
export type { OrderInsightsProps } from "./OrderInsights.types";
export type { OrderFiltersProps } from "./OrderFilters.types";
export type { ResultsInfoProps } from "./ResultsInfo.types";
export type { LoadingStateProps } from "./LoadingState.types";
export type { EmptyStateProps } from "./EmptyState.types";
export type { OrdersGridProps } from "./OrdersGrid.types";
export type { NewOrderCTAProps } from "./NewOrderCTA.types";
export type { SupportHubProps } from "./SupportHub.types";

// Re-export existing order components from subfolder
export { default as OrderCard } from "./_userOrders/OrderCard";
export { default as PaginationBar } from "./_userOrders/PaginationBar";
export type { OrderCardProps } from "./_userOrders/OrderCard.types";
export type { PaginationBarProps } from "./_userOrders/PaginationBar.types";