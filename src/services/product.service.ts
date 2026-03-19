import { api } from "./api";
import { PaginatedResponse, Product, StandardResponse } from "../types/api";

export interface ProductQuery {
  category?: string;
  search?: string;
  isHot?: boolean;
  isPromotion?: boolean;
  availability?: "true" | "false";
  page?: number;
  limit?: number;
}

export const ProductService = {
  list: async (params?: ProductQuery) => {
    const response = await api.get<StandardResponse<PaginatedResponse<Product>>>("/products", { params });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<StandardResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Product>) => {
    const response = await api.post<StandardResponse<Product>>("/products", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Product>) => {
    const response = await api.patch<StandardResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<StandardResponse<void>>(`/products/${id}`);
    return response.data.data;
  },
};
