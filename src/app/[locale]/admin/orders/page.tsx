"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Order = {
 id: string;
 customer: string;
 total: number;
 status: "processing" | "shipped" | "delivered" | "cancelled";
 date: string;
 method: "Card" | "PayPal" | "Crypto";
};

const data: Order[] = [
 {
 id: "#ORD-9910",
 customer: "Alice Johnson",
 total: 125.0,
 status: "shipped",
 date: "2026-02-24",
 method: "Card",
 },
 {
 id: "#ORD-9911",
 customer: "Bob Smith",
 total: 34.0,
 status: "processing",
 date: "2026-02-25",
 method: "PayPal",
 },
 {
 id: "#ORD-9912",
 customer: "Marie Lefebvre",
 total: 210.5,
 status: "delivered",
 date: "2026-02-22",
 method: "Card",
 },
 {
 id: "#ORD-9913",
 customer: "Charlie Davis",
 total: 89.0,
 status: "cancelled",
 date: "2026-02-20",
 method: "Crypto",
 },
];

const columns: ColumnDef<Order>[] = [
 {
 accessorKey: "id",
 header: "ID",
 cell: ({ row }) => (
 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
 {row.getValue("id")}
 </span>
 ),
 },
 {
 accessorKey: "customer",
 header: "Customer",
 cell: ({ row }) => (
 <span className="font-medium text-gray-700">
 {row.getValue("customer")}
 </span>
 ),
 },
 {
 accessorKey: "date",
 header: "Date",
 },
 {
 accessorKey: "total",
 header: "Total",
 cell: ({ row }) => {
 const amount = parseFloat(row.getValue("total"));
 return <span className="font-bold text-black">${amount.toFixed(2)}</span>;
 },
 },
 {
 accessorKey: "method",
 header: "Payment",
 cell: ({ row }) => (
 <span className="text-[10px] font-bold uppercase text-gray-400 border border-gray-100 px-2 py-0.5 rounded">
 {row.getValue("method")}
 </span>
 ),
 },
 {
 accessorKey: "status",
 header: "Status",
 cell: ({ row }) => {
 const status = row.getValue("status") as string;
 return (
 <Badge
 className={`rounded px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
 status === "delivered"
 ? "bg-green-100 text-green-700"
 : status === "processing"
 ? "bg-blue-100 text-blue-700"
 : status === "shipped"
 ? "bg-purple-100 text-purple-700"
 : "bg-red-100 text-red-700"
 }`}
 >
 {status}
 </Badge>
 );
 },
 },
 {
 id: "actions",
 cell: ({ row }) => (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="h-8 w-8 p-0">
 <MoreHorizontal className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent
 align="end"
 className="rounded border-gray-100 "
 >
 <DropdownMenuLabel className="text-xs font-bold uppercase text-gray-400">
 Order Actions
 </DropdownMenuLabel>
 <DropdownMenuItem className="text-sm font-medium flex items-center gap-2">
 <ExternalLink className="w-3 h-3" /> View Invoice
 </DropdownMenuItem>
 <DropdownMenuItem className="text-sm font-medium">
 Update status
 </DropdownMenuItem>
 <DropdownMenuItem className="text-sm font-medium text-destructive">
 Refund order
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 ),
 },
];

import { PageHeader } from "@/components/ui/page-header";

export default function AdminOrdersPage() {
 return (
 <div className="space-y-6">
 <PageHeader
 title="Sales & Orders"
 description="Monitor and fulfill your clinical herbal orders."
 />

 <DataTable columns={columns} data={data} searchKey="id" />
 </div>
 );
}
