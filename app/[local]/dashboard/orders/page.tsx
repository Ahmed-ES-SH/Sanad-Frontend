"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useMemo } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiEye,
  FiFilter,
  FiMoreVertical,
  FiPackage,
  FiPlus,
  FiSearch,
  FiShoppingBag,
  FiTrendingUp,
  FiX,
  FiDownload,
  FiCheckCircle,
  FiTrash2,
} from "react-icons/fi";

// ─── Animation Variants ───────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut" as const } },
};

// ─── Types ────────────────────────────────────────────────────────

type OrderStatus = "completed" | "processing" | "cancelled";
type PaymentStatus = "paid" | "pending" | "failed";

interface OrderUser {
  name: string;
  email: string;
  avatar: string;
}

interface OrderService {
  name: string;
  category: string;
}

interface Order {
  id: string;
  user: OrderUser;
  service: OrderService;
  paymentStatus: PaymentStatus;
  paymentId: string;
  orderStatus: OrderStatus;
  amount: string;
  date: string;
}

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: React.ReactNode;
  accent: string;
  accentBorder: string;
}

// ─── Mock Data ────────────────────────────────────────────────────

const mockOrders: Order[] = [
  {
    id: "#ORD-8821",
    user: {
      name: "Sarah Miller",
      email: "sarah.m@example.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    service: {
      name: "Document Legalization",
      category: "Legal Services",
    },
    paymentStatus: "paid",
    paymentId: "#PAY-01",
    orderStatus: "processing",
    amount: "$250.00",
    date: "Oct 24, 2023",
  },
  {
    id: "#ORD-8819",
    user: {
      name: "James Anderson",
      email: "j.anderson@cloud.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    service: {
      name: "Cloud Migration Support",
      category: "Tech Consulting",
    },
    paymentStatus: "paid",
    paymentId: "#PAY-05",
    orderStatus: "completed",
    amount: "$1,200.00",
    date: "Oct 23, 2023",
  },
  {
    id: "#ORD-8799",
    user: {
      name: "Linda Chen",
      email: "l.chen@logistics.co",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    },
    service: {
      name: "Route Optimization",
      category: "Logistics",
    },
    paymentStatus: "pending",
    paymentId: "",
    orderStatus: "processing",
    amount: "$450.00",
    date: "Oct 22, 2023",
  },
  {
    id: "#ORD-8750",
    user: {
      name: "Robert King",
      email: "r.king@design.io",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    service: {
      name: "Intellectual Property Audit",
      category: "Legal Services",
    },
    paymentStatus: "failed",
    paymentId: "",
    orderStatus: "cancelled",
    amount: "$890.00",
    date: "Oct 20, 2023",
  },
];

// ─── Helper Functions ─────────────────────────────────────────────

const getStatusBadgeStyle = (status: OrderStatus): string => {
  switch (status) {
    case "completed":
      return "bg-accent-emerald/10 text-accent-emerald";
    case "processing":
      return "bg-primary/10 text-primary";
    case "cancelled":
      return "bg-[var(--surface-200)] text-[var(--surface-600)]";
  }
};

const getPaymentBadgeStyle = (status: PaymentStatus): string => {
  switch (status) {
    case "paid":
      return "bg-accent-emerald/10 text-accent-emerald";
    case "pending":
      return "bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]";
    case "failed":
      return "bg-[var(--accent-rose)]/10 text-[var(--accent-rose)]";
  }
};

const getPaymentDotStyle = (status: PaymentStatus): string => {
  switch (status) {
    case "paid":
      return "bg-accent-emerald";
    case "pending":
      return "bg-[var(--accent-amber)]";
    case "failed":
      return "bg-[var(--accent-rose)]";
  }
};

const getPaymentLabel = (order: Order): string => {
  if (order.paymentStatus === "paid") return `Paid (${order.paymentId})`;
  if (order.paymentStatus === "pending") return "Pending";
  return "Failed";
};

// ─── Skeleton Components ──────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div
      className="p-5 rounded-xl border border-(--surface-card-border) bg-[var(--surface-card-bg)] animate-pulse"
      role="status"
      aria-label="Loading stat"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--surface-200)]" />
        <div className="w-14 h-5 rounded-md bg-[var(--surface-100)]" />
      </div>
      <div className="w-20 h-3 rounded bg-[var(--surface-200)] mb-2" />
      <div className="w-24 h-7 rounded bg-[var(--surface-200)]" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="animate-pulse" aria-label="Loading order">
      <td className="px-5 py-4">
        <div className="w-20 h-4 rounded bg-[var(--surface-200)]" />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--surface-200)]" />
          <div className="space-y-1.5">
            <div className="w-28 h-4 rounded bg-[var(--surface-200)]" />
            <div className="w-36 h-3 rounded bg-[var(--surface-100)]" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="space-y-1.5">
          <div className="w-36 h-4 rounded bg-[var(--surface-200)]" />
          <div className="w-24 h-3 rounded bg-[var(--surface-100)]" />
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="w-20 h-6 rounded-full bg-[var(--surface-100)]" />
      </td>
      <td className="px-5 py-4">
        <div className="w-16 h-5 rounded bg-[var(--surface-200)]" />
      </td>
      <td className="px-5 py-4">
        <div className="w-10 h-4 rounded bg-[var(--surface-200)]" />
      </td>
    </tr>
  );
}

