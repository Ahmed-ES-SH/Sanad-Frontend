"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import UserDashboardHeader from "./UserDashboardHeader";

const orders = [
  {
    id: "#SAN-99203-XT",
    title: "Enterprise Maintenance Suite",
    status: "completed",
    date: "Oct 12, 2024",
    amount: "$1,240.00",
  },
  {
    id: "#SAN-88124-PL",
    title: "HVAC System Optimization",
    status: "inProgress",
    date: "Oct 24, 2024",
    amount: "$850.00",
  },
  {
    id: "#SAN-77491-BC",
    title: "Fire Safety Audit",
    status: "pending",
    date: "Oct 26, 2024",
    amount: "$420.00",
  },
  {
    id: "#SAN-90211-MM",
    title: "Industrial Power Setup",
    status: "paid",
    date: "Sep 30, 2024",
    amount: "$2,800.00",
  },
  {
    id: "#SAN-65320-YY",
    title: "CCTV Network Install",
    status: "cancelled",
    date: "Sep 15, 2024",
    amount: "$560.00",
  },
];

export default function UserOrdersPage() {
  const { local } = useVariables();
  const translations = getTranslations(local);
  const t = translations.UserOrders;
  const isRTL = local === "ar";

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <UserDashboardHeader />

      <main className="flex-1  px-4 md:px-8 py-10 w-full space-y-8">
        {/* Heading */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-surface-900 tracking-tight font-display"
          >
            {t.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 text-lg max-w-2xl font-body"
          >
            {t.description}
          </motion.p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-4 shadow-surface-sm border border-surface-200/50 flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-grow w-full relative">
            <FiSearch
              className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-surface-400`}
            />
            <input
              className={`w-full bg-surface-50 border-none rounded-xl ${isRTL ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} py-3.5 focus:ring-2 focus:ring-primary/20 transition-all font-body text-sm`}
              placeholder={t.searchPlaceholder}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {Object.keys(t.filters).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  filter === key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                }`}
              >
                {t.filters[key as keyof typeof t.filters]}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              t={t}
              isRTL={isRTL}
              index={index}
            />
          ))}

          {/* New Order CTA */}
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl border-2 border-dashed border-surface-300 flex flex-col items-center justify-center p-8 bg-surface-100/30 hover:bg-surface-100 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-surface-100 flex items-center justify-center mb-4 group-hover:bg-primary transition-all duration-300">
              <FiPlusCircle className="text-primary text-2xl group-hover:text-white" />
            </div>
            <p className="font-bold text-surface-900 font-display">
              {t.newService.title}
            </p>
            <p className="text-xs text-surface-500 text-center mt-2 px-4 font-body">
              {t.newService.description}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function OrderCard({ order, t, isRTL, index }: any) {
  const statusStyles: any = {
    completed: "bg-green-100 text-green-700",
    inProgress: "bg-orange-100 text-orange-700",
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-blue-100 text-blue-700",
    cancelled: "bg-surface-200 text-surface-600 opacity-75",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-2xl p-6 shadow-surface-sm flex flex-col border border-surface-200/50 hover:shadow-surface-md transition-all ${order.status === "inProgress" ? (isRTL ? "border-r-4 border-r-primary" : "border-l-4 border-l-primary") : ""}`}
    >
      <div className="flex justify-between items-start mb-6 gap-2">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-surface-400 uppercase font-display block">
            {order.id}
          </span>
          <h3 className="text-xl font-bold text-surface-900 leading-tight font-display">
            {order.title}
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${statusStyles[order.status]}`}
        >
          {t.status[order.status]}
        </span>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-surface-500">{t.card.datePlaced}</span>
          <span className="font-semibold text-surface-800">{order.date}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-body pb-2">
          <span className="text-surface-500">{t.card.amount}</span>
          <span className="text-xl font-bold text-primary font-display">
            {order.amount}
          </span>
        </div>

        <button
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 group active:scale-95 ${order.status === "inProgress" ? "surface-btn-primary shadow-lg shadow-primary/20" : "bg-surface-100 text-surface-700 hover:bg-surface-200"}`}
        >
          {order.status === "cancelled"
            ? t.card.viewHistory
            : t.card.viewDetails}
          <FiChevronRight
            className={`text-lg transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`}
          />
        </button>
      </div>
    </motion.div>
  );
}
