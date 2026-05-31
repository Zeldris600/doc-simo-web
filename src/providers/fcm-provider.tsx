"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getMessagingInstance } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";
import {
  getStoredFcmToken,
  registerFcmTokenWithBackend,
  obtainFcmDeviceToken,
  unregisterFcmTokenFromBackend,
} from "@/lib/fcm-registration";

export function FCMProvider() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const token = lastTokenRef.current ?? getStoredFcmToken();
      if (token) {
        unregisterFcmTokenFromBackend(token).catch(() => {
          /* backend may already have removed token */
        });
        lastTokenRef.current = null;
      }
      return;
    }

    if (status !== "authenticated" || !session?.user?.token) {
      return;
    }

    let cancelled = false;

    async function registerDevice() {
      try {
        if (typeof Notification === "undefined" || Notification.permission !== "granted") {
          return;
        }

        const stored = getStoredFcmToken();
        if (stored) {
          await registerFcmTokenWithBackend(stored);
          lastTokenRef.current = stored;
          return;
        }

        const currentToken = await obtainFcmDeviceToken();
        if (!currentToken || cancelled) return;

        await registerFcmTokenWithBackend(currentToken);
        lastTokenRef.current = currentToken;
      } catch {
        /* permission denied, unsupported env, or network */
      }
    }

    void registerDevice();

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.id, session?.user?.token]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.token) {
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const messaging = await getMessagingInstance();
      if (!messaging || cancelled) return;
      unsubscribe = onMessage(messaging, (payload) => {
        void queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast(payload.notification?.title || "Notification", {
          description: payload.notification?.body,
        });
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [status, session?.user?.token, queryClient]);

  return null;
}
