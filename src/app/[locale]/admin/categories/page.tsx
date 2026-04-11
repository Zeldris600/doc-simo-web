"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "@/lib/icons";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardHeader from "@/components/dashboard-header";
import { useCategories, useDeleteCategory } from "@/hooks/use-category";
import { Category } from "@/types/api";
import { useCan } from "@/hooks/use-can";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { can } = useCan();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: categoriesResponse, isLoading } = useCategories({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const { mutate: deleteCategory } = useDeleteCategory();

  const categories = categoriesResponse?.data || [];
  const total = categoriesResponse?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        const src = row.original.image || "/placeholder.png";
        return (
          <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-50 border border-gray-100">
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
      header: "Category Name",
      cell: ({ row }) => (
        <span className="font-bold text-black">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <span className="text-gray-500 font-medium">
          {row.getValue("slug")}
        </span>
      ),
    },
    {
      accessorKey: "_count.products",
      header: "Products",
      cell: ({ row }) => (
        <span className="font-bold text-gray-500">
          {row.original._count?.products || 0} items
        </span>
      ),
    },
  ];

  if (can("categories:write")) {
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        return (
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
              <DropdownMenuLabel className="text-xs font-bold uppercase text-gray-400">
                Manage
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="text-sm font-medium"
                onClick={() =>
                  router.push(`/admin/categories/${row.original.id}`)
                }
              >
                Edit details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm font-medium text-destructive"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this category?")
                  ) {
                    deleteCategory(row.original.id, {
                      onSuccess: () =>
                        toast.success("Category deleted successfully"),
                    });
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  const addAction = can("categories:write") ? (
    <Button onClick={() => router.push("/admin/categories/new")}>
      <Plus className="w-4 h-4 mr-2" /> Add Category
    </Button>
  ) : null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Category Management"
        description="Organize your product catalog by therapeutic functions."
      />
      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        action={addAction || undefined}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
