"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Plus, X } from "@/lib/icons";
import Image from "next/image";
import { useUploadMultipleMedia } from "@/hooks/use-media";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MultiImageUploaderProps {
  defaultValue?: string[];
  onChange?: (urls: string[]) => void;
  category?: "image" | "video" | "pdf" | "invoice" | "other";
  label?: string;
  className?: string;
  maxFiles?: number;
}

export function MultiImageUploader({
  defaultValue = [],
  onChange,
  className,
  maxFiles = 5,
}: MultiImageUploaderProps) {
  const [images, setImages] = React.useState<string[]>(defaultValue);
  const uploadMutation = useUploadMultipleMedia();

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }

      uploadMutation.mutate(
        { files: acceptedFiles },
        {
          onSuccess: (res: { url: string }[]) => {
            const newUrls = res.map(item => item.url);
            if (newUrls.length > 0) {
              const updatedImages = [...images, ...newUrls].slice(0, maxFiles);
              setImages(updatedImages);
              onChange?.(updatedImages);
              toast.success(`${newUrls.length} images synchronized`);
            }
          },
          onError: (err) => {
            console.error("Multi-upload error:", err);
            toast.error("Failed to synchronize shots");
          },
        }
      );
    },
    [images, maxFiles, onChange, uploadMutation]
  );

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange?.(updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: maxFiles - images.length,
    disabled: uploadMutation.isPending || images.length >= maxFiles,
  });

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
      {images.map((url, index) => (
        <div key={url + index} className="relative group aspect-square rounded-lg overflow-hidden border border-black/5 bg-black/[0.02] ">
          <Image src={url} alt={`Gallery ${index}`} fill className="object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="bg-white text-black p-2 rounded-full hover:bg-black hover:text-white transition-all "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {images.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all gap-2",
            isDragActive ? "border-black bg-black/[0.02]" : "border-black/10 hover:border-black/20 hover:bg-black/[0.01]",
            uploadMutation.isPending && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-black/20" />
              <span className="text-[10px] font-black uppercase text-black/20">Syncing...</span>
            </>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-black/5 flex items-center justify-center">
                <Plus className="h-5 w-5 text-black/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Add Shot</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
