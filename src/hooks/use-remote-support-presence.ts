"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getPusherClient } from "@/lib/pusher";
import {
  SupportSendingPusherPayload,
  SupportTypingPusherPayload,
  SupportUploadingPusherPayload,
} from "@/services/support.service";

type RemotePresenceState = {
  typing: boolean;
  pickerOpen: boolean;
  sending: boolean;
  attachmentCount?: number;
};

const initial: RemotePresenceState = {
  typing: false,
  pickerOpen: false,
  sending: false,
};

function isOurUserId(payload: { userId: string }, selfId: string | undefined) {
  return Boolean(selfId && payload.userId === selfId);
}

/**
 * Subscribes to peer presence on `private-thread-{threadId}` (typing / picker / sending).
 */
export function useRemoteSupportPresence(
  threadId: string | null | undefined,
  token: string | undefined,
  currentUserId: string | undefined,
) {
  const t = useTranslations("supportChat.presence");
  const [state, setState] = useState<RemotePresenceState>(initial);
  const typingStaleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!threadId || !token) return;

    const pusher = getPusherClient(token);
    if (!pusher) return;

    const channel = pusher.subscribe(`private-thread-${threadId}`);

    const clearTypingStale = () => {
      if (typingStaleTimerRef.current) {
        clearTimeout(typingStaleTimerRef.current);
        typingStaleTimerRef.current = null;
      }
    };

    const onTyping = (data: SupportTypingPusherPayload) => {
      if (isOurUserId(data, currentUserId)) return;
      clearTypingStale();
      setState((s) => ({ ...s, typing: data.typing }));
      if (data.typing) {
        typingStaleTimerRef.current = setTimeout(() => {
          setState((s) => (s.typing ? { ...s, typing: false } : s));
          typingStaleTimerRef.current = null;
        }, 8000);
      }
    };

    const onUploading = (data: SupportUploadingPusherPayload) => {
      if (isOurUserId(data, currentUserId)) return;
      setState((s) => ({ ...s, pickerOpen: data.pickerOpen }));
    };

    const onSending = (data: SupportSendingPusherPayload) => {
      if (isOurUserId(data, currentUserId)) return;
      setState((s) => ({
        ...s,
        sending: data.sending,
        attachmentCount: data.sending ? data.attachmentCount : undefined,
      }));
    };

    channel.bind("support.typing", onTyping);
    channel.bind("support.uploading", onUploading);
    channel.bind("support.sending", onSending);

    return () => {
      clearTypingStale();
      channel.unbind("support.typing", onTyping);
      channel.unbind("support.uploading", onUploading);
      channel.unbind("support.sending", onSending);
      channel.unsubscribe();
    };
  }, [threadId, token, currentUserId]);

  const statusLine = useMemo(() => {
    if (state.sending) {
      const n = state.attachmentCount;
      if (typeof n === "number" && n > 1) return t("sendingMany", { count: n });
      return t("sendingOne");
    }
    if (state.pickerOpen) return t("choosingAttachment");
    if (state.typing) return t("typing");
    return null;
  }, [state, t]);

  return { state, statusLine };
}
