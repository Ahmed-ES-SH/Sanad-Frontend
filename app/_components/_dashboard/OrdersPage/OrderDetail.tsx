'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderById } from '@/lib/hooks/orders';
import { usePayment } from '@/lib/hooks/orders/usePayment';
import { Order, OrderStatus, OrderUpdate } from '@/app/types/order';

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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface OrderDetailProps {
  orderId: string;
  onPayClick?: (orderId: string) => void;
}

export function OrderDetail({ orderId, onPayClick }: OrderDetailProps) {
  const { order, isLoading, error, fetchOrder } = useOrderById(orderId);
  const payment = usePayment(orderId);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId, fetchOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600">{error || 'Order not found'}</p>
        <Link
          href="/dashboard/orders"
          className="mt-4 inline-flex text-sm text-indigo-600 hover:text-indigo-700"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;

  const handlePayClick = () => {
    onPayClick?.(order.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Order #{order.id.slice(0, 8)}
          </p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}
        >
          {status.label}
        </span>
      </div>

      {/* Service & Amount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Card */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Service</h3>
          <div className="flex items-center gap-3">
            {order.service.iconUrl && (
              <img
                src={order.service.iconUrl}
                alt={order.service.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <h4 className="font-medium text-gray-900">{order.service.title}</h4>
              <p className="text-sm text-gray-500">{order.service.shortDescription}</p>
            </div>
          </div>
        </div>

        {/* Amount Card */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Amount</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(order.amount, order.currency)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Created {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
          <p className="text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Timeline / Updates */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Timeline</h3>
        <div className="space-y-4">
          {order.updates.map((update, index) => (
            <TimelineItem key={update.id} update={update} isLast={index === order.updates.length - 1} />
          ))}
        </div>
      </div>

      {/* Actions */}
      {order.status === 'pending' && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handlePayClick}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Pay {formatCurrency(order.amount, order.currency)}
          </button>
        </div>
      )}
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ update, isLast }: { update: OrderUpdate; isLast: boolean }) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
      )}

      {/* Icon */}
      <div className="relative z-10 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
        {update.author === 'admin' ? (
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 capitalize">
            {update.author === 'admin' ? 'Admin' : 'System'}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(update.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{update.content}</p>
      </div>
    </div>
  );
}