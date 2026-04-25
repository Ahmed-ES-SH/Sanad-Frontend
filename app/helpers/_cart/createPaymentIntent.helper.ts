import { paymentsApi } from "@/lib/api/payments/client";
import type { CartItem } from "@/app/context/CartContext";
import axios from "axios";

/**
 * Response from creating a payment intent.
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
}

/**
 * Creates a payment intent for checkout.
 */
export const createPaymentIntent = async (
  total: number,
  items: CartItem[],
): Promise<PaymentIntentResponse> => {
  const description = `Sanad Services: ${items.map((i) => i.title).join(", ")}`;

  let response;
  try {
    response = await paymentsApi.createPaymentIntent({
      amount: total,
      currency: "usd",
      description: description.substring(0, 255),
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        throw new Error("Invalid payment data. Please review your cart and try again.");
      }
      if (status === 401) {
        throw new Error("Your session has expired. Please sign in and try again.");
      }
      if (status === 502) {
        throw new Error("Payment gateway is temporarily unavailable. Please retry.");
      }
    }
    throw new Error("Unable to start payment. Please try again.");
  }

  return {
    clientSecret: response.data.clientSecret,
    paymentId: response.data.paymentId,
  };
};
