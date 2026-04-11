"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Phone } from "@/lib/icons";
import Image from "next/image";
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
import { useRequestPasswordReset } from "@/hooks/use-auth-endpoints";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
 phoneNumber: z.string().min(9, "Phone number is required"),
});

export function ForgotPasswordForm() {
 const router = useRouter();

 const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset();

 const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
 resolver: zodResolver(forgotPasswordSchema),
 defaultValues: { phoneNumber: "" },
 });

 function onForgotPasswordSubmit(
 values: z.infer<typeof forgotPasswordSchema>,
 ) {

 const formattedPhone = values.phoneNumber.startsWith("+237")
 ? values.phoneNumber
 : `+237${values.phoneNumber}`;

 requestPasswordReset(
 { phoneNumber: formattedPhone },
 {
 onSuccess: () => {
 toast.success(
 `If an account matches ${formattedPhone}, reset instructions have been sent.`,
 );
 setTimeout(() => {
 // Include formatted phone in URL query to prefill reset form if needed
 router.push(
 `/reset-password?phone=${encodeURIComponent(formattedPhone)}`,
 );
 }, 2000);
 },
 onError: (err: unknown) => {
 const errorMsg =
 err instanceof Error
 ? err.message
 : "Error requesting password reset.";
 // @ts-expect-error - axios error structure
 toast.error(err?.response?.data?.message || errorMsg);
 },
 },
 );
 }

 return (
 <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
 <div className="mb-8 flex flex-col items-center gap-2">
 <div className="mb-2 text-primary">
 <Image src="/icon.png" alt="Doctasimo" width={100} height={100} className="object-contain" />
 </div>
 <h1 className="text-2xl font-bold tracking-tight text-center">
 Forgot Password
 </h1>
 <p className="text-sm text-black/60 text-center">
 Enter your phone number to receive an OTP reset code
 </p>
 </div>

 <Form {...forgotPasswordForm}>
 <form
 onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
 className="space-y-4"
 >
 <FormField
 control={forgotPasswordForm.control}
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

 <Button
 type="submit"
 className="w-full rounded-md"
 disabled={isPending}
 >
 {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
 Send Reset Link
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
