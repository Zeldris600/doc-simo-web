"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
} from "@/lib/icons";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import { useAnalyticsOverview, useTopProducts } from "@/hooks/use-analytics";
import { useOrders } from "@/hooks/use-order";
import { Order, TopProduct } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

const columns: ColumnDef<TopProduct>[] = [
  {
    accessorKey: "name",
    header: "Top Product",
    cell: ({ row }) => (
      <span className="font-bold text-black">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const cat = row.original.category;
      return <span>{typeof cat === 'object' ? cat.name : cat}</span>;
    }
  },
  {
    accessorKey: "salesCount",
    header: "Units Sold",
  },
  {
    accessorKey: "totalRevenue",
    header: "Revenue",
    cell: ({ row }) => (
      <span className="font-bold text-black">
        {(row.getValue("totalRevenue") as number).toLocaleString()} XAF
      </span>
    ),
  },
];

export default function AdminDashboard() {
  const { data: overview, isLoading: isLoadingOverview } = useAnalyticsOverview();
  const { data: topProductsData, isLoading: isLoadingTop } = useTopProducts({ limit: 5 });
  const { data: ordersResponse } = useOrders({ limit: 4 });

  const stats = [
    {
      title: "Total Revenue",
      value: `${(overview?.data?.revenue || 0).toLocaleString()} XAF`,
      trend: "+20.1%",
      up: true,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: overview?.data?.total_orders || 0,
      trend: "+12.5%",
      up: true,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Stock Alerts",
      value: "Low",
      trend: "3 items",
      up: false,
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "System Notifications",
      value: overview?.data?.notifications_count || 0,
      trend: "Fresh",
      up: true,
      icon: Bell,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const topProducts = topProductsData?.data || [];
  const recentOrders = ordersResponse?.data || [];

  if (isLoadingOverview || isLoadingTop) {
    return (
      <div className="space-y-8 pb-12">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-none bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="space-y-4">
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader
        title="Commerce Overview"
        description="Real-time performance metrics and synchronization."
        action={<Button variant="outline" size="sm" className="font-bold uppercase text-[10px] tracking-widest border-black/10">Export Report</Button>}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-none bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase text-black/30 tracking-widest">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">{stat.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {stat.up ? (
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-500" />
                )}
                <span
                  className={`text-[10px] font-bold ${stat.up ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.trend}
                </span>
                <span className="text-[10px] text-black/20 font-bold uppercase ml-1">
                  from last period
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black uppercase tracking-widest">
              Top Performing Products
            </h3>
          </div>
          <DataTable columns={columns} data={topProducts} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black uppercase tracking-widest">
              Recent Fulfillment
            </h3>
          </div>
          <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm border-none">
            {recentOrders.length > 0 ? recentOrders.map((order: Order) => (
              <div key={order.id} className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-lg bg-black/[0.02] border border-black/5 flex items-center justify-center text-[10px] font-black text-black/40 group-hover:bg-primary/5 transition-colors uppercase">
                  ID: {order.id.substring(0, 4)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-black uppercase tracking-tight">Order #{order.id.substring(0, 8)}</p>
                  <p className="text-[10px] font-bold text-black/40 capitalize">
                    {order.deliveryAddress?.phone || "No contact"}
                  </p>
                </div>
                <Badge className={`border-none font-bold text-[8px] uppercase rounded-md px-2 py-0.5 ${
                  order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {order.status}
                </Badge>
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-[10px] font-black uppercase text-black/20">No recent orders</p>
              </div>
            )}
            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black hover:bg-black/5" onClick={() => window.location.href='/admin/orders'}>
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
