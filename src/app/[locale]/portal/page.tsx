"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const STATS = [
 {
 title: "Open Tickets",
 value: "12",
 description: "+2 from yesterday",
 icon: Ticket,
 color: "text-blue-600",
 bg: "bg-blue-50",
 },
 {
 title: "Unread Messages",
 value: "5",
 description: "3 high priority",
 icon: MessageSquare,
 color: "text-green-600",
 bg: "bg-green-50",
 },
 {
 title: "Avg. Response Time",
 value: "1h 45m",
 description: "-10% from last week",
 icon: Clock,
 color: "text-purple-600",
 bg: "bg-purple-50",
 },
 {
 title: "Resolved Today",
 value: "28",
 description: "100% satisfaction",
 icon: CheckCircle2,
 color: "text-[#f2c94c]",
 bg: "bg-[#f2c94c]/10",
 },
];

type RecentActivity = {
 id: string;
 action: string;
 user: string;
 time: string;
 status: "success" | "info" | "warning";
};

const activityData: RecentActivity[] = [
 {
 id: "1",
 action: "Ticket #1024 resolved",
 user: "Support Agent",
 time: "5m ago",
 status: "success",
 },
 {
 id: "2",
 action: "New message from Alice",
 user: "Customer",
 time: "12m ago",
 status: "info",
 },
 {
 id: "3",
 action: "System update completed",
 user: "System",
 time: "1h ago",
 status: "success",
 },
 {
 id: "4",
 action: "Priority ticket escalation",
 user: "Manager",
 time: "2h ago",
 status: "warning",
 },
];

const columns: ColumnDef<RecentActivity>[] = [
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
 accessorKey: "action",
 header: "Activity",
 cell: ({ row }) => (
 <span className="font-bold text-black">{row.getValue("action")}</span>
 ),
 },
 {
 accessorKey: "user",
 header: "Performed By",
 },
 {
 accessorKey: "time",
 header: "Time",
 },
 {
 accessorKey: "status",
 header: "Status",
 cell: ({ row }) => {
 const status = row.getValue("status") as string;
 return (
 <Badge
 className={`rounded px-3 py-0.5 text-[10px] uppercase font-bold border-none ${
 status === "success"
 ? "bg-green-100 text-green-700"
 : status === "warning"
 ? "bg-red-100 text-red-700"
 : "bg-blue-100 text-blue-700"
 }`}
 >
 {status}
 </Badge>
 );
 },
 },
];

import { PageHeader } from "@/components/ui/page-header";

export default function PortalDashboard() {
 return (
 <div className="space-y-8 pb-12">
 <PageHeader
 title="Welcome Back, Agent"
 description="Support Portal Overview"
 />

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
 <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
 {stat.description}
 </p>
 </CardContent>
 </Card>
 ))}
 </div>

 <div className="space-y-4">
 <h3 className="text-lg font-bold text-black capitalize">
 Recent Activity
 </h3>
 <DataTable columns={columns} data={activityData} />
 </div>
 </div>
 );
}
