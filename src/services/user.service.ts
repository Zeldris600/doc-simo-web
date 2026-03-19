import { api } from "./api";
import { User } from "../types/auth";
import { PaginatedResponse, StandardResponse } from "../types/api";
import { UserRole } from "@/lib/rbac/types";

export interface UpdateUserDto {
  name?: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  otpChannelPreference?: "whatsapp" | "sms";
  metadata?: Record<string, unknown>;
}

export const UserService = {
  getMe: async () => {
    const response = await api.get<StandardResponse<User>>("/users/me");
    return response.data.data;
  },

  updateMe: async (data: UpdateUserDto) => {
    const response = await api.patch<User>("/users/me", data);
    return response.data;
  },

  // Admin section:
  getAll: async (params?: {
    role?: UserRole;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<StandardResponse<PaginatedResponse<User>>>(
      "/users",
      { params },
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  updateRole: async (id: string, role: string) => {
    const response = await api.patch<User>(`/users/${id}/role`, { role });
    return response.data;
  },
};
