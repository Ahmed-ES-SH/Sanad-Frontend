import { instance } from "@/lib/axios";

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  description: string;
  userId?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentId: string;
  stripePaymentIntentId: string;
}

export const paymentsApi = {
  createPaymentIntent: (data: CreatePaymentIntentParams) =>
    instance.post<CreatePaymentIntentResponse>(
      "/api/payments/create-intent",
      data,
    ),
};
