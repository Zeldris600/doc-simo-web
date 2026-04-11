"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X, ImageIcon } from "@/lib/icons";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUploadMedia } from "@/hooks/use-media"; // Switched to useUploadMedia for Cloudinary integration
import { toast } from "sonner";

interface ImageUploaderProps {
  onUploadSuccess?: (url: string) => void;
  defaultValue?: string;
  label?: string;
  category?: string;
  className?: string;
}

export function ImageUploader({
  onUploadSuccess,
  defaultValue = "",
  label,
  className,
}: ImageUploaderProps) {
  const [preview, setPreview] = React.useState<string>(defaultValue);
  const uploadMutation = useUploadMedia(); // Using MediaService.upload which targets Cloudinary-enabled endpoint

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      uploadMutation.mutate(
        { file },
        {
          onSuccess: (res: { url: string }) => {
            const uploadedUrl = res.url;
            if (uploadedUrl) {
              setPreview(uploadedUrl);
              onUploadSuccess?.(uploadedUrl);
              toast.success("Asset synchronized.");
            }
          },
          onError: (err) => {
            console.error("Cloudinary upload error:", err);
            toast.error(
              "Failed to upload to Cloudinary. Verify backend synchronization.",
            );
          },
        },
      );
    },
    [uploadMutation, onUploadSuccess],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: uploadMutation.isPending,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed transition-all bg-black/[0.01] hover:bg-black/[0.03] group",
        isDragActive
          ? "border-black bg-black/[0.05]"
          : "border-black/10 hover:border-black/20",
        preview
          ? "border-solid border-black/5"
          : "rounded-2xl p-8 min-h-[160px]",
        className,
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative h-full w-full min-h-[160px] group">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-lg">
              <Upload className="h-5 w-5 text-black" />
            </div>
            <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">
              Update Asset
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreview("");
              onUploadSuccess?.("");
            }}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 text-center px-4">
          {uploadMutation.isPending ? (
            <>
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1 w-1 bg-black/40 rounded-full animate-ping" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                  Synchronizing...
                </p>
                <p className="text-[8px] font-bold text-black/20 mt-1 uppercase">
                  Uploading to Cloudinary Mesh
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="h-14 w-14 rounded-full bg-black/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-black group-hover:text-white group-hover:shadow-xl group-hover:shadow-black/10 border border-black/5">
                <ImageIcon className="h-6 w-6 text-black/40 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 ">
                  Drop Design Asset
                </p>
                <p className="text-[9px] font-bold text-black/20 mt-1 uppercase tracking-wider">
                  PNG, JPG, WEBP • Max 5MB
                </p>
                {label && (
                  <p className="text-[8px] font-bold text-primary mt-2 uppercase">
                    {label}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
