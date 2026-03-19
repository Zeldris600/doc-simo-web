import { api } from "./api";
import { Category, PaginatedResponse, StandardResponse } from "../types/api";

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export const CategoryService = {
 getAll: async (params?: { page?: number; limit?: number }) => {
 const response = await api.get<StandardResponse<PaginatedResponse<Category>>>("/product-categories", { params });
 return response.data.data;
 },

 getById: async (id: string) => {
 const response = await api.get<StandardResponse<Category>>(`/product-categories/${id}`);
 return response.data.data;
 },

 create: async (data: CreateCategoryDto) => {
 const response = await api.post<StandardResponse<Category>>("/product-categories", data);
 return response.data.data;
 },

 update: async (id: string, data: Partial<CreateCategoryDto>) => {
 const response = await api.patch<StandardResponse<Category>>(`/product-categories/${id}`, data);
 return response.data.data;
 },

 delete: async (id: string) => {
 const response = await api.delete<StandardResponse<void>>(`/product-categories/${id}`);
 return response.data.data;
 },
};
