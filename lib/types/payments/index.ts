/**
 * Payment Status Enum
 */
export type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "partially_refunded"
  | "refunded";

/**
 * Request DTO for creating a payment intent
 */
export interface CreatePaymentIntentDto {
  amount: number; // Required. Min: 0.50. Max 2 decimal places.
  currency?: string; // Optional. Default: "usd". Max 10 chars.
  description: string; // Required.
  userId?: string; // Optional. UUID format.
}

/**
 * Response DTO from creating a payment intent
 */
export interface CreatePaymentIntentResponseDto {
  clientSecret: string; // Stripe client secret for use with Stripe.js
  paymentId: string; // Internal payment record ID
  stripePaymentIntentId: string; // Stripe PaymentIntent ID
}

/**
 * Payment record response DTO
 */
export interface PaymentResponseDto {
  id: string;
  userId: string | null;
  stripePaymentIntentId: string;
  stripeCustomerId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string; // ISO 8601 date
  updatedAt: string; // ISO 8601 date
}

/**
 * Refund response DTO
 */
export interface RefundResponseDto {
  id: string;
  status: PaymentStatus;
  message: string;
}

/**
 * Pagination meta information
 */
export interface PaginatedResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated payments response
 */
export interface PaginatedPaymentsResponse {
  data: PaymentResponseDto[];
  meta: PaginatedResponseMeta;
}

/**
 * Filter DTO for listing payments
 */
export interface PaymentFilterDto {
  page?: number; // Default: 1. Min: 1
  limit?: number; // Default: 10. Min: 1, Max: 100
  sortBy?: string; // Default: "createdAt"
  order?: "ASC" | "DESC"; // Default: "DESC"
  status?: PaymentStatus;
  userId?: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

/**
 * Payment creation data (simplified for frontend use)
 */
export interface PaymentCreateData {
  amount: number;
  currency?: string;
  description: string;
  userId?: string;
}
