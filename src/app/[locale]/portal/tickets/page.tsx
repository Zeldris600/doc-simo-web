"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Ticket = {
 id: string;
 subject: string;
 status: "open" | "closed" | "pending";
 priority: "low" | "medium" | "high";
 customer: string;
 createdAt: string;
};

const data: Ticket[] = [
 {
 id: "T-1001",
 subject: "Missing items in order #8821",
 status: "open",
 priority: "high",
 customer: "Alice Johnson",
 createdAt: "2026-02-20",
 },
 {
 id: "T-1002",
 subject: "Inquiry about Organic Ashwagandha",
 status: "pending",
 priority: "medium",
 customer: "Bob Smith",
 createdAt: "2026-02-21",
 },
 {
 id: "T-1003",
 subject: "Refund request for damaged bottle",
 status: "closed",
 priority: "high",
 customer: "Charlie Davis",
 createdAt: "2026-02-19",
 },
 {
 id: "T-1004",
 subject: "Wholesale inquiry for clinic",
 status: "open",
 priority: "low",
 customer: "Dr. Emily White",
 createdAt: "2026-02-22",
 },
 {
 id: "T-1005",
 subject: "Dosage question for Papaya Extract",
 status: "open",
 priority: "medium",
 customer: "Frank Miller",
 createdAt: "2026-02-23",
 },
 {
 id: "T-1006",
 subject: "Delayed shipping to Marseille",
 status: "pending",
 priority: "medium",
 customer: "Marie Lefebvre",
 createdAt: "2026-02-22",
 },
];

const columns: ColumnDef<Ticket>[] = [
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
 accessorKey: "subject",
 header: ({ column }) => {
 return (
 <Button
 variant="ghost"
 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
 className="p-0 hover:bg-transparent text-xs font-bold tracking-wider"
 >
 Subject
 <ArrowUpDown className="ml-2 h-4 w-4" />
 </Button>
 );
 },
 },
 {
 accessorKey: "customer",
 header: "Customer",
 },
 {
 accessorKey: "status",
 header: "Status",
 cell: ({ row }) => {
 const status = row.getValue("status") as string;
 return (
 <Badge
 className={`rounded px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
 status === "open"
 ? "bg-green-100 text-green-700"
 : status === "closed"
 ? "bg-gray-100 text-gray-700"
 : "bg-yellow-100 text-yellow-700"
 }`}
 >
 {status}
 </Badge>
 );
 },
 },
 {
 accessorKey: "priority",
 header: "Priority",
 cell: ({ row }) => {
 const priority = row.getValue("priority") as string;
 return (
 <Badge
 variant="outline"
 className={`rounded px-3 py-0.5 text-[10px] font-bold uppercase border-gray-100 ${
 priority === "high"
 ? "text-red-500"
 : priority === "medium"
 ? "text-orange-500"
 : "text-blue-500"
 }`}
 >
 {priority}
 </Badge>
 );
 },
 },
 {
 accessorKey: "createdAt",
 header: "Created At",
 },
 {
 id: "actions",
 cell: ({ row }) => {
 return (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="h-8 w-8 p-0">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent
 align="end"
 className="rounded border-gray-100 "
 >
 <DropdownMenuLabel className="text-xs font-bold uppercase text-gray-400">
 Actions
 </DropdownMenuLabel>
 <DropdownMenuItem className="text-sm font-medium">
 View details
 </DropdownMenuItem>
 <DropdownMenuItem className="text-sm font-medium">
 Assign agent
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
];

import { PageHeader } from "@/components/ui/page-header";

export default function TicketsPage() {
 const addAction = (
 <Button className="rounded px-6 py-6 bg-primary text-white font-bold uppercase text-[10px] tracking-widest transition-all hover:scale-105 border-none">
 New Ticket
 </Button>
 );

 return (
 <div className="space-y-6">
 <PageHeader
 title="Tickets"
 description="Manage customer support inquiries."
 action={addAction}
 />

 <DataTable
 columns={columns}
 data={data}
 searchKey="subject"
 action={addAction}
 />
 </div>
 );
}
