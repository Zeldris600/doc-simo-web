"use client";

import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";
import { useSession } from "next-auth/react";

export function useOrders(params?: { page?: number; limit?: number }) {
  const { status } = useSession();

  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => OrderService.list(params),
    enabled: status === "authenticated",
  });
}

export function useOrder(id: string) {
  const { status } = useSession();

  return useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getById(id),
    enabled: !!id && status === "authenticated",
  });
}
