import { getMessagingInstance, VAPID_KEY } from "@/lib/firebase";
import { getToken } from "firebase/messaging";
import { api } from "@/services/api";

const FCM_REGISTER_PATH = "/notifications/fcm/register";
export const FCM_TOKEN_STORAGE_KEY = "doctasimo:fcm-token";

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export async function obtainFcmDeviceToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return null;
  }

  const firebaseConfig = getFirebaseConfig();
  const swUrl = `/firebase-messaging-sw.js?firebaseConfig=${encodeURIComponent(
    JSON.stringify(firebaseConfig),
  )}`;

  let registration: ServiceWorkerRegistration | undefined;
  if ("serviceWorker" in navigator) {
    registration = await navigator.serviceWorker.register(swUrl);
  }

  const messaging = await getMessagingInstance();
  if (!messaging) {
    return null;
  }

  return getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
}

export async function registerFcmTokenWithBackend(token: string): Promise<void> {
  await api.post(FCM_REGISTER_PATH, { token });
  if (typeof window !== "undefined") {
    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
  }
}

export async function unregisterFcmTokenFromBackend(
  token: string,
): Promise<void> {
  await api.delete(FCM_REGISTER_PATH, { data: { token } });
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
    if (stored === token) {
      localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
    }
  }
}

export function getStoredFcmToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
}

/** Request permission, obtain token, and persist on the API. */
export async function enablePushNotifications(): Promise<{
  ok: boolean;
  reason?: "unsupported" | "denied" | "no-token" | "network";
}> {
  try {
    const token = await obtainFcmDeviceToken();
    if (!token) {
      const permission =
        typeof Notification !== "undefined"
          ? Notification.permission
          : "denied";
      if (permission === "denied") {
        return { ok: false, reason: "denied" };
      }
      return { ok: false, reason: "no-token" };
    }
    await registerFcmTokenWithBackend(token);
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function disablePushNotifications(): Promise<void> {
  const token = getStoredFcmToken();
  if (token) {
    await unregisterFcmTokenFromBackend(token).catch(() => undefined);
  }
}
