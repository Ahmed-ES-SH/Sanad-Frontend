"use server";

import { PAYMENTS_ENDPOINTS } from "@/app/constants/endpoints";
import { protectedRequest, ApiError } from "@/lib/api-client";
import {
  PaginatedPaymentsResponse,
  PaymentFilterDto,
} from "@/lib/types/payments";

export async function getInitialPayments(
  params: PaymentFilterDto = {}
): Promise<{ success: boolean; data?: PaginatedPaymentsResponse; message?: string }> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set("page", String(params.page));
    if (params.limit) queryParams.set("limit", String(params.limit));
    if (params.status) queryParams.set("status", params.status);
    if (params.userId) queryParams.set("userId", params.userId);
    if (params.startDate) queryParams.set("startDate", params.startDate);
    if (params.endDate) queryParams.set("endDate", params.endDate);
    if (params.order) queryParams.set("order", params.order);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);

    const queryString = queryParams.toString();
    const endpoint = `${PAYMENTS_ENDPOINTS.ADMIN_LIST}${queryString ? `?${queryString}` : ""}`;

    const response = await protectedRequest<PaginatedPaymentsResponse>(
      endpoint,
      "GET"
    );

    return {
      success: true,
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
      message: "Failed to fetch payments. Please try again.",
    };
  }
}

export async function refundPayment(
  paymentId: string
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await protectedRequest(
      PAYMENTS_ENDPOINTS.ADMIN_REFUND(paymentId),
      "POST"
    );

    return {
      success: true,
      message: "Payment refunded successfully",
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
      message: "Failed to refund payment. Please try again.",
    };
  }
}
