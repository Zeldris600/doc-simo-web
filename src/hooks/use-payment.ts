"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { PaymentService, InitiatePaymentDto, InitiatePaymentResponse } from "@/services/payment.service";
import { ApiError } from "@/types/api";

export function useInitiatePayment<TError = ApiError>(opt?: UseMutationOptions<InitiatePaymentResponse, TError, { orderId: string; data: InitiatePaymentDto }>) {
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: InitiatePaymentDto }) => PaymentService.initiate(orderId, data),
    ...opt,
  });
}
