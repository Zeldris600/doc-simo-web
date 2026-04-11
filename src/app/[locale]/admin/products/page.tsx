"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, PackagePlus } from "@/lib/icons";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DashboardHeader from "@/components/dashboard-header";
import { useState } from "react";
import { useProducts, useDeleteProduct, useRestockProduct } from "@/hooks/use-product";
import { Product } from "@/types/api";
import { useCan } from "@/hooks/use-can";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

export default function AdminProductsPage() {
  const router = useRouter();
  const { can } = useCan();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: productsResponse, isLoading } = useProducts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: restockProduct, isPending: isRestocking } = useRestockProduct();

  const [restockDialog, setRestockDialog] = useState<{ open: boolean; productId: string; productName: string }>({
    open: false,
    productId: "",
    productName: "",
  });
  const [restockQuantity, setRestockQuantity] = useState(1);

  const handleRestock = () => {
    restockProduct(
      { id: restockDialog.productId, quantity: restockQuantity },
      {
        onSuccess: () => {
          toast.success(`Restocked ${restockQuantity} units successfully`);
          setRestockDialog({ open: false, productId: "", productName: "" });
          setRestockQuantity(1);
        },
        onError: () => {
          toast.error("Failed to restock product");
        },
      }
    );
  };

  const products = productsResponse?.data || [];
  const total = productsResponse?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        const src =
          row.original.images?.[0] || row.original.image || "/placeholder.png";
        return (
          <div className="relative h-10 w-10 rounded overflow-hidden bg-black/[0.02] border border-black/5">
            <Image
              src={src}
              alt={row.getValue("name")}
              fill
              className="object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <span className="font-bold text-black">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-black/50 font-medium">{row.original.category?.name || "N/A"}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return (
          <span className="font-bold text-black">
            {price.toLocaleString()} XAF
          </span>
        );
      },
    },
    {
      accessorKey: "inventoryLevel",
      header: "Inventory",
      cell: ({ row }) => {
        const stock = row.getValue("inventoryLevel") as number | undefined;
        const displayStock = stock ?? 0;
        return (
          <span
            className={`font-bold ${displayStock === 0 ? "text-destructive" : "text-black/50"}`}
          >
            {displayStock} in stock
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
            className={`rounded px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-black/5 text-black/40"
            }`}
          >
            {isActive ? "Active" : "Disabled"}
          </Badge>
        );
      },
    },
  ];

  if (can("products:write")) {
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
            className="rounded border-black/10 shadow-none"
          >
            <DropdownMenuLabel className="text-xs font-bold uppercase text-black/30">
              Manage
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="text-sm font-medium"
              onClick={() => router.push(`/admin/products/${row.original.id}`)}
            >
              Edit details
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm font-medium flex items-center gap-2"
              onClick={() =>
                setRestockDialog({
                  open: true,
                  productId: row.original.id,
                  productName: row.original.name,
                })
              }
            >
              <PackagePlus className="h-3.5 w-3.5" /> Restock
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm font-medium text-destructive"
              onClick={() => {
                if (confirm("Are you sure you want to delete this product?")) {
                  deleteProduct(row.original.id, {
                    onSuccess: () =>
                      toast.success("Product deleted successfully"),
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

  const addAction = can("products:write") ? (
    <Button onClick={() => router.push("/admin/products/new")}>
      <Plus className="w-4 h-4 mr-2" /> Add Product
    </Button>
  ) : null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Product Catalog"
        description="View and manage your clinical herbal products."
      />

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        action={addAction || undefined}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />

      {/* Restock Dialog */}
      <Dialog
        open={restockDialog.open}
        onOpenChange={(open) =>
          setRestockDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-md rounded-2xl border-black/10 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-black">Restock Product</DialogTitle>
            <DialogDescription className="text-sm text-black/50">
              Add inventory to <strong className="text-black">{restockDialog.productName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-xs font-black uppercase tracking-widest text-black/40 mb-2 block">
              Quantity to add
            </label>
            <Input
              type="number"
              min={1}
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(Number(e.target.value))}
              className="text-lg font-bold"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRestockDialog({ open: false, productId: "", productName: "" })}
            >
              Cancel
            </Button>
            <Button onClick={handleRestock} disabled={isRestocking || restockQuantity < 1}>
              {isRestocking ? "Restocking..." : `Add ${restockQuantity} units`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
