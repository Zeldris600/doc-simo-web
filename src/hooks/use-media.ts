"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { MediaService, UploadMediaDto, UploadMultipleMediaDto, MediaUploadResponse } from "@/services/media.service";

export function useUploadMedia<TError = Error>(opt?: UseMutationOptions<MediaUploadResponse, TError, UploadMediaDto>) {
  return useMutation({
    mutationFn: (data: UploadMediaDto) => MediaService.upload(data),
    ...opt,
  });
}

export function useUploadMultipleMedia<TError = Error>(opt?: UseMutationOptions<MediaUploadResponse[], TError, UploadMultipleMediaDto>) {
  return useMutation({
    mutationFn: (data: UploadMultipleMediaDto) => MediaService.uploadMultiple(data),
    ...opt,
  });
}
