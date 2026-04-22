"use client";

import { useState, useCallback, useEffect } from "react";
import { FiPackage, FiClock, FiCheckCircle } from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import UserDashboardHeader from "@/app/_components/_website/_userDashboard/UserDashboardHeader";
import {
  PageHeading,
  OrderInsights,
  OrderFilters,
  ResultsInfo,
  LoadingState,
  EmptyState,
  OrdersGrid,
  NewOrderCTA,
  SupportHub,
  OrderCard,
  PaginationBar,
} from "@/app/_components/_userdashboard";
import { useAppQuery } from "@/lib/hooks/useAppQuery";
import { ORDERS_ENDPOINTS } from "@/app/constants/endpoints";
import { OrderListResponse } from "@/app/types/order";
import { useDebounce } from "@/app/hooks/useDebounce";
import { UserOrdersPageProps, FILTER_KEY_TO_STATUS } from "./page.types";
import { formatOrderId, formatDate, formatAmount } from "./OrderCard.utils";

export default function UserOrdersPage({ data, meta }: UserOrdersPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.UserOrders;
  const isRTL = local === "ar";

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(meta.page || 1);
  const debouncedSearch = useDebounce(search, 500);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  // Fetch data using useAppQuery
  const isInitialState = page === 1 && filter === "all" && !debouncedSearch;

  const { data: queryData, isLoading } = useAppQuery<OrderListResponse>({
    queryKey: ["user-orders", page, filter, debouncedSearch],
    endpoint: ORDERS_ENDPOINTS.LIST(
      page,
      meta.limit,
      FILTER_KEY_TO_STATUS[filter],
      debouncedSearch,
    ),
    options: {
      initialData: isInitialState
        ? ({
            data,
            meta,
          } as OrderListResponse)
        : undefined,
      staleTime: isInitialState ? 1000 * 60 * 5 : 0,
    },
  });

  const orders = queryData?.data || [];
  const currentMeta = queryData?.meta || meta;

  // Pagination navigation
  const navigateToPage = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const hasNextPage = currentMeta.page < currentMeta.totalPages;
  const hasPrevPage = currentMeta.page > 1;

  // Format display ID — short UUID (first 8 chars)
  const formatOrderIdFn = useCallback((id: string) => formatOrderId(id), []);

  // Format date
  const formatDateFn = useCallback(
    (dateString: string) => formatDate(dateString, local),
    [local],
  );

  // Format amount
  const formatAmountFn = useCallback(
    (amount: number, currency: string) => formatAmount(amount, currency, local),
    [local],
  );

  // Build results info text
  const resultsInfoText =
    currentMeta.total > 0
      ? orders.length === currentMeta.total
        ? t.resultsInfo.showingAll.replace("{{count}}", String(currentMeta.total))
        : t.resultsInfo.showingFiltered
            .replace("{{filtered}}", String(orders.length))
            .replace("{{total}}", String(currentMeta.total))
      : "";

  // Build insights data
  const insights = [
    {
      label: t.insights.activeOrders,
      value: "04",
      icon: FiPackage,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: t.insights.pendingReview,
      value: "02",
      icon: FiClock,
      color: "text-accent-amber",
      bgColor: "bg-accent-amber/10",
    },
    {
      label: t.insights.completedThisMonth,
      value: "12",
      icon: FiCheckCircle,
      color: "text-accent-emerald",
      bgColor: "bg-accent-emerald/10",
    },
  ];

  // Check if searching or filtering
  const isSearching = Boolean(search || filter !== "all");

  return (
    <div className="min-h-screen c-container flex flex-col">
      <UserDashboardHeader />

      <main className="flex-1 px-4 md:px-8 py-10 w-full space-y-8">
        {/* Page Heading */}
        <PageHeading
          title={t.title}
          description={t.description}
          isRTL={isRTL}
        />

        {/* Order Insights */}
        <OrderInsights insights={insights} isRTL={isRTL} />

        {/* Filters and Search */}
        <OrderFilters
          searchPlaceholder={t.searchPlaceholder}
          filterOptions={t.filters}
          filter={filter}
          search={search}
          isRTL={isRTL}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
        />

        {/* Results info */}
        {currentMeta.total > 0 && <ResultsInfo text={resultsInfoText} />}

        {/* Loading State */}
        <LoadingState isLoading={isLoading && orders.length === 0} />

        {/* Empty State */}
        {orders.length === 0 && !isLoading && (
          <EmptyState
            title={isSearching ? t.noResultsState.title : t.emptyState.title}
            description={
              isSearching ? t.noResultsState.description : t.emptyState.description
            }
            isSearching={isSearching}
          />
        )}

        {/* Orders Grid */}
        <OrdersGrid isLoading={isLoading}>
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              t={t}
              isRTL={isRTL}
              index={index}
              local={local}
              formatOrderId={formatOrderIdFn}
              formatDate={formatDateFn}
              formatAmount={formatAmountFn}
            />
          ))}

          {/* New Order CTA */}
          <NewOrderCTA
            title={t.newService.title}
            description={t.newService.description}
            href="/services"
          />
        </OrdersGrid>

        {/* Pagination */}
        {currentMeta && currentMeta?.totalPages > 1 && (
          <PaginationBar
            meta={currentMeta}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            isRTL={isRTL}
            navigateToPage={navigateToPage}
            local={local}
          />
        )}

        {/* Support Hub */}
        <SupportHub
          needAssistanceTitle={t.supportHub.needAssistance}
          needAssistanceDescription={t.supportHub.supportDescription}
          contactSupportText={t.supportHub.contactSupport}
          exploreNewTitle={t.supportHub.exploreNew}
          exploreNewDescription={t.supportHub.exploreDescription}
          browseServicesText={t.supportHub.browseServices}
          contactHref="/contact"
          servicesHref="/services"
          isRTL={isRTL}
        />
      </main>
    </div>
  );
}