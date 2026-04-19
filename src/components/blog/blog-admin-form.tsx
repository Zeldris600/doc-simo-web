"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBlogPost, useUpdateBlogPost } from "@/hooks/use-blog";
import { useUploadMedia } from "@/hooks/use-media";
import type { BlogPostWithAuthor } from "@/types/blog";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Loader2 } from "@/lib/icons";

const schema = z.object({
  slug: z
    .string()
    .min(2, "Slug too short")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers, hyphens only"),
  title: z.string().min(1).max(255),
  excerpt: z.string().max(500).optional(),
  body: z.string().min(1, "Body is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  kind: z.enum(["ARTICLE", "VIDEO", "MIXED"]),
  tags: z.string(),
  coverImageUrl: z.string().optional(),
  coverImagePublicId: z.string().optional(),
  embedUrl: z.union([z.literal(""), z.string().url()]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type BlogAdminFormValues = z.infer<typeof schema>;

function tagsToString(tags: string[]) {
  return tags?.length ? tags.join(", ") : "";
}

export function BlogAdminForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: BlogPostWithAuthor | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const createMut = useCreateBlogPost();
  const updateMut = useUpdateBlogPost();
  const uploadMut = useUploadMedia();

  const form = useForm<BlogAdminFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      body: "",
      status: "DRAFT",
      kind: "ARTICLE",
      tags: "",
      coverImageUrl: "",
      coverImagePublicId: "",
      embedUrl: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  useEffect(() => {
    if (!initial) return;
    form.reset({
      slug: initial.slug,
      title: initial.title,
      excerpt: initial.excerpt ?? "",
      body: initial.body,
      status: initial.status,
      kind: initial.kind,
      tags: tagsToString(initial.tags),
      coverImageUrl: initial.coverImageUrl ?? "",
      coverImagePublicId: initial.coverImagePublicId ?? "",
      embedUrl: initial.embedUrl ?? "",
      seoTitle: initial.seoTitle ?? "",
      seoDescription: initial.seoDescription ?? "",
    });
  }, [initial, form]);

  const parseTags = (raw: string) =>
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const onSubmit = (values: BlogAdminFormValues) => {
    const payload = {
      slug: values.slug,
      title: values.title,
      body: values.body,
      excerpt: values.excerpt || null,
      status: values.status,
      kind: values.kind,
      tags: parseTags(values.tags),
      coverImageUrl: values.coverImageUrl || null,
      coverImagePublicId: values.coverImagePublicId || null,
      embedUrl: values.embedUrl || null,
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
    };

    if (mode === "create") {
      createMut.mutate(payload, {
        onSuccess: () => {
          toast.success("Post created");
          router.push("/admin/blog");
        },
        onError: (e) => {
          const msg = e.response?.data?.message ?? e.message;
          toast.error(typeof msg === "string" ? msg : "Could not create post");
        },
      });
      return;
    }

    if (!initial?.id) return;
    updateMut.mutate(
      { id: initial.id, data: payload },
      {
        onSuccess: () => {
          toast.success("Post updated");
          router.push("/admin/blog");
        },
        onError: (e) => {
          const msg = e.response?.data?.message ?? e.message;
          toast.error(typeof msg === "string" ? msg : "Could not update post");
        },
      },
    );
  };

  const pending = createMut.isPending || updateMut.isPending;

  const onCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMut.mutate(
      { file },
      {
        onSuccess: (res) => {
          form.setValue("coverImageUrl", res.url);
          if (res.publicId) form.setValue("coverImagePublicId", res.publicId);
          toast.success("Cover uploaded");
        },
        onError: () => toast.error("Upload failed"),
      },
    );
    e.target.value = "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="my-post-url" {...field} disabled={mode === "edit"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt (plain text)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body (HTML)</FormLabel>
              <FormControl>
                <Textarea rows={14} className="font-mono text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kind"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kind</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ARTICLE">Article</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="MIXED">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="guides, tea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Cover image</FormLabel>
          <div className="flex flex-wrap items-end gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onCoverFile}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploadMut.isPending}
            >
              {uploadMut.isPending ? "Uploading…" : "Upload cover"}
            </Button>
            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem className="flex-1 min-w-[200px]">
                  <FormControl>
                    <Input placeholder="Or paste image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="coverImagePublicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs">
                  Cover public ID (optional, from upload)
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="embedUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embed URL (YouTube / Vimeo page)</FormLabel>
              <FormControl>
                <Input placeholder="https://…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="seoTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seoDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === "create" ? "Create post" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
