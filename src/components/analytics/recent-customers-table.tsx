"use client";

import { useCustomers } from "@/hooks/use-customers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "@/lib/icons";
import { Link } from "@/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerProfile } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function customerFullName(c: CustomerProfile): string {
  return (
    c.user?.name ||
    [c.firstName, c.lastName].filter(Boolean).join(" ") ||
    "Unnamed"
  );
}

const columns: ColumnDef<CustomerProfile>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => {
      const c = row.original;
      const image =
        (c.user as { image?: string | null } | undefined)?.image ?? null;
      const initials =
        customerFullName(c)
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "?";
      return (
        <Avatar className="h-9 w-9 rounded-lg border border-primary/10">
          {image ? <AvatarImage src={image} alt="" /> : null}
          <AvatarFallback className="bg-primary/5 text-primary text-xs">
            {initials}
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
      <span className="font-medium text-sm">{customerFullName(row.original)}</span>
    ),
  },
  {
    id: "email",
    accessorFn: (row) => row.user?.email || row.email || "",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground truncate max-w-[180px] block">
        {row.original.user?.email || row.original.email || "—"}
      </span>
    ),
  },
  {
    id: "phone",
    accessorFn: (row) => row.phoneNumber || row.user?.phoneNumber || "",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.phoneNumber || row.original.user?.phoneNumber || "—"}
      </span>
    ),
  },
  {
    id: "location",
    accessorFn: (row) => [row.city, row.region].filter(Boolean).join(", "),
    header: "Location",
    cell: ({ row }) => {
      const location = [row.original.city, row.original.region]
        .filter(Boolean)
        .join(", ");
      return (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-gray-300 shrink-0" />
          <span className="text-sm text-gray-600">{location || "—"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {new Date(row.original.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
];

const DASHBOARD_TABLE_LIMIT = 100;

export function RecentCustomersTable() {
  const { data: response, isLoading } = useCustomers({
    limit: DASHBOARD_TABLE_LIMIT,
  });
  const customers = response?.data?.data ?? [];

  if (isLoading) {
    return (
      <Card className="border border-black/8 bg-white rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-black/6">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-black/8 bg-white rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-black/6 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-black">
            New Customers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recently registered accounts
          </p>
        </div>
        <Link
          href="/admin/customers"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <DataTable
          columns={columns}
          data={customers}
          isLoading={isLoading}
          initialPageSize={DASHBOARD_TABLE_LIMIT}
          showToolbar={false}
          enableRowSelection={false}
          embedded
        />
      </CardContent>
    </Card>
  );
}
