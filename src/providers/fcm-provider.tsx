"use client";

import { useEffect } from "react";
import { getMessagingInstance, VAPID_KEY } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner"; // Using sonner as from package.json
import { api } from "@/services/api";

export function FCMProvider() {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        console.log("Requesting notification permission...");
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
          const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          };

          const swUrl = `/firebase-messaging-sw.js?firebaseConfig=${encodeURIComponent(
            JSON.stringify(firebaseConfig)
          )}`;

          // Register service worker with config
          let registration;
          if ("serviceWorker" in navigator) {
            registration = await navigator.serviceWorker.register(swUrl);
            console.log("Service Worker registered with scope:", registration.scope);
          }

          const messaging = await getMessagingInstance();

          if (messaging) {
            const currentToken = await getToken(messaging, {
              vapidKey: VAPID_KEY,
              serviceWorkerRegistration: registration,
            });
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              try {
                await api.post("/notifications/fcm/register", { token: currentToken });
                console.log("Token registered with the backend.");
              } catch (registerError) {
                console.error("Failed to register token with backend:", registerError);
              }
            } else {
              console.log("No registration token available. Request permission to generate one.");
            }
          }
        } else {
          console.log("Unable to get permission to notify.");
        }
      } catch (error) {
        console.error("An error occurred while retrieving token. ", error);
      }
    };

    requestPermission();

    // Listen for foreground messages
    const setupForegroundListener = async () => {
      const messaging = await getMessagingInstance();
      if (messaging) {
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log("Message received in foreground: ", payload);

          // Show toast notification for foreground messages
          toast(payload.notification?.title || "New Notification", {
            description: payload.notification?.body,
          });
        });

        // returning unsubscribe for this local scope. It's tricky to handle clean up of async
        // so we just rely on standard Next.js lifecycle, which usually is fine for global singletons.
        // If we really want to return it:
        return unsubscribe;
      }
    };
    
    // We cannot easily return a promise from useEffect, so we just run it
    setupForegroundListener();
  }, []);

  return null; // This is a logic-only component provider
}
