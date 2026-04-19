"use client";

import { useOrders } from "@/hooks/use-orders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, User } from "@/lib/icons";
import { Link } from "@/i18n/routing";

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-gray-50 flex items-center justify-center">
          <Package className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <span className="font-medium text-black text-[10px]">
          #{row.original.id.substring(0, 8)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/5 flex items-center justify-center">
            <User className="h-3 w-3 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-black text-[10px] truncate max-w-[min(100%,280px)]">
              {user?.name || "Guest Checkout"}
            </span>
            <span className="text-[9px] text-gray-400">
              {user?.email || "No email"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return (
        <Badge
          className={`border-none font-medium text-[9px] px-2 py-0 h-5 rounded-full text-white ${
            status === "DELIVERED"
              ? "bg-[#166534]"
              : status === "PENDING"
                ? "bg-[#D97706]"
                : status === "SHIPPED"
                  ? "bg-[#EA580C]"
                  : status === "PROCESSING"
                    ? "bg-blue-600"
                    : "bg-gray-400"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(String(row.getValue("amount")));
      return (
        <div className="flex items-center justify-end gap-3">
          <span className="font-medium text-black text-[10px]">
            XAF {amount.toLocaleString()}
          </span>
          <Link
            href={`/admin/orders/${row.original.id}`}
            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      );
    },
  },
];

const DASHBOARD_TABLE_LIMIT = 100;

export function RecentOrdersTable() {
  const { data: response, isLoading } = useOrders({
    limit: DASHBOARD_TABLE_LIMIT,
  });
  const orders = response?.data ?? [];

  return (
    <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-black">
            Recent Orders
          </CardTitle>
          <p className="text-[10px] font-medium text-gray-400">
            Latest shop transactions
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="text-[10px] font-medium text-primary hover:underline"
        >
          View All Orders
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          initialPageSize={DASHBOARD_TABLE_LIMIT}
        />
      </CardContent>
    </Card>
  );
}
