import { api } from "./api";
import {
  CreateProductReviewDto,
  PaginatedResponse,
  ProductReview,
  ProductReviewStats,
  StandardResponse,
  UpdateProductReviewDto,
} from "@/types/api";

export const ProductReviewService = {
  stats: async (productId: string) => {
    const response = await api.get<StandardResponse<ProductReviewStats>>(
      `/products/${productId}/reviews/stats`,
    );
    return response.data.data;
  },

  list: async (
    productId: string,
    params?: { page?: number; limit?: number },
  ) => {
    const response = await api.get<
      StandardResponse<PaginatedResponse<ProductReview>>
    >(`/products/${productId}/reviews`, { params });
    return response.data.data;
  },

  create: async (productId: string, data: CreateProductReviewDto) => {
    const response = await api.post<StandardResponse<ProductReview>>(
      `/products/${productId}/reviews`,
      data,
    );
    return response.data.data;
  },

  update: async (reviewId: string, data: UpdateProductReviewDto) => {
    const response = await api.patch<StandardResponse<ProductReview>>(
      `/product-reviews/${reviewId}`,
      data,
    );
    return response.data.data;
  },

  delete: async (reviewId: string) => {
    const response = await api.delete<StandardResponse<{ id: string }>>(
      `/product-reviews/${reviewId}`,
    );
    return response.data.data;
  },
};
