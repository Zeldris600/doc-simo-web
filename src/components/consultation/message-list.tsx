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

/** Subtle tile like WhatsApp Web chat wallpaper */
function chatWallpaperStyle(): React.CSSProperties {
  return {
    backgroundColor: "#F5F7F5",
  };
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
      style={chatWallpaperStyle()}
      className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2 md:px-6 md:py-3"
    >
      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onFetchNextPage}
          disabled={isFetchingNextPage}
          className="mb-2 self-center rounded-full bg-[#FFFFFF]/90 px-4 py-1 text-[12px] font-medium text-[#54656F] shadow-sm hover:bg-white"
        >
          {isFetchingNextPage ? "Loading…" : "Load older messages"}
        </Button>
      )}

      <div className="mx-auto w-full max-w-3xl space-y-1">
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
                <div className="flex justify-center py-3">
                  <span className="rounded-lg bg-[#FFFFFF]/95 px-3 py-1 text-[12px] font-medium text-[#54656F] shadow-sm">
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
