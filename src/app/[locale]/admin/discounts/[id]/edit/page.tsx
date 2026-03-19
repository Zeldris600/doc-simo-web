"use client";

import { DiscountForm } from "@/components/admin/discount-form";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useDiscount } from "@/hooks/use-discount";

export default function AdminEditDiscountPage() {
 const router = useRouter();
 const params = useParams();
 const id = params.id as string;
 const { data: discount, isLoading } = useDiscount(id);

 if (isLoading) {
 return (
 <div className="flex h-[600px] items-center justify-center animate-in fade-in duration-1000">
 <Loader2 className="h-16 w-16 animate-spin text-black/10" />
 </div>
 );
 }

 if (!discount) {
 return (
 <div className="flex flex-col items-center justify-center h-[600px] space-y-6 animate-in fade-in zoom-in duration-1000">
 <p className="text-4xl font-black uppercase text-black/10 tracking-tight">Voucher registry nullified.</p>
 <Button 
 variant="outline" 
 className="rounded-lg h-14 px-10 border-black/10 hover:bg-black hover:text-white transition-all font-black text-xs uppercase tracking-widest active:scale-95"
 onClick={() => router.back()}
 >
 Return to directory
 </Button>
 </div>
 );
 }

 return (
 <div className="container max-w-4xl mx-auto py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
 <div className="flex items-center gap-4">
 <Button 
 variant="outline" 
 size="icon" 
 className="rounded-full h-12 w-12 border-black/10 hover:bg-black hover:text-white transition-all group active:scale-95"
 onClick={() => router.back()}
 >
 <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
 </Button>
 <div>
 <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-tight">Modify Protocol</h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Updating voucher specs for <span className="text-black font-bold">{discount.code}</span>.</p>
 </div>
 </div>
 
 <DiscountForm initialData={discount} onSuccess={() => router.push("/admin/discounts")} />
 </div>
 );
}
