"use client";

import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  SupportService,
  SupportMessage,
  MessagesResponse,
  CreateThreadResponse,
  SendMessageDto,
} from "@/services/support.service";
import { ApiError } from "@/types/api";

export function useSupportThreads(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: ["support-threads", params],
    queryFn: () => SupportService.listThreads(params),
  });
}

export function useSupportMessages(
  threadId: string,
  params?: { limit?: number }
) {
  return useInfiniteQuery({
    queryKey: ["support-messages", threadId],
    queryFn: ({ pageParam }: { pageParam: unknown }) =>
      SupportService.listMessages(threadId, { ...params, cursor: pageParam as string }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: MessagesResponse) => lastPage.nextCursor || undefined,
    enabled: !!threadId,
  });
}

export function useCreateSupportThread(
  opt?: UseMutationOptions<CreateThreadResponse, ApiError, string | undefined>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (firstMessage?: string) => SupportService.createThread(firstMessage),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({ queryKey: ["support-threads"] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}

export function useSendSupportMessage(
  threadId: string,
  opt?: UseMutationOptions<SupportMessage, ApiError, SendMessageDto>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageDto) => SupportService.sendMessage(threadId, data),
    ...opt,
    onSuccess: (data, ...rest) => {
      queryClient.invalidateQueries({ queryKey: ["support-messages", threadId] });
      opt?.onSuccess?.(data, ...rest);
    },
  });
}
