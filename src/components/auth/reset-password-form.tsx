"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Phone, Key, Lock } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";

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
import {
 InputOTP,
 InputOTPGroup,
 InputOTPSlot,
} from "@/components/ui/input-otp";
import { useResetPasswordPhone } from "@/hooks/use-auth-endpoints";
import { toast } from "sonner";

const resetPasswordSchema = z.object({
 phoneNumber: z.string().min(9, "Phone number is required"),
 otp: z.string().length(6, "OTP must be exactly 6 digits"),
 newPassword: z.string().min(4, "Password must be at least 4 characters."),
});

export function ResetPasswordForm() {
 const [showPassword, setShowPassword] = useState(false);
 const router = useRouter();
 const searchParams = useSearchParams();
 
 const { mutate: resetPassword, isPending } = useResetPasswordPhone();

 const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
 resolver: zodResolver(resetPasswordSchema),
 defaultValues: { phoneNumber: "", otp: "", newPassword: "" },
 });

 // Pre-fill phone if passed from forgot password page
 useEffect(() => {
 const phoneFromUrl = searchParams.get("phone");
 if (phoneFromUrl) {
 // Stripping +237 visually if desired, or keeping it
 // if keeping the +237 we'd want to remove it for the display input since the UI affixes +237
 const cleanPhone = phoneFromUrl.replace(/^\+237/, "");
 resetPasswordForm.setValue("phoneNumber", cleanPhone);
 }
 }, [searchParams, resetPasswordForm]);

 function onResetPasswordSubmit(values: z.infer<typeof resetPasswordSchema>) {
 const formattedPhone = values.phoneNumber.startsWith("+237")
 ? values.phoneNumber
 : `+237${values.phoneNumber}`;

 resetPassword(
 { 
 phoneNumber: formattedPhone,
 otp: values.otp,
 newPassword: values.newPassword
 },
 {
 onSuccess: () => {
 toast.success("Password reset successfully. You can now log in.");
 setTimeout(() => {
 router.push("/login");
 }, 2000);
 },
 onError: (err: unknown) => {
 const errorMsg = err instanceof Error ? err.message : "Error resetting password.";
 // @ts-expect-error - axios error structure
 toast.error(err?.response?.data?.message || errorMsg);
 }
 }
 );
 }

 return (
 <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
 <div className="mb-8 flex flex-col items-center gap-2">
 <div className="mb-2">
 <Image src="/icon.png" alt="Doctasimo" width={100} height={100} className="object-contain" />
 </div>
 <h1 className="text-2xl font-bold tracking-tight text-center">
 Reset Password
 </h1>
 <p className="text-sm text-black/60 text-center">
 Enter your OTP code and new password
 </p>
 </div>

 <Form {...resetPasswordForm}>
 <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
 <FormField
 control={resetPasswordForm.control}
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
 control={resetPasswordForm.control}
 name="otp"
 render={({ field }) => (
 <FormItem className="flex flex-col">
 <FormLabel className="flex items-center gap-2">
 <Key className="h-3.5 w-3.5" />
 OTP Code
 </FormLabel>
 <FormControl>
 <InputOTP maxLength={6} {...field}>
 <InputOTPGroup className="gap-2">
 <InputOTPSlot index={0} className="h-11 w-11 rounded-md border-gray-200" />
 <InputOTPSlot index={1} className="h-11 w-11 rounded-md border-gray-200" />
 <InputOTPSlot index={2} className="h-11 w-11 rounded-md border-gray-200" />
 <InputOTPSlot index={3} className="h-11 w-11 rounded-md border-gray-200" />
 <InputOTPSlot index={4} className="h-11 w-11 rounded-md border-gray-200" />
 <InputOTPSlot index={5} className="h-11 w-11 rounded-md border-gray-200" />
 </InputOTPGroup>
 </InputOTP>
 </FormControl>
 <FormMessage />
 </FormItem>
 )}
 />

 <FormField
 control={resetPasswordForm.control}
 name="newPassword"
 render={({ field }) => (
 <FormItem>
 <FormLabel className="flex items-center gap-2">
 <Lock className="h-3.5 w-3.5" />
 New Password
 </FormLabel>
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

 <Button type="submit" className="w-full rounded-md" disabled={isPending}>
 {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 Reset Password
 </Button>

 <Button
 type="button"
 variant="ghost"
 asChild
 className="w-full text-black/60 font-medium hover:text-primary"
 >
 <Link href="/login">Back to Login</Link>
 </Button>
 </form>
 </Form>
 </div>
 );
}
