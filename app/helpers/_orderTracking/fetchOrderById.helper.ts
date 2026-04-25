/**
 * Fetches a single order by ID from the user endpoint
 * Endpoint: GET /orders/:id
 * Uses authenticated user credentials (not admin)
 */

import type { OrderDetails } from "@/app/_components/_orderTracking/OrderTrackingTable.types";
import { protectedRequest } from "@/lib/api-client";

const BASE_URL = process.env.BACKEND_URL || "https://sanad-backend.vercel.app";

/**
 * Fetches order details for the authenticated user
 * @param orderId - The order UUID
 * @returns Order details or throws error
 */
export async function fetchOrderById(orderId: string): Promise<OrderDetails> {
  const endpoint = `/api/orders/${orderId}`;

  const response = await protectedRequest(endpoint, "GET");

  return response as OrderDetails;
}

/**
 * Checks if an error indicates order not found
 */
export function isOrderNotFoundError(error: unknown): boolean {
  if (error && typeof error === "object" && "statusCode" in error) {
    return (error as any).statusCode === 404;
  }
  return false;
}

/**
 * Checks if an error indicates access denied
 */
export function isAccessDeniedError(error: unknown): boolean {
  if (error && typeof error === "object" && "statusCode" in error) {
    return (error as any).statusCode === 403;
  }
  return false;
}
