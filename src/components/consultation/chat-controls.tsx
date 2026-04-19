"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Paperclip, Mic, Send, Square, Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SupportAttachment } from "@/services/support.service";

interface ChatControlsProps {
  messageBody: string;
  setMessageBody: (val: string) => void;
  attachments: SupportAttachment[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Called immediately before opening the file picker (Socket.IO `support.uploading`). */
  onAttachClick?: () => void;
  onSend: (e: React.FormEvent) => void;
  isSending: boolean;
  uploadIsPending: boolean;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function ChatControls({
  messageBody,
  setMessageBody,
  attachments,
  onFileSelect,
  onAttachClick,
  onSend,
  isSending,
  uploadIsPending,
  isRecording,
  startRecording,
  stopRecording,
}: ChatControlsProps) {
  const t = useTranslations("supportChat.customer.composer");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const canSend =
    !isRecording &&
    !isSending &&
    (messageBody.trim().length > 0 || attachments.length > 0);

  return (
    <div className="shrink-0 border-t border-black/5 bg-[#F0F2F5] px-2 py-2 md:px-4 md:py-2">
      <form
        onSubmit={onSend}
        className="mx-auto flex max-w-3xl items-end gap-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={onFileSelect}
          className="hidden"
        />

        <div className="flex shrink-0 items-center gap-0.5 pb-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onAttachClick?.();
              fileInputRef.current?.click();
            }}
            className="h-10 w-10 rounded-full p-0 text-[#54656F] hover:bg-[#D9DDE1]"
            aria-label={t("attachAria")}
          >
            {uploadIsPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Paperclip className="h-6 w-6" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                setRecordingTime(0);
                startRecording();
              }
            }}
            className={cn(
              "h-10 w-10 rounded-full p-0 transition-colors",
              isRecording
                ? "bg-[#FF3B30] text-white hover:bg-[#E6352B]"
                : "text-[#54656F] hover:bg-[#D9DDE1]",
            )}
            aria-label={isRecording ? t("recordStopAria") : t("recordStartAria")}
          >
            {isRecording ? (
              <Square className="h-4 w-4 fill-current" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </div>

        <div className="relative min-w-0 flex-1 pb-1">
          {isRecording ? (
            <div className="flex h-11 items-center justify-between rounded-lg border border-[#D1D7DB] bg-white px-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-[13px] font-medium text-[#111B21]">
                  {t("recordingLabel", { time: formatTime(recordingTime) })}
                </span>
              </div>
              <Button
                type="button"
                onClick={stopRecording}
                variant="ghost"
                className="h-8 rounded-full px-3 text-[12px] font-semibold text-red-600 hover:bg-red-50"
              >
                {t("stop")}
              </Button>
            </div>
          ) : (
            <Textarea
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend(e as unknown as React.FormEvent);
                }
              }}
              placeholder={t("placeholder")}
              rows={1}
              className={cn(
                "max-h-32 min-h-[42px] resize-none rounded-lg border-0 bg-white py-2.5 pl-4 pr-3 text-[14px] text-[#111B21] shadow-none placeholder:text-[#54656F] focus-visible:ring-1 focus-visible:ring-primary/40",
              )}
            />
          )}
        </div>

        <div className="shrink-0 pb-1">
          <Button
            type="submit"
            disabled={!canSend}
            className={cn(
              "h-11 w-11 rounded-full p-0 shadow-none md:h-11 md:w-11",
              canSend
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-black/10 text-white hover:bg-black/10",
            )}
            aria-label={t("sendAria")}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
