"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { NotificationsService } from "@/services/notifications.service";
import type { UserNotification } from "@/types/notification";
import type { ApiError } from "@/types/api";

export function useNotificationsInfinite(
  params: { unreadOnly?: boolean; limit?: number },
  options?: { enabled?: boolean },
) {
  const limit = params.limit ?? 20;
  return useInfiniteQuery({
    queryKey: ["notifications", "infinite", params.unreadOnly ?? false, limit],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      NotificationsService.list({
        unreadOnly: params.unreadOnly,
        limit,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: options?.enabled ?? true,
  });
}

export function useMarkNotificationRead(
  opt?: UseMutationOptions<UserNotification, ApiError, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotificationsService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    ...opt,
  });
}
