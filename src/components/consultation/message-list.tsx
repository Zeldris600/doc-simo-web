"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./message-bubble";
import { SupportMessage } from "@/services/support.service";
import { User } from "@/types/auth";

interface MessageListProps {
  messages: SupportMessage[];
  user: User | undefined;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  getDateLabel: (date: string) => string;
}

export function MessageList({
  messages,
  user,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  getDateLabel,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 md:px-12 py-8 flex flex-col gap-6 bg-white/[0.98]"
    >
      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFetchNextPage}
          disabled={isFetchingNextPage}
          className="text-[9px] font-black uppercase tracking-widest self-center text-black/20 mb-6"
        >
          {isFetchingNextPage ? "Accessing Records..." : "Load Earlier Communication"}
        </Button>
      )}

      <div className="space-y-3 max-w-4xl mx-auto w-full">
        {messages.map((msg, index) => {
          const isMe = msg.senderUserId === user?.id;
          const prevMsg = messages[index - 1];
          const showDateSep =
            !prevMsg || getDateLabel(prevMsg.createdAt) !== getDateLabel(msg.createdAt);
          const showSenderName =
            !isMe &&
            (index === 0 || messages[index - 1].senderUserId !== msg.senderUserId);

          return (
            <React.Fragment key={msg.id}>
              {showDateSep && (
                <div className="flex justify-center py-6">
                  <span className="text-[8px] font-black uppercase tracking-widest text-black/20 bg-black/[0.01] px-4 py-1 border border-black/5 rounded-sm">
                    {getDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble msg={msg} isMe={isMe} showSenderName={showSenderName} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
