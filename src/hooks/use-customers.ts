"use client";

import { useQuery } from "@tanstack/react-query";
import { CustomerService } from "@/services/customer.service";

export function useCustomers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => CustomerService.list(params),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => CustomerService.getById(id),
    enabled: !!id,
  });
}
