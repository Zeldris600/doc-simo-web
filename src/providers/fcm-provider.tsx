"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getMessagingInstance, VAPID_KEY } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { api } from "@/services/api";

const FCM_REGISTER_PATH = "/notifications/fcm/register";

async function unregisterFcmToken(token: string) {
  await api.delete(FCM_REGISTER_PATH, { data: { token } });
}

export function FCMProvider() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      const t = lastTokenRef.current;
      if (t) {
        unregisterFcmToken(t).catch(() => {
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
        const permission = await Notification.requestPermission();
        if (permission !== "granted" || cancelled) return;

        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        const swUrl = `/firebase-messaging-sw.js?firebaseConfig=${encodeURIComponent(
          JSON.stringify(firebaseConfig),
        )}`;

        let registration: ServiceWorkerRegistration | undefined;
        if ("serviceWorker" in navigator) {
          registration = await navigator.serviceWorker.register(swUrl);
        }

        const messaging = await getMessagingInstance();
        if (!messaging || cancelled) return;

        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!currentToken || cancelled) return;

        await api.post(FCM_REGISTER_PATH, { token: currentToken });
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
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const messaging = await getMessagingInstance();
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        void queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast(payload.notification?.title || "Notification", {
          description: payload.notification?.body,
        });
      });
    })();

    return () => {
      unsubscribe?.();
    };
  }, [queryClient]);

  return null;
}
