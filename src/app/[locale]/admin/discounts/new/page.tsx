"use client";

import { DiscountForm } from "@/components/admin/discount-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function AdminAddDiscountPage() {
 const router = useRouter();

 return (
 <div className="container max-w-4xl mx-auto py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
 <div className="flex items-center gap-4">
 <Button 
 variant="outline" 
 size="icon" 
 className="rounded-full h-12 w-12 border-black/10 hover:bg-black hover:text-white transition-all group active:scale-95 /5"
 onClick={() => router.back()}
 >
 <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
 </Button>
 <div>
 <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-tight">Generate Voucher</h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Deploying new economic stimulus protocols.</p>
 </div>
 </div>
 
 <DiscountForm onSuccess={() => router.push("/admin/discounts")} />
 </div>
 );
}
