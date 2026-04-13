/** In-app notification from GET /notifications (not the browser Notification API). */
export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
  /** Optional deep link or metadata from the backend */
  data?: { url?: string } | Record<string, unknown>;
}

export interface NotificationsListResponse {
  data: UserNotification[];
  nextCursor: string | null;
}
