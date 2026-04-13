"use client";

import { useCan } from "@/hooks/use-can";
import { Permission } from "@/lib/rbac/types";

export interface CanProps {
  /** Required permission(s) to show the children. */
  perform?: Permission | Permission[];
  /**
   * If true, user must have ALL specified permissions.
   * If false, user must have at least ONE of the specified permissions.
   * Only applicable when perform is an array.
   */
  all?: boolean;
  children: React.ReactNode;
  /** Shown while the session is loading. Defaults to nothing. */
  loadingFallback?: React.ReactNode;
  /** Shown when the user lacks the required permission(s). */
  fallback?: React.ReactNode;
}

/**
 * Conditional render from RBAC permissions.
 */
export function Can({
  perform,
  all = false,
  children,
  loadingFallback = null,
  fallback = null,
}: CanProps) {
  const { can, canAll, canAny, isLoading } = useCan();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!perform) {
    return <>{children}</>;
  }

  const hasAccess = Array.isArray(perform)
    ? all
      ? canAll(perform)
      : canAny(perform)
    : can(perform);

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
