import { api } from "./api";
import {
  ApiResponse,
  CustomerProfile,
  PaginatedResponse,
  UpdateCustomerProfileDto,
} from "../types/api";

export const CustomerService = {
  getMe: async () => {
    const response = await api.get<ApiResponse<CustomerProfile>>(
      "/customers/me",
    );
    return response.data.data;
  },

  updateMe: async (data: UpdateCustomerProfileDto) => {
    const response = await api.patch<ApiResponse<CustomerProfile>>(
      "/customers/me",
      data,
    );
    return response.data.data;
  },

  list: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<
      ApiResponse<PaginatedResponse<CustomerProfile>>
    >("/customers", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<CustomerProfile>(`/customers/${id}`);
    return response.data;
  },
};
