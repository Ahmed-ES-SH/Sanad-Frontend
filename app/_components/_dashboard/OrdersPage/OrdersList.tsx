'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMyOrders } from '@/lib/hooks/orders';
import { Order, OrderStatus } from '@/app/types/order';

// Status badge configuration
const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    label: 'Pending',
  },
  paid: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'Paid',
  },
  in_progress: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    label: 'In Progress',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Completed',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'Cancelled',
  },
};

// Format currency
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface OrdersListProps {
  onPayClick?: (orderId: string) => void;
}

export function OrdersList({ onPayClick }: OrdersListProps) {
  const { orders, meta, isLoading, error, fetchOrders } = useMyOrders();

  useEffect(() => {
    fetchOrders({ page: 1, limit: 10 });
  }, [fetchOrders]);

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrders({ page, limit: 10 });
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchOrders({ page: currentPage, limit: 10 })}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-6 bg-gray-50 rounded-xl border border-gray-200"
      >
        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No orders yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start by browsing our services to create your first order.
        </p>
        <Link
          href="/services"
          className="inline-flex px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Browse Services
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Service Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {order.service.iconUrl && (
                      <img
                        src={order.service.iconUrl}
                        alt={order.service.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {order.service.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order #{order.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                >
                  {status.label}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                {/* Amount & Date */}
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(order.amount, order.currency)}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    View Details
                  </Link>
                  {order.status === 'pending' && onPayClick && (
                    <button
                      onClick={() => onPayClick(order.id)}
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {meta.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === meta.totalPages}
            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}