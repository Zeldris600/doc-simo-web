"use client";

import React from "react";
import Image from "next/image";
import { FileText, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportMessage } from "@/services/support.service";

interface MessageBubbleProps {
  msg: SupportMessage;
  isMe: boolean;
  showSenderName: boolean;
}

export function MessageBubble({ msg, isMe, showSenderName }: MessageBubbleProps) {
  return (
    <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
      {showSenderName && !isMe && (
        <span className="text-[8px] font-black text-black/40 mb-2 ml-2 uppercase tracking-widest">Medical Team</span>
      )}
      <div className={cn(
        "max-w-[85%] md:max-w-[70%] rounded-lg px-5 py-4 text-xs md:text-sm font-black shadow-none border-l-2", 
        isMe ? "bg-[#1f3d2b] text-white border-primary" : "bg-black/[0.02] text-black border-black/10"
      )}>
        {msg.body && <p className="whitespace-pre-wrap leading-relaxed">{msg.body}</p>}
        
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="mt-4 space-y-3">
            {msg.attachments.map((att, ai) => {
              const isImage = att.mimeType?.startsWith("image/");
              const isAudio = att.mimeType?.startsWith("audio/");
              
              if (isImage) {
                return (
                  <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" className="block border border-black/5 rounded-lg overflow-hidden max-w-[320px]">
                    <Image src={att.url} alt="Clinical Image" width={400} height={240} className="object-cover w-full" />
                  </a>
                );
              }
              if (isAudio) {
                return (
                  <div key={ai} className={cn("flex flex-col gap-2 p-3 rounded-lg border", isMe ? "border-white/10 bg-white/5" : "border-black/5 bg-white")}>
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span className="text-[9px] font-black uppercase">Voice Note</span>
                    </div>
                    <audio controls src={att.url} className="w-full h-8" />
                  </div>
                );
              }
              return (
                <a key={ai} href={att.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest", isMe ? "border-white/10 bg-white/5" : "border-black/10 bg-white")}>
                  <FileText className="h-4 w-4" />
                  <span className="truncate">{att.originalName}</span>
                </a>
              );
            })}
          </div>
        )}
        <div className="mt-2 text-[8px] font-black opacity-30 text-right uppercase tracking-[0.2em]">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
