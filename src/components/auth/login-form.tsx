"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Phone, Lock } from "@/lib/icons";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
 phoneNumber: z.string().min(9, "Phone number is required"),
 password: z.string().min(4, "Password must be at least 4 characters."),
 rememberMe: z.boolean().default(false).optional(),
});

export function LoginForm() {
 const [showPassword, setShowPassword] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 const form = useForm<z.infer<typeof loginSchema>>({
 resolver: zodResolver(loginSchema),
 defaultValues: { phoneNumber: "", password: "", rememberMe: false },
 });

 async function onSubmit(values: z.infer<typeof loginSchema>) {
 setIsLoading(true);
 try {
 const formattedPhone = values.phoneNumber.startsWith("+237")
 ? values.phoneNumber
 : `+237${values.phoneNumber}`;

 const res = await signIn("credentials", {
 redirect: false,
 phoneNumber: formattedPhone,
 password: values.password,
 rememberMe: values.rememberMe ? "true" : "false",
 isSignUp: "false",
 });

 if (res?.error) {
 toast.error("Invalid credentials.");
 } else if (res?.ok) {
 toast.success("Successfully logged in.");
 setTimeout(() => {
 window.location.href = "/"; // Force a hard refresh to the index page
 }, 1000);
 }
 } catch {
 toast.error("An unexpected error occurred.");
 } finally {
 setIsLoading(false);
 }
 }

 return (
 <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
 <div className="mb-8 flex flex-col items-center gap-2">
 <div className="mb-2">
 <Image src="/icon.png" alt="Doctasimo" width={100} height={100} className="object-contain" />
 </div>
 <h1 className="text-2xl font-bold tracking-tight text-center">
 Welcome Back
 </h1>
 <p className="text-sm text-black/60 text-center">
 Enter your credentials to sign in
 </p>
 </div>

 <Form {...form}>
 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
 <FormField
 control={form.control}
 name="phoneNumber"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="flex items-center gap-2">
 <Phone className="h-3.5 w-3.5" />
 Phone Number
 </FormLabel>
 <FormControl>
 <div className="flex">
 <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-black/60 text-sm">
 +237
 </span>
 <Input 
 placeholder="671381152" 
 className="rounded-l-none rounded-r-md" 
 {...field} 
 onChange={(e) => {
 const val = e.target.value.replace(/^\+237/, "");
 field.onChange(val);
 }}
 />
 </div>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />
 <FormField
 control={form.control}
 name="password"
 render={({ field }) => (
 <FormItem>
 <div className="flex items-center justify-between">
 <FormLabel className="flex items-center gap-2">
 <Lock className="h-3.5 w-3.5" />
 Password
 </FormLabel>
 <Link
 href="/forgot-password"
 className="text-xs font-medium text-primary hover:underline"
 >
 Forgot password?
 </Link>
 </div>
 <FormControl>
 <div className="relative">
 <Input 
 type={showPassword ? "text" : "password"} 
 placeholder="••••••••" 
 className="rounded-md pr-10" 
 {...field} 
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
 >
 {showPassword ? (
 <EyeOff className="h-4 w-4" />
 ) : (
 <Eye className="h-4 w-4" />
 )}
 </button>
 </div>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={form.control}
 name="rememberMe"
 render={({ field }) => (
 <FormItem className="flex flex-row items-center space-x-2 space-y-0">
 <FormControl>
 <Checkbox
 checked={field.value}
 onCheckedChange={field.onChange}
 />
 </FormControl>
 <div className="leading-none">
 <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
 Remember me
 </FormLabel>
 </div>
 </FormItem>
 )}
 />

 <Button type="submit" className="w-full rounded-md" disabled={isLoading}>
 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 Sign In
 </Button>
 </form>
 </Form>

 <div className="mt-6 text-center text-sm">
 <span className="text-black/60">
 Don&apos;t have an account?{" "}
 </span>
 <Link
 href="/register"
 className="text-primary font-medium hover:underline underline-offset-4"
 >
 Sign up
 </Link>
 </div>
 </div>
 );
}
