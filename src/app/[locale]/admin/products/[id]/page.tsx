"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { useEffect } from "react";
import { toast } from "sonner";
import DashboardHeader from "@/components/dashboard-header";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiImageUploader } from "@/components/ui/multi-image-uploader";
import { Category, Product } from "@/types/api";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.number().min(0, "Price must be a positive number"),
  inventoryLevel: z.number().min(0, "Inventory cannot be negative"),
  categoryId: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).min(1, "At least one product image is required"),
  active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminEditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data: product, isLoading: isLoadingProduct } = useProduct(id);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { data: categoriesResponse } = useCategories({ limit: 100 });
  const categories = categoriesResponse?.data || [];
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      inventoryLevel: 0,
      categoryId: "",
      images: [],
      active: true,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
        inventoryLevel: product.inventoryLevel || 0,
        categoryId: product.categoryId || "",
        images: product.images || [],
        active: product.active ?? true,
      });
    }
  }, [product, form]);

  const onSubmit = (data: ProductFormValues) => {
    updateProduct({ id, data: data as Partial<Product> }, {
      onSuccess: () => {
        toast.success("Product updated successfully");
        router.push("/admin/products");
      },
    });
  };

  if (isLoadingProduct) {
    return <div className="p-8 text-center text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">Loading Product...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl px-4 py-8 mx-auto">
      <DashboardHeader
        title="Edit Product"
        description="Update existing clinical herbal product details."
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-8 rounded-xl border border-gray-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Digestive Health Tea" 
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
                    <Input placeholder="e.g. digestive-health-tea" {...field} />
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
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-100 rounded-lg h-10">
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat: Category) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (XAF)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="5000" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inventoryLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="100" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Markdown Supported)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detailed description of the product" rows={6} {...field} />
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
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <MultiImageUploader
                    defaultValue={field.value}
                    onChange={(urls) => field.onChange(urls)}
                    category="image"
                    maxFiles={4}
                  />
                </FormControl>
                <FormDescription>Upload up to 4 high-quality product images.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isUpdating ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}