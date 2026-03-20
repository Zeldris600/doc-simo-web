"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupportMessages, useSendSupportMessage } from "@/hooks/use-support";
import { useCan } from "@/hooks/use-can";
import { getPusherClient } from "@/lib/pusher";
import { SupportMessage } from "@/services/support.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Loader2, MessageSquare, LifeBuoy } from "lucide-react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { MessagesResponse } from "@/services/support.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerThreadPage() {
  const { id: threadId } = useParams() as { id: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useCan();
  const [messageBody, setMessageBody] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSupportMessages(threadId);

  const sendMessageMutation = useSendSupportMessage(threadId, {
    onSuccess: () => {
      setMessageBody("");
    },
    onError: () => {
      toast.error("Failed to transmit signal to clinic.");
    }
  });

  const messages = data?.pages.flatMap((page) => page.data).reverse() || [];

  useEffect(() => {
    if (!threadId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`private-thread-${threadId}`);

    channel.bind("support.message.new", (newMessage: SupportMessage) => {
      // Optimized realtime update: append to the first page of the infinite query
      queryClient.setQueryData<InfiniteData<MessagesResponse>>(["support-messages", threadId], (oldData) => {
        if (!oldData) return oldData;
        
        // Check if message already exists
        const allMessages = oldData.pages.flatMap((page) => page.data);
        if (allMessages.some((m) => m.id === newMessage.id)) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: [newMessage, ...page.data]
              };
            }
            return page;
          })
        };
      });

      // Still invalidate to ensure backend/frontend state is fully synced
      queryClient.invalidateQueries({ queryKey: ["support-messages", threadId] });
      
      if (newMessage.senderUserId !== user?.id) {
          toast.info("A response from our clinical team has been synchronized.");
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [threadId, queryClient, user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({ body: messageBody });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4 mb-4">
           <Skeleton className="h-8 w-8 rounded-full" />
           <div className="space-y-2">
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-3 w-48" />
           </div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cn("flex flex-col", i % 2 === 0 ? "items-start" : "items-end")}>
            <Skeleton className={cn("h-16 w-[60%] rounded-2xl", i % 2 === 0 ? "rounded-bl-none" : "rounded-br-none")} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 rounded-t-xl">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-primary" />
              Clinical Consultation
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Direct Path: #{threadId.substring(0, 8)}</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 "
      >
        {hasNextPage && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-[10px] font-black uppercase tracking-widest text-primary/40"
            >
              {isFetchingNextPage ? "Syncing..." : "View Previous Signals"}
            </Button>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
            <MessageSquare className="h-12 w-12 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Awaiting interaction initiation</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderUserId === user?.id;
          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col",
                isMe ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                  isMe 
                    ? "bg-primary text-white rounded-br-none" 
                    : "bg-white text-black rounded-bl-none border border-gray-100"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                   <span className={cn(
                     "text-[8px] font-black uppercase tracking-widest",
                     isMe ? "text-white/40" : "text-black/40"
                   )}>
                     {isMe ? "You" : "Clinical Team"}
                   </span>
                </div>
                <p className="leading-relaxed font-medium">{msg.body}</p>
                <div className={cn(
                  "mt-2 text-[8px] font-bold uppercase tracking-tighter",
                   isMe ? "text-white/20" : "text-black/10"
                )}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-gray-100 rounded-b-xl flex items-center gap-4"
      >
        <Input
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Transmit a message to our clinical team..."
          className="flex-1 h-12 border-none bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium px-4 rounded-xl"
        />
        <Button 
          type="submit" 
          disabled={!messageBody.trim() || sendMessageMutation.isPending}
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0 p-0"
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
