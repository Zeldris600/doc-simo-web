import { getSession } from "next-auth/react";
import { StandardResponse } from "../types/api";
import { api } from "./api";
import {
  emitWithAck,
  getRealtimeSocket,
  waitForSocketConnect,
} from "@/lib/realtime-socket";

/**
 * Support API:
 * - `POST /api/support/threads` → **410 Gone** — use Socket.IO `support.thread.create`.
 * - `POST /api/support/threads/:threadId/messages` → **410 Gone** — use Socket.IO `support.message.send`.
 * - List/read threads, messages (pagination) remain **REST** (`GET` …).
 */

export type ThreadStatus = "OPEN" | "CLOSED";

/** Nested profile from `GET /api/support/threads` (list includes `customer`). */
export interface SupportThreadCustomerProfile {
  firstName: string | null;
  lastName: string | null;
}

export interface SupportThreadCustomer {
  id: string;
  name: string;
  image: string | null;
  customer: SupportThreadCustomerProfile;
}

export interface SupportThread {
  id: string;
  customerUserId: string;
  status: ThreadStatus;
  createdAt: string;
  updatedAt: string;
  customer?: SupportThreadCustomer;
}

export function getSupportThreadDisplayName(
  thread: SupportThread,
  unnamedThreadLabel?: (shortId: string) => string,
): string {
  const c = thread.customer;
  if (c) {
    const fn = c.customer?.firstName?.trim() || "";
    const ln = c.customer?.lastName?.trim() || "";
    const combined = [fn, ln].filter(Boolean).join(" ");
    if (combined) return combined;
    const n = c.name?.trim();
    if (n) return n;
  }
  const shortId = thread.id.slice(-4);
  return unnamedThreadLabel ? unnamedThreadLabel(shortId) : `Chat #${shortId}`;
}

export function getSupportThreadInitials(
  thread: SupportThread,
  unnamedThreadLabel?: (shortId: string) => string,
): string {
  const label = getSupportThreadDisplayName(thread, unnamedThreadLabel);
  const shortId = thread.id.slice(-4);
  const unnamedResolved = unnamedThreadLabel
    ? unnamedThreadLabel(shortId)
    : `Chat #${shortId}`;
  if (label === unnamedResolved) {
    return (thread.id.slice(-2) || "?").toUpperCase();
  }
  const parts = label.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return (label.slice(0, 2) || "?").toUpperCase();
}

