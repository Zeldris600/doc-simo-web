"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import DashboardHeader from "@/components/dashboard-header";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-order";
import { Order, OrderStatus } from "@/types/api";
import { toast } from "sonner";
import { useCan } from "@/hooks/use-can";

const OrderActions = ({ order }: { order: Order }) => {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const { can } = useCan();

  const handleStatusChange = (status: OrderStatus) => {
    updateStatus({ id: order.id, data: { status } }, {
      onSuccess: () => {
        toast.success(`Order status updated to ${status}`);
      },
      onError: () => {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded border-gray-100 shadow-none"
        >
          <DropdownMenuLabel className="text-xs font-bold uppercase text-gray-400">
            Order Actions
          </DropdownMenuLabel>
          <DropdownMenuItem className="text-sm font-medium flex items-center gap-2">
            <ExternalLink className="w-3 h-3" /> View details
          </DropdownMenuItem>
          
          {can("orders:update_status") && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-sm font-medium">
                  Update status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(status => (
                       <DropdownMenuItem 
                          key={status} 
                          onClick={() => handleStatusChange(status as OrderStatus)}
                          disabled={order.status === status}
                       >
                         {status}
                       </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem 
                className="text-sm font-medium text-destructive"
                onClick={() => handleStatusChange("CANCELLED")}
                disabled={order.status === "CANCELLED"}
              >
                Cancel order
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-bold text-black text-xs">#{row.getValue("id")?.toString().substring(0, 8)}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-gray-500 font-medium">
        {new Date(row.getValue("createdAt") as string).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer Phone",
    cell: ({ row }) => (
      <span className="font-medium text-gray-700">
        {row.original.deliveryAddress?.phone || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      return <span className="font-bold text-black">{amount.toLocaleString()} XAF</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={`rounded px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
            status === "DELIVERED"
              ? "bg-green-100 text-green-700"
              : status === "PROCESSING"
                ? "bg-blue-100 text-blue-700"
                : status === "SHIPPED"
                  ? "bg-purple-100 text-purple-700"
                  : status === "CANCELLED"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
];

export default function AdminOrdersPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: ordersResponse, isLoading } = useOrders({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const orders = ordersResponse?.data || [];
  const total = ordersResponse?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Sales & Orders"
        description="Monitor and fulfill your clinical herbal orders."
      />

      <DataTable 
        columns={columns} 
        data={orders as Order[]} 
        searchKey="id" 
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
