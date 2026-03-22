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
import { SupportMessage, SupportAttachment } from "@/services/support.service";
import { ShieldPlus, ChevronLeft } from "lucide-react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MessagesResponse } from "@/services/support.service";
import { useUploadMultipleMedia } from "@/hooks/use-media";
import { useRouter, useParams } from "next/navigation";
import { ConsultationSkeleton } from "@/components/skeletons/consultation-skeleton";

// Sub-components
import { ThreadRegistry } from "@/components/consultation/thread-registry";
import { MessageList } from "@/components/consultation/message-list";
import { ChatControls } from "@/components/consultation/chat-controls";
import { AttachmentPreview } from "@/components/consultation/attachment-preview";

export default function ConsultationPage() {
  const { user, isLoading: isLoadingAuth } = useCan();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [messageBody, setMessageBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachments, setAttachments] = useState<SupportAttachment[]>([]);
  const uploadMutation = useUploadMultipleMedia();

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const params = useParams();
  const locale = (params.locale as string) || "en";

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showThreadList, setShowThreadList] = useState(true);

  // Auth Redirect
  useEffect(() => {
    if (!user && !isLoadingAuth) {
      router.push(`/${locale}/login`);
    }
  }, [user, isLoadingAuth, router, locale]);

  const { data: threadsData, isLoading: isLoadingThreads } = useSupportThreads({ limit: 50 });

  // Set initial active thread when records arrive
  useEffect(() => {
    if (threadsData?.length && !activeThreadId) {
      const defaultId = threadsData[0].id;
      Promise.resolve().then(() => {
        setActiveThreadId(defaultId);
      });
    }
  }, [threadsData, activeThreadId]);

  const activeThread = threadsData?.find((t) => t.id === activeThreadId) || threadsData?.[0];
  const threadId = activeThread?.id;

  const createThreadMutation = useCreateSupportThread({
    onSuccess: (newThread) => {
      toast.success("Consultation successfully started.");
      setActiveThreadId(newThread.thread.id);
      setShowThreadList(false);
    },
    onError: () => {
      toast.error("Failed to start consultation.");
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
      toast.error("Failed to send message.");
    },
  });

  const messages = messagesData?.pages.flatMap((page) => page.data).reverse() || [];

  const filteredThreads =
    threadsData?.filter(
      (t) =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customerUserId.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          toast.success("Attachment ready");
        },
        onError: () => toast.error("Upload failed"),
      }
    );
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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
              toast.success("Audio recorded");
            },
            onError: () => toast.error("Audio upload failed"),
          }
        );
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied");
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
    const channel = pusher.subscribe(`private-thread-${threadId}`);

    channel.bind("support.message.new", (newMessage: SupportMessage) => {
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
        }
      );
      queryClient.invalidateQueries({ queryKey: ["support-messages", threadId] });
      if (newMessage.senderUserId !== user?.id) {
        toast.info("Clinical update received");
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [threadId, queryClient, user?.id, user?.token]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageBody.trim() && attachments.length === 0) || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({
      body: messageBody,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  if (isLoadingAuth || isLoadingThreads || user === undefined) {
    return <ConsultationSkeleton />;
  }

  return (
    <div className="fixed inset-0 bg-white flex overflow-hidden">
      {/* Sidebar Panel */}
      <div className={cn(!showThreadList && "hidden md:block")}>
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

      {/* Main Support Panel */}
      <main className={cn("flex-1 flex flex-col bg-white transition-all", showThreadList && "hidden md:flex")}>
        <header className="flex items-center justify-between px-6 h-16 border-b border-black/5 bg-white shrink-0 z-20">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => setShowThreadList(true)}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-sm hover:bg-black/5 text-black/40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-8 w-8 rounded-full bg-black/[0.03] flex items-center justify-center border border-black/5">
              <ShieldPlus className="h-4 w-4 text-black" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[11px] font-black text-black tracking-[0.1em] uppercase">Clinical Support Channel</h1>
              <div className="flex items-center gap-1.5 leading-none">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Live session</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="px-3 py-1.5 bg-black/[0.02] text-[8px] font-black text-black/40 border border-black/5 rounded-sm uppercase tracking-widest">
              Secure Room
            </div>
          </div>
        </header>

        <MessageList
          messages={messages}
          user={user}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onFetchNextPage={fetchNextPage}
          getDateLabel={getDateLabel}
        />

        <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />

        <ChatControls
          messageBody={messageBody}
          setMessageBody={setMessageBody}
          attachments={attachments}
          onFileSelect={handleFileSelect}
          onSend={handleSend}
          isSending={sendMessageMutation.isPending}
          uploadIsPending={uploadMutation.isPending}
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />

        <div className="text-center pb-5 mt-auto">
          <span className="text-[8px] font-black uppercase tracking-[0.6em] text-black/5">
            Clinical Encrypted Recording Corridor Protocol
          </span>
        </div>
      </main>
    </div>
  );
}
