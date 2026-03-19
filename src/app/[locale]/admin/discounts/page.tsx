"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Pencil, Trash2, Ticket, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDiscounts, useDeleteDiscount } from "@/hooks/use-discount";
import { Discount } from "@/types/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AdminDiscountsPage() {
 const router = useRouter();
 const { data: discountsData, isLoading } = useDiscounts();
 const deleteMutation = useDeleteDiscount();

 const discounts = discountsData?.data || [];

 const handleDelete = (id: string) => {
 if (confirm("Are you sure you want to delete this voucher?")) {
 deleteMutation.mutate(id, {
 onSuccess: () => {
 toast.success("Voucher deleted from system.");
 },
 });
 }
 };

 const columns: ColumnDef<Discount>[] = [
 {
 accessorKey: "code",
 header: "CODE",
 cell: ({ row }) => (
 <div className="flex items-center gap-3">
 <div className="h-10 w-10 rounded-xl bg-black/[0.02] border border-black/5 flex items-center justify-center">
 <Ticket className="h-5 w-5 text-black/40" />
 </div>
 <span className="font-mono font-black uppercase text-black tracking-tighter">{row.original.code}</span>
 </div>
 ),
 },
 {
 accessorKey: "type",
 header: "TYPE",
 cell: ({ row }) => (
 <Badge variant="outline" className="rounded-full border-black/10 px-3 py-1 font-black text-[10px] uppercase tracking-widest bg-black text-white">
 {row.original.type}
 </Badge>
 ),
 },
 {
 accessorKey: "value",
 header: "VALUE",
 cell: ({ row }) => (
 <span className="font-black text-black uppercase tracking-tighter">
 {row.original.type === "PERCENTAGE" ? `${row.original.value}%` : `$${row.original.value}`}
 </span>
 ),
 },
 {
 accessorKey: "active",
 header: "STATUS",
 cell: ({ row }) => (
 <div className="flex items-center gap-2">
 {row.original.active ? (
 <div className="flex items-center gap-1.5 text-emerald-600">
 <CheckCircle2 className="h-4 w-4" />
 <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
 </div>
 ) : (
 <div className="flex items-center gap-1.5 text-rose-600">
 <XCircle className="h-4 w-4" />
 <span className="text-[10px] font-black uppercase tracking-widest">Disabled</span>
 </div>
 )}
 </div>
 ),
 },
 {
 accessorKey: "expiresAt",
 header: "EXPIRY",
 cell: ({ row }) => (
 <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
 {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(row.original.expiresAt))}
 </span>
 ),
 },
 {
 id: "actions",
 cell: ({ row }) => {
 const discount = row.original;

 return (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-black hover:text-white rounded-full transition-all">
 <span className="sr-only">Open menu</span>
 <MoreHorizontal className="h-4 w-4" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="rounded-lg border-black/10 p-2 min-w-[160px]">
 <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-black/40 px-3 py-2">Operations</DropdownMenuLabel>
 <DropdownMenuItem 
 className="rounded-xl px-3 py-2 cursor-pointer focus:bg-black focus:text-white group"
 onClick={() => router.push(`/admin/discounts/${discount.id}/edit`)}
 >
 <Pencil className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
 <span className="font-black uppercase text-[10px] tracking-widest">Edit Spec</span>
 </DropdownMenuItem>
 <DropdownMenuItem 
 className="rounded-xl px-3 py-2 cursor-pointer focus:bg-rose-600 focus:text-white group text-rose-600"
 onClick={() => handleDelete(discount.id)}
 >
 <Trash2 className="mr-3 h-4 w-4 transition-transform group-hover:scale-110" />
 <span className="font-black uppercase text-[10px] tracking-widest">Erase Log</span>
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 );
 },
 },
 ];

 if (isLoading) {
 return (
 <div className="p-8 space-y-8 animate-in fade-in duration-500">
 <div className="flex items-center justify-between">
 <div className="space-y-2">
 <Skeleton className="h-10 w-[200px] rounded-xl" />
 <Skeleton className="h-4 w-[300px] rounded-lg" />
 </div>
 <Skeleton className="h-14 w-[180px] rounded-lg" />
 </div>
 <div className="border border-black/5 rounded-lg overflow-hidden">
 <Skeleton className="h-[400px] w-full" />
 </div>
 </div>
 );
 }

 return (
 <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
 <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-black/5">
 <div className="space-y-1">
 <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Voucher Repository</h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Managing economic stimulus and clinical promotions.</p>
 </div>
 <Button 
 onClick={() => router.push("/admin/discounts/new")}
 className="bg-black hover:bg-black/90 text-white rounded-lg h-14 px-10 font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 duration-300 group"
 >
 <Plus className="mr-3 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" /> Generate Voucher
 </Button>
 </div>

 <div className="bg-white border border-black/5 rounded-lg /5 overflow-hidden">
 <DataTable columns={columns} data={discounts} />
 </div>
 </div>
 );
}
