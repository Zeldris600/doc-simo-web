import { api } from "./api";
import {
  AssignOrderDto,
  CreateOrderDto,
  Order,
  PaginatedResponse,
  PushOrderLocationDto,
  ShippingProofDto,
  StandardResponse,
  UpdateOrderStatusDto,
  WrappedData
} from "../types/api";

export const OrderService = {
  create: async (data: CreateOrderDto) => {
    const response = await api.post<StandardResponse<Order>>("/orders", data);
    return response.data.data;
  },

  list: async (params?: { page?: number; limit?: number }) => {
    // Handling the triple nesting: StandardResponse -> WrappedData -> PaginatedResponse
    const response = await api.get<StandardResponse<WrappedData<PaginatedResponse<Order>>>>("/orders", { params });
    return response.data.data.data;
  },

  getMe: async () => {
    const response = await api.get<StandardResponse<WrappedData<PaginatedResponse<Order>>>>("/orders/me");
    return response.data.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<StandardResponse<Order>>("/orders/" + id);
    return response.data.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusDto) => {
    const response = await api.put<StandardResponse<Order>>(`/orders/${id}/status`, data);
    return response.data.data;
  },

  assign: async (id: string, data: AssignOrderDto) => {
    const response = await api.patch<StandardResponse<Order>>(
      `/orders/${id}/assign`,
      data,
    );
    return response.data.data;
  },

  submitShippingProof: async (id: string, data: ShippingProofDto) => {
    const response = await api.post<StandardResponse<Order>>(
      `/orders/${id}/shipping-proof`,
      data,
    );
    return response.data.data;
  },

  pushLocation: async (id: string, data: PushOrderLocationDto) => {
    const response = await api.post<StandardResponse<WrappedData<void>>>(`/orders/${id}/locations`, data);
    return response.data;
  },
};
