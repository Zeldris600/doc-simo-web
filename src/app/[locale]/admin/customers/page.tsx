"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin, Phone } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardHeader from "@/components/dashboard-header";
import { useState } from "react";
import { useListCustomers } from "@/hooks/use-customer";
import { CustomerProfile } from "@/types/api";

const columns: ColumnDef<CustomerProfile>[] = [
  {
    accessorKey: "firstName",
    header: "Customer",
    cell: ({ row }) => {
      const c = row.original;
      const fullName =
        c.user?.name ||
        [c.firstName, c.lastName].filter(Boolean).join(" ") ||
        "Unnamed";
      const initials = fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "NA";
      const email = c.user?.email || c.email;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-gray-100 shadow-none rounded">
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium rounded">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-black">{fullName}</span>
            <span className="text-xs text-muted-foreground">
              {email || "No email"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Phone className="w-3.5 h-3.5 text-black/40" />
        <span className="text-sm font-medium">
          {row.original.phoneNumber || row.original.user?.phoneNumber || "N/A"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => {
      const city = row.original.city;
      const region = row.original.region;
      const location = [city, region].filter(Boolean).join(", ");
      return (
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-black/40" />
          <span className="text-sm font-medium">{location || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "otpChannelPreference",
    header: "OTP Channel",
    cell: ({ row }) => (
      <span className="text-xs font-medium uppercase bg-black/[0.03] px-2.5 py-1 rounded-lg">
        {row.original.otpChannelPreference || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-sm text-black/40 font-medium">
        {new Date(row.original.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: () => (
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
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem className="text-sm font-medium">
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm font-medium">
            Message customer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function AdminCustomersPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: customersResponse, isLoading } = useListCustomers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  // API shape: StandardResponse<PaginatedResponse<CustomerProfile>>
  // service returns response.data → { status, data: { data: [...], total, take, skip } }
  const customers = customersResponse?.data?.data || [];
  const total = customersResponse?.data?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Customer Management"
        description="Track and manage your community of wellness seekers."
      />

      <DataTable
        columns={columns}
        data={customers}
        searchKey="firstName"
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
