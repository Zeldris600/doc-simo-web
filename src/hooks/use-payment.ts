"use client";

import { useMutation, useQuery, UseMutationOptions } from "@tanstack/react-query";
import {
  PaymentService,
  InitiatePaymentDto,
  InitiatePaymentResponse,
} from "@/services/payment.service";
import { ApiError } from "@/types/api";

export function useInitiatePayment<TError = ApiError>(
  opt?: UseMutationOptions<
    InitiatePaymentResponse,
    TError,
    { orderId: string; data: InitiatePaymentDto }
  >,
) {
  return useMutation({
    mutationFn: ({ orderId, data }) => PaymentService.initiate(orderId, data),
    ...opt,
  });
}

export function usePayments(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => PaymentService.list(params),
  });
}
