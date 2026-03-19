"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, User as UserIcon, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
 Form, 
 FormControl, 
 FormField, 
 FormItem, 
 FormLabel, 
 FormMessage, 
} from "@/components/ui/form";
import { useUpdateMe } from "@/hooks/use-user"; // For admin editing specific user, we might need a general hook
import { toast } from "sonner";
import { User } from "@/types/auth";
import { ImageUploader } from "../ui/image-uploader";

const userSchema = z.object({
 name: z.string().min(2, "Name must be at least 2 characters"),
 image: z.string().optional(),
 // For account/profile specific fields, we'd typically have a separate profile form or include it here if the API supports it
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
 initialData?: User;
 onSuccess?: () => void;
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
 const isEditing = !!initialData;
 const updateMutation = useUpdateMe(); // Using updateMe as a placeholder if there's no general updateUser admin hook
 
 const form = useForm<UserFormValues>({
 resolver: zodResolver(userSchema),
 defaultValues: {
 name: initialData?.name || "",
 image: initialData?.image || "",
 },
 });

 const onSubmit = (data: UserFormValues) => {
 // In a real scenario, an admin would call UserService.updateUser(id, data)
 // For now, let's assume updateMutation handles it or we'd add useUpdateUser
 updateMutation.mutate(data, {
 onSuccess: () => {
 toast.success("Identity log synchronized.");
 onSuccess?.();
 },
 });
 };

 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-1000">
 <Card className="border-black/5 rounded-lg overflow-hidden bg-white/50 backdrop-blur-md">
 <CardHeader className="bg-black text-white p-10">
 <div className="flex items-center gap-6">
 <div className="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/5 ">
 <UserIcon className="h-8 w-8 text-white" />
 </div>
 <div>
 <CardTitle className="text-3xl font-black uppercase tracking-tighter ">
 {isEditing ? "Modify Patient Log" : "New Patient Node"}
 </CardTitle>
 <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
 Clinical identity management & biometric protocols.
 </CardDescription>
 </div>
 </div>
 </CardHeader>
 
 <CardContent className="p-10 space-y-10">
 <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
 <div className="md:col-span-4 space-y-4">
 <FormField
 control={form.control}
 name="image"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px]">Biometric Portrait</FormLabel>
 <FormControl>
 <ImageUploader 
 defaultValue={field.value}
 onUploadSuccess={field.onChange}
 className="rounded-lg overflow-hidden border-black/5 "
 label="Facial Signature"
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>

 <div className="md:col-span-8 space-y-8">
 <FormField
 control={form.control}
 name="name"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px]">Full Legal Signature</FormLabel>
 <FormControl>
 <Input 
 placeholder="E.G. John Doe" 
 {...field} 
 className="bg-black/[0.02] border-black/10 focus:border-black rounded-lg py-8 h-auto transition-all text-xl font-black uppercase tracking-tight "
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 opacity-50 pointer-events-none">
 <div className="space-y-2">
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
 <Mail className="h-3 w-3" /> Communication Node
 </FormLabel>
 <Input 
 disabled
 value={initialData?.email || "N/A"} 
 className="bg-black/[0.02] border-black/5 rounded-xl py-4 h-auto text-xs font-bold"
 />
 </div>
 <div className="space-y-2">
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
 <Phone className="h-3 w-3" /> Mobile Vector
 </FormLabel>
 <Input 
 disabled
 value={(initialData as any)?.phoneNumber || "N/A"} 
 className="bg-black/[0.02] border-black/5 rounded-xl py-4 h-auto text-xs font-bold"
 />
 </div>
 </div>
 </div>
 </div>

 <div className="p-8 rounded-lg bg-black text-white space-y-6 ">
 <div className="flex items-center gap-4 border-b border-white/10 pb-4">
 <MapPin className="h-5 w-5 text-white/40" />
 <h4 className="font-black uppercase tracking-widest text-xs ">Primary Delivery Coordinates (Simulation)</h4>
 </div>
 <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] leading-relaxed ">
 { (initialData as any)?.profile?.address || "Coordinate sync not established for this node." }
 </p>
 </div>
 </CardContent>

 <CardFooter className="bg-black/[0.02] p-10 flex justify-between gap-6 border-t border-black/5">
 <Button 
 type="button" 
 variant="outline" 
 className="rounded-lg border-black/10 hover:bg-black hover:text-white px-10 h-14 transition-all font-black uppercase text-[10px] tracking-widest active:scale-95 duration-300"
 onClick={() => form.reset()}
 >
 Reset Logs
 </Button>
 <Button 
 type="submit" 
 disabled={updateMutation.isPending}
 className="bg-black hover:bg-black/90 text-white rounded-lg px-14 h-14 font-black transition-all group active:scale-95 uppercase text-[10px] tracking-widest /20"
 >
 {updateMutation.isPending ? (
 <>
 <Loader2 className="mr-3 h-5 w-5 animate-spin text-white/50" />
 Synchronizing...
 </>
 ) : (
 <>
 <Save className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
 {isEditing ? "Finish Re-Indexing" : "Establish Node"}
 </>
 )}
 </Button>
 </CardFooter>
 </Card>
 </form>
 </Form>
 );
}
