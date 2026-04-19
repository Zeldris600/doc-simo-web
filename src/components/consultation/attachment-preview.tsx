"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FileText, X } from "@/lib/icons";
import { SupportAttachment } from "@/services/support.service";

interface AttachmentPreviewProps {
  attachments: SupportAttachment[];
  onRemove: (index: number) => void;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  const t = useTranslations("supportChat.customer");
  if (attachments.length === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-t border-[#D1D7DB] bg-[#F0F2F5] px-3 py-2">
      {attachments.map((att, i) => {
        const isImage = att.mimeType?.startsWith("image/");
        return (
          <div
            key={i}
            className="group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#D1D7DB] bg-white"
          >
            {isImage ? (
              <Image src={att.url} alt="preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-0.5 px-1">
                <FileText className="h-5 w-5 text-[#8696A0]" />
                <span className="max-w-[52px] truncate text-[8px] font-medium text-[#54656F]">
                  {att.originalName}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#54656F] text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={t("removeAttachmentAria")}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
