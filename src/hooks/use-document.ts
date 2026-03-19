"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { DocumentService, UploadDocumentDto, UploadMultipleDto } from "@/services/document.service";

// Using unknown instead of any per user request
export function useUploadDocument<TError = Error>(opt?: UseMutationOptions<unknown, TError, UploadDocumentDto>) {
 return useMutation({
 mutationFn: (data: UploadDocumentDto) => DocumentService.upload(data),
 ...opt,
 });
}

export function useUploadMultipleDocuments<TError = Error>(opt?: UseMutationOptions<unknown, TError, UploadMultipleDto>) {
 return useMutation({
 mutationFn: (data: UploadMultipleDto) => DocumentService.uploadMultiple(data),
 ...opt,
 });
}

export function useReplaceDocument<TError = Error>(opt?: UseMutationOptions<unknown, TError, { id: string; file: File }>) {
 return useMutation({
 mutationFn: ({ id, file }: { id: string; file: File }) => DocumentService.replace(id, file),
 ...opt,
 });
}

export function useDeleteDocument<TError = Error>(opt?: UseMutationOptions<unknown, TError, string>) {
 return useMutation({
 mutationFn: (id: string) => DocumentService.delete(id),
 ...opt,
 });
}
