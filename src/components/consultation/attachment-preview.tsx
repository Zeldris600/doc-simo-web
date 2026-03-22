"use client";

import React from "react";
import Image from "next/image";
import { FileText, X } from "lucide-react";
import { SupportAttachment } from "@/services/support.service";

interface AttachmentPreviewProps {
  attachments: SupportAttachment[];
  onRemove: (index: number) => void;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="px-6 py-4 border-t border-black/5 flex items-center gap-4 overflow-x-auto bg-black/[0.01]">
      {attachments.map((att, i) => {
        const isImage = att.mimeType?.startsWith("image/");
        return (
          <div
            key={i}
            className="relative group shrink-0 rounded-lg border border-black/10 overflow-hidden bg-white h-20 w-20 flex items-center justify-center"
          >
            {isImage ? (
              <Image src={att.url} alt="preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <FileText className="h-5 w-5 text-black/20" />
                <span className="text-[7px] font-black uppercase truncate max-w-[60px]">
                  {att.originalName}
                </span>
              </div>
            )}
            <button
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
