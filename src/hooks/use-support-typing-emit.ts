"use client";

import { useEffect, useRef } from "react";
import { SupportService } from "@/services/support.service";

const IDLE_MS = 4500;
const KEEPALIVE_MS = 2800;

/**
 * Emits Socket.IO `support.typing` with idle stop, keep-alive while composing, and cleanup on thread change.
 */
export function useSupportTypingEmit(
  threadId: string | null | undefined,
  messageBody: string,
  enabled: boolean,
) {
  const bodyRef = useRef(messageBody);
  bodyRef.current = messageBody;

  useEffect(() => {
    if (!threadId || !enabled) return;

    if (!messageBody.trim()) {
      SupportService.emitTyping(threadId, false).catch(() => {});
      return;
    }

    const emit = (typing: boolean) =>
      SupportService.emitTyping(threadId, typing).catch(() => {});

    emit(true);
    const keepAlive = window.setInterval(() => {
      if (bodyRef.current.trim()) emit(true);
    }, KEEPALIVE_MS);
    const idleTimer = window.setTimeout(() => {
      window.clearInterval(keepAlive);
      emit(false);
    }, IDLE_MS);

    return () => {
      window.clearInterval(keepAlive);
      window.clearTimeout(idleTimer);
    };
  }, [messageBody, threadId, enabled]);

  useEffect(() => {
    const tid = threadId;
    const run = enabled;
    return () => {
      if (tid && run) {
        SupportService.emitTyping(tid, false).catch(() => {});
      }
    };
  }, [threadId, enabled]);
}
