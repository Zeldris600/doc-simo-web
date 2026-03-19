"use client";

import { useCan } from "@/hooks/use-can";
import { Permission } from "@/lib/rbac/types";

interface CanProps {
 /**
 * Required permission(s) to show the children.
 */
 perform?: Permission | Permission[];
 
 /**
 * If true, user must have ALL specified permissions.
 * If false, user must have at least ONE of the specified permissions.
 * Only applicable when perform is an array.
 */
 all?: boolean;
 
 /**
 * Content to show if user has the required permissions.
 */
 children: React.ReactNode;
 
 /**
 * Optional placeholder to show if user DOES NOT have the required permissions.
 */
 fallback?: React.ReactNode;
}

/**
 * Component for conditional rendering based on RBAC permissions.
 */
export function Can({ perform, all = false, children, fallback = null }: CanProps) {
 const { can, canAll, canAny, isLoading } = useCan();

 // Handle loading state - usually we hide then show children once loading is complete
 if (isLoading) return null;

 // No permissions specified - show children (acting as a pass-through)
 if (!perform) return <>{children}</>;

 const hasAccess = Array.isArray(perform)
 ? all ? canAll(perform) : canAny(perform)
 : can(perform);

 if (hasAccess) {
 return <>{children}</>;
 }

 return <>{fallback}</>;
}
