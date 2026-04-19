"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { BlogService, type AdminBlogListParams, type PublicBlogListParams } from "@/services/blog.service";
import type {
  BlogPostWithAuthor,
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from "@/types/blog";
import type { ApiError } from "@/types/api";

export function useBlogPosts(params?: PublicBlogListParams) {
  return useQuery({
    queryKey: ["blog-posts", params],
    queryFn: () => BlogService.listPublished(params),
  });
}

export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => BlogService.getPublishedBySlug(slug as string),
    enabled: !!slug,
  });
}

export function useAdminBlogPosts(params?: AdminBlogListParams) {
  return useQuery({
    queryKey: ["admin-blog-posts", params],
    queryFn: () => BlogService.listAdmin(params),
  });
}

export function useAdminBlogPost(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: () => BlogService.getAdminById(id as string),
    enabled: !!id,
  });
}

export function useCreateBlogPost(
  opt?: UseMutationOptions<BlogPostWithAuthor, ApiError, CreateBlogPostDto>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBlogPostDto) => BlogService.create(data),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}

export function useUpdateBlogPost(
  opt?: UseMutationOptions<
    BlogPostWithAuthor,
    ApiError,
    { id: string; data: UpdateBlogPostDto }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPostDto }) =>
      BlogService.update(id, data),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-post", data.id] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post", data.slug] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}

export function useDeleteBlogPost(
  opt?: UseMutationOptions<void, ApiError, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BlogService.delete(id),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}
