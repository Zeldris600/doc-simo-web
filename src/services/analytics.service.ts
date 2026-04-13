import { api } from "./api";
import { 
  AnalyticsQueryDto, 
  AnalyticsOverview, 
  TopProduct, 
  StandardResponse,
  TimeSeriesResponse,
  RevenueBucket,
  DeliveryBucket,
  UnifiedBucket,
  WrappedData,
  RevenueAnalytics,
  OrdersAnalytics
} from "../types/api";

export type TimeSeriesGranularity = "day" | "week" | "month" | "year";

export interface TimeSeriesParams {
  granularity: TimeSeriesGranularity;
  from?: string;
  to?: string;
}

export const AnalyticsService = {
  getOverview: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<WrappedData<AnalyticsOverview>>>("/analytics/overview", { params });
    return response.data.data;
  },

  getOrdersAnalytics: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<WrappedData<OrdersAnalytics>>>("/analytics/orders", { params });
    return response.data.data;
  },

  getRevenueAnalytics: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<WrappedData<RevenueAnalytics>>>("/analytics/revenue", { params });
    return response.data.data;
  },

  getTopProducts: async (params?: AnalyticsQueryDto & { limit?: number }) => {
    const response = await api.get<StandardResponse<WrappedData<TopProduct[]>>>("/analytics/products/top", { params });
    return response.data.data;
  },

  getMyOverview: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<WrappedData<AnalyticsOverview>>>("/analytics/me/overview", { params });
    return response.data.data.data;
  },

  getMyOrdersAnalytics: async (params?: AnalyticsQueryDto) => {
    const response = await api.get<StandardResponse<WrappedData<{ status: string; count: number }[]>>>("/analytics/me/orders", { params });
    // Convert array to record for the UI
    const record: Record<string, number> = {};
    response.data.data.data.forEach(item => {
      record[item.status] = item.count;
    });
    return record;
  },

  /** GET /api/analytics/timeseries — Combined time-series stats */
  getTimeSeries: async (params: TimeSeriesParams) => {
    const response = await api.get<StandardResponse<WrappedData<TimeSeriesResponse<UnifiedBucket>>>>("/analytics/timeseries", { params });
    return response.data.data;
  },

  /** GET /api/analytics/revenue/series — Revenue time series */
  getRevenueSeries: async (params: TimeSeriesParams) => {
    const response = await api.get<StandardResponse<WrappedData<TimeSeriesResponse<RevenueBucket>>>>("/analytics/revenue/series", { params });
    return response.data.data;
  },

  /** GET /api/analytics/deliveries/series — Delivery stats time series */
  getDeliveriesSeries: async (params: TimeSeriesParams) => {
    const response = await api.get<StandardResponse<WrappedData<TimeSeriesResponse<DeliveryBucket>>>>("/analytics/deliveries/series", { params });
    return response.data.data;
  },
};
