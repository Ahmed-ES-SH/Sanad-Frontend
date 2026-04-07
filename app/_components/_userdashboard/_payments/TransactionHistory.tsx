"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiCloud,
  FiStar,
  FiHeadphones,
  FiDatabase,
  FiAlertTriangle,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

type TransactionStatus = "paid" | "pending" | "failed";

interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  subtitle: string;
  icon: React.ReactNode;
  amount: string;
  status: TransactionStatus;
  errorReason?: string;
  timestamp: Date;
}

const transactions: Transaction[] = [
  {
    id: "1",
    date: "Oct 24, 2024",
    time: "2:32 PM",
    description: "Cloud Infrastructure",
    subtitle: "Subscription Plan: Pro Plus",
    icon: <FiCloud className="text-sm" />,
    amount: "1,240.00 SAR",
    status: "paid",
    timestamp: new Date(2024, 9, 24),
  },
  {
    id: "2",
    date: "Oct 12, 2024",
    time: "9:15 AM",
    description: "SaaS Subscription",
    subtitle: "Monthly platform access",
    icon: <FiStar className="text-sm" />,
    amount: "350.00 SAR",
    status: "paid",
    timestamp: new Date(2024, 9, 12),
  },
  {
    id: "3",
    date: "Sep 28, 2024",
    time: "6:50 PM",
    description: "Priority Support Add-on",
    subtitle: "Annual 24/7 technical support",
    icon: <FiHeadphones className="text-sm" />,
    amount: "2,500.00 SAR",
    status: "pending",
    timestamp: new Date(2024, 8, 28),
  },
  {
    id: "4",
    date: "Sep 12, 2024",
    time: "11:00 AM",
    description: "Database Hosting",
    subtitle: "Scaling storage quota",
    icon: <FiDatabase className="text-sm" />,
    amount: "150.00 SAR",
    status: "failed",
    errorReason: "Card expired",
    timestamp: new Date(2024, 8, 12),
  },
];

const statusConfig: Record<
  TransactionStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  paid: {
    label: "Paid",
    className: "bg-green-50 text-green-700",
    icon: null,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
    icon: null,
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700",
    icon: <FiAlertTriangle className="text-[10px] mr-1" />,
  },
};

const statusOptions: { value: TransactionStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const closeDropdowns = useCallback((e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      setShowFilterDropdown(false);
    }
    if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
      setShowDateDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdowns);
    return () => document.removeEventListener("mousedown", closeDropdowns);
  }, [closeDropdowns]);

  const getFilteredTransactions = () => {
    return transactions.filter((t) => {
      // Text search
      const matchesSearch =
        searchQuery === "" ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      // Date range filter
      let matchesDate = true;
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && t.timestamp >= fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && t.timestamp <= toDate;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const hasActiveFilters =
    statusFilter !== "all" || dateFrom !== "" || dateTo !== "";

  const clearAllFilters = () => {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (dateFrom !== "" ? 1 : 0) +
    (dateTo !== "" ? 1 : 0);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden">
      <div className="p-6 border-b border-stone-200/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" aria-hidden="true" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200/50 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:outline-none focus:border-orange-500/50"
              placeholder="Search description..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search transactions by description"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                showFilterDropdown
                  ? "bg-orange-50 border-orange-500/50 text-orange-700"
                  : "bg-stone-50 border-stone-200/50 text-muted-foreground hover:bg-stone-100"
              }`}
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowDateDropdown(false);
              }}
              aria-expanded={showFilterDropdown}
              aria-haspopup="listbox"
              aria-label="Filter transactions by status"
            >
              <FiFilter className="text-sm" aria-hidden="true" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <FiChevronDown className="text-xs" aria-hidden="true" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden" role="listbox">
                <div className="p-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        statusFilter === option.value
                          ? "bg-orange-50 text-orange-700 font-semibold"
                          : "text-foreground hover:bg-stone-50"
                      }`}
                      onClick={() => setStatusFilter(option.value)}
                      role="option"
                      aria-selected={statusFilter === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Range Dropdown */}
          <div className="relative" ref={dateRef}>
            <button
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                showDateDropdown
                  ? "bg-orange-50 border-orange-500/50 text-orange-700"
                  : "bg-stone-50 border-stone-200/50 text-muted-foreground hover:bg-stone-100"
              }`}
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowFilterDropdown(false);
              }}
              aria-expanded={showDateDropdown}
              aria-label="Filter transactions by date range"
            >
              <FiCalendar className="text-sm" aria-hidden="true" />
              Date Range
              <FiChevronDown className="text-xs" aria-hidden="true" />
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-lg z-50 p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:outline-none focus:border-orange-500/50"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      aria-label="Filter from date"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:outline-none focus:border-orange-500/50"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      aria-label="Filter to date"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      className="flex-1 py-2 px-3 text-sm font-semibold text-foreground bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="flex-1 py-2 px-3 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={() => setShowDateDropdown(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <button
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              onClick={clearAllFilters}
              aria-label="Clear all filters"
            >
              <FiX className="text-sm" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-100">
              <th className="px-6 py-4 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/50">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FiFilter className="text-3xl text-stone-300" aria-hidden="true" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No transactions match your filters
                    </p>
                    <button
                      className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1"
                      onClick={clearAllFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => {
                const status = statusConfig[transaction.status];
                return (
                  <tr key={transaction.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">{transaction.date}</p>
                      <p className="text-xs text-muted-foreground">{transaction.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center text-stone-500" aria-hidden="true">
                          {transaction.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-foreground">{transaction.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${status.className}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      {transaction.errorReason && (
                        <p className="text-xs text-red-600 mt-1">{transaction.errorReason}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {transaction.status === "failed" ? (
                        <button
                          className="px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-600/20 rounded-lg hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                          aria-label={`Retry payment for ${transaction.description}`}
                        >
                          Retry
                        </button>
                      ) : (
                        <button
                          className="p-2 text-muted-foreground hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                          aria-label={`Download invoice for ${transaction.description}`}
                        >
                          <FiFileText />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-stone-100 border-t border-stone-200/50 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </p>
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg bg-white border border-stone-200/50 text-muted-foreground disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            disabled
            aria-disabled="true"
            aria-label="Previous page"
          >
            <FiChevronLeft className="text-sm" />
          </button>
          <button
            className="p-2 rounded-lg bg-white border border-stone-200/50 text-muted-foreground hover:bg-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Next page"
          >
            <FiChevronRight className="text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
}
