"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader2, User, Phone, Mail, Lock } from "@/lib/icons";
import Image from "next/image";
import { useSignUp, useSendOtp } from "@/hooks/use-auth-endpoints";
import { Link, useRouter } from "@/i18n/routing";
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
const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phoneNumber: z.string().min(9, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters."),
  rememberMe: z.boolean().default(true).optional(),
});
export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", phoneNumber: "", email: "", password: "", rememberMe: true },
  });

  function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    const formattedPhone = values.phoneNumber.startsWith("+237")
      ? values.phoneNumber
      : `+237${values.phoneNumber}`;

    signUp({
      name: values.name,
      email: values.email,
      password: values.password,
      phoneNumber: formattedPhone,
      rememberMe: values.rememberMe,
    }, {
      onSuccess: () => {
        sendOtp({ phoneNumber: formattedPhone }, {
          onSuccess: () => {
            toast.success("Verification code sent to your WhatsApp. Please verify.");
            router.push(`/verify?phone=${encodeURIComponent(formattedPhone)}`);
          },
          onError: (err: unknown) => {
            const errorMsg = err instanceof Error ? err.message : "Failed to send OTP.";
            // @ts-expect-error - axios err
            toast.error(err?.response?.data?.message || errorMsg);
          }
        });
      },
      onError: (err: unknown) => {
        const errorMsg = err instanceof Error ? err.message : "Failed to create account.";
        // @ts-expect-error - axios err
        toast.error(err?.response?.data?.message || errorMsg);
      }
    });
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="mb-2">
          <Image src="/icon.png" alt="Doctasimo" width={100} height={100} className="object-contain" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Create Account
        </h1>
        <p className="text-sm text-black/60 text-center">
          Enter your details to sign up
        </p>
      </div>

      <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="rounded-md" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
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
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" type="email" className="rounded-md" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" />
                    Password
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

            <FormField
              control={registerForm.control}
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

            <Button type="submit" className="w-full rounded-md" disabled={isSigningUp || isSendingOtp}>
              {(isSigningUp || isSendingOtp) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
        </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-black/60">
          Already have an account?{" "}
        </span>
        <Link
          href="/login"
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
