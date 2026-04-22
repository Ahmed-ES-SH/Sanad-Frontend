"use client";

import React from "react";
import { AdminOrder, OrderStatus } from "@/app/types/order";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiEye } from "react-icons/fi";

type Column<T> = {
  label: string;
  accessor: keyof T;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  mobile?: boolean;
  desktop?: boolean;
};

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
}

export function OrdersTable({
  onViewOrder,
  statusFilter,
  userIdFilter,
}: OrdersTableProps) {
  const { local } = useVariables();
  const translations = getTranslations(local) as any;
  const t = translations.OrdersPage || {};

  const columns: Column<AdminOrder>[] = [
    {
      label: t.table?.orderId || "Order ID",
      accessor: "id",
      render: (order) => (
        <span className="text-sm font-mono font-bold text-primary">
          {order.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      label: t.table?.user || "User",
      render: (order) => (
        <div className="flex items-center gap-2.5">
          {order.user.avatar && (
            <img
              src={order.user.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-100"
            />
          )}
          <div>
            <p className="text-sm font-bold text-surface-800">
              {order.user.name || "Unknown"}
            </p>
            <p className="text-xs text-surface-500">{order.user.email}</p>
          </div>
        </div>
      ),
      accessor: "currency",
    },
    {
      label: t.table?.service || "Service",
      render: (order) => (
        <p className="text-sm font-medium text-surface-800">
          {order.service.title}
        </p>
      ),
      accessor: "status",
    },
    {
      label: t.table?.amount || "Amount",
      render: (order) => (
        <span className="text-sm font-bold text-surface-800 tabular-nums">
          {formatCurrency(order.amount, order.currency)}
        </span>
      ),
      accessor: "currency",
    },
    {
      label: t.table?.status || "Status",
      accessor: "status",
      render: (order) => {
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
      label: t.table?.date || "Date",
      accessor: "createdAt",
      render: (order) => (
        <span className="text-xs text-surface-500">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
  ];

  const extraParams = React.useMemo(() => {
    const params: Record<string, any> = {};
    if (statusFilter && statusFilter !== "all") params.status = statusFilter;
    if (userIdFilter) params.userId = userIdFilter;
    return params;
  }, [statusFilter, userIdFilter]);

  return <div></div>;
}
