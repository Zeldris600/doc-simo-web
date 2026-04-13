import type { Permission } from "./types";

/**
 * Maps `/admin…` path (without locale prefix) to the minimum permission required.
 * `null` means any authenticated staff role (ADMIN | SALES | DELIVERY) may access.
 * Aligns with `FE_USER_ROLES.md` / `role-permissions.ts` themes.
 */
export function requiredPermissionForAdminPath(restPath: string): Permission | null {
  const path = (restPath.split("?")[0] ?? "/").replace(/\/+$/, "") || "/";

  if (path === "/admin") return null;

  if (path.startsWith("/admin/analytics")) return "analytics:read";
  if (path.startsWith("/admin/support")) return "support:read";
  if (path.startsWith("/admin/users")) return "users:read";

  if (/^\/admin\/products\/new\/?$/.test(path)) return "products:write";
  if (/^\/admin\/products\/[^/]+\/edit\/?$/.test(path)) return "products:write";
  if (path.startsWith("/admin/products")) return "products:read";

  if (/^\/admin\/categories\/new\/?$/.test(path)) return "categories:write";
  if (/^\/admin\/categories\/[^/]+\/edit\/?$/.test(path)) return "categories:write";
  if (path.startsWith("/admin/categories")) return "categories:read";

  if (path.startsWith("/admin/orders")) return "orders:read";
  if (path.startsWith("/admin/discounts")) return "discounts:read";
  if (path.startsWith("/admin/customers")) return "customers:read";

  return null;
}
