import { api } from "./api";
import { AnalyticsQueryDto, AnalyticsOverview, TopProduct, StandardResponse } from "../types/api";

export const AnalyticsService = {
  getOverview: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<AnalyticsOverview>>("/analytics/overview", { params });
    return response.data;
  },

  getOrdersAnalytics: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<Record<string, number>>>("/analytics/orders", { params });
    return response.data;
  },

  getRevenueAnalytics: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<Record<string, number>>>("/analytics/revenue", { params });
    return response.data;
  },

  getTopProducts: async (params?: AnalyticsQueryDto & { limit?: number }) => {
    const response = await api.get<StandardResponse<TopProduct[]>>("/analytics/products/top", { params });
    return response.data;
  },

  getMyOverview: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<AnalyticsOverview>>("/analytics/me/overview", { params });
    return response.data;
  },

  getMyOrdersAnalytics: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<Record<string, number>>>("/analytics/me/orders", { params });
    return response.data;
  },
};
