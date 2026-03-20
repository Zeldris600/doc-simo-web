import { api } from "./api";
import {
 CreateOrderDto,
 Order,
 PaginatedResponse,
 PushOrderLocationDto,  UpdateOrderStatusDto,
  StandardResponse
} from "../types/api";

export const OrderService = {
  create: async (data: CreateOrderDto) => {
    // Ensuring it matches documentation fields
    const response = await api.post<StandardResponse<Order>>("/orders", data);
    return response.data.data;
  },

 list: async (params?: { page?: number; limit?: number }) => {
 const response = await api.get<StandardResponse<PaginatedResponse<Order>>>("/orders", { params });
 return response.data.data;
 },

  getMe: async () => {
    const response = await api.get<StandardResponse<PaginatedResponse<Order>>>("/orders/me");
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<StandardResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusDto) => {
    const response = await api.put<StandardResponse<Order>>(`/orders/${id}/status`, data);
    return response.data.data;
  },

  pushLocation: async (id: string, data: PushOrderLocationDto) => {
    const response = await api.post<StandardResponse<void>>(`/orders/${id}/locations`, data);
    return response.data.data;
  },
};
