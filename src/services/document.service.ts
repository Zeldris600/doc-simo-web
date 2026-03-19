import { api } from "./api";

export interface UploadDocumentDto {
 file: File;
 category: "image" | "video" | "pdf" | "invoice" | "other";
 isPublic: boolean;
 label?: string;
}

export interface UploadMultipleDto {
 files: File[];
 category: "image" | "video" | "pdf" | "invoice" | "other";
 isPublic: boolean;
 label?: string;
}

export const DocumentService = {
 upload: async (data: UploadDocumentDto) => {
 const formData = new FormData();
 formData.append("file", data.file);
 formData.append("category", data.category);
 formData.append("isPublic", String(data.isPublic));
 if (data.label) formData.append("label", data.label);

 const response = await api.post("/documents/upload", formData, {
 headers: { "Content-Type": "multipart/form-data" },
 });
 return response.data;
 },

 uploadMultiple: async (data: UploadMultipleDto) => {
 const formData = new FormData();
 data.files.forEach((file) => formData.append("files", file));
 formData.append("category", data.category);
 formData.append("isPublic", String(data.isPublic));
 if (data.label) formData.append("label", data.label);

 const response = await api.post("/documents/upload-multiple", formData, {
 headers: { "Content-Type": "multipart/form-data" },
 });
 return response.data;
 },

 getUrl: async (key: string) => {
 const response = await api.get<{ url: string }>(`/documents/url/${key}`);
 return response.data;
 },

 getSignedUrl: async (key: string) => {
 const response = await api.get<{ url: string }>(`/documents/signed-url/${key}`);
 return response.data;
 },

 replace: async (id: string, file: File) => {
 const formData = new FormData();
 formData.append("file", file);

 const response = await api.put(`/documents/${id}`, formData, {
 headers: { "Content-Type": "multipart/form-data" },
 });
 return response.data;
 },

 delete: async (id: string) => {
 const response = await api.delete(`/documents/${id}`);
 return response.data;
 },
};
