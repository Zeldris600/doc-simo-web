"use client";

import React, { useState, useEffect, useRef } from "react";
import { Paperclip, Mic, Send, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SupportAttachment } from "@/services/support.service";
import { UseMutationResult } from "@tanstack/react-query";

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
    } else {
      setRecordingTime(0);
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

  return (
    <div className="px-4 md:px-8 py-6 border-t border-black/5 bg-white shrink-0">
      <form onSubmit={onSend} className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={onFileSelect}
          className="hidden"
        />

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 w-11 p-0 rounded-sm bg-black/[0.01] border-black/10 text-black/40 shadow-none hover:bg-black/5"
          >
            {uploadIsPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "h-11 w-11 p-0 rounded-sm border-black/10 shadow-none transition-all",
              isRecording ? "bg-red-500 text-white border-red-500 animate-pulse" : "bg-black/[0.01] text-black/40 hover:bg-black/5"
            )}
          >
            {isRecording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-5 w-5" />}
          </Button>
        </div>

        <div className="relative flex-1">
          {isRecording ? (
            <div className="h-11 flex items-center justify-between px-4 bg-red-50 rounded-sm border border-red-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black uppercase text-red-500 tracking-widest leading-none">
                  Live Recording - {formatTime(recordingTime)}
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
                className="h-8 px-3 text-[9px] font-black uppercase text-red-500 hover:bg-red-100 rounded-none border border-red-200"
              >
                Stop Protocol
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
              placeholder="Type clinical inquiry..."
              className="min-h-[44px] h-11 py-3 bg-black/[0.01] border-black/10 focus-visible:ring-0 rounded-sm text-[13px] font-bold shadow-none resize-none transition-all placeholder:text-black/20"
            />
          )}
        </div>

        <Button
          type="submit"
          disabled={(!messageBody.trim() && attachments.length === 0) || isSending || isRecording}
          className={cn(
            "h-11 w-11 md:w-auto md:px-8 rounded-sm font-black text-[11px] uppercase tracking-widest shadow-none",
            messageBody.trim() || attachments.length > 0 ? "bg-[#1f3d2b] text-white" : "bg-black/5 text-black/20"
          )}
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
