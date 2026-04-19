import { getSession } from "next-auth/react";
import type { StandardResponse } from "@/types/api";
import type {
  AdminBroadcastStartDto,
  AdminBroadcastStartResult,
  AdminBroadcastStatus,
  AdminTargetedSendDto,
  AdminTopicBroadcastDto,
  AdminTopicBroadcastResult,
} from "@/types/admin-broadcast";
import { api } from "./api";
import {
  emitWithAck,
  getRealtimeSocket,
  waitForSocketConnect,
} from "@/lib/realtime-socket";

async function getAccessToken(): Promise<string> {
  const session = await getSession();
  const token = session?.user?.token;
  if (!token) {
    throw new Error("Not authenticated");
  }
  return token;
}

function parseSentAck(raw: unknown): { sent: number } {
  let v: unknown = raw;
  if (v && typeof v === "object" && "data" in v) {
    v = (v as { data: unknown }).data;
  }
  if (
    v &&
    typeof v === "object" &&
    "sent" in v &&
    typeof (v as { sent: unknown }).sent === "number"
  ) {
    return { sent: (v as { sent: number }).sent };
  }
  const msg =
    raw && typeof raw === "object" && "message" in raw
      ? String((raw as { message: unknown }).message)
      : "notifications.admin.send failed";
  throw new Error(msg);
}

export const AdminBroadcastService = {
  /**
   * Socket.IO `notifications.admin.send` — small explicit user lists.
   * In-app + push per user; no email.
   */
  sendTargeted: async (payload: AdminTargetedSendDto): Promise<{ sent: number }> => {
    const token = await getAccessToken();
    const socket = getRealtimeSocket(token);
    await waitForSocketConnect(socket);
    const raw = await emitWithAck<unknown>(
      socket,
      "notifications.admin.send",
      payload,
    );
    return parseSentAck(raw);
  },

  /** POST /notifications/admin/broadcast — 202 Accepted. */
  startBatched: async (
    dto: AdminBroadcastStartDto,
  ): Promise<AdminBroadcastStartResult> => {
    const response = await api.post<StandardResponse<AdminBroadcastStartResult>>(
      "/notifications/admin/broadcast",
      dto,
    );
    return response.data.data;
  },

  getStatus: async (id: string): Promise<AdminBroadcastStatus> => {
    const response = await api.get<StandardResponse<AdminBroadcastStatus>>(
      `/notifications/admin/broadcast/${encodeURIComponent(id)}`,
    );
    return response.data.data;
  },

  /** POST …/broadcast/topic — push-only to FCM topic; no in-app rows. */
  sendTopic: async (
    dto: AdminTopicBroadcastDto,
  ): Promise<AdminTopicBroadcastResult> => {
    const response = await api.post<StandardResponse<AdminTopicBroadcastResult>>(
      "/notifications/admin/broadcast/topic",
      dto,
    );
    return response.data.data;
  },
};