/** Lowercase blob for search (id, user id, names). */
export function getSupportThreadSearchBlob(
  thread: SupportThread,
  unnamedThreadLabel?: (shortId: string) => string,
): string {
  const c = thread.customer;
  return [
    thread.id,
    thread.customerUserId,
    getSupportThreadDisplayName(thread, unnamedThreadLabel),
    c?.name,
    c?.customer?.firstName,
    c?.customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export interface SupportAttachment {
  url: string;
  publicId?: string;
  mimeType?: string;
  originalName?: string;
  sizeBytes?: number;
}

export interface SupportMessage {
  id: string;
  threadId: string;
  senderUserId: string;
  senderRole: "CUSTOMER" | "ADMIN";
  body: string;
  attachments?: SupportAttachment[];
  createdAt: string;
}

export interface SendMessageDto {
  body: string;
  attachments?: SupportAttachment[];
}

/** Pusher payloads for `support.typing` / `support.uploading` / `support.sending` on `private-thread-{id}`. */
export type SupportPusherSenderRole = "ADMIN" | "CUSTOMER";

export interface SupportTypingPusherPayload {
  threadId: string;
  userId: string;
  senderRole: SupportPusherSenderRole;
  typing: boolean;
  at: string;
}

export interface SupportUploadingPusherPayload {
  threadId: string;
  userId: string;
  senderRole: SupportPusherSenderRole;
  pickerOpen: boolean;
  at: string;
}

export interface SupportSendingPusherPayload {
  threadId: string;
  userId: string;
  senderRole: SupportPusherSenderRole;
  sending: boolean;
  attachmentCount?: number;
  at: string;
}

export interface CreateThreadResponse {
  thread: SupportThread;
  firstMessage?: SupportMessage;
}

export interface MessagesResponse {
  data: SupportMessage[];
  nextCursor: string | null;
}

async function getAccessToken(): Promise<string> {
  const session = await getSession();
  const token = session?.user?.token;
  if (!token) {
    throw new Error("Not authenticated");
  }
  return token;
}

function createThreadResponseFromAck(raw: unknown): CreateThreadResponse {
  let v: unknown = raw;
  if (v && typeof v === "object" && "data" in v) {
    v = (v as { data: unknown }).data;
  }
  if (!v || typeof v !== "object") {
    throw new Error("Invalid response from support.thread.create");
  }
  const o = v as Record<string, unknown>;
  if ("thread" in o && o.thread && typeof o.thread === "object") {
    const thread = o.thread as SupportThread;
    if (typeof thread.id === "string") {
      return {
        thread,
        firstMessage: o.firstMessage as SupportMessage | undefined,
      };
    }
  }
  if ("id" in o && typeof o.id === "string") {
    return { thread: v as SupportThread };
  }
  throw new Error("Invalid response from support.thread.create");
}

function messageFromSendAck(raw: unknown): SupportMessage {
  let v: unknown = raw;
  if (v && typeof v === "object" && "data" in v) {
    v = (v as { data: unknown }).data;
  }
  if (v && typeof v === "object" && "id" in v && "threadId" in v) {
    return v as SupportMessage;
  }
  throw new Error("Invalid response from support.message.send");
}

function unwrapPresenceAck(raw: unknown): unknown {
  let v: unknown = raw;
  if (v && typeof v === "object" && "data" in v) {
    v = (v as { data: unknown }).data;
  }
  return v;
}

function assertPresenceAck(raw: unknown): void {
  const v = unwrapPresenceAck(raw);
  if (v && typeof v === "object" && "ok" in v && (v as { ok: unknown }).ok === true) {
    return;
  }
  throw new Error("Presence event rejected");
}

async function emitSupportPresence(
  event: "support.typing" | "support.uploading" | "support.sending",
  payload: Record<string, unknown>,
): Promise<void> {
  const token = await getAccessToken();
  const socket = getRealtimeSocket(token);
  await waitForSocketConnect(socket);
  const raw = await emitWithAck<unknown>(socket, event, payload);
  assertPresenceAck(raw);
}

export const SupportService = {
  /** Socket.IO `support.thread.create` (HTTP POST returns **410 Gone**). */
  createThread: async (
    firstMessage?: string,
  ): Promise<CreateThreadResponse> => {
    const token = await getAccessToken();
    const socket = getRealtimeSocket(token);
    await waitForSocketConnect(socket);
    const raw = await emitWithAck<unknown>(socket, "support.thread.create", {
      firstMessage,
    });
    return createThreadResponseFromAck(raw);
  },

  /** REST `GET /api/support/threads` */
  listThreads: async (params?: { limit?: number; cursor?: string }) => {
    const response = await api.get<StandardResponse<SupportThread[]>>(
      "/support/threads",
      {
        params,
      },
    );
    return response.data.data;
  },

  /** REST `GET /api/support/threads/:threadId/messages` */
  listMessages: async (
    threadId: string,
    params?: { limit?: number; cursor?: string },
  ) => {
    const response = await api.get<StandardResponse<MessagesResponse>>(
      `/support/threads/${threadId}/messages`,
      { params },
    );
    return response.data.data;
  },

  /** Socket.IO `support.message.send` (HTTP POST …/messages returns **410 Gone**). */
  sendMessage: async (
    threadId: string,
    data: SendMessageDto,
  ): Promise<SupportMessage> => {
    const token = await getAccessToken();
    const socket = getRealtimeSocket(token);
    await waitForSocketConnect(socket);
    const raw = await emitWithAck<unknown>(socket, "support.message.send", {
      threadId,
      body: data.body,
      attachments: data.attachments,
    });
    return messageFromSendAck(raw);
  },

  emitTyping: (threadId: string, typing: boolean) =>
    emitSupportPresence("support.typing", { threadId, typing }),

  emitUploading: (threadId: string, pickerOpen: boolean) =>
    emitSupportPresence("support.uploading", { threadId, pickerOpen }),

  emitSending: (threadId: string, sending: boolean, attachmentCount?: number) =>
    emitSupportPresence("support.sending", {
      threadId,
      sending,
      ...(typeof attachmentCount === "number" ? { attachmentCount } : {}),
    }),
};
