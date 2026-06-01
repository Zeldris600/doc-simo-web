"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, User } from "@/lib/icons";
import { storefrontRoutes } from "@/lib/storefront-routes";

const nav = [
  { href: storefrontRoutes.account, key: "dashboard" as const, icon: LayoutDashboard },
  { href: storefrontRoutes.accountOrders, key: "orders" as const, icon: Package },
  { href: storefrontRoutes.accountSettings, key: "profile" as const, icon: User },
];

export function AccountLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const t = useTranslations("account.nav");

  const active = (href: string) => {
    if (href === storefrontRoutes.accountSettings) {
      return pathname === storefrontRoutes.accountSettings;
    }
    if (href === storefrontRoutes.accountOrders) {
      return (
        pathname === storefrontRoutes.account &&
        (tab === "orders" || tab === null)
      );
    }
    if (href === storefrontRoutes.account) {
      return pathname === storefrontRoutes.account && tab !== "orders";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 pt-24 md:pt-28 pb-16 md:pb-20">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
          {t("areaTitle")}
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground max-w-xl">
          {t("areaSubtitle")}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        <nav
          className="flex lg:flex-col gap-1.5 p-1 rounded-2xl bg-muted/40 border border-border/60 overflow-x-auto lg:overflow-visible shrink-0 lg:w-52"
          aria-label={t("areaTitle")}
        >
          {nav.map(({ href, key, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-bold transition-colors",
                active(href)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" />
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
