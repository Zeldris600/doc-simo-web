"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink, Truck, MapPin } from "@/lib/icons";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DashboardHeader from "@/components/dashboard-header";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-order";
import { Order, OrderStatus } from "@/types/api";
import { toast } from "sonner";
import { useCan } from "@/hooks/use-can";
import { AssignDeliveryDialog } from "@/components/analytics/assign-delivery-dialog";
import { Link } from "@/i18n/routing";

const OrderActions = ({ order }: { order: Order }) => {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const { can } = useCan();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const handleStatusChange = (status: OrderStatus) => {
    updateStatus(
      { id: order.id, data: { status } },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${status}`);
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-xl border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-2 min-w-[160px]"
        >
          <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 px-2 py-1.5">
            Order Actions
          </DropdownMenuLabel>
          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
            <Link
              href={`/admin/orders/${order.id}`}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="font-medium text-xs">View details</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-50 my-1" />

          {can("orders:update_status") && (
            <>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer flex items-center gap-2"
                onClick={() => setAssignDialogOpen(true)}
              >
                <Truck className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-xs">Assign Delivery</span>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-lg flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-medium text-xs">Update status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="rounded-xl border-gray-100 shadow-xl p-2 min-w-[140px]">
                    {[
                      "PENDING",
                      "PAID",
                      "PROCESSING",
                      "SHIPPED",
                      "DELIVERED",
                      "CANCELLED",
                      "REFUNDED",
                    ].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        className="rounded-lg text-xs font-medium cursor-pointer"
                        onClick={() =>
                          handleStatusChange(status as OrderStatus)
                        }
                        disabled={order.status === status}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-gray-50 my-1" />

              <DropdownMenuItem
                className="rounded-lg cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleStatusChange("CANCELLED")}
                disabled={order.status === "CANCELLED"}
              >
                <span className="font-medium text-xs text-destructive">
                  Cancel order
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignDeliveryDialog
        orderId={order.id}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </>
  );
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-medium text-black text-xs">
        #{row.getValue<string>("id").substring(0, 8)}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-gray-400 font-medium text-xs">
        {new Date(row.getValue("createdAt") as string).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-black text-xs">
          {row.original.user?.name || "Guest"}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          {row.original.deliveryAddress?.phone || "No phone"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "assignedToUserId",
    header: "Assignee",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.assignedToUserId ? (
          <Badge className="bg-blue-50 text-blue-600 border-none font-medium text-[9px] px-2 rounded-full">
            Assigned
          </Badge>
        ) : (
          <span className="text-[10px] text-gray-300 font-medium italic">
            Unassigned
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(String(row.getValue("amount")));
      return (
        <span className="font-medium text-black text-xs">
          XAF {amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={`rounded-full px-3 py-0.5 text-[9px] font-medium border-none text-white ${
            status === "DELIVERED"
              ? "bg-[#166534]"
              : status === "PENDING"
                ? "bg-[#D97706]"
                : status === "SHIPPED"
                  ? "bg-[#EA580C]"
                  : status === "PROCESSING"
                    ? "bg-blue-600"
                    : status === "CANCELLED"
                      ? "bg-red-600"
                      : "bg-gray-400"
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
  const { data: response, isLoading } = useOrders({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const orders = response?.data || [];
  const total = response?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Sales & Orders"
        description="Monitor and fulfill your clinical herbal orders."
      />

      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
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
    </div>
  );
}
