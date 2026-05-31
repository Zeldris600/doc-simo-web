import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  /** Better Auth cookie sessions need this on browser requests (with trusted CORS origins). */
  withCredentials: true,
});

/** Avoid repeated signOut calls when multiple requests fail at once. */
let authErrorHandling = false;

function localeFromPathname(): string {
  if (typeof window === "undefined") return "en";
  const first = window.location.pathname.split("/").filter(Boolean)[0];
  return first === "en" || first === "fr" ? first : "en";
}

function isAuthRoute(): boolean {
  if (typeof window === "undefined") return false;
  const p = window.location.pathname;
  return (
    p.includes("/login") ||
    p.includes("/sign-up") ||
    p.includes("/register") ||
    p.includes("/forgot-password")
  );
}

function handleUnauthorizedResponse() {
  if (typeof window === "undefined" || authErrorHandling || isAuthRoute()) {
    return;
  }
  authErrorHandling = true;
  const locale = localeFromPathname();
  const loginUrl = `/${locale}/login`;

  import("next-auth/react")
    .then(({ signOut }) =>
      signOut({
        callbackUrl: loginUrl,
        redirect: true,
      })
    )
    .catch(() => {
      window.location.href = loginUrl;
    })
    .finally(() => {
      window.setTimeout(() => {
        authErrorHandling = false;
      }, 2000);
    });
}

// Request interceptor to attach token
api.interceptors.request.use(
  async config => {
    // For client-side requests, fetch the token from NextAuth session
    if (typeof window !== "undefined") {
      const session = await getSession();
      const token = session?.user.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

function handleForbiddenResponse() {
  if (typeof window === "undefined" || authErrorHandling) {
    return;
  }
  const locale = localeFromPathname();
  const path = window.location.pathname;
  if (!path.includes("/admin") || path.includes("/admin/unauthorized")) {
    return;
  }
  authErrorHandling = true;
  window.location.href = `/${locale}/admin/unauthorized`;
  window.setTimeout(() => {
    authErrorHandling = false;
  }, 2000);
}

// Response: 401 → login; 403 on admin → unauthorized (do not sign out)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }
    if (status === 401) {
      handleUnauthorizedResponse();
    } else if (status === 403) {
      handleForbiddenResponse();
    }
    return Promise.reject(error);
  },
);
