import NextAuth from "next-auth";
import type { User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./services/api";
import { UserRole } from "@/lib/rbac/types";
import type { PhoneSessionApiBody, User as ApiUser } from "@/types/auth";
import { AxiosError } from "axios";

function mapApiRole(role: ApiUser["role"]): UserRole {
  if (!role || typeof role !== "string") return UserRole.CUSTOMER;
  const upper = role.toUpperCase();
  return (Object.values(UserRole) as string[]).includes(upper)
    ? (upper as UserRole)
    : UserRole.CUSTOMER;
}

function toNextAuthUser(
  body: PhoneSessionApiBody | undefined,
): NextAuthUser | null {
  if (!body?.user?.id || !body.token) return null;
  const u = body.user;
  return {
    id: u.id,
    name: u.name ?? null,
    email: u.email ?? "",
    emailVerified: u.emailVerified === true ? new Date() : null,
    image: u.image ?? null,
    role: mapApiRole(u.role),
    profile: null,
    token: body.token,
  };
}

/** Normalize `authorize` user into JWT shape so `session` sees a strict `AdapterUser`-compatible object. */
function toJwtUser(user: NextAuthUser): JWT["user"] {
  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email ?? "",
    emailVerified: user.emailVerified ?? null,
    image: user.image ?? null,
    role: user.role,
    profile: user.profile ?? null,
    token: user.token,
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        code: { label: "OTP code", type: "text" },
      },
      async authorize(credentials) {
        const phoneNumber = credentials?.phoneNumber as string | undefined;
        const code = credentials?.code as string | undefined;
        if (!phoneNumber || !code) return null;

        try {
          const { data } = await api.post<PhoneSessionApiBody>(
            "/auth/phone-number/verify",
            { phoneNumber, code },
          );
          return toNextAuthUser(data);
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            console.error(error.response?.data);
            throw new Error(
              error.response?.data?.message || "Invalid phone number or code",
            );
          }
          throw new Error("Invalid phone number or code");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = toJwtUser(user as NextAuthUser);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "doctasimo-secret-never-expose",
});
