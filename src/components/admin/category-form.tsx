"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-category";
import { toast } from "sonner";
import { Category } from "@/types/api";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  image: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            toast.success("Category updated");
            onSuccess?.();
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Category created");
          form.reset();
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-black/5 rounded-3xl overflow-hidden">
          <CardHeader className="bg-black text-white p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tight">
              {isEditing ? "Edit Category" : "Build New Category"}
            </CardTitle>
            <CardDescription className="text-white/40 font-medium">
              Clinical classification of botanical products.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g. Herbal Extracts"
                          {...field}
                          className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all"
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
                      <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                        Slug identifier
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="herbal-extracts"
                          {...field}
                          className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all font-mono text-xs"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] uppercase font-bold text-black/20">
                        Unique URL address key.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                      Catalog image
                    </FormLabel>
                    <FormControl>
                      <ImageUploader
                        defaultValue={field.value}
                        onUploadSuccess={field.onChange}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/60 font-bold uppercase tracking-widest text-[10px]">
                    Medical details
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Botanical properties and clinical focus..."
                      className="min-h-[120px] bg-black/[0.02] border-black/10 focus:border-black rounded-lg p-4 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="bg-black/[0.02] p-8 flex justify-between gap-4 border-t border-black/5">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-black/10 hover:bg-black hover:text-white px-8 h-12 transition-all font-bold"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-black hover:bg-black/90 text-white rounded-xl px-12 h-12 font-black transition-all group active:scale-95"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Finish Update" : "Publish Category"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
