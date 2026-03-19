import { api } from "./api";
import { 
 CreateDiscountDto, 
 Discount, 
 PaginatedResponse, 
 StandardResponse,
 UpdateDiscountDto 
} from "../types/api";

export const DiscountService = {
 create: async (data: CreateDiscountDto) => {
 const response = await api.post<Discount>("/discounts", data);
 return response.data;
 },

 list: async (params?: { activeOnly?: "true" | "false"; page?: number; limit?: number }) => {
 const response = await api.get<StandardResponse<PaginatedResponse<Discount>>>("/discounts", { params });
 return response.data.data;
 },

 getById: async (id: string) => {
 const response = await api.get<Discount>(`/discounts/${id}`);
 return response.data;
 },

 update: async (id: string, data: UpdateDiscountDto) => {
 const response = await api.patch<Discount>(`/discounts/${id}`, data);
 return response.data;
 },

 delete: async (id: string) => {
 const response = await api.delete(`/discounts/${id}`);
 return response.data;
 },
};