// ─── Expanded Row Detail ──────────────────────────────────────────

function ExpandedOrderDetail({ order }: { order: Order }) {
  return (
    <tr className="bg-surface-50">
      <td colSpan={6} className="px-5 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-surface-500 text-xs font-medium mb-1">
              Service Category
            </p>
            <p className="text-surface-800 font-medium">
              {order.service.category}
            </p>
          </div>
          <div>
            <p className="text-surface-500 text-xs font-medium mb-1">
              Payment Reference
            </p>
            <p className="text-surface-800 font-medium">
              {order.paymentId || "No reference available"}
            </p>
          </div>
          <div>
            <p className="text-surface-500 text-xs font-medium mb-1">
              Contact Email
            </p>
            <p className="text-surface-800 font-medium">{order.user.email}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Empty State ──────────────────────────────────────────────────

function EmptyOrdersState() {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
        <FiPackage className="w-7 h-7 text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-800 mb-1">
        No orders found
      </h3>
      <p className="text-surface-500 text-sm max-w-xs mb-5">
        There are no service orders matching your current filters. Try adjusting
        your search or create a new order.
      </p>
      <button
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: "var(--gradient-primary)" }}
      >
        Create Your First Order
      </button>
    </div>
  );
}

// ─── Bulk Actions Bar ─────────────────────────────────────────────

