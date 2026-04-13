"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
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
import { Loader2, ShoppingBag } from "@/lib/icons";

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

export default function AdminAddProductPage() {
 const router = useRouter();
 const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
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

 const onSubmit = (data: ProductFormValues) => {
 createProduct(data as unknown as Partial<Product>, {
 onSuccess: () => {
 router.push("/admin/products");
 },
 });
 };

 return (
 <div className="space-y-6 max-w-4xl px-4 py-8 mx-auto">
 <DashboardHeader
 title="Add Product"
 description="Create a new clinical herbal product for your store."
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
 onChange={(e) => {
 field.onChange(e);
 const currentSlug = form.getValues("slug");
 const val = e.target.value;
 const slugified = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
 if (!currentSlug || currentSlug === slugified.slice(0, -1)) {
 form.setValue("slug", slugified);
 }
 }}
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
 <Select onValueChange={field.onChange} defaultValue={field.value}>
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
 <Button type="submit" disabled={isCreating}>
 {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
 {isCreating ? "Saving..." : "Save Product"}
 </Button>
 </div>
 </form>
 </Form>
 </div>
 );
}