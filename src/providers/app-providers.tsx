"use client";

import { SessionProvider } from "next-auth/react";
import { FCMProvider } from "@/providers/fcm-provider";
import { PusherUserBridge } from "@/components/realtime/pusher-user-bridge";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <FCMProvider />
      <PusherUserBridge />
    </SessionProvider>
  );
}
