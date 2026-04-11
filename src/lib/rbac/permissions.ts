import { UserRole, Permission, RolePermissionsMapping } from "./types";

export const ROLE_PERMISSIONS: RolePermissionsMapping = {
 [UserRole.ADMIN]: [
 "users:read", "users:write", "users:manage_roles",
 "products:read", "products:write",
 "categories:read", "categories:write",
 "orders:read", "orders:write", "orders:update_status",
 "payments:read", "payments:reconcile",
 "customers:read", "customers:write",
 "documents:read", "documents:write",
 "notifications:read", "notifications:write",
 "analytics:read",
 "discounts:read", "discounts:write",
 "support:read", "support:write",
 ],
 [UserRole.SALES]: [
 "products:read",
 "categories:read",
 "orders:read", "orders:write", "orders:update_status",
 "payments:read",
 "customers:read", "customers:write",
 "documents:read", "documents:write",
 "notifications:read", "notifications:write",
 "discounts:read", "discounts:write",
 ],
 [UserRole.DELIVERY]: [
 "orders:read", "orders:update_status",
 "documents:read",
 "documents:write",
 "notifications:read",
 ],
 [UserRole.CUSTOMER]: [
 "products:read",
 "categories:read",
 "orders:read",
 "orders:write",
 "customers:read", "customers:write",
 "documents:read", "documents:write",
 "notifications:read",
 "support:read", "support:write",
 ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: string | undefined, permission: Permission): boolean {
 if (!role) return false;
 
 const userRole = role.toUpperCase() as UserRole;
 const permissions = ROLE_PERMISSIONS[userRole] || [];
 
 return permissions.includes(permission);
}

/**
 * Check if a role has all required permissions.
 */
export function hasAllPermissions(role: string | undefined, permissions: Permission[]): boolean {
 return permissions.every((p) => hasPermission(role, p));
}

/**
 * Check if a role has any of the required permissions.
 */
export function hasAnyPermission(role: string | undefined, permissions: Permission[]): boolean {
 return permissions.some((p) => hasPermission(role, p));
}
