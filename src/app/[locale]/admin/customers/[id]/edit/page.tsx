"use client";

import { UserForm } from "@/components/admin/user-form";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, ShieldAlert } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export default function AdminEditCustomerPage() {
 const router = useRouter();
 const params = useParams();
 const id = params.id as string;
 const { data: user, isLoading } = useUser(id);

 if (isLoading) {
 return (
 <div className="flex h-[600px] items-center justify-center animate-in fade-in duration-1000">
 <Loader2 className="h-20 w-20 animate-spin text-black/[0.02]" />
 </div>
 );
 }

 if (!user) {
 return (
 <div className="flex flex-col items-center justify-center h-[600px] space-y-6 animate-in zoom-in duration-1000">
 <ShieldAlert className="h-20 w-20 text-rose-600/20" />
 <p className="text-4xl font-black uppercase text-black/10 tracking-tighter">Clinical data nullified.</p>
 <Button 
 variant="outline" 
 className="rounded-lg h-16 px-12 border-black/10 hover:bg-black hover:text-white transition-all font-black text-xs uppercase tracking-widest active:scale-95 duration-500"
 onClick={() => router.back()}
 >
 Return to Registry
 </Button>
 </div>
 );
 }

 return (
 <div className="container max-w-5xl mx-auto py-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
 <div className="flex items-center gap-6">
 <Button 
 variant="outline" 
 size="icon" 
 className="rounded-full h-14 w-14 border-black/10 hover:bg-black hover:text-white transition-all group active:scale-90 duration-500"
 onClick={() => router.back()}
 >
 <ChevronLeft className="h-8 w-8 group-hover:-translate-x-1 transition-transform" />
 </Button>
 <div>
 <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none">Modify Node</h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-2 inline-block px-1">Updating biometric logs for <span className="text-black font-black ">{user.name}</span>.</p>
 </div>
 </div>
 
 <UserForm initialData={user} onSuccess={() => router.push("/admin/customers")} />
 </div>
 );
}
