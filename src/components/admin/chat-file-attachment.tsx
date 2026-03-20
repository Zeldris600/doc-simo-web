"use client";

import React from "react";
import { Paperclip, X, FileText, Loader2 } from "lucide-react";
import { useUploadMultipleMedia } from "@/hooks/use-media";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatFile {
  url: string;
  name: string;
  type: "image" | "file";
}

interface ChatFileAttachmentProps {
  onFilesReady: (urls: string[]) => void;
  disabled?: boolean;
}

export function ChatFileAttachment({ onFilesReady, disabled }: ChatFileAttachmentProps) {
  const [stagedFiles, setStagedFiles] = React.useState<ChatFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMultipleMedia();

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    uploadMutation.mutate(
      { files },
      {
        onSuccess: (res) => {
          const uploaded: ChatFile[] = res.map((item, i) => ({
            url: item.url,
            name: files[i]?.name || "file",
            type: files[i]?.type.startsWith("image/") ? "image" : "file",
          }));
          setStagedFiles((prev) => [...prev, ...uploaded]);
          onFilesReady(res.map((r) => r.url));
          toast.success(`${res.length} file(s) attached`);
        },
        onError: () => {
          toast.error("Failed to upload files");
        },
      }
    );

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      {/* Staged files preview */}
      {stagedFiles.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
          {stagedFiles.map((file, i) => (
            <div
              key={i}
              className="relative group shrink-0 rounded-lg border border-black/5 overflow-hidden bg-black/[0.02]"
            >
              {file.type === "image" ? (
                <div className="h-16 w-16 relative">
                  <Image src={file.url} alt={file.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-16 w-16 flex flex-col items-center justify-center gap-1 px-1">
                  <FileText className="h-5 w-5 text-black/30" />
                  <span className="text-[8px] font-medium text-black/40 truncate w-full text-center">{file.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Attach button */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFiles}
        className="hidden"
      />
      <button
        type="button"
        disabled={disabled || uploadMutation.isPending}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          "text-black/40 hover:text-black/60 hover:bg-black/[0.04]",
          uploadMutation.isPending && "pointer-events-none"
        )}
      >
        {uploadMutation.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Paperclip className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

/** Render an attachment inside a chat bubble */
export function ChatBubbleAttachment({ url }: { url: string }) {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);

  if (isImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2">
        <div className="relative rounded-lg overflow-hidden max-w-[240px] border border-black/5">
          <Image src={url} alt="attachment" width={240} height={160} className="object-cover w-full" />
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-black/[0.04] border border-black/5 hover:bg-black/[0.06] transition-colors"
    >
      <FileText className="h-4 w-4 text-black/40 shrink-0" />
      <span className="text-[11px] font-medium text-black/60 truncate">
        {url.split("/").pop() || "Download file"}
      </span>
    </a>
  );
}
