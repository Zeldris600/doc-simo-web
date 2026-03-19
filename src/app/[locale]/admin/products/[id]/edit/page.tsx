"use client";

import { ProductForm } from "@/components/admin/product-form";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useProduct } from "@/hooks/use-product";

export default function AdminEditProductPage() {
 const router = useRouter();
 const params = useParams();
 const id = params.id as string;
 const { data: product, isLoading } = useProduct(id);

 if (isLoading) {
 return (
 <div className="flex h-[400px] items-center justify-center">
 <Loader2 className="h-12 w-12 animate-spin text-black/20" />
 </div>
 );
 }

 if (!product) {
 return (
 <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
 <p className="text-xl font-black uppercase text-black/20 ">Molecular structure not found.</p>
 <Button 
 variant="outline" 
 className="rounded-lg border-black/10 hover:bg-black hover:text-white transition-all font-black text-xs uppercase"
 onClick={() => router.back()}
 >
 Return to directory
 </Button>
 </div>
 );
 }

 return (
 <div className="container max-w-5xl mx-auto py-10 space-y-8">
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
 <h1 className="text-4xl font-black uppercase tracking-tighter ">Edit Formulation</h1>
 <p className="text-black/40 font-medium">Updating botanical specs for <span className="text-black font-bold uppercase">{product.name}</span>.</p>
 </div>
 </div>
 
 <ProductForm initialData={product} onSuccess={() => router.push("/admin/products")} />
 </div>
 );
}
