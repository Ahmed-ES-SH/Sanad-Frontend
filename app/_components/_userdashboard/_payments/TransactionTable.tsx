"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  FiAlertCircle,
  FiRefreshCw,
  FiLoader,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { usePaymentHistory } from "@/lib/hooks/payments";
import { FilterStatus } from "./TransactionTable.types";
import FilterBar from "./FilterBar";
import TransactionTableHeader from "./TransactionTableHeader";
import TransactionRow from "./TransactionRow";
import TransactionPagination from "./TransactionPagination";
import EmptyState from "./EmptyState";
import {
  Transaction,
  TransactionStatus,
  transformPaymentToTransaction,
} from "@/app/helpers/_payments";
import { PaymentStatus } from "@/lib/types/payments";

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  paid: {
    label: "Paid",
    className: "bg-green-50 text-green-700",
    icon: <FiCheckCircle className="text-[10px] mr-1" />,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
    icon: <FiClock className="text-[10px] mr-1" />,
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700",
    icon: <FiXCircle className="text-[10px] mr-1" />,
  },
};

// Status to API status mapping
const getApiStatus = (filter: FilterStatus): string | undefined => {
  if (filter === "all") return undefined;
  return filter === "paid" ? "succeeded" : filter;
};

const TransactionTable: React.FC = () => {
  const { local } = useVariables();
  const { payments } = getTranslations(local ?? "en");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // API status conversion
  const apiStatus = getApiStatus(statusFilter);

  // Fetch payments from API
  const {
    payments: apiPayments,
    isLoading,
    isFetching,
    error,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
    refetch,
  } = usePaymentHistory({
    page: currentPage,
    limit: 10,
    status: apiStatus as PaymentStatus,
    startDate: dateFrom || undefined,
    endDate: dateTo || undefined,
    enabled: true,
  });

  // Transform API payments to Transaction format
  const transactions: Transaction[] = useMemo(() => {
    return apiPayments.map(transformPaymentToTransaction);
  }, [apiPayments]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFrom, dateTo]);

  // Filter transactions client-side (for search)
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // Text search
      const matchesSearch =
        searchQuery === "" ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter (server-side but keep for consistency)
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
  }, [transactions, searchQuery, statusFilter, dateFrom, dateTo]);

  // Filter count
  const hasActiveFilters =
    statusFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    searchQuery !== "";

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (dateFrom !== "" ? 1 : 0) +
    (dateTo !== "" ? 1 : 0);

  // Handlers
  const clearAllFilters = () => {
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRetry = () => {
    setRefreshKey((prev) => prev + 1);
    refetch();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden">
        <div className="p-6 border-b border-stone-200/50">
          <h2 className="text-xl font-semibold text-foreground">
            {payments.tableTitle}
          </h2>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <FiLoader className="animate-spin text-xl" />
            <span>{payments.loadingText}</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden">
        <div className="p-6 border-b border-stone-200/50">
          <h2 className="text-xl font-semibold text-foreground">
            {payments.tableTitle}
          </h2>
        </div>
        <div className="p-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <FiAlertCircle className="text-4xl text-red-500" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {payments.loadFailed}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error.message || payments.tryAgainLater}
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-600/20 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <FiRefreshCw className="text-sm" />
              {payments.tryAgainLabel}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden">
      {/* Header & Filters */}
      <div className="p-6 border-b border-stone-200/50">
        <FilterBar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          activeFilterCount={activeFilterCount}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearchQuery}
          onStatusFilterChange={setStatusFilter}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onClearFilters={clearAllFilters}
        />
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <TransactionTableHeader />
          <tbody className="divide-y divide-stone-200/50">
            {filteredTransactions.length === 0 ? (
              <EmptyState
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
              />
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  statusConfig={STATUS_CONFIG}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TransactionPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        filteredCount={filteredTransactions.length}
        onPageChange={handlePageChange}
        onPreviousPage={() => handlePageChange(currentPage - 1)}
        onNextPage={() => handlePageChange(currentPage + 1)}
      />
    </section>
  );
};

export default TransactionTable;
