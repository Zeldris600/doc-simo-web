"use client";

import type { ReactNode } from "react";
import { Loader2, Lock } from "@/lib/icons";
import { Link } from "@/i18n/routing";
import { Can, type CanProps } from "@/components/rbac/can";
import type { Permission } from "@/lib/rbac/types";

type ProtectScreenProps = Omit<CanProps, "perform" | "fallback" | "loadingFallback"> & {
  perform: Permission | Permission[];
  /** Override the default “access denied” panel. */
  fallback?: ReactNode;
  /** Override the default loading spinner. */
  loadingFallback?: ReactNode;
};

function DefaultDenied() {
  return (
    <div className="flex min-h-[42vh] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Lock className="size-7" />
      </div>
      <div className="max-w-sm space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Access denied</h2>
        <p className="text-sm text-muted-foreground">
          You do not have permission to view this page. Contact an administrator if
          you need access.
        </p>
      </div>
      <Link
        href="/admin"
        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        Back to admin
      </Link>
    </div>
  );
}

import { PageSkeleton } from "@/components/skeletons/page-skeleton";

function DefaultLoading() {
  return (
    <div className="w-full">
      <PageSkeleton />
    </div>
  );
}

/**
 * Like {@link Can}, but with sensible full-screen fallbacks for loading and
 * missing permission (for protected areas such as admin).
 */
export function ProtectScreen({
  perform,
  all,
  children,
  fallback,
  loadingFallback,
}: ProtectScreenProps) {
  return (
    <Can
      perform={perform}
      all={all}
      loadingFallback={loadingFallback ?? <DefaultLoading />}
      fallback={fallback ?? <DefaultDenied />}
    >
      {children}
    </Can>
  );
}
