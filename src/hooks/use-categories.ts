import { useQuery, useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { CategoryService, CreateCategoryDto } from "@/services/category.service";
import { Category, ApiError } from "@/types/api";

export const categoryKeys = {
 all: ["categories"] as const,
 detail: (id: string) => [...categoryKeys.all, id] as const,
};

export const useCategories = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [...categoryKeys.all, params],
    queryFn: () => CategoryService.getAll(params),
  });
};

export const useCategory = (id: string) => {
 return useQuery({
 queryKey: categoryKeys.detail(id),
 queryFn: () => CategoryService.getById(id),
 enabled: !!id,
 });
};

export const useCreateCategory = (opt?: UseMutationOptions<Category, ApiError, CreateCategoryDto>) => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (data: CreateCategoryDto) => CategoryService.create(data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: categoryKeys.all });
 opt?.onSuccess?.(data, ...rest);
 },
 });
};

export const useUpdateCategory = (opt?: UseMutationOptions<Category, ApiError, { id: string; data: Partial<CreateCategoryDto> }>) => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryDto> }) =>
 CategoryService.update(id, data),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: categoryKeys.all });
 queryClient.invalidateQueries({ queryKey: categoryKeys.detail(rest[0].id) }); // variables is the first item in rest
 opt?.onSuccess?.(data, ...rest);
 },
 });
};

export const useDeleteCategory = (opt?: UseMutationOptions<void, ApiError, string>) => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (id: string) => CategoryService.delete(id),
 ...opt,
 onSuccess: (data, ...rest) => {
 queryClient.invalidateQueries({ queryKey: categoryKeys.all });
 opt?.onSuccess?.(data, ...rest);
 },
 });
};
