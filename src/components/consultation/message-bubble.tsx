"use client";

import React from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("supportChat.customer");
  const timeLabel = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div className="max-w-[85%] md:max-w-[65%]">
        {showSenderName && !isMe && (
          <span className="mb-0.5 ml-1 block text-[12px] font-medium text-[#667781]">
            {t("senderSupportName")}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-3 py-2 text-[14px] leading-relaxed",
            isMe
              ? "rounded-br-sm bg-primary text-white"
              : "rounded-bl-sm bg-white text-[#111B21]",
          )}
        >
          {msg.body && (
            <p className={cn("whitespace-pre-wrap", isMe ? "text-white" : "text-[#111B21]")}>{msg.body}</p>
          )}

          {msg.attachments && msg.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
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
                        "block max-w-[280px] overflow-hidden rounded-md border",
                        isMe ? "border-[#B7E8B0]" : "border-black/10",
                      )}
                    >
                      <Image
                        src={att.url}
                        alt={t("attachmentAlt")}
                        width={520}
                        height={340}
                        className="w-full object-cover"
                      />
                    </a>
                  );
                }
                if (isAudio) {
                  return (
                    <div
                      key={ai}
                      className={cn(
                        "flex flex-col gap-2 rounded-md border p-2",
                        isMe ? "border-[#B7E8B0] bg-white" : "border-black/10 bg-[#F0F2F5]",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-[#54656F]" />
                        <span className="text-[12px] font-medium text-[#54656F]">
                          {t("voiceMessage")}
                        </span>
                      </div>
                      <audio controls src={att.url} className="h-8 w-full" />
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
                      "flex items-center gap-2 rounded-md border px-3 py-2 text-[13px] font-medium",
                      isMe
                        ? "border-[#B7E8B0] bg-white text-[#111B21]"
                        : "border-black/10 bg-[#F0F2F5] text-[#111B21]",
                    )}
                  >
                    <FileText className="h-4 w-4 shrink-0 text-[#54656F]" />
                    <span className="truncate">{att.originalName}</span>
                  </a>
                );
              })}
            </div>
          )}
          <div className={cn("mt-1 flex justify-end text-[10px] font-bold tabular-nums", isMe ? "text-white/70" : "text-gray-400")}>
            <span>{timeLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
