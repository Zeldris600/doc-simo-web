import { api } from "./api";
import { CustomerProfile, PaginatedResponse, UpdateCustomerProfileDto } from "../types/api";

export const CustomerService = {
 getMe: async () => {
 const response = await api.get<{ data: CustomerProfile | null }>("/customers/me");
 return response.data;
 },

 updateMe: async (data: UpdateCustomerProfileDto) => {
 const response = await api.patch<CustomerProfile>("/customers/me", data);
 return response.data;
 },

 list: async (params?: { page?: number; limit?: number }) => {
 const response = await api.get<PaginatedResponse<CustomerProfile>>("/customers", { params });
 return response.data;
 },

 getById: async (id: string) => {
 const response = await api.get<CustomerProfile>(`/customers/${id}`);
 return response.data;
 },
};
