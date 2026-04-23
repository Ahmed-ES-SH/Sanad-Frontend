"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import {
  FiClock,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";
import { OrdersTable } from "@/app/_components/_dashboard/AdminOrdersPage/OrdersTable";
import { OrderManagement } from "@/app/_components/_dashboard/AdminOrdersPage/OrderManagement";

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

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  accent: string;
  accentBorder: string;
}

export default function AdminOrdersPage() {
  const { local } = useVariables();
  const translations = getTranslations(local) as any;
  const t = translations.OrdersPage || {};

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const stats: StatCard[] = [
    {
      label: t.stats?.total || "Total Orders",
      value: "1,284",
      change: "+12%",
      icon: <FiShoppingBag className="w-5 h-5" />,
      accent: "text-primary",
      accentBorder: "border-primary",
    },
    {
      label: t.stats?.pending || "Pending",
      value: "42",
      change: "Needs attention",
      icon: <FiClock className="w-5 h-5" />,
      accent: "text-[var(--accent-amber)]",
      accentBorder: "border-[var(--accent-amber)]",
    },
    {
      label: t.stats?.revenue || "Revenue",
      value: "$142.5K",
      change: "+8.4%",
      icon: <FiDollarSign className="w-5 h-5" />,
      accent: "text-accent-emerald",
      accentBorder: "border-accent-emerald",
    },
    {
      label: t.stats?.avgValue || "Avg. Order Value",
      value: "$310",
      change: "Stable",
      icon: <FiTrendingUp className="w-5 h-5" />,
      accent: "text-accent-cyan",
      accentBorder: "border-accent-cyan",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <main className="flex-1 p-6 lg:p-8 space-y-6 w-full">
        <AnimatePresence mode="wait">
          {!selectedOrderId ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* ── Page Header ─────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold font-display text-surface-900 tracking-tight">
                    {t.title || "Orders"}
                  </h1>
                  <p className="text-surface-500 mt-0.5 text-sm">
                    {t.description ||
                      "Track client service requests across all categories."}
                  </p>
                </div>
              </div>

              {/* ── Stats Row ───────────────────────────────────────── */}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={item}
                    className="relative p-5 rounded-xl border border-(--surface-card-border) bg-surface-card-bg shadow-surface-sm hover:shadow-surface-md transition-shadow duration-200"
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
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 text-sm rounded-xl border border-[var(--surface-input-border)] bg-[var(--surface-input-bg)] text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="all">
                    {t.filters?.all || "All Statuses"}
                  </option>
                  <option value="pending">
                    {t.status?.pending || "Pending"}
                  </option>
                  <option value="paid">{t.status?.paid || "Paid"}</option>
                  <option value="in_progress">
                    {t.status?.in_progress || "In Progress"}
                  </option>
                  <option value="completed">
                    {t.status?.completed || "Completed"}
                  </option>
                  <option value="cancelled">
                    {t.status?.cancelled || "Cancelled"}
                  </option>
                </select>
              </div>

              {/* ── Table View ──────────────────────────────────────── */}
              <div className="bg-surface-card-bg rounded-xl shadow-surface-sm">
                <OrdersTable
                  onViewOrder={setSelectedOrderId}
                  statusFilter={statusFilter}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <OrderManagement
                orderId={selectedOrderId}
                onBack={() => setSelectedOrderId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
