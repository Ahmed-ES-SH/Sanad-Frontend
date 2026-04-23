// ============================================================================
// ORDER HOOKS - Client-side hooks for order operations
// ============================================================================

'use client';

import { useState, useCallback } from 'react';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  initiatePayment,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  addOrderUpdate,
} from '@/app/actions/ordersActions';
import {
  Order,
  OrderListResponse,
  AdminOrderListResponse,
  AdminOrder,
  PaymentIntentResponse,
  OrderQueryParams,
  AdminOrderQueryParams,
  OrderActionResult,
} from '@/app/types/order';

// Re-export the new useAdminOrdersWithState hook
export { useAdminOrdersWithState } from './useAdminOrders';
export type { OrderFilters } from './useAdminOrders';

// ============================================================================
// USER ORDER HOOKS
// ============================================================================

interface UseCreateOrderState {
  isLoading: boolean;
  error: string | null;
}

export function useCreateOrder() {
  const [state, setState] = useState<UseCreateOrderState>({
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (
    serviceId: string,
    notes?: string
  ): Promise<OrderActionResult<Order>> => {
    setState({ isLoading: true, error: null });

    const result = await createOrder(serviceId, notes);

    if (!result.success) {
      setState({ isLoading: false, error: result.message });
    } else {
      setState({ isLoading: false, error: null });
    }

    return result;
  }, []);

  return {
    ...state,
    createOrder: execute,
  };
}

export function useMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrderListResponse['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (params: OrderQueryParams = {}) => {
    setIsLoading(true);
    setError(null);

    const result = await getMyOrders(params);

    if (result.success && result.data) {
      setOrders(result.data.data);
      setMeta(result.data.meta);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
    return result;
  }, []);

  const refetch = useCallback(async (params: OrderQueryParams = {}) => {
    return fetchOrders(params);
  }, [fetchOrders]);

  return {
    orders,
    meta,
    isLoading,
    error,
    fetchOrders: refetch,
  };
}

export function useOrderById(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    const result = await getOrderById(id);

    if (result.success && result.data) {
      setOrder(result.data);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
    return result;
  }, []);

  // Fetch order on mount if orderId is provided
  useState(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  });

  return {
    order,
    isLoading,
    error,
    fetchOrder,
  };
}

export function useInitiatePayment() {
  const [state, setState] = useState<UseCreateOrderState>({
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (
    orderId: string
  ): Promise<OrderActionResult<PaymentIntentResponse>> => {
    setState({ isLoading: true, error: null });

    const result = await initiatePayment(orderId);

    if (!result.success) {
      setState({ isLoading: false, error: result.message });
    } else {
      setState({ isLoading: false, error: null });
    }

    return result;
  }, []);

  return {
    ...state,
    initiatePayment: execute,
  };
}

// ============================================================================
// ADMIN ORDER HOOKS
// ============================================================================

export function useAllOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [meta, setMeta] = useState<AdminOrderListResponse['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (params: AdminOrderQueryParams = {}) => {
    setIsLoading(true);
    setError(null);

    const result = await getAllOrders(params);

    if (result.success && result.data) {
      setOrders(result.data.data);
      setMeta(result.data.meta);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
    return result;
  }, []);

  const refetch = useCallback(async (params: AdminOrderQueryParams = {}) => {
    return fetchOrders(params);
  }, [fetchOrders]);

  return {
    orders,
    meta,
    isLoading,
    error,
    fetchOrders: refetch,
  };
}

export function useAdminOrderById(orderId: string | null) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    const result = await getAdminOrderById(id);

    if (result.success && result.data) {
      setOrder(result.data);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
    return result;
  }, []);

  // Fetch order on mount if orderId is provided
  useState(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  });

  return {
    order,
    isLoading,
    error,
    fetchOrder,
  };
}

export function useUpdateOrderStatus() {
  const [state, setState] = useState<UseCreateOrderState>({
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (id: string, status: string) => {
    setState({ isLoading: true, error: null });

    const result = await updateOrderStatus(id, status);

    if (!result.success) {
      setState({ isLoading: false, error: result.message });
    } else {
      setState({ isLoading: false, error: null });
    }

    return result;
  }, []);

  return {
    ...state,
    updateStatus: execute,
  };
}

export function useAddOrderUpdate() {
  const [state, setState] = useState<UseCreateOrderState>({
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (id: string, content: string) => {
    setState({ isLoading: true, error: null });

    const result = await addOrderUpdate(id, content);

    if (!result.success) {
      setState({ isLoading: false, error: result.message });
    } else {
      setState({ isLoading: false, error: null });
    }

    return result;
  }, []);

  return {
    ...state,
    addUpdate: execute,
  };
}