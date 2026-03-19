"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
 TrendingUp,
 Users,
 Package,
 ShoppingBag,
 ArrowUpRight,
 ArrowDownRight,
 Zap,
 ShieldCheck,
 Activity,
 FileText,
 ChevronRight,
 BarChart3
} from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-product";
import { useOrders } from "@/hooks/use-order";
import { useUsers } from "@/hooks/use-user";
import { Product } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
 const router = useRouter();
 const { data: productsData, isLoading: productsLoading } = useProducts();
 const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 5 });
 const { data: usersData, isLoading: usersLoading } = useUsers({ limit: 5 });

 const products = productsData?.data || [];
 const orders = ordersData?.data || [];

 const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

 const stats = [
 {
 title: "Logistical Volume",
 value: totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD" }),
 trend: "+24% increase",
 up: true,
 icon: TrendingUp,
 color: "text-emerald-500",
 bg: "bg-emerald-500/10",
 description: "Aggregated commercial throughput."
 },
 {
 title: "Patient Nodes",
 value: usersData?.total || 0,
 trend: "+12 centers",
 up: true,
 icon: Users,
 color: "text-indigo-500",
 bg: "bg-indigo-500/10",
 description: "Active biometric nodes."
 },
 {
 title: "Batch Manifests",
 value: ordersData?.total || 0,
 trend: "+8.2% frequency",
 up: true,
 icon: ShoppingBag,
 color: "text-amber-500",
 bg: "bg-amber-500/10",
 description: "Successful batch deployments."
 },
 {
 title: "Inventory Density",
 value: productsData?.total || 0,
 trend: "-2 depletions",
 up: false,
 icon: Package,
 color: "text-rose-500",
 bg: "bg-rose-500/10",
 description: "Catalogued formulations."
 },
 ];

 const columns: ColumnDef<Product>[] = [
 {
 accessorKey: "name",
 header: "Formulation",
 cell: ({ row }) => (
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-black/5 border border-black/5 flex items-center justify-center p-1 overflow-hidden relative">
 {row.original.image ? (
 <Image src={row.original.image} alt="" fill className="object-cover" />
 ) : (
 <Zap className="h-4 w-4 text-black/20" />
 )}
 </div>
 <span className="font-bold text-black text-sm">{row.original.name}</span>
 </div>
 ),
 },
 {
 accessorKey: "price",
 header: "Market Value",
 cell: ({ row }) => <span className="font-bold text-black">${row.original.price.toFixed(2)}</span>,
 },
 {
 accessorKey: "availability",
 header: "Protocol",
 cell: ({ row }) => (
 <Badge className={`rounded-full px-3 py-0.5 text-[9px] font-bold tracking-wide border-none ${row.original.availability ? "bg-primary/10 text-primary" : "bg-black/5 text-black/30"}`}>
 {row.original.availability ? "active" : "archived"}
 </Badge>
 ),
 },
 ];

 if (productsLoading || ordersLoading || usersLoading) {
 return (
 <div className="p-10 space-y-10 animate-in fade-in duration-500">
 <Skeleton className="h-12 w-[300px] rounded-xl" />
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
 {[1,2,3,4].map(i => (
 <Skeleton key={i} className="h-32 rounded-xl" />
 ))}
 </div>
 <div className="grid lg:grid-cols-3 gap-10">
 <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
 <Skeleton className="h-[400px] rounded-xl" />
 </div>
 </div>
 );
 }

 return (
 <div className="p-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 bg-gray-50/30">
 {/* Dashboard Greeting */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-10">
 <div className="space-y-1">
 <h1 className="text-5xl font-bold tracking-tight text-black">Command Center</h1>
 <p className="text-black/40 font-medium text-sm mt-2 border-l-2 border-primary/20 pl-4">
 Logistics management for botanical distribution and identity security.
 </p>
 </div>
 <div className="flex items-center gap-4">
 <Button 
 variant="outline" 
 className="rounded-xl h-12 px-6 border-black/10 hover:bg-black/5 transition-all font-bold text-xs active:scale-95 group"
 onClick={() => router.push("/admin/analytics")}
 >
 <BarChart3 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> Depth Metrics
 </Button>
 <Button 
 className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 font-bold text-xs transition-all active:scale-95 flex items-center gap-2"
 onClick={() => router.push("/admin/products/new")}
 >
 <Zap className="h-4 w-4 fill-white" /> Launch Formula
 </Button>
 </div>
 </div>

 {/* Primary Stats Grid */}
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
 {stats.map((stat, i) => (
 <Card key={stat.title} className={`border-black/5 rounded-xl overflow-hidden bg-white transition-all`}>
 <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
 <div className={`${stat.bg} p-3 rounded-lg`}>
 <stat.icon className={`h-5 w-5 ${stat.color}`} />
 </div>
 <div className="flex items-center gap-1 opacity-60">
 {stat.up ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-rose-500" />}
 <span className={`text-[10px] font-bold ${stat.up ? "text-emerald-600" : "text-rose-600"}`}>{stat.trend}</span>
 </div>
 </CardHeader>
 <CardContent className="p-6 pt-2 space-y-1">
 <div className="text-3xl font-bold tracking-tight text-black">{stat.value}</div>
 <p className="text-[10px] font-bold uppercase tracking-wider text-black/30 mt-2">{stat.title}</p>
 </CardContent>
 </Card>
 ))}
 </div>

 <div className="grid gap-10 grid-cols-1 lg:grid-cols-3">
 {/* Elite Catalog View */}
 <div className="lg:col-span-2 space-y-6">
 <div className="flex items-center justify-between px-2">
 <div className="flex items-center gap-3">
 <Activity className="h-5 w-5 text-primary/40" />
 <h3 className="text-xl font-bold tracking-tight text-black">Molecular Performance</h3>
 </div>
 <Button 
 variant="link" 
 className="text-primary font-bold text-xs hover:no-underline flex items-center group"
 onClick={() => router.push("/admin/products")}
 >
 Full Registry <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
 </Button>
 </div>
 <Card className="bg-white rounded-xl border-black/5 p-2 overflow-hidden">
 <DataTable columns={columns} data={products.slice(0, 4)} />
 </Card>
 </div>

 {/* Real-time Logistics Log */}
 <div className="space-y-6">
 <div className="flex items-center gap-3 px-2">
 <ShieldCheck className="h-5 w-5 text-primary/40" />
 <h3 className="text-xl font-bold tracking-tight text-black">Manifest Signals</h3>
 </div>
 <Card className="bg-white border-black/5 rounded-xl p-8 space-y-8 relative overflow-hidden">
 <div className="space-y-6 relative z-10 transition-all">
 {orders.slice(0, 4).map((order) => (
 <div key={order.id} className="flex items-center gap-4 group/item cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
 <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 group-hover/item:bg-primary group-hover/item:text-white transition-all">
 <FileText className="h-5 w-5" />
 </div>
 <div className="flex-1 space-y-0.5">
 <p className="text-[10px] font-bold text-black/30 flex items-center gap-2 uppercase tracking-tight">
 batch-{order.id.slice(0, 6)}
 </p>
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-black">{order.status?.toLowerCase()}</span>
 <span className="text-sm font-bold text-primary">${order.total?.toFixed(2)}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 <Button 
 className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 font-bold text-xs transition-all active:scale-95"
 onClick={() => router.push("/admin/orders")}
 >
 Logistics Matrix
 </Button>
 </Card>
 </div>
 </div>
 </div>
 );
}
