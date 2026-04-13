"use client";

import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";

export function useOrders(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => OrderService.list(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getById(id),
    enabled: !!id,
  });
}
