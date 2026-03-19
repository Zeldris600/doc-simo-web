import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Added the localhost fallback you're using for your API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to attach token
api.interceptors.request.use(
  async (config) => {
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
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // // If the API returns a 401 Unauthorized, redirect the user back to the login page
    // if (error.response?.status === 401 && typeof window !== "undefined") {
    // window.location.href = "/login";
    // }
    return Promise.reject(error);
  },
);
