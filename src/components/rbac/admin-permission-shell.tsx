"use client";

import { usePathname } from "next/navigation";
import { ProtectScreen } from "@/components/rbac/protect-screen";
import { requiredPermissionForAdminPath } from "@/lib/rbac/admin-route-permission";

/**
 * Wraps admin page content: enforces the same permission map as `proxy.ts` on
 * the client so users see a fallback instead of a flash of forbidden UI.
 */
export function AdminPermissionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const rest =
    pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  const required = requiredPermissionForAdminPath(rest);

  if (!required) {
    return <>{children}</>;
  }

  return <ProtectScreen perform={required}>{children}</ProtectScreen>;
}
