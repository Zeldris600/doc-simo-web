"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, RefreshCw, Box, AlertTriangle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProducts, useUpdateProduct } from "@/hooks/use-product";
import { Product } from "@/types/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

export default function AdminInventoryPage() {
 const router = useRouter();
 const { data: productsData, isLoading } = useProducts();
 const updateProductMutation = useUpdateProduct();

 const products = productsData?.data || [];

 const handleToggleAvailability = (product: Product, checked: boolean) => {
 updateProductMutation.mutate(
 { id: product.id, data: { availability: checked } },
 {
 onSuccess: () => {
 toast.success(`Module ${product.name} ${checked ? "re-engaged" : "decommissioned"}.`);
 },
 }
 );
 };

 const columns: ColumnDef<Product>[] = [
 {
 accessorKey: "image",
 header: "MOLECULE",
 cell: ({ row }) => (
 <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-black/5 bg-black/[0.02]">
 {row.original.image ? (
 <Image src={row.original.image} alt="" fill className="object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center">
 <Box className="h-5 w-5 text-black/10" />
 </div>
 )}
 </div>
 ),
 },
 {
 accessorKey: "name",
 header: "FORMULATION",
 cell: ({ row }) => (
 <div className="flex flex-col">
 <span className="font-black uppercase text-black tracking-tighter text-sm">{row.original.name}</span>
 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{row.original.slug}</span>
 </div>
 ),
 },
 {
 accessorKey: "availability",
 header: "PROTOCOL STATUS",
 cell: ({ row }) => (
 <div className="flex items-center gap-4">
 <Switch 
 checked={row.original.availability} 
 onCheckedChange={(checked) => handleToggleAvailability(row.original, checked)}
 className="data-[state=checked]:bg-black data-[state=unchecked]:bg-black/10"
 />
 <Badge className={`rounded-full px-3 py-0.5 font-black text-[8px] uppercase tracking-widest border-none ${row.original.availability ? "bg-black text-white" : "bg-black/5 text-black/20"}`}>
 {row.original.availability ? "Active" : "Archived"}
 </Badge>
 </div>
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
 <DropdownMenuContent align="end" className="rounded-lg border-black/10 p-2 min-w-[160px]">
 <DropdownMenuItem 
 className="rounded-xl px-3 py-2 cursor-pointer focus:bg-black focus:text-white group"
 onClick={() => router.push(`/admin/products/${row.original.id}/edit`)}
 >
 <RefreshCw className="mr-3 h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
 <span className="font-black uppercase text-[10px] tracking-widest text-inherit">Re-Index Log</span>
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 ),
 },
 ];

 if (isLoading) {
 return (
 <div className="p-8 space-y-10 animate-in fade-in duration-500">
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

 // Stock Analytics (Mock)
 const lowStock = products.filter(p => !p.availability).length;

 return (
 <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1500">
 <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-black/5">
 <div className="space-y-1">
 <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-none flex items-center gap-4">
 <Box className="h-10 w-10 text-black/10" />
 Stock Command
 </h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Real-time molecular availability and logistical protocols.</p>
 </div>
 <div className="flex gap-4">
 <div className="flex items-center gap-3 bg-black/[0.02] border border-black/5 px-6 py-3 rounded-lg">
 <CheckCircle2 className="h-4 w-4 text-emerald-500" />
 <div className="flex flex-col">
 <span className="text-xl font-black tracking-tighter leading-none">{products.length - lowStock}</span>
 <span className="text-[8px] font-black uppercase text-black/20 tracking-widest ">Live Assets</span>
 </div>
 </div>
 <div className="flex items-center gap-3 bg-rose-500/[0.02] border border-rose-500/5 px-6 py-3 rounded-lg">
 <AlertTriangle className="h-4 w-4 text-rose-500" />
 <div className="flex flex-col">
 <span className="text-xl font-black tracking-tighter leading-none">{lowStock}</span>
 <span className="text-[8px] font-black uppercase text-rose-500/40 tracking-widest ">Suspended</span>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white border border-black/5 rounded-lg overflow-hidden transition-all hover:/[0.04] p-2">
 <DataTable columns={columns} data={products} />
 </div>
 </div>
 );
}
