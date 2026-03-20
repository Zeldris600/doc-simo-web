import { StandardResponse } from "../types/api";
import { api } from "./api";

export type ThreadStatus = "OPEN" | "CLOSED";

export interface SupportThread {
  id: string;
  customerUserId: string;
  status: ThreadStatus;
  createdAt: string;
  updatedAt: string;
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

export interface CreateThreadResponse {
  thread: SupportThread;
  firstMessage?: SupportMessage;
}

export interface MessagesResponse {
  data: SupportMessage[];
  nextCursor: string | null;
}

export const SupportService = {
  createThread: async (firstMessage?: string) => {
    const response = await api.post<StandardResponse<CreateThreadResponse>>("/support/threads", {
      firstMessage,
    });
    return response.data.data;
  },

  listThreads: async (params?: { limit?: number; cursor?: string }) => {
    const response = await api.get<StandardResponse<SupportThread[]>>("/support/threads", {
      params,
    });
    return response.data.data;
  },

  listMessages: async (
    threadId: string,
    params?: { limit?: number; cursor?: string }
  ) => {
    const response = await api.get<StandardResponse<MessagesResponse>>(
      `/support/threads/${threadId}/messages`,
      { params }
    );
    return response.data.data;
  },

  sendMessage: async (threadId: string, data: SendMessageDto) => {
    const response = await api.post<StandardResponse<SupportMessage>>(
      `/support/threads/${threadId}/messages`,
      data
    );
    return response.data.data;
  },
};
