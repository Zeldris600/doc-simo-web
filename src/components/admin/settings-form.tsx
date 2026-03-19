"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
 Settings as SettingsIcon, 
 Globe, 
 Smartphone, 
 MapPin, 
 Mail, 
 ShieldCheck, 
 Save, 
 Loader2,
 Trash2,
 Bell,
 Smartphone as PhoneIcon,
 CreditCard
} from "lucide-react";
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
 FormDescription 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImageUploader } from "../ui/image-uploader";

const settingsSchema = z.object({
 appName: z.string().min(2, "App name must be at least 2 characters"),
 supportEmail: z.string().email("Invalid email address"),
 supportPhone: z.string().min(8, "Invalid phone number"),
 address: z.string().min(5, "Address must be at least 5 characters"),
 enableNotifications: z.boolean().default(true),
 maintenanceMode: z.boolean().default(false),
 logo: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
 const [isPending, setIsPending] = React.useState(false);
 
 const form = useForm<SettingsFormValues>({
 resolver: zodResolver(settingsSchema),
 defaultValues: {
 appName: "DOCTASIME",
 supportEmail: "support@doctasime.com",
 supportPhone: "+237 600 000 000",
 address: "Yaoundé, Cameroon",
 enableNotifications: true,
 maintenanceMode: false,
 logo: "",
 },
 });

 const onSubmit = (data: SettingsFormValues) => {
 setIsPending(true);
 setTimeout(() => {
 setIsPending(false);
 toast.success("System protocols updated.");
 }, 1500);
 };

 return (
 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1500">
 <div className="grid lg:grid-cols-12 gap-10">
 <div className="lg:col-span-8 space-y-10">
 {/* General Settings */}
 <Card className="border-black/5 rounded-lg overflow-hidden bg-white/50 backdrop-blur-md">
 <CardHeader className="bg-black text-white p-10">
 <CardTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4">
 <Globe className="h-8 w-8 text-white/40" />
 Core Protocals
 </CardTitle>
 <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Global metadata and application identity.</CardDescription>
 </CardHeader>
 <CardContent className="p-10 space-y-8">
 <div className="grid md:grid-cols-2 gap-8">
 <FormField
 control={form.control}
 name="appName"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px]">Registry Name</FormLabel>
 <FormControl>
 <Input {...field} className="bg-black/[0.02] border-black/10 focus:border-black rounded-lg h-14 font-black text-xl " />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="supportEmail"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px]">Communication Vector</FormLabel>
 <FormControl>
 <Input {...field} className="bg-black/[0.02] border-black/10 focus:border-black rounded-lg h-14 font-bold text-sm uppercase tracking-tight" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>

 <div className="grid md:grid-cols-2 gap-8">
 <FormField
 control={form.control}
 name="supportPhone"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px]">Mobile Signal</FormLabel>
 <FormControl>
 <Input {...field} className="bg-black/[0.02] border-black/10 focus:border-black rounded-lg h-14 font-bold text-sm uppercase tracking-tight" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="address"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="text-black/60 font-black uppercase tracking-[0.2em] text-[10px]">Primary Coordinates</FormLabel>
 <FormControl>
 <Input {...field} className="bg-black/[0.02] border-black/10 focus:border-black rounded-lg h-14 font-bold text-sm uppercase tracking-tight" />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </div>
 </CardContent>
 </Card>

 {/* System Controls */}
 <Card className="border-black/5 rounded-lg overflow-hidden bg-white">
 <CardHeader className="p-10 border-b border-black/5">
 <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-black">
 <ShieldCheck className="h-6 w-6 text-black/20" />
 Isolation Protocols
 </CardTitle>
 </CardHeader>
 <CardContent className="p-10 space-y-6">
 <FormField
 control={form.control}
 name="maintenanceMode"
 render={({ field }) => (
 <FormItem className="flex flex-row items-center justify-between rounded-lg border border-black/5 bg-rose-500/[0.02] p-8 transition-all hover:bg-rose-500/5 hover:-rotate-1">
 <div className="space-y-1">
 <FormLabel className="text-rose-600 font-black uppercase tracking-[0.2em] text-xs">System Lock (Maintenance)</FormLabel>
 <FormDescription className="text-[10px] font-bold text-rose-600/40 uppercase tracking-widest leading-tight">
 Suspend all clinical node interactions.
 </FormDescription>
 </div>
 <FormControl>
 <Switch
 checked={field.value}
 onCheckedChange={field.onChange}
 className="data-[state=checked]:bg-rose-600"
 />
 </FormControl>
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="enableNotifications"
 render={({ field }) => (
 <FormItem className="flex flex-row items-center justify-between rounded-lg border border-black/5 bg-emerald-500/[0.02] p-8 transition-all hover:bg-emerald-500/5 hover:rotate-1">
 <div className="space-y-1">
 <FormLabel className="text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">Broadcast Protocol</FormLabel>
 <FormDescription className="text-[10px] font-bold text-emerald-600/40 uppercase tracking-widest leading-tight">
 Enable real-time push signals for botanical batches.
 </FormDescription>
 </div>
 <FormControl>
 <Switch
 checked={field.value}
 onCheckedChange={field.onChange}
 className="data-[state=checked]:bg-emerald-600"
 />
 </FormControl>
 </FormItem>
 )}
 />
 </CardContent>
 </Card>
 </div>

 <div className="lg:col-span-4 space-y-10">
 {/* Logo/Brand */}
 <Card className="border-black/5 rounded-lg overflow-hidden bg-black text-white p-10 space-y-10">
 <div className="space-y-2">
 <CardTitle className="text-2xl font-black uppercase tracking-tight ">Visual Signal</CardTitle>
 <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Primary identity molecule.</p>
 </div>
 <FormField
 control={form.control}
 name="logo"
 render={({ field }) => (
 <FormItem>
 <FormControl>
 <ImageUploader 
 defaultValue={field.value}
 onUploadSuccess={field.onChange}
 className="rounded-lg overflow-hidden border-white/10 group-hover:scale-105 transition-transform duration-700 h-64 bg-white/5"
 label="Identity Token"
 />
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 </Card>

 {/* Quick Actions List */}
 <div className="space-y-4">
 {[
 { label: "Purge Buffers", icon: Trash2, color: "text-rose-600" },
 { label: "Signal Diagnostics", icon: Bell, color: "text-indigo-600" },
 { label: "Log Synchronization", icon: Globe, color: "text-emerald-600" },
 { label: "Encrypted Backup", icon: ShieldCheck, color: "text-blue-600" }
 ].map((action, i) => (
 <Button key={i} variant="outline" className="w-full h-16 rounded-lg border-black/5 justify-between px-6 hover:bg-black hover:text-white transition-all group active:scale-[0.98]">
 <div className="flex items-center gap-4">
 <action.icon className={`h-5 w-5 ${action.color} group-hover:text-white transition-colors`} />
 <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
 </div>
 <Loader2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity animate-spin" />
 </Button>
 ))}
 </div>
 </div>
 </div>

 <div className="fixed bottom-10 right-10 z-50">
 <Button 
 type="submit" 
 disabled={isPending}
 className="bg-black hover:bg-black/90 text-white rounded-full px-12 h-20 font-black transition-all hover:scale-105 active:scale-90 uppercase text-xs tracking-[0.2em] /40 group"
 >
 {isPending ? (
 <>
 <Loader2 className="mr-4 h-6 w-6 animate-spin text-white/30" />
 Updating Protocols...
 </>
 ) : (
 <>
 <Save className="mr-4 h-6 w-6 group-hover:rotate-12 transition-transform" />
 Commit Protocol
 </>
 )}
 </Button>
 </div>
 </form>
 </Form>
 );
}
