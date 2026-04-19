"use client";

import { useCustomers } from "@/hooks/use-customers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { User, MapPin } from "@/lib/icons";
import { Link } from "@/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";
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
      const email = c.user?.email || c.email;
      return (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
            <User className="h-3 w-3 text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-black text-[10px] truncate max-w-[min(100%,280px)]">
              {fullName}
            </span>
            <span className="text-[9px] text-gray-400 truncate max-w-[min(100%,280px)]">
              {email || "No email"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => {
      const c = row.original;
      const location = [c.city, c.region].filter(Boolean).join(", ");
      return (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-gray-300 shrink-0" />
          <span className="text-[10px] font-medium text-gray-600">{location || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-[9px] font-medium text-gray-400 whitespace-nowrap">
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
      <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-gray-50">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-black">New Customers</CardTitle>
          <p className="text-[10px] font-medium text-gray-400">Recently registered accounts</p>
        </div>
        <Link href="/admin/customers" className="text-[10px] font-medium text-primary hover:underline">View All</Link>
      </CardHeader>
      <CardContent className="p-6">
        <DataTable
          columns={columns}
          data={customers}
          isLoading={isLoading}
          initialPageSize={DASHBOARD_TABLE_LIMIT}
        />
      </CardContent>
    </Card>
  );
}
