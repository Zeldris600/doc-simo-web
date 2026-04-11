"use client";

import React from "react";
import Image from "next/image";
import { FileText, X } from "@/lib/icons";
import { SupportAttachment } from "@/services/support.service";

interface AttachmentPreviewProps {
  attachments: SupportAttachment[];
  onRemove: (index: number) => void;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="px-4 md:px-8 py-3 border-t border-black/5 flex items-center gap-3 overflow-x-auto bg-white/80 backdrop-blur shrink-0">
      {attachments.map((att, i) => {
        const isImage = att.mimeType?.startsWith("image/");
        return (
          <div
            key={i}
            className="relative group shrink-0 rounded-xl border border-black/10 overflow-hidden bg-white h-16 w-16 flex items-center justify-center shadow-sm"
          >
            {isImage ? (
              <Image src={att.url} alt="preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <FileText className="h-5 w-5 text-black/20" />
                <span className="text-[9px] font-semibold truncate max-w-[56px] text-black/70">
                  {att.originalName}
                </span>
              </div>
            )}
            <button
              onClick={() => onRemove(i)}
              className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
