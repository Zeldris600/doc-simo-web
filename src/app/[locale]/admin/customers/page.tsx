"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { MapPin, Phone, Mail } from "@/lib/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardHeader from "@/components/dashboard-header";
import { useState } from "react";
import { useListCustomers } from "@/hooks/use-customer";
import { CustomerProfile } from "@/types/api";
import { CustomerRowActions } from "@/components/admin/customer-row-actions";
import {
  customerEmail,
  customerFullName,
  customerImage,
  customerInitials,
  customerPhone,
} from "@/lib/customer-display";

const columns: ColumnDef<CustomerProfile>[] = [
  {
    id: "avatar",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      const c = row.original;
      const image = customerImage(c);
      return (
        <Avatar className="h-10 w-10 border border-gray-100 rounded-lg">
          {image ? <AvatarImage src={image} alt={customerFullName(c)} /> : null}
          <AvatarFallback className="bg-primary/5 text-primary text-sm font-medium rounded-lg">
            {customerInitials(c)}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "name",
    accessorFn: (row) => customerFullName(row),
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {customerFullName(row.original)}
      </span>
    ),
  },
  {
    id: "email",
    accessorFn: (row) => customerEmail(row) ?? "",
    header: "Email",
    cell: ({ row }) => {
      const email = customerEmail(row.original);
      return (
        <div className="flex items-center gap-2 max-w-[220px]">
          <Mail className="h-4 w-4 shrink-0 text-black/35" />
          <span className="text-sm truncate" title={email ?? undefined}>
            {email ?? "—"}
          </span>
        </div>
      );
    },
  },
  {
    id: "phone",
    accessorFn: (row) => customerPhone(row) ?? "",
    header: "Phone",
    cell: ({ row }) => {
      const phone = customerPhone(row.original);
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-black/35" />
          <span className="font-medium whitespace-nowrap">
            {phone ?? "—"}
          </span>
        </div>
      );
    },
  },
  {
    id: "location",
    accessorFn: (row) =>
      [row.city, row.region].filter(Boolean).join(", "),
    header: "Location",
    cell: ({ row }) => {
      const location = [row.original.city, row.original.region]
        .filter(Boolean)
        .join(", ");
      return (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-black/35" />
          <span>{location || "—"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "otpChannelPreference",
    header: "OTP Channel",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      return row.getValue(columnId) === filterValue;
    },
    cell: ({ row }) => (
      <span className="text-xs font-medium uppercase bg-muted px-2.5 py-1 rounded-md">
        {row.original.otpChannelPreference || "—"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
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
    enableHiding: false,
    cell: ({ row }) => <CustomerRowActions customer={row.original} />,
  },
];

export default function AdminCustomersPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data: customersResponse, isLoading } = useListCustomers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const customers = customersResponse?.data?.data || [];
  const total = customersResponse?.data?.total || 0;
  const pageCount = Math.ceil(total / pagination.pageSize) || 1;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Customer Management"
        description="Track and manage your community of wellness seekers."
      />

      <div className="rounded-xl border border-black/8 bg-white shadow-sm overflow-hidden p-4 sm:p-6">
        <DataTable
          columns={columns}
          data={customers}
          searchKeys={[
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "user.name",
            "user.email",
            "user.phoneNumber",
            "city",
            "region",
          ]}
          searchPlaceholder="Search customers…"
          filters={[
            {
              columnId: "otpChannelPreference",
              label: "OTP channel",
              options: [
                { label: "All channels", value: "all" },
                { label: "WhatsApp", value: "whatsapp" },
                { label: "SMS", value: "sms" },
              ],
            },
          ]}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
