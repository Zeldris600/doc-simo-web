import { api } from "./api";

export type ThreadStatus = "OPEN" | "CLOSED";

export interface SupportThread {
  id: string;
  customerUserId: string;
  status: ThreadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  threadId: string;
  senderUserId: string;
  senderRole: "CUSTOMER" | "ADMIN";
  body: string;
  createdAt: string;
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
    const response = await api.post<CreateThreadResponse>("/support/threads", {
      firstMessage,
    });
    return response.data;
  },

  listThreads: async (params?: { limit?: number; cursor?: string }) => {
    const response = await api.get<SupportThread[]>("/support/threads", {
      params,
    });
    return response.data;
  },

  listMessages: async (
    threadId: string,
    params?: { limit?: number; cursor?: string }
  ) => {
    const response = await api.get<MessagesResponse>(
      `/support/threads/${threadId}/messages`,
      { params }
    );
    return response.data;
  },

  sendMessage: async (threadId: string, body: string) => {
    const response = await api.post<SupportMessage>(
      `/support/threads/${threadId}/messages`,
      { body }
    );
    return response.data;
  },
};
