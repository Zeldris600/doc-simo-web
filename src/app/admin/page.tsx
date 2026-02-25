"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const STATS = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    trend: "+20.1%",
    up: true,
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    trend: "+180.1%",
    up: true,
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Sales",
    value: "+12,234",
    trend: "+19.2%",
    up: true,
    icon: ShoppingBag,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Active Now",
    value: "+573",
    trend: "-12%",
    up: false,
    icon: Package,
    color: "text-[#f2c94c]",
    bg: "bg-[#f2c94c]/10",
  },
];

type TopProduct = {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
};

const topProducts: TopProduct[] = [
  {
    id: "1",
    name: "Organic Ashwagandha",
    category: "Stress Relief",
    sales: 1205,
    revenue: 40970,
  },
  {
    id: "2",
    name: "Papaya Enzyme Extract",
    category: "Digestion",
    sales: 982,
    revenue: 38298,
  },
  {
    id: "3",
    name: "Elderberry Syrup",
    category: "Immunity",
    sales: 856,
    revenue: 20972,
  },
  {
    id: "4",
    name: "Ginger Root Formula",
    category: "Inflammation",
    sales: 543,
    revenue: 15204,
  },
];

const columns: ColumnDef<TopProduct>[] = [
  {
    accessorKey: "name",
    header: "Top Product",
    cell: ({ row }) => (
      <span className="font-black text-black">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sales",
    header: "Units Sold",
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => (
      <span className="font-bold text-black">
        ${(row.getValue("revenue") as number).toLocaleString()}
      </span>
    ),
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-black capitalize">
            Commerce Overview
          </h2>
          <p className="text-[10px] font-bold text-gray-400 capitalize tracking-widest">
            Store Management Dashboard
          </p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded text-[10px] font-bold uppercase hover:bg-primary transition-all shadow-none tracking-widest">
          Export Report
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card
            key={stat.title}
            className="border border-gray-100 bg-white rounded overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase text-gray-400 tracking-tight">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
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
                <span className="text-[10px] text-gray-400 font-bold uppercase ml-1 tracking-tighter">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-black capitalize tracking-tight">
            Top Performing Products
          </h3>
          <DataTable columns={columns} data={topProducts} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-black capitalize tracking-tight">
            Recent Fulfillment
          </h3>
          <div className="bg-white rounded p-6 space-y-6 shadow-none border border-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                  #{9910 + i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-black">Order Shipped</p>
                  <p className="text-[10px] font-bold text-gray-400 capitalize tracking-tight">
                    Customer: User_{i}
                  </p>
                </div>
                <Badge className="bg-green-50 text-green-700 border-none font-bold text-[8px] uppercase rounded-sm">
                  Done
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
