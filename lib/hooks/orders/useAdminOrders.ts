// ============================================================================
// USE ADMIN ORDERS HOOK - Client-side hook for admin order operations using useAppQuery
// ============================================================================

"use client";

import { useState, useCallback, useMemo } from "react";
import { ORDERS_ENDPOINTS } from "@/app/constants/endpoints";
import {
  AdminOrderListResponse,
  AdminOrderQueryParams,
  PaginationMeta,
} from "@/app/types/order";
import { useAppQuery } from "../useAppQuery";

interface UseAdminOrdersOptions {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: string;
  initialUserId?: number;
  initialServiceId?: string;
}

interface UseAdminOrdersResult {
  orders: AdminOrderListResponse["data"];
  meta: PaginationMeta | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  status: string;
  setStatus: (status: string) => void;
  userId: number | undefined;
  setUserId: (userId: number | undefined) => void;
  serviceId: string | undefined;
  setServiceId: (serviceId: string | undefined) => void;
}

export function useAdminOrders(
  options: UseAdminOrdersOptions = {},
): UseAdminOrdersResult {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialStatus,
    initialUserId,
    initialServiceId,
  } = options;

  // Build query parameters based on current filters
  const buildQueryParams = useCallback(
    (
      page: number,
      limit: number,
      status?: string,
      userId?: number,
      serviceId?: string,
    ) => {
      const params: AdminOrderQueryParams = {
        page,
        limit,
      };
      if (status && status !== "all")
        params.status = status as AdminOrderQueryParams["status"];
      if (userId) params.userId = userId;
      if (serviceId) params.serviceId = serviceId;
      return params;
    },
    [],
  );

  // Use useAppQuery with dynamic query key
  const queryResult = useAppQuery<AdminOrderListResponse, Error>({
    queryKey: [
      "admin-orders",
      {
        page: initialPage,
        limit: initialLimit,
        status: initialStatus,
        userId: initialUserId,
        serviceId: initialServiceId,
      },
    ],
    endpoint: ORDERS_ENDPOINTS.ADMIN_LIST(
      initialPage,
      initialLimit,
      initialStatus,
      initialUserId,
      initialServiceId,
    ),
    options: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    },
  });

  // Return parsed data
  return {
    orders: queryResult.data?.data ?? [],
    meta: queryResult.data?.meta ?? null,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    error: queryResult.error,
    refetch: queryResult.refetch,
    page: initialPage,
    setPage: () => {}, // Will be controlled by parent
    limit: initialLimit,
    setLimit: () => {},
    status: initialStatus || "all",
    setStatus: () => {},
    userId: initialUserId,
    setUserId: () => {},
    serviceId: initialServiceId,
    setServiceId: () => {},
  };
}

// ============================================================================
// RE-EXPORT: Hook with state management for standalone use
// ============================================================================

export interface OrderFilters {
  page: number;
  limit: number;
  status?: string;
  userId?: number;
  serviceId?: string;
}

interface UseAdminOrdersWithStateResult {
  orders: AdminOrderListResponse["data"];
  meta: PaginationMeta | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;

  // Filter state
  filters: OrderFilters;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setStatus: (status: string) => void;
  setUserId: (userId: number | undefined) => void;
  setServiceId: (serviceId: string | undefined) => void;
  resetFilters: () => void;
}

/**
 * Admin Orders hook with built-in state management
 * Uses useAppQuery for data fetching with dynamic query keys
 */
export function useAdminOrdersWithState(
  initialFilters: Partial<OrderFilters> = {},
): UseAdminOrdersWithStateResult {
  const defaultFilters: OrderFilters = {
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 10,
    status: initialFilters.status,
    userId: initialFilters.userId,
    serviceId: initialFilters.serviceId,
  };

  const [filters, setFiltersState] = useState<OrderFilters>(defaultFilters);

  // Build query key dynamically based on filters
  const queryKey = useMemo(
    () => [
      "admin-orders",
      {
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        userId: filters.userId,
        serviceId: filters.serviceId,
      },
    ],
    [
      filters.page,
      filters.limit,
      filters.status,
      filters.userId,
      filters.serviceId,
    ],
  );

  // Build endpoint with current filters
  const endpoint = useMemo(
    () =>
      ORDERS_ENDPOINTS.ADMIN_LIST(
        filters.page,
        filters.limit,
        filters.status,
        filters.userId,
        filters.serviceId,
      ),
    [
      filters.page,
      filters.limit,
      filters.status,
      filters.userId,
      filters.serviceId,
    ],
  );

  // Use useAppQuery
  const queryResult = useAppQuery<AdminOrderListResponse, Error>({
    queryKey,
    endpoint,
    options: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
      enabled: true, // Always enabled since we have default values
    },
  });

  // Update filters helper
  const setFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFiltersState((prev) => {
      const updated = { ...prev, ...newFilters };

      // Reset to page 1 if page-related filters change
      if (
        newFilters.status !== undefined ||
        newFilters.userId !== undefined ||
        newFilters.serviceId !== undefined
      ) {
        updated.page = 1;
      }

      return updated;
    });
  }, []);

  // Individual setters
  const setPage = useCallback((page: number) => {
    setFiltersState((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFiltersState((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setStatus = useCallback((status: string) => {
    setFiltersState((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const setUserId = useCallback((userId: number | undefined) => {
    setFiltersState((prev) => ({ ...prev, userId, page: 1 }));
  }, []);

  const setServiceId = useCallback((serviceId: string | undefined) => {
    setFiltersState((prev) => ({ ...prev, serviceId, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, [defaultFilters]);

  return {
    orders: queryResult.data?.data ?? [],
    meta: queryResult.data?.meta ?? null,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    error: queryResult.error,
    refetch: queryResult.refetch,
    filters,
    setFilters,
    setPage,
    setLimit,
    setStatus,
    setUserId,
    setServiceId,
    resetFilters,
  };
}
