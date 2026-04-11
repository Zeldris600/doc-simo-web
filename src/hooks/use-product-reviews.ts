"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { ProductReviewService } from "@/services/product-review.service";
import {
  ApiError,
  CreateProductReviewDto,
  ProductReview,
  UpdateProductReviewDto,
} from "@/types/api";

export function useReviewStats(productId: string) {
  return useQuery({
    queryKey: ["product-reviews-stats", productId],
    queryFn: () => ProductReviewService.stats(productId),
    enabled: !!productId,
  });
}

export function useProductReviews(
  productId: string,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["product-reviews", productId, params?.page, params?.limit],
    queryFn: () => ProductReviewService.list(productId, params),
    enabled: !!productId,
  });
}

export function useCreateProductReview(
  productId: string,
  opt?: UseMutationOptions<ProductReview, ApiError, CreateProductReviewDto>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductReviewDto) =>
      ProductReviewService.create(productId, data),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-reviews-stats", productId],
      });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}

export function useUpdateProductReview(
  opt?: UseMutationOptions<
    ProductReview,
    ApiError,
    { reviewId: string; data: UpdateProductReviewDto }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, data }) =>
      ProductReviewService.update(reviewId, data),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", data.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-reviews-stats", data.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["product", data.productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}

export function useDeleteProductReview(
  opt?: UseMutationOptions<
    { id: string },
    ApiError,
    { reviewId: string; productId: string }
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOpt } = opt ?? {};
  return useMutation({
    ...restOpt,
    mutationFn: ({ reviewId }: { reviewId: string; productId: string }) =>
      ProductReviewService.delete(reviewId),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-reviews-stats", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
