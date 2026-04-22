import { paymentsApi } from "@/lib/api/payments/client";
import type { CartItem } from "@/app/context/CartContext";

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

  const response = await paymentsApi.createPaymentIntent({
    amount: total,
    currency: "usd",
    description: description.substring(0, 255),
  });

  return {
    clientSecret: response.data.clientSecret,
    paymentId: response.data.paymentId,
  };
};