"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Loader2, User, Phone } from "@/lib/icons";
import { useSignUp, useSendOtp } from "@/hooks/use-auth-endpoints";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { toE164PhoneNumber } from "@/lib/phone-e164";
import { buildAuthPathWithCallback } from "@/lib/auth-callback-url";
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
import { Input } from "@/components/ui/input";

type Step = "name" | "phone";

function placeholderEmailForPhone(phoneE164: string): string {
  const digits = phoneE164.replace(/\D/g, "") || "user";
  return `${digits}@signup.phone.doctasimo`;
}

export function RegisterForm() {
  const locale = useLocale();
  const t = useTranslations("auth.register");
  const tc = useTranslations("auth.common");
  const tv = useTranslations("auth.validation");
  const tf = useTranslations("auth.form");

  const [step, setStep] = useState<Step>("name");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const nameStepSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, tv("nameMin")),
      }),
    [tv],
  );

  const phoneStepSchema = useMemo(
    () =>
      z.object({
        phoneNumber: z
          .string()
          .min(9, tv("phoneMin"))
          .max(20, tv("phoneMax")),
      }),
    [tv],
  );

  const { mutate: signUp, isPending: isSigningUp } = useSignUp();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const nameForm = useForm<z.infer<typeof nameStepSchema>>({
    resolver: zodResolver(nameStepSchema),
    defaultValues: { name: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneStepSchema>>({
    resolver: zodResolver(phoneStepSchema),
    defaultValues: { phoneNumber: "" },
  });

  const nameValue = useWatch({
    control: nameForm.control,
    name: "name",
    defaultValue: "",
  });

  function onNameContinue() {
    setStep("phone");
  }

  function onPhoneSubmit(values: z.infer<typeof phoneStepSchema>) {
    const formattedPhone = toE164PhoneNumber(values.phoneNumber);
    const name = nameForm.getValues("name").trim();
    const email = placeholderEmailForPhone(formattedPhone);

    signUp(
      {
        name,
        email,
        phoneNumber: formattedPhone,
        rememberMe: true,
      },
      {
        onSuccess: () => {
          sendOtp(
            { phoneNumber: formattedPhone },
            {
              onSuccess: () => {
                toast.success(t("toastCodeSent"));
                const verifyQs = new URLSearchParams();
                verifyQs.set("phone", formattedPhone);
                verifyQs.set("intent", "register");
                if (callbackUrl?.trim()) {
                  verifyQs.set("callbackUrl", callbackUrl.trim());
                }
                router.push(`/verify?${verifyQs.toString()}`);
              },
              onError: (err: unknown) => {
                const msg = isAxiosError(err)
                  ? (err.response?.data as { message?: string } | undefined)
                      ?.message
                  : undefined;
                toast.error(msg || t("errors.sendOtpFailed"));
              },
            },
          );
        },
        onError: (err: unknown) => {
          const msg = isAxiosError(err)
            ? (err.response?.data as { message?: string } | undefined)?.message
            : undefined;
          toast.error(msg || t("errors.signUpFailed"));
        },
      },
    );
  }

  const loginHref = buildAuthPathWithCallback("/login", callbackUrl);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
      <div className="mb-8 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-center">
          {t("title")}
        </h1>
        <p className="text-sm text-black/60 text-center">
          {step === "name" ? t("step1Subtitle") : t("step2Subtitle")}
        </p>
      </div>

      {step === "name" ? (
        <Form {...nameForm}>
          <form
            key={`name-${locale}`}
            onSubmit={nameForm.handleSubmit(onNameContinue)}
            className="space-y-4"
          >
            <FormField
              control={nameForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    {t("nameLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tf("fullNamePlaceholder")}
                      className="rounded-md"
                      autoCapitalize="words"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full rounded-md" size="default">
              {t("continue")}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...phoneForm}>
          <form
            key={`phone-${locale}`}
            onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
            className="space-y-4"
          >
            <p className="text-sm text-black/50 text-center rounded-md border border-input bg-muted/40 px-3 py-2">
              {t("signingUpAs", { name: nameValue.trim() || "…" })}
            </p>
            <FormField
              control={phoneForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {tc("phoneLabel")}
                  </FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-black/60 text-sm">
                        +237
                      </span>
                      <Input
                        placeholder={tc("phonePlaceholder")}
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
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-md"
                onClick={() => setStep("name")}
              >
                {t("back")}
              </Button>
              <Button
                type="submit"
                className="w-full rounded-md"
                disabled={isSigningUp || isSendingOtp}
              >
                {(isSigningUp || isSendingOtp) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("createAndSendCode")}
              </Button>
            </div>
          </form>
        </Form>
      )}

      <div className="mt-6 text-center text-sm">
        <span className="text-black/60">{t("hasAccount")} </span>
        <Link
          href={loginHref}
          className="text-primary font-medium hover:underline underline-offset-4"
        >
          {t("signIn")}
        </Link>
      </div>

      <AuthLocaleSwitcher className="mt-8" />
    </div>
  );
}
