import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";
import { UserRole } from "@/lib/rbac/types";
import { hasPermission } from "@/lib/rbac/permissions";
import { requiredPermissionForAdminPath } from "@/lib/rbac/admin-route-permission";

const intlMiddleware = createMiddleware(routing);

const STAFF_ROLES = new Set<string>([
  UserRole.ADMIN,
  UserRole.SALES,
  UserRole.DELIVERY,
]);

/** Next.js 16 network boundary (replaces `middleware.ts`). */
export const proxy = auth((req) => {
  const { pathname, search } = req.nextUrl;

  const localeMatch = pathname.match(/^\/(en|fr)(?=\/|$)/);
  const locale = (localeMatch?.[1] as "en" | "fr") ?? routing.defaultLocale;
  const rest =
    pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";

  if (rest === "/admin" || rest.startsWith("/admin/")) {
    if (!req.auth?.user) {
      const url = new URL(`/${locale}/login`, req.url);
      url.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(url);
    }

    const role = String(req.auth.user.role ?? "").toUpperCase();
    if (!STAFF_ROLES.has(role)) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }

    const required = requiredPermissionForAdminPath(rest);
    if (required && !hasPermission(role, required)) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/",
    "/(en|fr)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
