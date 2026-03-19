"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProducts, useDeleteProduct } from "@/hooks/use-product";
import { Product } from "@/types/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductsPage() {
 const router = useRouter();
 const { data: productsResponse, isLoading } = useProducts();
 const deleteMutation = useDeleteProduct();

 const products = productsResponse?.data || [];

 const handleDelete = (id: string) => {
 if (confirm("Are you sure you want to delete this product?")) {
 deleteMutation.mutate(id, {
 onSuccess: () => {
 toast.success("Product deleted successfully");
 },
 });
 }
 };

 const columns: ColumnDef<Product>[] = [
 {
 accessorKey: "image",
 header: "",
 cell: ({ row }) => {
 const image = row.getValue("image") as string;
 return (
 <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black/[0.02] border border-black/5 ">
 {image ? (
 <Image
 src={image}
 alt={row.getValue("name")}
 fill
 className="object-cover"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center bg-black/5">
 <Plus className="h-4 w-4 text-black/20" />
 </div>
 )}
 </div>
 );
 },
 },
 {
 accessorKey: "name",
 header: "Product",
 cell: ({ row }) => (
 <div className="flex flex-col">
 <span className="font-black text-black uppercase tracking-tight ">{row.getValue("name")}</span>
 <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{row.original.slug}</span>
 </div>
 ),
 },
 {
 accessorKey: "price",
 header: "Price",
 cell: ({ row }) => {
 const price = parseFloat(row.getValue("price"));
 return <span className="font-black text-black">${price.toFixed(2)}</span>;
 },
 },
 {
 accessorKey: "availability",
 header: "Status",
 cell: ({ row }) => {
 const available = row.getValue("availability") as boolean;
 return (
 <Badge
 className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-wider border-none ${
 available
 ? "bg-black text-white"
 : "bg-black/5 text-black/20"
 }`}
 >
 {available ? "In Stock" : "Sold Out"}
 </Badge>
 );
 },
 },
 {
 id: "actions",
 cell: ({ row }) => (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-black hover:text-white transition-all">
 <MoreHorizontal className="h-5 w-5" />
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent
 align="end"
 className="w-48 rounded-lg border-black/5 p-2"
 >
 <DropdownMenuLabel className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black/20">
 Operations
 </DropdownMenuLabel>
 <DropdownMenuSeparator className="bg-black/5" />
 <DropdownMenuItem 
 className="rounded-xl px-4 py-3 font-bold text-sm cursor-pointer hover:bg-black/[0.02]"
 onClick={() => router.push(`/admin/products/${row.original.id}/edit`)}
 >
 <Pencil className="mr-3 h-4 w-4" /> Edit Specs
 </DropdownMenuItem>
 <DropdownMenuItem 
 className="rounded-xl px-4 py-3 font-bold text-sm cursor-pointer text-destructive hover:bg-destructive/5"
 onClick={() => handleDelete(row.original.id)}
 >
 <Trash2 className="mr-3 h-4 w-4" /> Decommission
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 ),
 },
 ];

 if (isLoading) {
 return (
 <div className="space-y-8 p-10">
 <div className="flex justify-between items-center">
 <Skeleton className="h-12 w-64 rounded-lg" />
 <Skeleton className="h-12 w-48 rounded-lg" />
 </div>
 <Skeleton className="h-[400px] w-full rounded-lg" />
 </div>
 );
 }

 return (
 <div className="p-10 space-y-10">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-6xl font-black uppercase tracking-tighter text-black leading-none">Catalog</h1>
 <p className="text-black/40 font-bold uppercase tracking-widest text-xs mt-4">Molecular inventory and pharmacological database.</p>
 </div>
 <Link href="/admin/products/new">
 <Button className="bg-black hover:bg-black/90 text-white rounded-lg h-16 px-10 font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 gap-3">
 <Plus className="h-6 w-6" /> Add Product
 </Button>
 </Link>
 </div>

 <div className="bg-white rounded-lg border border-black/5 overflow-hidden p-2">
 <DataTable
 columns={columns}
 data={products}
 searchKey="name"
 />
 </div>
 </div>
 );
}
