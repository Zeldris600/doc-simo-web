import { api } from "./api";
import type { StandardResponse } from "@/types/api";
import type {
  BlogPostListResponse,
  BlogPostWithAuthor,
  CreateBlogPostDto,
  UpdateBlogPostDto,
  BlogPostStatus,
  BlogPostKind,
} from "@/types/blog";

export type PublicBlogListParams = {
  page?: number;
  limit?: number;
  tag?: string;
  kind?: BlogPostKind;
};

export type AdminBlogListParams = PublicBlogListParams & {
  status?: BlogPostStatus;
};

export const BlogService = {
  listPublished: async (params?: PublicBlogListParams) => {
    const response = await api.get<StandardResponse<BlogPostListResponse>>(
      "/blog/posts",
      { params },
    );
    return response.data.data;
  },

  getPublishedBySlug: async (slug: string) => {
    const response = await api.get<StandardResponse<BlogPostWithAuthor>>(
      `/blog/posts/${encodeURIComponent(slug)}`,
    );
    return response.data.data;
  },

  listAdmin: async (params?: AdminBlogListParams) => {
    const response = await api.get<StandardResponse<BlogPostListResponse>>(
      "/blog/admin/posts",
      { params },
    );
    return response.data.data;
  },

  /** Resolves a post by id from an admin list page (API has no single GET-by-id in the handoff doc). */
  getAdminById: async (id: string, pageSize = 200) => {
    const first = await BlogService.listAdmin({ page: 1, limit: pageSize });
    let found = first.data.find((p) => p.id === id);
    if (found) return found;
    const pages = Math.ceil(first.total / pageSize);
    for (let page = 2; page <= pages; page++) {
      const chunk = await BlogService.listAdmin({ page, limit: pageSize });
      found = chunk.data.find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  },

  create: async (data: CreateBlogPostDto) => {
    const response = await api.post<StandardResponse<BlogPostWithAuthor>>(
      "/blog/posts",
      data,
    );
    return response.data.data;
  },

  update: async (id: string, data: UpdateBlogPostDto) => {
    const response = await api.patch<StandardResponse<BlogPostWithAuthor>>(
      `/blog/posts/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/blog/posts/${id}`);
  },
};
