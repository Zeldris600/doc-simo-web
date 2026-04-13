"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "@/lib/icons";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardHeader from "@/components/dashboard-header";
import { useDiscounts, useDeleteDiscount } from "@/hooks/use-discount";
import { Discount } from "@/types/api";
import { useCan } from "@/hooks/use-can";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

export default function AdminDiscountsPage() {
 const router = useRouter();
 const { can } = useCan();
 const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
 const { data: discountsResponse, isLoading } = useDiscounts({
 page: pagination.pageIndex + 1,
 limit: pagination.pageSize,
 });
 const { mutate: deleteDiscount } = useDeleteDiscount();

 const discounts = discountsResponse?.data || [];
 const total = discountsResponse?.total || 0;
 const pageCount = Math.ceil(total / pagination.pageSize);

 const columns: ColumnDef<Discount>[] = [
 {
 accessorKey: "code",
 header: "Code",
 cell: ({ row }) => (
 <span className="font-medium text-black uppercase text-xs bg-black/[0.03] px-3 py-1.5 rounded-lg">
 {row.getValue("code")}
 </span>
 ),
 },
 {
 accessorKey: "type",
 header: "Type",
 cell: ({ row }) => (
 <Badge
 variant="outline"
 className={`rounded-lg px-3 py-0.5 text-[10px] font-medium uppercase border-none ${
 row.getValue("type") === "PERCENT"
 ? "bg-blue-50 text-blue-700"
 : "bg-amber-50 text-amber-700"
 }`}
 >
 {row.getValue("type")}
 </Badge>
 ),
 },
 {
 accessorKey: "value",
 header: "Value",
 cell: ({ row }) => {
 const type = row.original.type;
 const value = Number(row.getValue("value"));
 return (
 <span className="font-medium text-black">
 {type === "PERCENT" ? `${value}%` : `${value.toLocaleString()} XAF`}
 </span>
 );
 },
 },
 {
 accessorKey: "expiresAt",
 header: "Expires",
 cell: ({ row }) => {
 const expiresAt = row.getValue("expiresAt") as string | null;
 return (
 <span className="text-sm text-gray-500 font-medium">
 {expiresAt
 ? new Date(expiresAt).toLocaleDateString(undefined, {
 year: "numeric",
 month: "short",
 day: "numeric",
 })
 : "No expiry"}
 </span>
 );
 },
 },
 {
 accessorKey: "usedCount",
 header: "Usage",
 cell: ({ row }) => {
 const used = row.original.usedCount ?? 0;
 const max = row.original.maxUses;
 return (
 <span className="text-sm font-medium text-gray-500">
 {used}{max != null ? ` / ${max}` : " / ∞"}
 </span>
 );
 },
 },
 {
 accessorKey: "active",
 header: "Status",
 cell: ({ row }) => {
 const isActive = row.getValue("active") as boolean;
 return (
 <Badge
 className={`rounded px-3 py-0.5 text-[10px] font-medium uppercase border-none ${
 isActive
 ? "bg-green-100 text-green-700"
 : "bg-gray-100 text-gray-700"
 }`}
 >
 {isActive ? "Active" : "Expired"}
 </Badge>
 );
 },
 },
 ];

 if (can("discounts:write")) {
 columns.push({
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
 className="rounded border-gray-100 shadow-none"
 >
 <DropdownMenuLabel className="text-xs font-medium uppercase text-gray-400">
 Manage
 </DropdownMenuLabel>
 <DropdownMenuItem
 className="text-sm font-medium"
 onClick={() => router.push(`/admin/discounts/${row.original.id}`)}
 >
 Edit details
 </DropdownMenuItem>
 <DropdownMenuItem
 className="text-sm font-medium text-destructive"
 onClick={() => {
 if (confirm("Are you sure you want to delete this discount?")) {
 deleteDiscount(row.original.id, {
 onSuccess: () =>
 toast.success("Discount deleted successfully"),
 });
 }
 }}
 >
 Delete
 </DropdownMenuItem>
 </DropdownMenuContent>
 </DropdownMenu>
 ),
 });
 }

 const addAction = can("discounts:write") ? (
 <Button onClick={() => router.push("/admin/discounts/new")}>
 <Plus className="w-4 h-4 mr-2" /> Add Discount
 </Button>
 ) : null;

 return (
 <div className="space-y-6">
 <DashboardHeader
 title="Discount Codes"
 description="Create and manage promotional discount codes for your store."
 />

 <DataTable
 columns={columns}
 data={discounts}
 searchKey="code"
 action={addAction || undefined}
 pageCount={pageCount}
 pagination={pagination}
 onPaginationChange={setPagination}
 isLoading={isLoading}
 />
 </div>
 );
}
