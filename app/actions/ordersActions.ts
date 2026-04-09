'use server';

import { revalidateTag } from 'next/cache';
import { ORDERS_ENDPOINTS } from '@/app/constants/endpoints';
import { protectedRequest, ApiError } from '@/lib/api-client';
import {
  Order,
  OrderListResponse,
  AdminOrderListResponse,
  AdminOrder,
  PaymentIntentResponse,
  AddOrderUpdateResponse,
  UpdateOrderStatusResponse,
  OrderQueryParams,
  AdminOrderQueryParams,
  OrderActionResult,
} from '@/app/types/order';

// Cache tags for revalidation
const ORDER_CACHE_TAG = 'orders';

// ============================================================================
// USER-FACING ORDER ACTIONS
// ============================================================================

/**
 * Creates a new order for the authenticated user.
 * POST /api/orders?serviceId={uuid}&notes={string}
 */
export async function createOrder(
  serviceId: string,
  notes?: string
): Promise<OrderActionResult<Order>> {
  try {
    const response = await protectedRequest<Order>(
      ORDERS_ENDPOINTS.CREATE(serviceId, notes),
      'POST'
    );

    revalidateTag(ORDER_CACHE_TAG, 'default');

    return {
      success: true,
      message: 'Order created successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to create order. Please try again.',
    };
  }
}

/**
 * Lists the authenticated user's orders with pagination.
 * GET /api/orders?page=1&limit=10
 */
export async function getMyOrders(
  params: OrderQueryParams = {}
): Promise<OrderActionResult<OrderListResponse>> {
  try {
    const response = await protectedRequest<OrderListResponse>(
      ORDERS_ENDPOINTS.LIST(params.page, params.limit),
      'GET'
    );

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to fetch orders. Please try again.',
    };
  }
}

/**
 * Gets full details of a single order.
 * GET /api/orders/:id
 */
export async function getOrderById(
  id: string
): Promise<OrderActionResult<Order>> {
  try {
    const response = await protectedRequest<Order>(
      ORDERS_ENDPOINTS.GET(id),
      'GET'
    );

    return {
      success: true,
      message: 'Order fetched successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to fetch order. Please try again.',
    };
  }
}

/**
 * Initiates Stripe payment for a pending order.
 * POST /api/orders/:id/pay
 */
export async function initiatePayment(
  orderId: string
): Promise<OrderActionResult<PaymentIntentResponse>> {
  try {
    const response = await protectedRequest<PaymentIntentResponse>(
      ORDERS_ENDPOINTS.PAY(orderId),
      'POST'
    );

    return {
      success: true,
      message: 'Payment initiated successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to initiate payment. Please try again.',
    };
  }
}

// ============================================================================
// ADMIN-FACING ORDER ACTIONS
// ============================================================================

/**
 * Lists all orders with optional filtering and pagination (Admin).
 * GET /api/admin/orders?page=1&limit=10&status=paid&userId=5&serviceId=abc123
 */
export async function getAllOrders(
  params: AdminOrderQueryParams = {}
): Promise<OrderActionResult<AdminOrderListResponse>> {
  try {
    const response = await protectedRequest<AdminOrderListResponse>(
      ORDERS_ENDPOINTS.ADMIN_LIST(
        params.page,
        params.limit,
        params.status,
        params.userId,
        params.serviceId
      ),
      'GET'
    );

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to fetch orders. Please try again.',
    };
  }
}

/**
 * Gets full order details including user, service, payment (Admin).
 * GET /api/admin/orders/:id
 */
export async function getAdminOrderById(
  id: string
): Promise<OrderActionResult<AdminOrder>> {
  try {
    const response = await protectedRequest<AdminOrder>(
      ORDERS_ENDPOINTS.ADMIN_GET(id),
      'GET'
    );

    return {
      success: true,
      message: 'Order fetched successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to fetch order. Please try again.',
    };
  }
}

/**
 * Updates the status of an order (Admin).
 * PATCH /api/admin/orders/:id/status
 */
export async function updateOrderStatus(
  id: string,
  status: string
): Promise<OrderActionResult<UpdateOrderStatusResponse>> {
  try {
    const response = await protectedRequest<UpdateOrderStatusResponse>(
      ORDERS_ENDPOINTS.ADMIN_UPDATE_STATUS(id),
      'PATCH',
      { status } as unknown as Record<string, unknown>
    );

    revalidateTag(ORDER_CACHE_TAG, 'default');

    return {
      success: true,
      message: 'Order status updated successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to update order status. Please try again.',
    };
  }
}

/**
 * Adds a custom message to the order's timeline (Admin).
 * POST /api/admin/orders/:id/updates
 */
export async function addOrderUpdate(
  id: string,
  content: string
): Promise<OrderActionResult<AddOrderUpdateResponse>> {
  try {
    const response = await protectedRequest<AddOrderUpdateResponse>(
      ORDERS_ENDPOINTS.ADMIN_ADD_UPDATE(id),
      'POST',
      { content } as unknown as Record<string, unknown>
    );

    revalidateTag(ORDER_CACHE_TAG, 'default');

    return {
      success: true,
      message: 'Update added successfully',
      data: response,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: 'Failed to add update. Please try again.',
    };
  }
}