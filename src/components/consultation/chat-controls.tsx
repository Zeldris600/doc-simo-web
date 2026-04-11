"use client";

import React, { useState, useEffect, useRef } from "react";
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
  onSend,
  isSending,
  uploadIsPending,
  isRecording,
  startRecording,
  stopRecording,
}: ChatControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
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
    !isRecording && !isSending && (messageBody.trim().length > 0 || attachments.length > 0);

  return (
    <div className="px-4 md:px-8 py-4 border-t border-black/5 bg-white/80 backdrop-blur shrink-0">
      <form
        onSubmit={onSend}
        className="max-w-4xl mx-auto flex items-end gap-2 md:gap-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={onFileSelect}
          className="hidden"
        />

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 w-10 p-0 rounded-full bg-white border-black/10 text-black/55 shadow-none hover:bg-black/5"
            aria-label="Attach files"
          >
            {uploadIsPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                setRecordingTime(0);
                startRecording();
              }
            }}
            className={cn(
              "h-10 w-10 p-0 rounded-full border-black/10 shadow-none transition-all",
              isRecording
                ? "bg-red-500 text-white border-red-500 animate-pulse"
                : "bg-white text-black/55 hover:bg-black/5",
            )}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>

        <div className="relative flex-1">
          {isRecording ? (
            <div className="h-10 flex items-center justify-between px-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[12px] font-semibold text-red-600 leading-none">
                  Recording {formatTime(recordingTime)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-500/40 rounded-full animate-pulse"
                    style={{
                      height: `${[4, 12, 16, 8, 14, 6, 12, 10][i % 8]}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <Button
                type="button"
                onClick={stopRecording}
                variant="ghost"
                className="h-8 px-3 text-[11px] font-semibold text-red-600 hover:bg-red-100 rounded-full"
              >
                Stop
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend(e as unknown as React.FormEvent);
                  }
                }}
                placeholder="Write a message…"
                className={cn(
                  "min-h-[40px] max-h-32 py-2.5 px-4 bg-white border-black/10 focus-visible:ring-0 rounded-2xl text-[14px] font-medium shadow-sm shadow-black/5 resize-none transition-all placeholder:text-black/30 pr-12",
                  canSend ? "border-primary/20" : "",
                )}
              />

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-black/25 hidden md:block">
                Enter
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!canSend}
          className={cn(
            "h-10 w-10 md:w-auto md:px-5 rounded-full font-semibold text-[13px] shadow-none shrink-0",
            canSend
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-black/5 text-black/25 hover:bg-black/5",
          )}
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">Send</span>
              <Send className="h-4 w-4" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
