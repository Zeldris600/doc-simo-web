"use client";

import { SessionProvider } from "next-auth/react";
import { FCMProvider } from "@/providers/fcm-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <FCMProvider />
    </SessionProvider>
  );
}
