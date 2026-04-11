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
      className="flex-1 overflow-y-auto px-4 md:px-10 py-6 flex flex-col gap-6 bg-[#f7faf7]"
    >
      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFetchNextPage}
          disabled={isFetchingNextPage}
          className="text-[10px] font-semibold uppercase tracking-wider self-center text-black/40 mb-4 hover:bg-black/5"
        >
          {isFetchingNextPage ? "Accessing Records..." : "Load Earlier Communication"}
        </Button>
      )}

      <div className="space-y-2 max-w-4xl mx-auto w-full">
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
                <div className="flex justify-center py-5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/45 bg-white/70 backdrop-blur px-4 py-1.5 border border-black/5 rounded-full shadow-sm">
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
