import { api } from "./api";

export interface UploadMediaDto {
  file: File;
}

export interface UploadMultipleMediaDto {
  files: File[];
}

export interface MediaUploadResponse {
  url: string;
  publicId?: string;
}

export interface StandardMediaResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: MediaUploadResponse | MediaUploadResponse[];
}

export const MediaService = {
  upload: async (data: UploadMediaDto) => {
    const formData = new FormData();
    formData.append("file", data.file);
    const response = await api.post<StandardMediaResponse>("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  uploadMultiple: async (data: UploadMultipleMediaDto) => {
    const formData = new FormData();
    data.files.forEach((file) => formData.append("files", file));
    const response = await api.post<StandardMediaResponse>("/media/upload-multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
