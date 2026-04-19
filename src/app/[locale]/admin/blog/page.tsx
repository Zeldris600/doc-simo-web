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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardHeader from "@/components/dashboard-header";
import { useAdminBlogPosts, useDeleteBlogPost } from "@/hooks/use-blog";
import type { BlogPostStatus, BlogPostWithAuthor } from "@/types/blog";
import { useCan } from "@/hooks/use-can";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

const STATUS_FILTER: Array<{ value: string; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function AdminBlogPage() {
  const router = useRouter();
  const { can } = useCan();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: listResponse, isLoading } = useAdminBlogPosts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status:
      statusFilter === "all" ? undefined : (statusFilter as BlogPostStatus),
  });
  const { mutate: deletePost } = useDeleteBlogPost();

  const posts = listResponse?.data ?? [];
  const total = listResponse?.total ?? 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  const columns: ColumnDef<BlogPostWithAuthor>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium text-black line-clamp-2 max-w-[240px]">
          {row.original.title}
        </span>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 font-mono">{row.original.slug}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        const styles =
          s === "PUBLISHED"
            ? "bg-green-100 text-green-800"
            : s === "DRAFT"
              ? "bg-amber-50 text-amber-800"
              : "bg-gray-100 text-gray-700";
        return (
          <Badge
            className={`rounded px-3 py-0.5 text-[10px] font-medium uppercase border-none ${styles}`}
          >
            {s}
          </Badge>
        );
      },
    },
    {
      accessorKey: "kind",
      header: "Kind",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-gray-600">{row.original.kind}</span>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: "Published",
      cell: ({ row }) => {
        const d = row.original.publishedAt;
        return (
          <span className="text-sm text-gray-500">
            {d
              ? new Date(d).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </span>
        );
      },
    },
  ];

  if (can("blog:write")) {
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
              onClick={() => router.push(`/admin/blog/${row.original.id}`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm font-medium text-destructive"
              onClick={() => {
                if (confirm("Delete this post? This cannot be undone.")) {
                  deletePost(row.original.id, {
                    onSuccess: () => toast.success("Post deleted"),
                    onError: () => toast.error("Could not delete post"),
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

  const addAction = can("blog:write") ? (
    <Button onClick={() => router.push("/admin/blog/new")}>
      <Plus className="w-4 h-4 mr-2" /> New post
    </Button>
  ) : null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Blog"
        description="Create and publish articles and videos for the storefront."
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        searchKey="title"
        action={addAction || undefined}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
