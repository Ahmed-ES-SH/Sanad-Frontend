"use client";

import { useState, useCallback, useEffect } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { motion } from "framer-motion";
import {
  FiFilter,
  FiPieChart,
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import TransactionTable from "@/app/_components/_dashboard/PaymentsPage/TransactionTable";
import PaymentDetailModal from "@/app/_components/_dashboard/PaymentsPage/PaymentDetailModal";
import type {
  PaymentStatus,
  PaginatedPaymentsResponse,
} from "@/lib/types/payments";
import { useAppQuery } from "@/lib/hooks/useAppQuery";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface PaymentsClientProps {
  initialData: PaginatedPaymentsResponse | null;
}

// Simple debounce hook just in case it doesn't exist at @/lib/hooks/useDebounce
function useLocalDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function PaymentsClient({ initialData }: PaymentsClientProps) {
  const { local } = useVariables();
  const { PaymentsPage: t } = getTranslations(local);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const debouncedSearch = useLocalDebounce(searchFilter, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal state
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );

  // Construct query endpoint
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (statusFilter) queryParams.set("status", statusFilter);
  // Assuming we use 'userId' for searching if UUID format, else we might not pass it
  // Backend doesn't support 'search' natively based on the provided spec,
  // but if debouncedSearch looks like a UUID we could pass it as userId.
  if (debouncedSearch) {
    queryParams.set("userId", debouncedSearch);
  }

  const endpoint = `/api/admin/payments?${queryParams.toString()}`;

  // Fetch payments using useAppQuery
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useAppQuery<PaginatedPaymentsResponse>({
    queryKey: ["admin-payments", page, statusFilter, debouncedSearch],
    endpoint,
    options: {
      // Use initialData for the very first render if we are on page 1 with no filters
      initialData:
        page === 1 && !statusFilter && !debouncedSearch && initialData
          ? initialData
          : undefined,
    },
  });

  const responseData = queryData || initialData;
  const payments = responseData?.data || [];
  const meta = responseData?.meta || null;

  const handleRowClick = useCallback((paymentId: string) => {
    setSelectedPaymentId(paymentId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPaymentId(null);
  }, []);

  const handleRefundSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleStatusFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value as PaymentStatus | "");
      setPage(1); // reset to page 1 on filter change
    },
    [],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchFilter(e.target.value);
      setPage(1); // reset to page 1 on search change
    },
    [],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50">
      <main className="flex-1 p-6 md:p-8 space-y-8 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 font-display">
              {t.PaymentsHeader.title}
            </h1>
            <p className="text-stone-500 mt-1">{t.PaymentsHeader.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors shadow-sm text-sm font-medium">
              <FiFilter className="w-4 h-4" />
              {t.PaymentFilters.statusAll}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-md shadow-orange-200 text-sm font-medium">
              <FiDollarSign className="w-4 h-4" />
              {t.PaymentActions.sendInvoice}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Stats are kept as display-only since backend doesn't provide stats endpoint yet */}
          <motion.div
            variants={item}
            className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <FiDollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                {t.PaymentStats.totalRevenue}
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">
                {meta ? `${meta.total || 0} payments` : "—"}
              </h3>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <FiCreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                {t.PaymentStats.activeSubscriptions}
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">
                {meta ? `${meta.totalPages || 0} pages` : "—"}
              </h3>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <FiTrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                {t.PaymentStats.netVolume}
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">
                {payments ? payments.length : 0}
              </h3>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <FiPieChart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                {t.PaymentStats.avgTicketSize}
              </p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">
                {payments && payments.length > 0
                  ? `$${(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toFixed(2)}`
                  : "—"}
              </h3>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400" />
            <input
              className="w-full pl-8 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:border-orange-300 focus:outline-none"
              placeholder={
                t.PaymentFilters.searchPlaceholder || "Search by User ID..."
              }
              type="text"
              value={searchFilter}
              onChange={handleSearchChange}
              aria-label={t.PaymentFilters.searchPlaceholder}
            />
          </div>
          <select
            className="px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-600 focus:border-orange-300 focus:outline-none"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">{t.PaymentFilters.statusAll}</option>
            <option value="succeeded">{t.PaymentFilters.success}</option>
            <option value="pending">{t.PaymentFilters.pending}</option>
            <option value="failed">{t.PaymentFilters.failed}</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Transactions Table */}
        <TransactionTable
          payments={payments}
          isLoading={isLoading && !responseData}
          error={error}
          onRowClick={handleRowClick}
          onRetry={refetch}
          meta={meta}
          onPageChange={handlePageChange}
        />
      </main>

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={!!selectedPaymentId}
        onClose={handleCloseModal}
        paymentId={selectedPaymentId || ""}
        onRefundSuccess={handleRefundSuccess}
      />
    </div>
  );
}
