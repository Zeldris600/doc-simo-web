"use client";

import { io, type Socket } from "socket.io-client";
import { getApiHttpOrigin } from "@/lib/api-origin";

let socket: Socket | null = null;
let currentToken: string | null = null;

/**
 * Socket.IO `/realtime` namespace (RPC-style). Same session as REST: cookies + Bearer.
 */
export function getRealtimeSocket(accessToken: string): Socket {
  if (socket?.connected && currentToken === accessToken) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = accessToken;
  const origin = getApiHttpOrigin();
  if (!origin) {
    throw new Error("Missing NEXT_PUBLIC_API_URL for realtime connection");
  }

  socket = io(`${origin}/realtime`, {
    path: "/socket.io",
    transports: ["websocket"],
    withCredentials: true,
    auth: { token: accessToken },
  });

  return socket;
}

export function disconnectRealtimeSocket(): void {
  socket?.disconnect();
  socket = null;
  currentToken = null;
}

export function waitForSocketConnect(s: Socket): Promise<void> {
  return new Promise((resolve, reject) => {
    if (s.connected) {
      resolve();
      return;
    }
    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onError = (err: Error) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      s.off("connect", onConnect);
      s.off("connect_error", onError);
    };
    s.once("connect", onConnect);
    s.once("connect_error", onError);
  });
}

export function emitWithAck<T>(
  socket: Socket,
  event: string,
  payload: unknown,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${event} timed out`));
    }, 60_000);

    socket.emit(event, payload, (res: unknown) => {
      clearTimeout(timer);
      resolve(res as T);
    });
  });
}
