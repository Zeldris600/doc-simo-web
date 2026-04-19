export type AdminBroadcastAudience = "CUSTOMERS" | "ALL_USERS";

export type AdminBroadcastChannel = "in_app" | "push";

export type AdminBroadcastJobStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface AdminBroadcastStartDto {
  audience: AdminBroadcastAudience;
  title: string;
  body: string;
  channels?: AdminBroadcastChannel[];
  data?: Record<string, unknown>;
}

export interface AdminBroadcastStartResult {
  broadcastId: string;
  bullJobId?: string;
}

/** GET /notifications/admin/broadcast/:id — fields may grow with the API. */
export interface AdminBroadcastStatus {
  id: string;
  status: AdminBroadcastJobStatus;
  audience?: AdminBroadcastAudience;
  title?: string;
  body?: string;
  processedCount?: number;
  targetCount?: number | null;
  lastError?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminTopicBroadcastDto {
  title: string;
  body: string;
  /** FCM data map: string values only. */
  data?: Record<string, string>;
}

export interface AdminTopicBroadcastResult {
  success: boolean;
  messageId?: string;
}

export interface AdminTargetedSendDto {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}
