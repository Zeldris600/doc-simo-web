"use client";

import { useQuery, useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { DiscountService } from "@/services/discount.service";
import { Discount, CreateDiscountDto, UpdateDiscountDto, ApiError } from "@/types/api";

export function useDiscounts(params?: { activeOnly?: "true" | "false"; page?: number; limit?: number }) {
 return useQuery({
 queryKey: ["discounts", params],
 queryFn: () => DiscountService.list(params),
 });
}

export function useDiscount(id: string) {
 return useQuery({
 queryKey: ["discount", id],
 queryFn: () => DiscountService.getById(id),
 enabled: !!id,
 });
}

export function useCreateDiscount(opt?: UseMutationOptions<Discount, ApiError, CreateDiscountDto>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (data: CreateDiscountDto) => DiscountService.create(data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["discounts"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function useUpdateDiscount(opt?: UseMutationOptions<Discount, ApiError, { id: string; data: UpdateDiscountDto }>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, data }: { id: string; data: UpdateDiscountDto }) => DiscountService.update(id, data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["discounts"] });
 queryClient.invalidateQueries({ queryKey: ["discount", data.id] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function useDeleteDiscount(opt?: UseMutationOptions<void, ApiError, string>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (id: string) => DiscountService.delete(id),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["discounts"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}
