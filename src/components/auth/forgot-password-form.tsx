"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Phone } from "@/lib/icons";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
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
import { useRequestPasswordReset } from "@/hooks/use-auth-endpoints";
import { toast } from "sonner";
import { toE164PhoneNumber } from "@/lib/phone-e164";

export function ForgotPasswordForm() {
  const locale = useLocale();
  const t = useTranslations("auth.forgotPassword");
  const tc = useTranslations("auth.common");
  const tv = useTranslations("auth.validation");
  const router = useRouter();

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        phoneNumber: z.string().min(9, tv("phoneRequired")),
      }),
    [tv],
  );

  const { mutate: requestPasswordReset, isPending } = useRequestPasswordReset();

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phoneNumber: "" },
  });

  function onForgotPasswordSubmit(
    values: z.infer<typeof forgotPasswordSchema>,
  ) {
    const formattedPhone = toE164PhoneNumber(values.phoneNumber);

    requestPasswordReset(
      { phoneNumber: formattedPhone },
      {
        onSuccess: () => {
          toast.success(t("toastSuccess", { phone: formattedPhone }));
          setTimeout(() => {
            router.push(
              `/reset-password?phone=${encodeURIComponent(formattedPhone)}`,
            );
          }, 2000);
        },
        onError: (err: unknown) => {
          const errorMsg =
            err instanceof Error ? err.message : t("errors.generic");
          // @ts-expect-error - axios error structure
          toast.error(err?.response?.data?.message || errorMsg);
        },
      },
    );
  }

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
          {t("title")}
        </h1>
        <p className="text-sm text-black/60 text-center">{t("subtitle")}</p>
      </div>

      <Form {...forgotPasswordForm}>
        <form
          key={locale}
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
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("submit")}
          </Button>

          <Button
            type="button"
            variant="ghost"
            asChild
            className="w-full text-black/60 font-medium hover:text-primary"
          >
            <Link href="/login">{t("backToLogin")}</Link>
          </Button>
        </form>
      </Form>

      <AuthLocaleSwitcher className="mt-8" />
    </div>
  );
}
