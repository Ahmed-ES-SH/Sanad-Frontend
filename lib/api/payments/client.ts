import { instance } from "@/lib/axios";
import { PAYMENTS_ENDPOINTS } from "@/app/constants/endpoints";
import axios from "axios";

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

export interface PaymentStatusResponse {
  id: string;
  status: "pending" | "succeeded" | "failed" | "partially_refunded" | "refunded";
}

export const paymentsApi = {
  createPaymentIntent: async (data: CreatePaymentIntentParams) => {
    try {
      return await instance.post<CreatePaymentIntentResponse>(
        PAYMENTS_ENDPOINTS.CREATE_INTENT,
        data,
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return instance.post<CreatePaymentIntentResponse>(
          "/api/payments/create-intent",
          data,
        );
      }
      throw error;
    }
  },
  getPaymentById: async (paymentId: string) => {
    try {
      return await instance.get<PaymentStatusResponse>(
        PAYMENTS_ENDPOINTS.GET_BY_ID(paymentId),
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return instance.get<PaymentStatusResponse>(`/api/payments/${paymentId}`);
      }
      throw error;
    }
  },
};
