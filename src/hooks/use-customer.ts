"use client";

import { useQuery, useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { CustomerService } from "@/services/customer.service";
import { CustomerProfile, UpdateCustomerProfileDto } from "@/types/api";

export function useCustomerMe() {
 return useQuery({
 queryKey: ["customer", "me"],
 queryFn: CustomerService.getMe,
 });
}

export function useUpdateCustomerMe(opt?: UseMutationOptions<CustomerProfile, Error, UpdateCustomerProfileDto>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (data: UpdateCustomerProfileDto) => CustomerService.updateMe(data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["customer", "me"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function uselistCustomers(params?: { page?: number; limit?: number }) {
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
