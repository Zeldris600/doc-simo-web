import type { NotificationsListResponse, UserNotification } from "@/types/notification";
import type { StandardResponse } from "@/types/api";
import { api } from "./api";

export const NotificationsService = {
  list: async (params?: {
    unreadOnly?: boolean;
    limit?: number;
    cursor?: string;
  }): Promise<NotificationsListResponse> => {
    const response = await api.get<StandardResponse<NotificationsListResponse>>("/notifications", {
      params,
    });
    return response.data.data;
  },

  markRead: async (id: string): Promise<UserNotification> => {
    const response = await api.patch<StandardResponse<UserNotification>>(
      `/notifications/${id}/read`,
    );
    return response.data.data;
  },

  /** POST /api/notifications/fcm/register — Register current device FCM token */
  registerFcmToken: async (): Promise<unknown> => {
    const response = await api.post<StandardResponse<unknown>>(
      "/notifications/fcm/register",
    );
    return response.data.data;
  },
};
