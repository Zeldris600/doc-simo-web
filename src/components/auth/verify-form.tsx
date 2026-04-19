"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Key } from "@/lib/icons";
import { signIn } from "next-auth/react";

import { useSendOtp } from "@/hooks/use-auth-endpoints";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { toE164PhoneNumber } from "@/lib/phone-e164";
import {
  buildAuthPathWithCallback,
  resolveAuthCallbackUrl,
} from "@/lib/auth-callback-url";
import { AuthLocaleSwitcher } from "@/components/auth/auth-locale-switcher";

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

export function VerifyForm() {
  const locale = useLocale();
  const t = useTranslations("auth.verify");
  const tv = useTranslations("auth.validation");
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const intent = searchParams.get("intent");
  const isLoginFlow = intent === "login";
  const callbackUrl = searchParams.get("callbackUrl");

  const otpSchema = useMemo(
    () =>
      z.object({
        otp: z.string().length(6, tv("otpLength")),
      }),
    [tv],
  );

  const [isSigningIn, setIsSigningIn] = useState(false);

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  async function onVerifyPhoneSubmit(values: z.infer<typeof otpSchema>) {
    if (!phone) {
      toast.error(
        isLoginFlow ? t("phoneMissingLogin") : t("phoneMissingRegister"),
      );
      return;
    }

    const phoneE164 = toE164PhoneNumber(phone);
    const next = resolveAuthCallbackUrl(callbackUrl);

    setIsSigningIn(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        phoneNumber: phoneE164,
        code: values.otp,
      });

      if (res?.error) {
        toast.error(t("invalidCode"));
        return;
      }
      if (!res?.ok) return;

      toast.success(
        isLoginFlow ? t("signedInSuccess") : t("welcomeSignedIn"),
      );
      setTimeout(() => {
        window.location.href = next;
      }, 600);
    } catch {
      toast.error(t("genericError"));
    } finally {
      setIsSigningIn(false);
    }
  }

  const registerHref = buildAuthPathWithCallback("/register", callbackUrl);
  const loginHref = buildAuthPathWithCallback("/login", callbackUrl);

  const subtitleRegister = phone
    ? t("subtitleRegister", { phone })
    : t("subtitleRegister", { phone: t("yourPhone") });

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
      <div className="mb-6 flex justify-center">
        <Link href="/">
          <img
            src="/logo-minimized.png"
            alt="Doctasimo Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>
      <div className="mb-8 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-center">
          {isLoginFlow ? t("titleLogin") : t("titleRegister")}
        </h1>
        <p className="text-sm text-black/60 text-center">
          {isLoginFlow ? t("subtitleLogin") : subtitleRegister}
        </p>
      </div>

      <Form {...otpForm}>
        <form
          key={locale}
          onSubmit={otpForm.handleSubmit(onVerifyPhoneSubmit)}
          className="space-y-6"
        >
          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="flex items-center gap-2 mb-2">
                  <Key className="h-3.5 w-3.5" />
                  {t("otpLabel")}
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="h-11 w-11 rounded-md border-gray-200"
                      />
                      <InputOTPSlot
                        index={1}
                        className="h-11 w-11 rounded-md border-gray-200"
                      />
                      <InputOTPSlot
                        index={2}
                        className="h-11 w-11 rounded-md border-gray-200"
                      />
                      <InputOTPSlot
                        index={3}
                        className="h-11 w-11 rounded-md border-gray-200"
                      />
                      <InputOTPSlot
                        index={4}
                        className="h-11 w-11 rounded-md border-gray-200"
                      />
                      <InputOTPSlot
                        index={5}
                        className="h-11 w-11 rounded-md border-gray-200"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full rounded-md"
            disabled={isSigningIn}
          >
            {isSigningIn && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("verifySignIn")}
          </Button>

          <div className="flex flex-col gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-md h-10"
              disabled={isSendingOtp}
              onClick={() => {
                if (phone) {
                  sendOtp(
                    { phoneNumber: toE164PhoneNumber(phone) },
                    {
                      onSuccess: () => toast.success(t("toastResendSuccess")),
                      onError: (err: unknown) => {
                        const errorMsg =
                          err instanceof Error
                            ? err.message
                            : t("errors.resendFailed");
                        // @ts-expect-error - axios err
                        toast.error(err?.response?.data?.message || errorMsg);
                      },
                    },
                  );
                }
              }}
            >
              {isSendingOtp && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("resendOtp")}
            </Button>

            <Button
              type="button"
              variant="ghost"
              asChild
              className="w-full text-black/60 font-medium hover:text-primary"
            >
              <Link href={isLoginFlow ? loginHref : registerHref}>
                {isLoginFlow ? t("differentNumber") : t("backSignUp")}
              </Link>
            </Button>
          </div>
        </form>
      </Form>

      <AuthLocaleSwitcher className="mt-8" />
    </div>
  );
}
