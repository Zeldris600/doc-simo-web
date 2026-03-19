"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone, ShieldCheck, User as UserIcon, LogOut, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUsers } from "@/hooks/use-user";
import { User } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminCustomersPage() {
 const router = useRouter();
 const { data: usersData, isLoading } = useUsers({ role: "CUSTOMER" });
 const users = usersData?.data || [];

 const columns: ColumnDef<User>[] = [
 {
 accessorKey: "name",
 header: "Patient Node",
 cell: ({ row }) => {
 const name = row.original.name || "N/A";
 const image = row.original.image;
 return (
 <div className="flex items-center gap-4">
 <div className="h-10 w-10 relative rounded-xl overflow-hidden border border-black/5 bg-black/[0.02]">
 <Avatar className="h-full w-full rounded-none">
 <AvatarImage src={image || ""} className="object-cover" />
 <AvatarFallback className="bg-black text-white text-[10px] font-black uppercase">
 {name.substring(0, 2).toUpperCase()}
 </AvatarFallback>
 </Avatar>
 </div>
 <div className="flex flex-col">
 <span className="font-black uppercase text-black tracking-tighter text-sm">{name}</span>
 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">ID: {row.original.id.slice(0, 8)}</span>
 </div>
 </div>
 );
 },
 },
 {
 accessorKey: "email",
 header: "Comm Vector",
 cell: ({ row }) => (
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2 text-[10px] text-black font-black uppercase tracking-tight ">
 <Mail className="w-3 h-3 text-black/20" /> {row.original.email || "N/A"}
 </div>
 <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
 <Phone className="w-3 h-3 text-gray-300" /> {(row.original as any).phoneNumber || "N/A"}
 </div>
 </div>
 ),
 },
 {
 accessorKey: "role",
 header: "PROTOCOL",
 cell: ({ row }) => (
 <Badge variant="outline" className="rounded-full border-black/10 px-3 py-0.5 font-black text-[8px] uppercase tracking-[0.2em] bg-black text-white border-none ">
 {row.original.role}
 </Badge>
 ),
 },
 {
 accessorKey: "createdAt",
 header: "NODE SINCE",
 cell: ({ row }) => (
 <span className="text-[10px] font-black uppercase tracking-widest text-black/40 ">
 {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(row.original.createdAt))}
 </span>
 ),
 },
 {
 id: "actions",
 cell: ({ row }) => (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-black hover:text-white rounded-full transition-all">
 <MoreHorizontal className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent
 align="end"
 className="rounded-lg border-black/10 p-2 min-w-[180px] animate-in slide-in-from-top-2 duration-300"
 >
 <DropdownMenuLabel className="text-[10px] font-black uppercase text-black/20 tracking-widest px-3 py-2">Node Security</DropdownMenuLabel>
 <DropdownMenuItem 
 className="rounded-xl px-3 py-2 cursor-pointer focus:bg-black focus:text-white group"
 onClick={() => router.push(`/admin/customers/${row.original.id}/edit`)}
 >
 <ShieldCheck className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
 <span className="font-black uppercase text-[10px] tracking-widest">Modify Specs</span>
 </DropdownMenuItem>
 <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-black focus:text-white group">
 <Package className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
 <span className="font-black uppercase text-[10px] tracking-widest">Trace Shipments</span>
 </DropdownMenuItem>
 <DropdownMenuItem 
 className="rounded-xl px-3 py-2 cursor-pointer focus:bg-rose-600 focus:text-white group text-rose-600"
 onClick={() => toast.error("System isolation protocol engaged.")}
 >
 <LogOut className="mr-3 h-4 w-4 transition-transform group-hover:scale-110 rotate-180" />
 <span className="font-black uppercase text-[10px] tracking-widest">Lock Account</span>
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
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
 <UserIcon className="h-10 w-10 text-black/10" />
 Clinical Nodes
 </h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Registry of wellness seekers and botanical patient nodes.</p>
 </div>
 </div>

 <div className="bg-white border border-black/5 rounded-lg /[0.02] overflow-hidden transition-all hover:/[0.04]">
 <DataTable columns={columns} data={users} />
 </div>
 </div>
 );
}
