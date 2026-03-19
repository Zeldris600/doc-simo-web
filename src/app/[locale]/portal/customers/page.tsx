"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCheck, ShieldAlert } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PortalCustomer = {
 id: string;
 name: string;
 email: string;
 accountType: "VIP" | "Standard" | "Consultant";
 lastContact: string;
 supportPriority: "normal" | "urgent";
};

const data: PortalCustomer[] = [
 {
 id: "UID-776",
 name: "Alice Johnson",
 email: "alice@example.com",
 accountType: "VIP",
 lastContact: "2h ago",
 supportPriority: "urgent",
 },
 {
 id: "UID-812",
 name: "Bob Smith",
 email: "bob.smith@company.com",
 accountType: "Standard",
 lastContact: "1d ago",
 supportPriority: "normal",
 },
 {
 id: "UID-102",
 name: "Marie Lefebvre",
 email: "marie.l@paris.fr",
 accountType: "Consultant",
 lastContact: "5m ago",
 supportPriority: "urgent",
 },
];

const columns: ColumnDef<PortalCustomer>[] = [
 {
 accessorKey: "name",
 header: "Customer",
 cell: ({ row }) => {
 const name = row.getValue("name") as string;
 return (
 <div className="flex items-center gap-3">
 <Avatar className="h-8 w-8">
 <AvatarFallback className="bg-gray-100 text-xs font-bold">
 {name.substring(0, 2)}
 </AvatarFallback>
 </Avatar>
 <div className="flex flex-col">
 <span className="font-black text-black">{name}</span>
 <span className="text-[10px] text-gray-400 font-bold uppercase">
 {row.original.id}
 </span>
 </div>
 </div>
 );
 },
 },
 {
 accessorKey: "accountType",
 header: "Plan",
 cell: ({ row }) => (
 <span className="text-[10px] font-black uppercase text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded">
 {row.getValue("accountType")}
 </span>
 ),
 },
 {
 accessorKey: "lastContact",
 header: "Last Activity",
 },
 {
 accessorKey: "supportPriority",
 header: "Priority",
 cell: ({ row }) => {
 const priority = row.getValue("supportPriority") as string;
 return (
 <span
 className={`text-[10px] font-black uppercase ${priority === "urgent" ? "text-red-500" : "text-gray-400"}`}
 >
 {priority}
 </span>
 );
 },
 },
 {
 id: "actions",
 cell: () => (
 <div className="flex items-center gap-2">
 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
 <UserCheck className="w-4 h-4" />
 </Button>
 <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400">
 <ShieldAlert className="w-4 h-4" />
 </Button>
 </div>
 ),
 },
];

export default function PortalCustomersPage() {
 return (
 <div className="space-y-6">
 <div>
 <h2 className="text-2xl font-black tracking-tight text-black">
 Customer Support Records
 </h2>
 <p className="text-sm font-medium text-gray-500">
 Quick access to customer profiles and account data.
 </p>
 </div>
 <DataTable columns={columns} data={data} searchKey="name" />
 </div>
 );
}
