"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useSupportThreads,
  useSupportMessages,
  useCreateSupportThread,
  useSendSupportMessage,
} from "@/hooks/use-support";
import { useCan } from "@/hooks/use-can";
import { getPusherClient } from "@/lib/pusher";
import {
  SupportMessage,
  SupportAttachment,
  SupportService,
  getSupportThreadDisplayName,
  getSupportThreadInitials,
  getSupportThreadSearchBlob,
} from "@/services/support.service";
import { ChevronLeft } from "@/lib/icons";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessagesResponse } from "@/services/support.service";
import { useRouter, useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ConsultationSkeleton } from "@/components/skeletons/consultation-skeleton";

import { ThreadRegistry } from "@/components/consultation/thread-registry";
import { MessageList } from "@/components/consultation/message-list";
import { ChatControls } from "@/components/consultation/chat-controls";
import { AttachmentPreview } from "@/components/consultation/attachment-preview";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useUploadMultipleMedia } from "@/hooks/use-media";
import { useSupportTypingEmit } from "@/hooks/use-support-typing-emit";
import { useRemoteSupportPresence } from "@/hooks/use-remote-support-presence";

export default function ConsultationPage() {
  const t = useTranslations("supportChat.customer");
  const tPresence = useTranslations("supportChat.presence");
  const tDate = useTranslations("supportChat.date");
  const locale = useLocale();
  const { user, isLoading: isLoadingAuth } = useCan();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [messageBody, setMessageBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const uploadMutation = useUploadMultipleMedia();

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const filePickerSessionRef = useRef(false);

  const params = useParams();

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showThreadList, setShowThreadList] = useState(true);

  useEffect(() => {
    if (!user && !isLoadingAuth) {
      router.push(`/${locale}/login`);
    }
  }, [user, isLoadingAuth, router, locale]);

  const { data: threadsData, isLoading: isLoadingThreads } = useSupportThreads({
    limit: 50,
  });

  useEffect(() => {
    if (threadsData?.length && !activeThreadId) {
      const defaultId = threadsData[0].id;
      Promise.resolve().then(() => {
        setActiveThreadId(defaultId);
      });
    }
  }, [threadsData, activeThreadId]);

  const activeThread =
    threadsData?.find((t) => t.id === activeThreadId) || threadsData?.[0];
  const threadId = activeThread?.id;

  const { statusLine: presenceStatusLine } = useRemoteSupportPresence(
    threadId,
    user?.token,
    user?.id,
  );
  const peerOnlineLabel = tPresence("peerOnline", {
    name: t("senderSupportName"),
  });

  useSupportTypingEmit(threadId, messageBody, Boolean(threadId));

  useEffect(() => {
    const onWinFocus = () => {
      if (!filePickerSessionRef.current || !threadId) return;
      filePickerSessionRef.current = false;
      SupportService.emitUploading(threadId, false).catch(() => {});
    };
    window.addEventListener("focus", onWinFocus);
    return () => window.removeEventListener("focus", onWinFocus);
  }, [threadId]);

  const createThreadMutation = useCreateSupportThread({
    onSuccess: (newThread) => {
      toast.success(t("toastChatStarted"));
      setActiveThreadId(newThread.thread.id);
      setShowThreadList(false);
    },
    onError: () => {
      toast.error(t("toastChatStartFailed"));
    },
  });

  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSupportMessages(threadId as string, { limit: 50 });

  const sendMessageMutation = useSendSupportMessage(threadId as string, {
    onSuccess: () => {
      setMessageBody("");
      setAttachments([]);
      setIsRecording(false);
    },
    onError: () => {
      toast.error(t("toastSendFailed"));
    },
  });

  const messages = messagesData?.pages.flatMap((page) => page.data).reverse() || [];

  const unnamedThread = (suffix: string) => t("unnamedThread", { suffix });
  const q = searchQuery.toLowerCase().trim();
  const filteredThreads =
    threadsData?.filter(
      (thread) => !q || getSupportThreadSearchBlob(thread, unnamedThread).includes(q),
    ) || [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    filePickerSessionRef.current = false;
    if (threadId) {
      SupportService.emitUploading(threadId, false).catch(() => {});
    }
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    uploadMutation.mutate(
      { files },
      {
        onSuccess: (res) => {
          const newAttachments: SupportAttachment[] = res.map((item, i) => ({
            url: item.url,
            publicId: item.publicId,
            mimeType: files[i]?.type || "application/octet-stream",
            originalName: files[i]?.name || "attached_file",
            sizeBytes: files[i]?.size || 0,
          }));
          setAttachments((prev) => [...prev, ...newAttachments]);
          toast.success(t("toastAttachmentReady"));
        },
        onError: () => toast.error(t("toastUploadFailed")),
      },
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });

        uploadMutation.mutate(
          { files: [file] },
          {
            onSuccess: (res) => {
              const att: SupportAttachment = {
                url: res[0].url,
                publicId: res[0].publicId,
                mimeType: "audio/webm",
                originalName: "Voice Note",
                sizeBytes: audioBlob.size,
              };
              setAttachments((prev) => [...prev, att]);
              toast.success(t("toastAudioRecorded"));
            },
            onError: () => toast.error(t("toastAudioUploadFailed")),
          },
        );
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      toast.error(t("toastMicDenied"));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!threadId || !user?.token) return;
    const pusher = getPusherClient(user.token);
    if (!pusher) return;
    const channel = pusher.subscribe(`private-thread-${threadId}`);

    const onMessageNew = (newMessage: SupportMessage) => {
      queryClient.setQueryData<InfiniteData<MessagesResponse>>(
        ["support-messages", threadId],
        (oldData) => {
          if (!oldData) return oldData;
          const allMessages = oldData.pages.flatMap((page) => page.data);
          if (allMessages.some((m) => m.id === newMessage.id)) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) return { ...page, data: [newMessage, ...page.data] };
              return page;
            }),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["support-messages", threadId] });
      if (newMessage.senderUserId !== user?.id) {
        toast.info(t("toastNewMessage"));
      }
    };

    const onCallStarted = () => {
      toast.info(t("toastCallStarted"));
    };

    const onCallEnded = () => {
      toast.info(t("toastCallEnded"));
    };

    channel.bind("support.message.new", onMessageNew);
    channel.bind("support.call.started", onCallStarted);
    channel.bind("support.call.ended", onCallEnded);

    return () => {
      channel.unbind("support.message.new", onMessageNew);
      channel.unbind("support.call.started", onCallStarted);
      channel.unbind("support.call.ended", onCallEnded);
      channel.unsubscribe();
    };
  }, [threadId, queryClient, user?.id, user?.token, t]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!messageBody.trim() && attachments.length === 0) ||
      sendMessageMutation.isPending ||
      !threadId
    )
      return;
    const n = attachments.length;
    await SupportService.emitSending(
      threadId,
      true,
      n > 0 ? n : undefined,
    ).catch(() => {});
    try {
      await sendMessageMutation.mutateAsync({
        body: messageBody,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    } finally {
      await SupportService.emitSending(threadId, false).catch(() => {});
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return tDate("today");
    if (date.toDateString() === yesterday.toDateString()) return tDate("yesterday");
    return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
  };

  if (isLoadingAuth || isLoadingThreads || user === undefined) {
    return <ConsultationSkeleton />;
  }

  const chatTitle = activeThread
    ? getSupportThreadDisplayName(activeThread, unnamedThread)
    : t("pageTitle");
  const chatHeaderInitials = activeThread
    ? getSupportThreadInitials(activeThread, unnamedThread)
    : "?";
  const chatHeaderAvatarUrl = activeThread?.customer?.image;

  return (
    <div className="fixed inset-0 z-40 flex overflow-hidden bg-[#F5F7F5]">
      <div
        className={cn(
          "flex h-full min-h-0 w-full max-w-[1600px] flex-1 overflow-hidden md:mx-auto md:my-4 md:max-h-[calc(100vh-2rem)] md:rounded-2xl md:border md:border-black/5",
        )}
      >
        <div className={cn(!showThreadList && "hidden md:flex md:min-h-0")}>
          <ThreadRegistry
            threads={filteredThreads}
            activeThreadId={activeThreadId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onThreadSelect={(id) => {
              setActiveThreadId(id);
              setShowThreadList(false);
            }}
            createMutation={createThreadMutation}
            getDateLabel={getDateLabel}
          />
        </div>

        <main
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col bg-white",
            showThreadList && "hidden md:flex",
          )}
        >
          <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-[#D1D7DB] bg-[#F0F2F5] px-2 md:px-4">
            <button
              type="button"
              onClick={() => setShowThreadList(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#54656F] hover:bg-[#D9DDE1] md:hidden"
              aria-label={t("backToChatsAria")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-primary/10">
              {chatHeaderAvatarUrl ? (
                <Image
                  src={chatHeaderAvatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[14px] font-bold text-primary">
                  {chatHeaderInitials}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-bold text-foreground">
                {chatTitle}
              </h1>
              <p className="truncate text-[11px] font-medium text-emerald-600">
                {presenceStatusLine ?? peerOnlineLabel}
              </p>
            </div>
          </header>

          <MessageList
            messages={messages}
            user={user}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onFetchNextPage={fetchNextPage}
            getDateLabel={getDateLabel}
            presenceStatusLine={presenceStatusLine}
          />

          <AttachmentPreview
            attachments={attachments}
            onRemove={removeAttachment}
          />

          <ChatControls
            messageBody={messageBody}
            setMessageBody={setMessageBody}
            attachments={attachments}
            onFileSelect={handleFileSelect}
            onAttachClick={() => {
              if (!threadId) return;
              filePickerSessionRef.current = true;
              SupportService.emitUploading(threadId, true).catch(() => {});
            }}
            onSend={handleSend}
            isSending={sendMessageMutation.isPending}
            uploadIsPending={uploadMutation.isPending}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        </main>
      </div>
    </div>
  );
}
