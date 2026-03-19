export enum UserRole {
 ADMIN = "ADMIN",
 SALES = "SALES",
 DELIVERY = "DELIVERY",
 CUSTOMER = "CUSTOMER",
}

export type Permission =
 | "users:read"
 | "users:write"
 | "users:manage_roles"
 | "products:read"
 | "products:write"
 | "categories:read"
 | "categories:write"
 | "orders:read"
 | "orders:write"
 | "orders:update_status"
 | "payments:read"
 | "payments:reconcile"
 | "customers:read"
 | "customers:write"
 | "documents:read"
 | "documents:write"
 | "notifications:read"
 | "notifications:write"
 | "analytics:read"
 | "discounts:read"
 | "discounts:write"
 | "support:read"
 | "support:write";

export type RolePermissionsMapping = Record<UserRole, Permission[]>;
