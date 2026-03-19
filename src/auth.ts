import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./services/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
        phoneNumber: { label: "Phone Number", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;

        // Use phone number for sign in by default based on recent UI changes
        const loginPayload = {
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
          rememberMe: true,
        };

        try {
          const res = await api.post(
            "/auth/sign-in/phone-number",
            loginPayload,
          );

          console.log(res);

          if (!res.data.user) return null;

          return {
            ...res.data.user,
            token: res.data.token,
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user = token.user as any;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "doctasime-secret-never-expose",
});
