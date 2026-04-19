import type { PaginatedResponse } from "./api";

export type BlogPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type BlogPostKind = "ARTICLE" | "VIDEO" | "MIXED";

export interface BlogAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

export interface BlogGalleryItem {
  url: string;
  publicId?: string | null;
  mimeType?: string | null;
  thumbnailUrl?: string | null;
  thumbnailPublicId?: string | null;
}

export interface BlogPostWithAuthor {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  status: BlogPostStatus;
  kind: BlogPostKind;
  primaryVideoUrl: string | null;
  primaryVideoPublicId: string | null;
  embedUrl: string | null;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  gallery: BlogGalleryItem[] | null;
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  publishedAt: string | null;
  authorUserId: string;
  createdAt: string;
  updatedAt: string;
  author: BlogAuthor;
}

export type BlogPostListResponse = PaginatedResponse<BlogPostWithAuthor>;

export interface CreateBlogPostDto {
  slug: string;
  title: string;
  body: string;
  excerpt?: string | null;
  status?: BlogPostStatus;
  kind?: BlogPostKind;
  primaryVideoUrl?: string | null;
  primaryVideoPublicId?: string | null;
  embedUrl?: string | null;
  coverImageUrl?: string | null;
  coverImagePublicId?: string | null;
  gallery?: BlogGalleryItem[] | null;
  tags?: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
}

export type UpdateBlogPostDto = Partial<CreateBlogPostDto>;
