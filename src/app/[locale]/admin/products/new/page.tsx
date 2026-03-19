"use client";

import { ProductForm } from "@/components/admin/product-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function AdminAddProductPage() {
 const router = useRouter();

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
 <h1 className="text-4xl font-black uppercase tracking-tighter ">Launch New Product</h1>
 <p className="text-black/40 font-medium">Add a new botanical formulation to the clinical inventory.</p>
 </div>
 </div>
 
 <ProductForm onSuccess={() => router.push("/admin/products")} />
 </div>
 );
}