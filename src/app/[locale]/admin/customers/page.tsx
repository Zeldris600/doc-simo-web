"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin, Phone } from "lucide-react";
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
      const firstName = row.original.firstName || "";
      const lastName = row.original.lastName || "";
      const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Unnamed";
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "NA";
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-gray-100 shadow-none rounded">
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold rounded">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-black">{fullName}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.email || "No email"}
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
        <span className="text-sm font-medium">{row.original.phoneNumber || "N/A"}</span>
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
      <span className="text-xs font-bold uppercase tracking-wider bg-black/[0.03] px-2.5 py-1 rounded-lg">
        {row.original.otpChannelPreference || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-sm text-black/40 font-medium tracking-tight">
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
          <DropdownMenuLabel className="text-xs font-bold uppercase text-gray-400">
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

  const customers = customersResponse?.data || [];
  const total = customersResponse?.total || 0;
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
