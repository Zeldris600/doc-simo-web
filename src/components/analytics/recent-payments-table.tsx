"use client";

import { usePayments } from "@/hooks/use-payment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CreditCard, ArrowRight, AlertCircle } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { Payment } from "@/types/api";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Transaction",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
          <CreditCard className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm text-black font-mono">
            #{row.original.id.substring(0, 8)}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={`border-none font-medium text-xs px-2.5 py-0.5 h-6 rounded-full text-white capitalize ${
            status === "success"
              ? "bg-[#166534]"
              : status === "failed"
                ? "bg-red-500"
                : "bg-amber-500"
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
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <span className="font-semibold text-sm text-black whitespace-nowrap tabular-nums">
          {row.original.currency} {Number(row.original.amount).toLocaleString()}
        </span>
        <div className="p-1.5 rounded-lg text-gray-300">
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    ),
  },
];

const DASHBOARD_TABLE_LIMIT = 100;

export function RecentPaymentsTable() {
  const { data: response, isLoading } = usePayments({
    limit: DASHBOARD_TABLE_LIMIT,
  });
  const payments = response?.data?.data || [];

  return (
    <Card className="border border-black/8 bg-white rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-black">Recent Payments</CardTitle>
          <p className="text-xs font-medium text-gray-500">Incoming clinical transaction log</p>
        </div>
        <Link href="/admin/analytics" className="text-sm font-medium text-primary hover:underline">View All</Link>
      </CardHeader>
      <CardContent className="p-6">
        {payments.length > 0 ? (
          <DataTable
            columns={columns}
            data={payments}
            isLoading={isLoading}
            initialPageSize={DASHBOARD_TABLE_LIMIT}
            showToolbar={false}
            enableRowSelection={false}
            embedded
          />
        ) : (
          <div className="py-12 text-center">
            <AlertCircle className="h-6 w-6 text-gray-200 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-400">No payment records found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
