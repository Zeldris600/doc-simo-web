import { UserRole } from "@/lib/rbac/types";
import { CustomerProfile } from "./api";
import "next-auth";

declare module "next-auth" {
 /**
 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
 */
 interface Session {
 user: {
 id: string;
 name?: string | null;
 email?: string | null;
 image?: string | null;
 role: UserRole;
 profile?: CustomerProfile | null;
 token?: string;
 };
 }

 interface User {
 id: string;
 name?: string | null;
 email?: string | null;
 image?: string | null;
 role: UserRole;
 profile?: CustomerProfile | null;
 token?: string;
 }
}

declare module "next-auth/jwt" {
 /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
 interface JWT {
 user: {
 id: string;
 name?: string | null;
 email?: string | null;
 image?: string | null;
 role: UserRole;
 profile?: CustomerProfile | null;
 token?: string;
 };
 }
}
