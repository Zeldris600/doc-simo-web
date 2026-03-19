"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUploadDocument } from "@/hooks/use-document";
import { toast } from "sonner";

interface ImageUploaderProps {
 onUploadSuccess?: (url: string) => void;
 defaultValue?: string;
 label?: string;
 category?: string; // Internal classification, mapped to document label
 className?: string;
}

export function ImageUploader({ 
 onUploadSuccess,
 defaultValue = "",
 label,
 category = "product",
 className,
}: ImageUploaderProps) {
 const [preview, setPreview] = React.useState<string>(defaultValue);
 const uploadMutation = useUploadDocument();

 const onDrop = React.useCallback(
 async (acceptedFiles: File[]) => {
 const file = acceptedFiles[0];
 if (!file) return;

 uploadMutation.mutate(
 {
 file,
 category: "image", // API supports 'image', 'video', etc.
 isPublic: true,
 label: label || category || file.name,
 },
 {
 onSuccess: (res: unknown) => {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const uploadedUrl = (res as any).url || (res as any).data?.url;
 if (uploadedUrl) {
 setPreview(uploadedUrl);
 onUploadSuccess?.(uploadedUrl);
 toast.success("Design asset synchronized.");
 }
 },
 onError: () => {
 toast.error("Failed to upload image. Please check API connectivity.");
 },
 }
 );
 },
 [uploadMutation, onUploadSuccess, label, category]
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
 "relative aspect-square w-full cursor-pointer overflow-hidden border-2 border-dashed transition-all flex items-center justify-center bg-black/[0.02] group",
 isDragActive ? "border-black bg-black/[0.04]" : "border-black/10 hover:border-black/20 hover:bg-black/[0.01]",
 preview ? "border-none" : "rounded-lg",
 className
 )}
 >
 <input {...getInputProps()} />
 
 {preview ? (
 <div className="relative h-full w-full group">
 <Image
 src={preview}
 alt="Preview"
 fill
 className="object-cover transition-transform group-hover:scale-105"
 />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
 <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center ">
 <Upload className="h-5 w-5 text-black" />
 </div>
 <span className="text-[10px] font-black uppercase text-white tracking-widest">Update Shot</span>
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
 <div className="flex flex-col items-center justify-center gap-4 p-10 h-full w-full">
 {uploadMutation.isPending ? (
 <>
 <Loader2 className="h-10 w-10 animate-spin text-black/20" />
 <div className="text-center">
 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Uploading...</p>
 <p className="text-[10px] font-bold text-black/20 mt-1 uppercase">Synchronizing with node</p>
 </div>
 </>
 ) : (
 <>
 <div className="h-16 w-16 rounded-full bg-black/5 flex items-center justify-center transition-transform group-hover:scale-110 border border-black/5">
 <Upload className="h-6 w-6 text-black/40" />
 </div>
 <div className="text-center">
 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60 ">Drop Design Asset</p>
 <p className="text-[10px] font-bold text-black/20 mt-1 uppercase">PNG, JPG, WEBPT {label ? `(${label})` : ""}</p>
 </div>
 </>
 )}
 </div>
 )}
 </div>
 );
}
