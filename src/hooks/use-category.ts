"use client";

import { useQuery, useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { CategoryService, CreateCategoryDto } from "@/services/category.service";
import { Category, ApiError } from "@/types/api";

export function useCategories(params?: { page?: number; limit?: number }) {
 return useQuery({
 queryKey: ["categories", params],
 queryFn: () => CategoryService.getAll(params),
 });
}

export function useCategory(id: string) {
 return useQuery({
 queryKey: ["category", id],
 queryFn: () => CategoryService.getById(id),
 enabled: !!id,
 });
}

export function useCreateCategory<TError = ApiError>(opt?: UseMutationOptions<Category, TError, CreateCategoryDto>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (data: CreateCategoryDto) => CategoryService.create(data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["categories"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function useUpdateCategory<TError = ApiError>(opt?: UseMutationOptions<Category, TError, { id: string; data: Partial<CreateCategoryDto> }>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryDto> }) => CategoryService.update(id, data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["categories"] });
 queryClient.invalidateQueries({ queryKey: ["category", data.id || ""] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function useDeleteCategory<TError = ApiError>(opt?: UseMutationOptions<void, TError, string>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (id: string) => CategoryService.delete(id),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["categories"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}
