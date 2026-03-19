"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { AnalyticsQueryDto } from "@/types/api";

export function useAnalyticsOverview(params?: AnalyticsQueryDto) {
 return useQuery({
 queryKey: ["analytics", "overview", params],
 queryFn: () => AnalyticsService.getOverview(params),
 });
}

export function useOrdersAnalytics(params?: AnalyticsQueryDto) {
 return useQuery({
 queryKey: ["analytics", "orders", params],
 queryFn: () => AnalyticsService.getOrdersAnalytics(params),
 });
}

export function useRevenueAnalytics(params?: AnalyticsQueryDto) {
 return useQuery({
 queryKey: ["analytics", "revenue", params],
 queryFn: () => AnalyticsService.getRevenueAnalytics(params),
 });
}

export function useTopProducts(params?: AnalyticsQueryDto & { limit?: number }) {
 return useQuery({
 queryKey: ["analytics", "top-products", params],
 queryFn: () => AnalyticsService.getTopProducts(params),
 });
}

export function useMyAnalyticsOverview(params?: AnalyticsQueryDto) {
 return useQuery({
 queryKey: ["analytics", "me", "overview", params],
 queryFn: () => AnalyticsService.getMyOverview(params),
 });
}

export function useMyOrdersAnalytics(params?: AnalyticsQueryDto) {
 return useQuery({
 queryKey: ["analytics", "me", "orders", params],
 queryFn: () => AnalyticsService.getMyOrdersAnalytics(params),
 });
}
