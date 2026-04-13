"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ShoppingBag } from "@/lib/icons";
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
import { MultiImageUploader } from "@/components/ui/multi-image-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { toast } from "sonner";
import { Product } from "@/types/api";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  categoryId: z.string().min(1, "Please select a category"),
  availability: z.boolean(),
  isHot: z.boolean(),
  isPromotion: z.boolean(),
  image: z.string().min(1, "Hero image is required"),
  images: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const isEditing = !!initialData;
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data || [];

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description || "",
      price: initialData?.price ? Number(initialData.price) : undefined,
      categoryId: initialData?.categoryId ?? "",
      availability: initialData?.availability !== false,
      isHot: initialData?.isHot ?? false,
      isPromotion: initialData?.isPromotion ?? false,
      image: initialData?.image ?? "",
      images: initialData?.images ?? [],
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data },
        {
          onSuccess: () => {
            toast.success("Product updated successfully");
            onSuccess?.();
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Product created successfully");
          form.reset();
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <Card className="border-black/5 rounded-xl overflow-hidden bg-white">
          <CardHeader className="p-10 border-b border-black/5">
            <div className="flex items-center gap-4 mb-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold tracking-tight text-black">
                {isEditing ? "Modify Formula" : "Launch Formula"}
              </CardTitle>
            </div>
            <CardDescription className="text-black/40 font-medium">
              Define botanical specs and pricing for the medical storefront.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 space-y-10">
            {/* Visual Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black/40 font-bold uppercase tracking-wider text-[10px]">
                        Hero Image
                      </FormLabel>
                      <FormControl>
                        <ImageUploader
                          defaultValue={field.value}
                          onUploadSuccess={field.onChange}
                          className="rounded-xl border-dashed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Info Section */}
              <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black/40 font-bold uppercase tracking-wider text-[10px]">
                          Product Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="E.g. Papaya Enzyme"
                            {...field}
                            className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all font-bold"
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
                        <FormLabel className="text-black/40 font-bold uppercase tracking-wider text-[10px]">
                          Unique Handle
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="papaya-enzyme-extract"
                            {...field}
                            className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all font-mono text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black/40 font-bold uppercase tracking-wider text-[10px]">
                          Unit Price (USD)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-black/20">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl pl-12 py-6 h-auto transition-all font-bold"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black/40 font-bold uppercase tracking-wider text-[10px]">
                          Classification
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-black/[0.02] border-black/10 focus:border-black rounded-xl py-6 h-auto transition-all font-bold">
                              <SelectValue placeholder="Select classification..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-black/5">
                            {categories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id}
                                className="rounded-lg py-3 font-medium"
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/40 font-bold uppercase tracking-wider text-[10px]">
                    Full Formulation Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed pharmacological and herbal properties..."
                      className="min-h-[160px] bg-black/[0.02] border-black/10 focus:border-black rounded-xl p-6 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-6 bg-black/[0.02] rounded-xl border border-black/5">
                    <div className="space-y-1 pr-2">
                      <FormLabel className="font-bold text-black text-sm">
                        In Stock
                      </FormLabel>
                      <FormDescription className="text-[10px]">
                        Ready for dispatch.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 rounded-md border-black/20"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isHot"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-6 bg-orange-50/50 rounded-xl border border-orange-100">
                    <div className="space-y-1 pr-2">
                      <FormLabel className="font-bold text-orange-900 text-sm">
                        Hot Badge
                      </FormLabel>
                      <FormDescription className="text-[10px] text-orange-700/50">
                        Trends filter.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 rounded-md border-orange-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPromotion"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-6 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div className="space-y-1 pr-2">
                      <FormLabel className="font-bold text-emerald-900 text-sm">
                        Promotion
                      </FormLabel>
                      <FormDescription className="text-[10px] text-emerald-700/50">
                        Active offer.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 rounded-md border-emerald-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black/40 font-bold uppercase tracking-wider text-[10px]">
                    Product Gallery
                  </FormLabel>
                  <FormControl>
                    <MultiImageUploader
                      defaultValue={field.value}
                      onChange={field.onChange}
                      category="image"
                      className="mt-4"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-black/20 mt-2">
                    Add up to 5 additional clinical angles for this formula.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="bg-black/[0.02] p-10 flex justify-end gap-6 border-t border-black/5">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-black/10 hover:bg-black/5 px-8 h-12 transition-all font-bold text-xs"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-12 h-12 font-bold transition-all active:scale-95 text-xs"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Save Updates" : "Publish to Store"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
