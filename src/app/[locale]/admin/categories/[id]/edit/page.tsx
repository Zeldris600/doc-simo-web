"use client";

import { CategoryForm } from "@/components/admin/category-form";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useCategory } from "@/hooks/use-category";

export default function AdminEditCategoryPage() {
 const router = useRouter();
 const params = useParams();
 const id = params.id as string;
 const { data: categoryResponse, isLoading } = useCategory(id);
 const category = categoryResponse?.data;

 if (isLoading) {
 return (
 <div className="flex h-[400px] items-center justify-center">
 <Loader2 className="h-12 w-12 animate-spin text-black/20" />
 </div>
 );
 }

 if (!category) {
 return (
 <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
 <p className="text-xl font-black uppercase text-black/20 ">Category classification not found.</p>
 <Button 
 variant="outline" 
 className="rounded-lg border-black/10 hover:bg-black hover:text-white transition-all font-black text-xs uppercase"
 onClick={() => router.back()}
 >
 Return to hierarchy
 </Button>
 </div>
 );
 }

 return (
 <div className="container max-w-4xl mx-auto py-10 space-y-8">
 <div className="flex items-center gap-4">
 <Button 
 variant="outline" 
 size="icon" 
 className="rounded-full h-12 w-12 border-black/10 hover:bg-black hover:text-white transition-all "
 onClick={() => router.back()}
 >
 <ChevronLeft className="h-6 w-6" />
 </Button>
 <div>
 <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Edit Taxonomy</h1>
 <p className="text-black/40 font-medium">Refining details for <span className="text-black font-bold uppercase">{category.name}</span>.</p>
 </div>
 </div>
 
 <CategoryForm initialData={category} onSuccess={() => router.push("/admin/categories")} />
 </div>
 );
}
