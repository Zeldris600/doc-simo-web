"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";
import {
  CreateOrderDto,
  Order,
  UpdateOrderStatusDto,
  ApiError,
} from "@/types/api";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";



export function useCreateOrder<TError extends ApiError = ApiError>(
  opt?: UseMutationOptions<Order, TError, CreateOrderDto>,
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => OrderService.create(data),
    ...opt,
    onSuccess: (order, ...rest) => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/orders/${order.id}`); // Push to success page
      opt?.onSuccess?.(order, ...rest);
    },
    onError: (error, ...rest) => {
      const message = error.response?.data?.message || "Failed to place order";
      toast.error(message);
      opt?.onError?.(error, ...rest);
    },
  });
}

export function useOrders(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => OrderService.list(params),
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ["orders", "me"],
    queryFn: () => OrderService.getMe(),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus<TError extends ApiError = ApiError>(
  opt?: UseMutationOptions<
    Order,
    TError,
    { id: string; data: UpdateOrderStatusDto }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => OrderService.updateStatus(id, data),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}
