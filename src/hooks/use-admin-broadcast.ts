"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminBroadcastService } from "@/services/admin-broadcast.service";
import type {
  AdminBroadcastStartDto,
  AdminTargetedSendDto,
  AdminTopicBroadcastDto,
} from "@/types/admin-broadcast";

export function useAdminBroadcastPoll(broadcastId: string | null) {
  return useQuery({
    queryKey: ["admin-broadcast-status", broadcastId],
    queryFn: () => AdminBroadcastService.getStatus(broadcastId as string),
    enabled: Boolean(broadcastId),
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      if (!s || s === "COMPLETED" || s === "FAILED") return false;
      return 2000;
    },
  });
}

export function useSendTargetedAdminNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AdminTargetedSendDto) =>
      AdminBroadcastService.sendTargeted(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useStartAdminBroadcast() {
  return useMutation({
    mutationFn: (dto: AdminBroadcastStartDto) =>
      AdminBroadcastService.startBatched(dto),
  });
}

export function useSendAdminTopicBroadcast() {
  return useMutation({
    mutationFn: (dto: AdminTopicBroadcastDto) =>
      AdminBroadcastService.sendTopic(dto),
  });
}
