import { api } from "./api";
import { AnalyticsQueryDto } from "../types/api";

export const AnalyticsService = {
 getOverview: async (params?: AnalyticsQueryDto) => {
 const response = await api.get<{ data: any }>("/analytics/overview", { params });
 return response.data;
 },

 getOrdersAnalytics: async (params?: AnalyticsQueryDto) => {
 const response = await api.get<{ data: any }>("/analytics/orders", { params });
 return response.data;
 },

 getRevenueAnalytics: async (params?: AnalyticsQueryDto) => {
 const response = await api.get<{ data: any }>("/analytics/revenue", { params });
 return response.data;
 },

 getTopProducts: async (params?: AnalyticsQueryDto & { limit?: number }) => {
 const response = await api.get<{ data: any[] }>("/analytics/products/top", { params });
 return response.data;
 },

 getMyOverview: async (params?: AnalyticsQueryDto) => {
 const response = await api.get<{ data: any }>("/analytics/me/overview", { params });
 return response.data;
 },

 getMyOrdersAnalytics: async (params?: AnalyticsQueryDto) => {
 const response = await api.get<{ data: any }>("/analytics/me/orders", { params });
 return response.data;
 },
};
