"use client";

import React from "react";
import Image from "next/image";
import { FileText, Volume2 } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { SupportMessage } from "@/services/support.service";

interface MessageBubbleProps {
  msg: SupportMessage;
  isMe: boolean;
  showSenderName: boolean;
}

export function MessageBubble({ msg, isMe, showSenderName }: MessageBubbleProps) {
  const timeLabel = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("w-full flex", isMe ? "justify-end" : "justify-start")}>
      <div className="max-w-[92%] md:max-w-[70%]">
        {showSenderName && !isMe && (
          <span className="block text-[11px] font-semibold text-black/60 mb-1.5 ml-2">
            Medical Team
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[13px] md:text-sm font-medium leading-relaxed border shadow-sm",
            isMe
              ? "bg-primary text-white border-white/10 shadow-primary/10"
              : "bg-white text-black border-black/5",
          )}
        >
        {msg.body && (
          <p className={cn("whitespace-pre-wrap", isMe ? "text-white/95" : "text-black/80")}>
            {msg.body}
          </p>
        )}
        
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="mt-4 space-y-3">
            {msg.attachments.map((att, ai) => {
              const isImage = att.mimeType?.startsWith("image/");
              const isAudio = att.mimeType?.startsWith("audio/");
              
              if (isImage) {
                return (
                  <a
                    key={ai}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "block rounded-xl overflow-hidden max-w-[360px] border",
                      isMe ? "border-white/10" : "border-black/5",
                    )}
                  >
                    <Image
                      src={att.url}
                      alt="Clinical Image"
                      width={520}
                      height={340}
                      className="object-cover w-full"
                    />
                  </a>
                );
              }
              if (isAudio) {
                return (
                  <div
                    key={ai}
                    className={cn(
                      "flex flex-col gap-2 p-3 rounded-xl border",
                      isMe ? "border-white/10 bg-white/10" : "border-black/5 bg-[#fbfbfb]",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span className={cn("text-[11px] font-semibold", isMe ? "text-white/90" : "text-black/70")}>
                        Voice note
                      </span>
                    </div>
                    <audio controls src={att.url} className="w-full h-8" />
                  </div>
                );
              }
              return (
                <a
                  key={ai}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border text-[12px] font-medium",
                    isMe ? "border-white/10 bg-white/10 text-white/90" : "border-black/10 bg-white text-black/80",
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span className="truncate">{att.originalName}</span>
                </a>
              );
            })}
          </div>
        )}
        <div className={cn("mt-2 text-[11px] text-right", isMe ? "text-white/60" : "text-black/35")}>
          {timeLabel}
        </div>
        </div>
      </div>
    </div>
  );
}
