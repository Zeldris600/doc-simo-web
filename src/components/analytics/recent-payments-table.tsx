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
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
          <CreditCard className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-black text-[10px]">
            #{row.original.id.substring(0, 8)}
          </span>
          <span className="text-[9px] text-gray-400">
            {new Date(row.original.createdAt).toLocaleTimeString()}
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
        <Badge className={`border-none font-medium text-[9px] px-2 py-0 h-5 rounded-full text-white ${
          status === "success" ? "bg-[#166534]" :
          status === "failed" ? "bg-red-500" :
          "bg-amber-500"
        }`}>
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
        <span className="font-medium text-black text-[10px] whitespace-nowrap">
          {row.original.currency} {Number(row.original.amount).toLocaleString()}
        </span>
        <div className="p-1.5 rounded-lg text-gray-300">
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    ),
  },
];

export function RecentPaymentsTable() {
  const { data: response, isLoading } = usePayments({ limit: 5 });
  const payments = response?.data?.data || [];

  return (
    <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-gray-50 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-black">Recent Payments</CardTitle>
          <p className="text-[10px] font-medium text-gray-400">Incoming clinical transaction log</p>
        </div>
        <Link href="/admin/analytics" className="text-[10px] font-medium text-primary hover:underline">View All</Link>
      </CardHeader>
      <CardContent className="p-6">
        {payments.length > 0 ? (
          <DataTable
            columns={columns}
            data={payments}
            isLoading={isLoading}
          />
        ) : (
          <div className="py-12 text-center">
            <AlertCircle className="h-6 w-6 text-gray-200 mx-auto mb-2" />
            <p className="text-[10px] font-medium text-gray-400">No payment records found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
