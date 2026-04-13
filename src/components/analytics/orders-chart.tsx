"use client";

import { useState } from "react";
import { useAnalyticsTimeSeries } from "@/hooks/use-analytics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeSeriesFilter } from "./time-series-filter";
import { TimeSeriesGranularity } from "@/services/analytics.service";

export function OrdersChart() {
  const [granularity, setGranularity] =
    useState<TimeSeriesGranularity>("month");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const { data: resp, isLoading } = useAnalyticsTimeSeries({
    granularity,
    from: new Date(dateRange.from).toISOString(),
    to: new Date(dateRange.to).toISOString(),
  });

  const buckets = resp?.data?.buckets ?? [];
  const chartData = buckets.map((b) => ({
    period: b.period,
    orders: b.orders,
  }));

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  return (
    <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-xs font-medium text-black">
            Order Velocity
          </CardTitle>
          <p className="text-[9px] text-gray-400 font-medium">
            Checkout frequency and customer engagement
          </p>
        </div>
        <TimeSeriesFilter
          granularity={granularity}
          onGranularityChange={setGranularity}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 500, fill: "#94a3b8" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fontWeight: 500, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontSize: "9px",
                  fontWeight: 500,
                  backgroundColor: "white",
                }}
                itemStyle={{ color: "#0284c7" }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="Orders"
                stroke="#0284c7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
