"use client";

import { useQuery, useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { ProductService, ProductQuery } from "@/services/product.service";
import { Product } from "@/types/api";

export function useProducts(params?: ProductQuery) {
 return useQuery({
 queryKey: ["products", params],
 queryFn: () => ProductService.list(params),
 });
}

export function useProduct(id: string) {
 return useQuery({
 queryKey: ["product", id],
 queryFn: () => ProductService.getById(id),
 enabled: !!id,
 });
}

export function useCreateProduct(opt?: UseMutationOptions<Product, Error, Partial<Product>>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (data: Partial<Product>) => ProductService.create(data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["products"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function useUpdateProduct(opt?: UseMutationOptions<Product, Error, { id: string; data: Partial<Product> }>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => ProductService.update(id, data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["products"] });
 queryClient.invalidateQueries({ queryKey: ["product", data.id] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}

export function useDeleteProduct(opt?: UseMutationOptions<void, Error, string>) {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: (id: string) => ProductService.delete(id),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: ["products"] });
 opt?.onSuccess?.(data, ...rest);
 },
 });
}
