"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Key } from "lucide-react";
import Image from "next/image";

import { useVerifyPhoneOtp, useSendOtp } from "@/hooks/use-auth-endpoints";
import { useRouter, Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
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
import {
 InputOTP,
 InputOTPGroup,
 InputOTPSlot,
} from "@/components/ui/input-otp";


const otpSchema = z.object({
 otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export function VerifyForm() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const phone = searchParams.get("phone");

 const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyPhoneOtp();
 const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

 const otpForm = useForm<z.infer<typeof otpSchema>>({
 resolver: zodResolver(otpSchema),
 defaultValues: { otp: "" },
 });

 useEffect(() => {
 if (!phone) {
 toast.error("Phone number missing in URL. Please sign up again.");
 router.push("/register");
 }
 }, [router, phone]);

 function onVerifyPhoneSubmit(values: z.infer<typeof otpSchema>) {
 if (!phone) {
 toast.error("Phone number missing. Please go back to sign up.");
 return;
 }

 verifyOtp(
 { phoneNumber: phone, code: values.otp },
 {
 onSuccess: () => {
 toast.success("Verified successfully. Please log in.");
 setTimeout(() => {
 router.push("/login");
 }, 1000);
 },
 onError: (err: unknown) => {
 const errorMsg = err instanceof Error ? err.message : "Invalid OTP or verification failed.";
 // @ts-expect-error - axios err
 toast.error(err?.response?.data?.message || errorMsg);
 },
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
 Verify Phone Number
 </h1>
 <p className="text-sm text-black/60 text-center">
 We sent a 6-digit code to {phone || "your phone"}
 </p>
 </div>

 <Form {...otpForm}>
 <form onSubmit={otpForm.handleSubmit(onVerifyPhoneSubmit)} className="space-y-6">
 <FormField
 control={otpForm.control}
 name="otp"
 render={({ field }) => (
 <FormItem className="flex flex-col items-center">
 <FormLabel className="flex items-center gap-2 mb-2">
 <Key className="h-3.5 w-3.5" />
 Enter Verification Code
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

 <Button type="submit" className="w-full rounded-md" disabled={isVerifyingOtp}>
 {isVerifyingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 Verify & Login
 </Button>
 
 <div className="flex flex-col gap-2 w-full">
 <Button
 type="button"
 variant="outline"
 className="w-full rounded-md h-10"
 disabled={isSendingOtp}
 onClick={() => {
 if (phone) {
 sendOtp({ phoneNumber: phone }, {
 onSuccess: () => toast.success("OTP sent to your WhatsApp."),
 onError: (err: unknown) => {
 const errorMsg = err instanceof Error ? err.message : "Failed to resend OTP.";
 // @ts-expect-error - axios err
 toast.error(err?.response?.data?.message || errorMsg);
 }
 });
 }
 }}
 >
 {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 Resend OTP
 </Button>

 <Button
 type="button"
 variant="ghost"
 asChild
 className="w-full text-black/60 font-medium hover:text-primary"
 >
 <Link href="/register">Back to Sign Up</Link>
 </Button>
 </div>
 </form>
 </Form>
 </div>
 );
}
