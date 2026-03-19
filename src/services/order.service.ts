import { api } from "./api";
import { 
 CreateOrderDto, 
 Order, 
 PaginatedResponse, 
 PushOrderLocationDto, 
 UpdateOrderStatusDto,
 OrderStatus
} from "../types/api";

export const OrderService = {
 create: async (data: CreateOrderDto) => {
 // Ensuring it matches documentation fields
 const response = await api.post<Order>("/orders", data);
 return response.data;
 },

 list: async (params?: { page?: number; limit?: number }) => {
 const response = await api.get<PaginatedResponse<Order>>("/orders", { params });
 return response.data;
 },

 getMe: async () => {
 const response = await api.get<PaginatedResponse<Order>>("/orders/me");
 return response.data;
 },

 getById: async (id: string) => {
 const response = await api.get<Order>(`/orders/${id}`);
 return response.data;
 },

 updateStatus: async (id: string, data: UpdateOrderStatusDto) => {
 const response = await api.put<Order>(`/orders/${id}/status`, data);
 return response.data;
 },

 pushLocation: async (id: string, data: PushOrderLocationDto) => {
 const response = await api.post(`/orders/${id}/locations`, data);
 return response.data;
 },
};
