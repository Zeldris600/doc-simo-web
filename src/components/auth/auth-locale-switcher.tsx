"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function AuthLocaleSwitcherInner({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("auth.common");

  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <div
      className={cn(
        "flex justify-center items-center gap-2 text-sm text-black/45",
        className,
      )}
      role="navigation"
      aria-label={t("language")}
    >
      <Link
        href={href}
        locale="fr"
        className={cn(
          "font-bold tracking-wide transition-colors hover:text-primary",
          locale === "fr" ? "text-primary" : "text-black/35",
        )}
      >
        FR
      </Link>
      <span className="text-black/25 select-none" aria-hidden>
        |
      </span>
      <Link
        href={href}
        locale="en"
        className={cn(
          "font-bold tracking-wide transition-colors hover:text-primary",
          locale === "en" ? "text-primary" : "text-black/35",
        )}
      >
        EN
      </Link>
    </div>
  );
}

/** Preserves path + query when switching locale (e.g. verify OTP, callbackUrl). */
export function AuthLocaleSwitcher({ className }: { className?: string }) {
  return (
    <Suspense fallback={<div className={cn("h-5", className)} aria-hidden />}>
      <AuthLocaleSwitcherInner className={className} />
    </Suspense>
  );
}
