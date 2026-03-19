"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { useCategory, useUpdateCategory } from "@/hooks/use-category";
import { useEffect } from "react";

import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { CreateCategoryDto } from "@/services/category.service";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
  description: z.string().optional(),
  images: z.array(z.string()),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: category, isLoading: isLoadingCategory } = useCategory(id);
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        images: category.image ? [category.image] : [],
      });
    }
  }, [category, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    const data: Partial<CreateCategoryDto> = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      image: values.images?.[0], 
    };

    updateCategory({ id, data }, {
      onSuccess: () => {
        toast.success("Category updated successfully");
        router.push("/admin/categories");
      },
    });
  };

  if (isLoadingCategory) {
    return <div className="p-8 text-center text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">Loading Category...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl px-4 py-8 mx-auto">
      <DashboardHeader
        title="Edit Category"
        description="Update the therapeutic category details."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl border border-gray-100"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Digestive Health"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug URI</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. digestive-health" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of products in this category"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Image</FormLabel>
                <FormControl>
                  <div className="w-full max-w-md h-64 mt-2">
                    <ImageUploader 
                      label="Category Backdrop (1:1 or 16:9)"
                      defaultValue={field.value?.[0]} 
                      onUploadSuccess={(url) => field.onChange(url ? [url] : [])} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Upload exactly one high-quality image representing the
                  category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