function BulkActionsBar({
  selectedCount,
  onClear,
}: {
  selectedCount: number;
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl bg-surface-900 shadow-2xl border border-surface-800 flex items-center gap-6"
    >
      <div className="flex items-center gap-3 border-r border-surface-700 pr-6">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-[10px] font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-white">Orders Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-800 transition-all"
          title="Mark as Completed"
        >
          <FiCheckCircle className="w-4 h-4 text-accent-emerald" />
          <span className="hidden md:inline">Complete</span>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-800 transition-all"
          title="Export CSV"
        >
          <FiDownload className="w-4 h-4 text-accent-cyan" />
          <span className="hidden md:inline">Export</span>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-surface-300 hover:text-[var(--accent-rose)] hover:bg-surface-800 transition-all"
          title="Cancel Orders"
        >
          <FiTrash2 className="w-4 h-4" />
          <span className="hidden md:inline">Cancel</span>
        </button>
      </div>

      <button
        onClick={onClear}
        className="p-2 rounded-lg text-surface-500 hover:text-white hover:bg-surface-800 transition-all"
        aria-label="Clear selection"
      >
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Mobile Order Card ────────────────────────────────────────────

function OrderCard({
  order,
  isSelected,
  onToggleSelect,
  isExpanded,
  onToggleExpand,
}: {
  order: Order;
  isSelected: boolean;
  onToggleSelect: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/[0.02]"
          : "border-(--surface-card-border) bg-[var(--surface-card-bg)] shadow-surface-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect();
            }}
            className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
          />
        </div>

        <div className="flex-1 min-w-0" onClick={onToggleExpand}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono font-semibold text-primary">
              {order.id}
            </span>
            <span className="text-xs text-surface-400">{order.date}</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <img
              src={order.user.avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--surface-100)]"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-surface-900 truncate">
                {order.user.name}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {order.service.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(
                  order.orderStatus,
                )}`}
              >
                {order.orderStatus}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPaymentBadgeStyle(
                  order.paymentStatus,
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <span className="text-sm font-bold text-surface-900">
              {order.amount}
            </span>
          </div>
        </div>

        <button onClick={onToggleExpand} className="p-1 text-surface-400">
          <FiChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-(--surface-card-border) grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-surface-500 font-medium mb-1">Category</p>
                <p className="text-surface-800">{order.service.category}</p>
              </div>
              <div>
                <p className="text-surface-500 font-medium mb-1">Payment ID</p>
                <p className="text-surface-800 font-mono">
                  {order.paymentId || "N/A"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-surface-500 font-medium mb-1">Contact</p>
                <p className="text-surface-800">{order.user.email}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function OrdersPage() {
  const { local } = useVariables();
  const { OrdersPage: t } = getTranslations(local) as any;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const stats: StatCard[] = [
    {
      label: "Total Orders",
      value: "1,284",
      change: "+12%",
      changeLabel: "vs last month",
      icon: <FiShoppingBag className="w-5 h-5" />,
      accent: "text-primary",
      accentBorder: "border-primary",
    },
    {
      label: "Pending",
      value: "42",
      change: "Needs attention",
      changeLabel: "high priority",
      icon: <FiClock className="w-5 h-5" />,
      accent: "text-[var(--accent-amber)]",
      accentBorder: "border-[var(--accent-amber)]",
    },
    {
      label: "Revenue",
      value: "$142.5K",
      change: "+8.4%",
      changeLabel: "vs last month",
      icon: <FiDollarSign className="w-5 h-5" />,
      accent: "text-accent-emerald",
      accentBorder: "border-accent-emerald",
    },
    {
      label: "Avg. Order Value",
      value: "$310",
      change: "Stable",
      changeLabel: "on track",
      icon: <FiTrendingUp className="w-5 h-5" />,
      accent: "text-accent-cyan",
      accentBorder: "border-accent-cyan",
    },
  ];

  const toggleRow = (orderId: string) => {
    setExpandedRow((prev) => (prev === orderId ? null : orderId));
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (
      selectedOrders.size === filteredOrders.length &&
      filteredOrders.length > 0
    ) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || categoryFilter !== "all";

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      order.service.category
        .toLowerCase()
        .includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* ── Page Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-surface-900 tracking-tight">
              Orders
            </h1>
            <p className="text-surface-500 mt-0.5 text-sm">
              Track client service requests across all categories.
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 4px 16px rgba(249,115,22,0.25)",
            }}
            aria-label="Create a new service order"
          >
            <FiPlus className="w-4 h-4" />
            New Order
          </button>
        </div>

        {/* ── Stats Row — Asymmetric, token-driven ────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            : stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={item}
                  className="relative p-5 rounded-xl border border-(--surface-card-border) bg-[var(--surface-card-bg)] shadow-surface-sm hover:shadow-surface-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg border ${stat.accentBorder} flex items-center justify-center ${stat.accent}`}
                    >
                      {stat.icon}
                    </div>
                    <span className="text-xs font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-md">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-surface-500 text-xs font-medium mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-surface-900 tracking-tight">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
        </motion.div>

        {/* ── Filter Bar ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="order-search" className="sr-only">
              Search orders by ID or user name
            </label>
            <input
              id="order-search"
              type="text"
              placeholder="Search by order ID or user name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[var(--surface-input-border)] bg-[var(--surface-input-bg)] text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Status Filter */}
          <label htmlFor="order-status-filter" className="sr-only">
            Filter by order status
          </label>
          <select
            id="order-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-[var(--surface-input-border)] bg-[var(--surface-input-bg)] text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Category Filter */}
          <label htmlFor="order-category-filter" className="sr-only">
            Filter by service category
          </label>
          <select
            id="order-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 text-sm rounded-xl border border-[var(--surface-input-border)] bg-[var(--surface-input-bg)] text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="all">All Categories</option>
            <option value="legal">Legal Services</option>
            <option value="tech">Tech Consulting</option>
            <option value="logistics">Logistics</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm rounded-xl border border-(--surface-card-border) text-[var(--surface-600)] hover:bg-[var(--surface-100)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              aria-label="Clear all filters"
            >
              <FiX className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* ── Orders View ────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Mobile View */}
          <div className="sm:hidden space-y-4">
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState />
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrders.has(order.id)}
                  onToggleSelect={() => toggleSelectOrder(order.id)}
                  isExpanded={expandedRow === order.id}
                  onToggleExpand={() => toggleRow(order.id)}
                />
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block rounded-xl border border-(--surface-card-border) bg-[var(--surface-card-bg)] shadow-surface-sm overflow-hidden">
            {filteredOrders.length === 0 ? (
              <EmptyOrdersState />
            ) : loading ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-(--surface-card-border)">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TableRowSkeleton key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-(--surface-card-border) bg-surface-50">
                        <th className="px-5 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={
                              selectedOrders.size === filteredOrders.length &&
                              filteredOrders.length > 0
                            }
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                          />
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider font-display">
                          Order
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider font-display">
                          User
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider font-display">
                          Service
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider font-display">
                          Payment
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider font-display">
                          Status
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider font-display">
                          Amount
                        </th>
                        <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider w-12">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-(--surface-card-border)">
                      {filteredOrders.map((order) => (
                        <React.Fragment key={order.id}>
                          <tr
                            className={`hover:bg-surface-50 transition-colors duration-150 group cursor-pointer ${
                              selectedOrders.has(order.id)
                                ? "bg-primary/[0.02]"
                                : ""
                            }`}
                            onClick={() => toggleRow(order.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleRow(order.id);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-expanded={expandedRow === order.id}
                          >
                            {/* Selection */}
                            <td
                              className="px-5 py-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedOrders.has(order.id)}
                                onChange={() => toggleSelectOrder(order.id)}
                                className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                              />
                            </td>

                            {/* Order ID */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono font-bold text-primary">
                                  {order.id}
                                </span>
                                <FiChevronDown
                                  className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-200 ${
                                    expandedRow === order.id ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                              <span className="text-xs text-surface-400 mt-0.5 block">
                                {order.date}
                              </span>
                            </td>

                            {/* User */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={order.user.avatar}
                                  alt=""
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--surface-100)]"
                                  loading="lazy"
                                />
                                <div>
                                  <p className="text-sm font-bold text-surface-800">
                                    {order.user.name}
                                  </p>
                                  <p className="text-xs text-surface-500">
                                    {order.user.email}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Service */}
                            <td className="px-5 py-4">
                              <p className="text-sm font-medium text-surface-800">
                                {order.service.name}
                              </p>
                            </td>

                            {/* Payment Status */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPaymentBadgeStyle(
                                  order.paymentStatus,
                                )}`}
                              >
                                {order.paymentStatus}
                              </span>
                            </td>

                            {/* Order Status */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyle(
                                  order.orderStatus,
                                )}`}
                              >
                                {order.orderStatus}
                              </span>
                            </td>

                            {/* Amount */}
                            <td className="px-5 py-4">
                              <span className="text-sm font-bold text-surface-800 tabular-nums">
                                {order.amount}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4">
                              <div
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="p-1.5 rounded-lg text-surface-500 hover:bg-[var(--surface-100)] hover:text-surface-800 transition-colors">
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded-lg text-surface-500 hover:bg-[var(--surface-100)] hover:text-surface-800 transition-colors">
                                  <FiMoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expandable Detail Row */}
                          <AnimatePresence>
                            {expandedRow === order.id && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.2,
                                  ease: "easeOut" as const,
                                }}
                              >
                                <td colSpan={8} className="p-0 border-none">
                                  <ExpandedOrderDetail order={order} />
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Pagination ──────────────────────────────────── */}
                <div className="px-5 py-3 border-t border-(--surface-card-border) bg-surface-50 flex items-center justify-between">
                  <p className="text-xs text-surface-500">
                    Showing{" "}
                    <span className="font-bold text-surface-700">1</span> to{" "}
                    <span className="font-bold text-surface-700">
                      {filteredOrders.length}
                    </span>{" "}
                    of <span className="font-bold text-surface-700">1,284</span>{" "}
                    orders
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--surface-card-border) text-surface-500 hover:bg-[var(--surface-card-bg)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-white text-xs font-bold"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--surface-card-border) text-[var(--surface-600)] hover:bg-[var(--surface-card-bg)] transition-all text-xs font-bold">
                      2
                    </button>
                    <span className="px-1 text-surface-400">…</span>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--surface-card-border) text-surface-500 hover:bg-[var(--surface-card-bg)] transition-all">
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {selectedOrders.size > 0 && (
            <BulkActionsBar
              selectedCount={selectedOrders.size}
              onClear={() => setSelectedOrders(new Set())}
            />
          )}
        </AnimatePresence>

        {/* ── Footer Hint ─────────────────────────────────────── */}
        <div className="text-center text-xs text-surface-400 pt-2">
          <p>
            Tip: Click any row to expand and see service category and payment
            details.
          </p>
        </div>
      </main>
    </div>
  );
}
