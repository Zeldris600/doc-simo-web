"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Phone } from "@/lib/icons";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { toE164PhoneNumber } from "@/lib/phone-e164";
import { useSendOtp } from "@/hooks/use-auth-endpoints";
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

export function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("auth.login");
  const tc = useTranslations("auth.common");
  const tv = useTranslations("auth.validation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

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

  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const phoneForm = useForm<z.infer<typeof phoneStepSchema>>({
    resolver: zodResolver(phoneStepSchema),
    defaultValues: { phoneNumber: "" },
  });

  function onPhoneSubmit(values: z.infer<typeof phoneStepSchema>) {
    const formatted = toE164PhoneNumber(values.phoneNumber);
    sendOtp(
      { phoneNumber: formatted },
      {
        onSuccess: () => {
          toast.success(t("codeSent"));
          const q = new URLSearchParams();
          q.set("phone", formatted);
          q.set("intent", "login");
          if (callbackUrl?.trim()) {
            q.set("callbackUrl", callbackUrl.trim());
          }
          router.push(`/verify?${q.toString()}`);
        },
        onError: (err: unknown) => {
          const msg = isAxiosError(err)
            ? (err.response?.data as { message?: string } | undefined)?.message
            : undefined;
          toast.error(msg || t("errors.sendFailed"));
        },
      },
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center">
      <div className="mb-8 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-center">
          {t("title")}
        </h1>
        <p className="text-sm text-black/60 text-center">{t("subtitle")}</p>
        <p className="text-xs text-black/45 text-center max-w-xs">
          {t("phoneSubtitle")}
        </p>
      </div>

      <Form {...phoneForm}>
        <form
          key={locale}
          onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
          className="space-y-4"
        >
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

          <Button
            type="submit"
            className="w-full rounded-md"
            disabled={isSendingOtp}
          >
            {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("sendCode")}
          </Button>
        </form>
      </Form>

      <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-xs font-medium text-primary hover:underline"
        >
          {t("forgotPassword")}
        </Link>
        <div>
          <span className="text-black/60">{t("noAccount")} </span>
          <Link
            href={buildAuthPathWithCallback("/register", callbackUrl)}
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            {t("registerLink")}
          </Link>
        </div>
      </div>

      <AuthLocaleSwitcher className="mt-8" />
    </div>
  );
}
