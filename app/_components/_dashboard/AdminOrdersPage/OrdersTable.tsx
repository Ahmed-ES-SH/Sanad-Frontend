"use client";

import React, { useMemo } from "react";
import { AdminOrder, OrderStatus } from "@/app/types/order";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiEye, FiPackage } from "react-icons/fi";
import { useAdminOrdersWithState } from "@/lib/hooks/orders/useAdminOrders";
import { Pagination } from "@/app/_components/_ui/Pagination";

// Status badge configuration
const statusConfig: Record<
  OrderStatus,
  { bg: string; text: string; labelKey: string }
> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    labelKey: "pending",
  },
  paid: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    labelKey: "paid",
  },
  in_progress: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    labelKey: "in_progress",
  },
  completed: {
    bg: "bg-green-100",
    text: "text-green-700",
    labelKey: "completed",
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-700",
    labelKey: "cancelled",
  },
};

// Format currency
function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface OrdersTableProps {
  onViewOrder?: (orderId: string) => void;
  statusFilter?: string;
  userIdFilter?: number;
  initialPage?: number;
  initialLimit?: number;
}

export function OrdersTable({
  onViewOrder,
  statusFilter,
  userIdFilter,
  initialPage = 1,
  initialLimit = 10,
}: OrdersTableProps) {
  const { local } = useVariables();
  const translations = getTranslations(local) as any;
  const t = translations.OrdersPage || {};

  // Initialize the hook with filters
  const {
    orders,
    meta,
    isLoading,
    isFetching,
    error,
    setPage,
    setLimit,
    setStatus,
    filters,
  } = useAdminOrdersWithState({
    page: initialPage,
    limit: initialLimit,
    status: statusFilter !== "all" ? statusFilter : undefined,
    userId: userIdFilter,
  });

  // Sync external statusFilter changes
  React.useEffect(() => {
    setStatus((statusFilter !== "all" ? statusFilter : "") as OrderStatus);
  }, [statusFilter, setStatus]);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        key: "orderId",
        label: t.table?.orderId || "Order ID",
        render: (order: AdminOrder) => (
          <span className="text-sm font-mono font-bold text-primary">
            {order.id ? order.id.slice(0, 8).toUpperCase() : "N/A"}
          </span>
        ),
      },
      {
        key: "user",
        label: t.table?.user || "User",
        render: (order: AdminOrder) => (
          <div className="flex items-center gap-2.5">
            {order.user.avatar ? (
              <img
                src={order.user.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-100"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center">
                <span className="text-xs font-bold text-surface-500">
                  {order.user.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-surface-800">
                {order.user.name || "Unknown"}
              </p>
              <p className="text-xs text-surface-500">{order.user.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "service",
        label: t.table?.service || "Service",
        render: (order: AdminOrder) => (
          <div>
            <p className="text-sm font-medium text-surface-800">
              {order.service.title}
            </p>
            <p className="text-xs text-surface-500 truncate max-w-[150px]">
              {order.service.shortDescription}
            </p>
          </div>
        ),
      },
      {
        key: "amount",
        label: t.table?.amount || "Amount",
        render: (order: AdminOrder) => (
          <span className="text-sm font-bold text-surface-800 tabular-nums">
            {formatCurrency(order.amount, order.currency)}
          </span>
        ),
      },
      {
        key: "status",
        label: t.table?.status || "Status",
        render: (order: AdminOrder) => {
          const config = statusConfig[order.status] || statusConfig.pending;
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
            >
              {t.status?.[config.labelKey] || config.labelKey.replace("_", " ")}
            </span>
          );
        },
      },
      {
        key: "date",
        label: t.table?.date || "Date",
        render: (order: AdminOrder) => (
          <span className="text-xs text-surface-500">
            {formatDate(order.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        label: "",
        render: (order: AdminOrder) => (
          <button
            onClick={() => onViewOrder?.(order.id)}
            className="p-2 text-surface-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            aria-label="View order"
          >
            <FiEye className="w-4 h-4" />
          </button>
        ),
      },
    ],
    [t, onViewOrder],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Table header */}
          <div className="grid grid-cols-7 gap-4 pb-4 border-b border-surface-100">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 bg-surface-100 rounded" />
            ))}
          </div>
          {/* Table rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 py-4">
              {[...Array(7)].map((_, j) => (
                <div key={j} className="h-8 bg-surface-50 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <FiPackage className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          {t.errors?.loadFailed || "Failed to load orders"}
        </h3>
        <p className="text-sm text-surface-500 mb-4">
          {error.message || "An error occurred while fetching orders."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t.actions?.retry || "Try Again"}
        </button>
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-100 mb-4">
          <FiPackage className="w-6 h-6 text-surface-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          {t.empty?.title || "No orders found"}
        </h3>
        <p className="text-sm text-surface-500">
          {t.empty?.description || "There are no orders matching your filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-surface-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider text-left"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-surface-50">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-surface-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render(order)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="px-4 py-4 border-t border-surface-100 bg-surface-50/30">
          <div className="flex items-center justify-between">
            {/* Results per page */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-500">
                {t.pagination?.show || "Show"}
              </span>
              <select
                value={filters.limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={isFetching}
                className="px-2 py-1 text-sm border border-surface-200 rounded-lg bg-white text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-surface-500">
                {t.pagination?.perPage || "per page"}
              </span>
            </div>

            {/* Pagination controls */}
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              isLoading={isFetching}
              onPageChange={setPage}
            />
          </div>

          {/* Results count */}
          <div className="text-xs text-surface-500 mt-2 text-center">
            {t.pagination?.showing || "Showing"}{" "}
            <span className="font-medium text-surface-700">
              {(meta.page - 1) * meta.limit + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-surface-700">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            {t.pagination?.of || "of"}{" "}
            <span className="font-medium text-surface-700">{meta.total}</span>{" "}
            {t.pagination?.results || "results"}
          </div>
        </div>
      )}
    </div>
  );
}
