import { protectedRequest } from "@/lib/api-client";
import { PAYMENTS_ENDPOINTS } from "@/app/constants/endpoints";
import type {
  CreatePaymentIntentDto,
  CreatePaymentIntentResponseDto,
  PaymentResponseDto,
  PaginatedPaymentsResponse,
  RefundResponseDto,
  PaymentFilterDto,
} from "@/lib/types/payments";

/**
 * Payments API Service
 * 
 * Provides functions for interacting with the Payments API.
 * All endpoints require authentication (Bearer token).
 */

/**
 * Create a payment intent with Stripe
 * @param data - Payment intent creation data
 * @returns Payment intent response with clientSecret
 */
export async function createPaymentIntent(
  data: CreatePaymentIntentDto
): Promise<CreatePaymentIntentResponseDto> {
  return protectedRequest<CreatePaymentIntentResponseDto>(
    PAYMENTS_ENDPOINTS.CREATE_INTENT,
    "POST",
    data as unknown as Record<string, unknown>
  );
}

/**
 * Get all payments (admin endpoint)
 * @param filters - Optional filters and pagination parameters
 * @returns Paginated list of payments
 */
export async function getPayments(
  filters?: PaymentFilterDto
): Promise<PaginatedPaymentsResponse> {
  return protectedRequest<PaginatedPaymentsResponse>(
    PAYMENTS_ENDPOINTS.ADMIN_LIST,
    "GET",
    filters as unknown as Record<string, unknown>
  );
}

/**
 * Get a single payment by ID (admin endpoint)
 * @param id - Payment UUID
 * @returns Payment details
 */
export async function getPaymentById(
  id: string
): Promise<PaymentResponseDto> {
  return protectedRequest<PaymentResponseDto>(
    PAYMENTS_ENDPOINTS.ADMIN_GET(id),
    "GET"
  );
}

/**
 * Get current user's payment status by ID
 * @param id - Payment UUID
 * @returns Payment details for the current authenticated user
 */
export async function getMyPaymentById(
  id: string
): Promise<PaymentResponseDto> {
  return protectedRequest<PaymentResponseDto>(
    PAYMENTS_ENDPOINTS.GET_BY_ID(id),
    "GET"
  );
}

/**
 * Refund a payment (admin endpoint)
 * @param id - Payment UUID
 * @returns Refund response
 */
export async function refundPayment(
  id: string
): Promise<RefundResponseDto> {
  return protectedRequest<RefundResponseDto>(
    PAYMENTS_ENDPOINTS.ADMIN_REFUND(id),
    "POST"
  );
}
