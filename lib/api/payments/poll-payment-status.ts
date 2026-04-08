import type { PaymentStatus, PaymentResponseDto } from "@/lib/types/payments";
import { getPaymentById } from "@/lib/api/payments";

export type PaymentStatusCallback = (status: PaymentStatus) => void;

export interface PollPaymentStatusOptions {
  /** Payment ID to poll */
  paymentId: string;
  /** Callback when status changes */
  onStatusChange: PaymentStatusCallback;
  /** Maximum number of polling attempts (default: 10) */
  maxAttempts?: number;
  /** Interval between polling attempts in ms (default: 2000) */
  intervalMs?: number;
  /** Callback when polling fails */
  onError?: (error: Error) => void;
  /** Callback when polling times out */
  onTimeout?: () => void;
}

/**
 * Poll for payment status updates after initiating payment.
 * Since status changes are webhook-driven, polling is needed to detect async updates.
 * 
 * @returns Cleanup function to stop polling
 */
export function pollPaymentStatus({
  paymentId,
  onStatusChange,
  maxAttempts = 10,
  intervalMs = 2000,
  onError,
  onTimeout,
}: PollPaymentStatusOptions): () => void {
  let attempts = 0;
  let isCancelled = false;

  const interval = setInterval(async () => {
    if (isCancelled) {
      clearInterval(interval);
      return;
    }

    attempts++;

    try {
      const payment = await getPaymentById(paymentId);
      const { status } = payment;

      onStatusChange(status);

      // Stop polling if status is no longer pending
      if (status !== "pending") {
        clearInterval(interval);
      }
    } catch (error) {
      // Log error but continue polling
      if (onError && error instanceof Error) {
        onError(error);
      }
    }

    // Handle timeout
    if (attempts >= maxAttempts) {
      clearInterval(interval);
      if (onTimeout) {
        onTimeout();
      }
      // Consider timeout as failure
      onStatusChange("failed");
    }
  }, intervalMs);

  // Return cleanup function
  return () => {
    isCancelled = true;
    clearInterval(interval);
  };
}

/**
 * Check if payment status terminal (not pending)
 */
export function isPaymentStatusTerminal(status: PaymentStatus): boolean {
  return status === "succeeded" || status === "failed" || status === "refunded";
}

/**
 * Get user-friendly message for payment status
 */
export function getPaymentStatusMessage(status: PaymentStatus): string {
  switch (status) {
    case "pending":
      return "Payment is being processed...";
    case "succeeded":
      return "Payment completed successfully!";
    case "failed":
      return "Payment failed. Please try again.";
    case "refunded":
      return "Payment has been refunded.";
    default:
      return "Unknown payment status";
  }
}
