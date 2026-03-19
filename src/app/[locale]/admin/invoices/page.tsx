"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
 FileText, 
 Download, 
 Eye, 
 Search, 
 Filter, 
 Calendar,
 ChevronRight,
 Printer
} from "lucide-react";
import { useOrders } from "@/hooks/use-order";
import { Order } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminInvoicesPage() {
 const router = useRouter();
 const { data: ordersData, isLoading } = useOrders();
 const orders = ordersData?.data || [];

 const columns: ColumnDef<Order>[] = [
 {
 accessorKey: "id",
 header: "INVOICE ID",
 cell: ({ row }) => (
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-black/[0.02] border border-black/5 flex items-center justify-center">
 <FileText className="h-5 w-5 text-black/40" />
 </div>
 <span className="font-mono font-black uppercase text-black tracking-tighter">INV-{row.original.id.slice(0, 8)}</span>
 </div>
 ),
 },
 {
 accessorKey: "createdAt",
 header: "ISSUE DATE",
 cell: ({ row }) => (
 <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
 {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(row.original.createdAt))}
 </span>
 ),
 },
 {
 accessorKey: "total",
 header: "TOTAL VALUE",
 cell: ({ row }) => (
 <span className="font-black text-black uppercase tracking-tighter">
 ${row.original.total?.toFixed(2)}
 </span>
 ),
 },
 {
 accessorKey: "status",
 header: "FISCAL STATUS",
 cell: ({ row }) => {
 const isPaid = row.original.status !== "CANCELLED"; // Simple logic for mock
 return (
 <Badge className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none ${isPaid ? "bg-black text-white" : "bg-rose-500/10 text-rose-600"}`}>
 {isPaid ? "AUTHORIZED" : "VOIDED"}
 </Badge>
 );
 },
 },
 {
 id: "actions",
 cell: ({ row }) => (
 <div className="flex items-center gap-2">
 <Button 
 variant="ghost" 
 size="icon" 
 className="h-9 w-9 p-0 hover:bg-black hover:text-white rounded-xl transition-all "
 onClick={() => router.push(`/admin/orders/${row.original.id}`)}
 >
 <Eye className="h-4 w-4" />
 </Button>
 <Button 
 variant="ghost" 
 size="icon" 
 className="h-9 w-9 p-0 hover:bg-emerald-500 hover:text-white rounded-xl transition-all "
 onClick={() => toast.success("Generating encrypted PDF...")}
 >
 <Download className="h-4 w-4" />
 </Button>
 <Button 
 variant="ghost" 
 size="icon" 
 className="h-9 w-9 p-0 hover:bg-blue-500 hover:text-white rounded-xl transition-all "
 onClick={() => window.print()}
 >
 <Printer className="h-4 w-4" />
 </Button>
 </div>
 ),
 },
 ];

 if (isLoading) {
 return (
 <div className="p-8 space-y-10 animate-in fade-in duration-1000">
 <div className="space-y-4">
 <Skeleton className="h-10 w-[300px] rounded-xl" />
 <Skeleton className="h-4 w-[400px] rounded-lg" />
 </div>
 <div className="border border-black/5 rounded-lg overflow-hidden ">
 <Skeleton className="h-[500px] w-full" />
 </div>
 </div>
 );
 }

 return (
 <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1500">
 <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-black/5">
 <div className="space-y-1">
 <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-none flex items-center gap-4">
 <FileText className="h-10 w-10 text-black/10" />
 Fiscal Registry
 </h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Managing botanical distribution invoices and commercial logs.</p>
 </div>
 
 <div className="flex items-center gap-4">
 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20" />
 <input 
 placeholder="SEARCH PROTOCOLS..." 
 className="bg-black/[0.02] border border-black/5 rounded-lg pl-12 pr-6 py-4 h-14 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-black transition-all outline-none w-64 "
 />
 </div>
 <Button variant="outline" className="rounded-lg h-14 px-8 border-black/10 hover:bg-black hover:text-white transition-all font-black uppercase tracking-widest text-[10px] gap-3 active:scale-95 ">
 <Filter className="h-4 w-4" /> Filter Logs
 </Button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
 <div className="bg-black text-white p-8 rounded-lg space-y-4">
 <div className="flex items-center justify-between">
 <Calendar className="h-6 w-6 text-white/40" />
 <Badge className="bg-white/10 text-white border-none rounded-full px-3 py-1 text-[8px] font-black tracking-widest">Q1 REVENUE</Badge>
 </div>
 <div className="space-y-1">
 <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Total Fiscal Volume</p>
 <h3 className="text-5xl font-black tracking-tighter leading-none">${orders.reduce((acc, o) => acc + (o.total || 0), 0).toLocaleString()}</h3>
 </div>
 </div>
 <div className="bg-white border border-black/5 p-8 rounded-lg space-y-4">
 <div className="flex items-center justify-between">
 <CheckCircle2 className="h-6 w-6 text-emerald-500/40" />
 <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full px-3 py-1 text-[8px] font-black tracking-widest ">SETTLED</Badge>
 </div>
 <div className="space-y-1">
 <p className="text-black/40 font-black uppercase tracking-[0.2em] text-[10px]">Authorized Manifests</p>
 <h3 className="text-5xl font-black tracking-tighter text-black leading-none">{orders.length}</h3>
 </div>
 </div>
 <div className="bg-white border border-black/5 p-8 rounded-lg space-y-4 group">
 <div className="flex items-center justify-between">
 <AlertCircle className="h-6 w-6 text-rose-500/40" />
 <Badge className="bg-rose-500/10 text-rose-600 border-none rounded-full px-3 py-1 text-[8px] font-black tracking-widest">VOIDED</Badge>
 </div>
 <div className="space-y-1">
 <p className="text-black/40 font-black uppercase tracking-[0.2em] text-[10px]">Log Disruptions</p>
 <h3 className="text-5xl font-black tracking-tighter text-black leading-none">0</h3>
 </div>
 </div>
 </div>

 <div className="bg-white border border-black/5 rounded-lg overflow-hidden p-2">
 <DataTable columns={columns} data={orders} />
 </div>
 </div>
 );
}

import { AlertCircle } from "lucide-react";
