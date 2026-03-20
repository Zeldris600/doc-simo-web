import { StandardResponse } from "../types/api";
import { api } from "./api";

export interface InitiatePaymentDto {
  redirectUrl: string;
  email: string;
}

export interface InitiatePaymentResponse {
  link: string;
  transId: string;
  dateInitiated?: string;
  message?: string;
}

export const PaymentService = {
  initiate: async (orderId: string, data: InitiatePaymentDto) => {
    const response = await api.post<StandardResponse<InitiatePaymentResponse>>(`/payments/orders/${orderId}/initiate`, data);
    return response.data.data;
  },
};
