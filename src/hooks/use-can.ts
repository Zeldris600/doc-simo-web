"use client";

import { useSession } from "next-auth/react";
import { Permission } from "@/lib/rbac/types";
import { hasPermission, hasAllPermissions, hasAnyPermission } from "@/lib/rbac/permissions";
import { User } from "@/types/auth";

/**
 * Hook to check RBAC permissions.
 */
export function useCan() {
 const { data: session, status } = useSession();
 const isLoading = status === "loading";
 const user = session?.user as User | undefined;
 const role = user?.role as string | undefined;

 /**
 * Check if user can perform a single action.
 */
 const can = (permission: Permission) => {
 return hasPermission(role, permission);
 };

 /**
 * Check if user can perform all specified actions.
 */
 const canAll = (permissions: Permission[]) => {
 return hasAllPermissions(role, permissions);
 };

 /**
 * Check if user can perform any of the specified actions.
 */
 const canAny = (permissions: Permission[]) => {
 return hasAnyPermission(role, permissions);
 };

 return {
 can,
 canAll,
 canAny,
 isLoading,
 role,
 user,
 };
}
