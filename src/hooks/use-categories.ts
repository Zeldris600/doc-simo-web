import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService, CreateCategoryDto } from "@/services/category.service";

export const categoryKeys = {
 all: ["categories"] as const,
 detail: (id: string) => [...categoryKeys.all, id] as const,
};

export const useCategories = () => {
 return useQuery({
 queryKey: categoryKeys.all,
 queryFn: CategoryService.getAll,
 });
};

export const useCategory = (id: string) => {
 return useQuery({
 queryKey: categoryKeys.detail(id),
 queryFn: () => CategoryService.getById(id),
 enabled: !!id,
 });
};

export const useCreateCategory = () => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (data: CreateCategoryDto) => CategoryService.create(data),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: categoryKeys.all });
 },
 });
};

export const useUpdateCategory = () => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryDto> }) =>
 CategoryService.update(id, data),
 onSuccess: (_, variables) => {
 queryClient.invalidateQueries({ queryKey: categoryKeys.all });
 queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
 },
 });
};

export const useDeleteCategory = () => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (id: string) => CategoryService.delete(id),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: categoryKeys.all });
 },
 });
};
