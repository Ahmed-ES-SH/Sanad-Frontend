'use client';

import React from 'react';
import { AdminOrder, OrderStatus } from '@/app/types/order';
import GlobalTable, { Column } from '@/app/_components/_global/GlobalTable';
import { useVariables } from '@/app/context/VariablesContext';
import { getTranslations } from '@/app/helpers/helpers';
import { FiEye } from 'react-icons/fi';

// Status badge configuration
const statusConfig: Record<OrderStatus, { bg: string; text: string; labelKey: string }> = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    labelKey: 'pending',
  },
  paid: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    labelKey: 'paid',
  },
  in_progress: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    labelKey: 'in_progress',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    labelKey: 'completed',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    labelKey: 'cancelled',
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

interface OrdersTableProps {
  onViewOrder?: (orderId: string) => void;
  statusFilter?: string;
  userIdFilter?: number;
}

export function OrdersTable({ onViewOrder, statusFilter, userIdFilter }: OrdersTableProps) {
  const { local } = useVariables();
  const translations = getTranslations(local) as any;
  const t = translations.OrdersPage || {};

  const columns: Column<AdminOrder>[] = [
    {
      label: t.table?.orderId || 'Order ID',
      accessor: 'id',
      render: (order) => (
        <span className="text-sm font-mono font-bold text-primary">
          {order.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      label: t.table?.user || 'User',
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
              {order.user.name || 'Unknown'}
            </p>
            <p className="text-xs text-surface-500">
              {order.user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: t.table?.service || 'Service',
      render: (order) => (
        <p className="text-sm font-medium text-surface-800">
          {order.service.title}
        </p>
      ),
    },
    {
      label: t.table?.amount || 'Amount',
      render: (order) => (
        <span className="text-sm font-bold text-surface-800 tabular-nums">
          {formatCurrency(order.amount, order.currency)}
        </span>
      ),
    },
    {
      label: t.table?.status || 'Status',
      accessor: 'status',
      render: (order) => {
        const config = statusConfig[order.status] || statusConfig.pending;
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}
          >
            {t.status?.[config.labelKey] || config.labelKey.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      label: t.table?.date || 'Date',
      accessor: 'createdAt',
      render: (order) => (
        <span className="text-xs text-surface-500">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
  ];

  const extraParams = React.useMemo(() => {
    const params: Record<string, any> = {};
    if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
    if (userIdFilter) params.userId = userIdFilter;
    return params;
  }, [statusFilter, userIdFilter]);

  return (
    <GlobalTable<AdminOrder>
      endpoint="/api/admin/orders"
      queryKey="admin-orders"
      initialData={[]}
      columns={columns}
      rowKey="id"
      isPaginated={true}
      extraParams={extraParams}
      LIMIT={10}
      emptyMessage={t.table?.empty || 'No orders found'}
      onRowClick={(order) => onViewOrder?.(order.id)}
      renderActions={(order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewOrder?.(order.id);
          }}
          className="p-1.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-800 transition-colors"
          title={t.table?.view || 'View Details'}
        >
          <FiEye className="w-4 h-4" />
        </button>
      )}
    />
  );
}
