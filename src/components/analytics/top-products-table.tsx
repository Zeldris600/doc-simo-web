"use client";

import { useTopProducts } from "@/hooks/use-analytics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Package, TrendingUp } from "@/lib/icons";
import { TopProduct } from "@/types/api";
import { Link } from "@/i18n/routing";
import { Skeleton } from "@/components/ui/skeleton";

const DASHBOARD_TABLE_LIMIT = 100;

const columns: ColumnDef<TopProduct>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
            <Package className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <Link
              href={`/admin/products/${p.productId}`}
              className="font-medium text-black text-[10px] hover:text-primary hover:underline truncate block max-w-[min(100%,420px)]"
            >
              {p.productName}
            </Link>
            {p.productSlug ? (
              <span className="text-[9px] text-gray-400 truncate block max-w-[min(100%,420px)]">
                {p.productSlug}
              </span>
            ) : null}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "quantitySold",
    header: "Sold",
    cell: ({ row }) => (
      <span className="text-[10px] font-medium text-gray-700 tabular-nums">
        {row.original.quantitySold}
      </span>
    ),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => (
      <span className="font-medium text-black text-[10px] whitespace-nowrap tabular-nums">
        XAF {parseFloat(String(row.original.revenue)).toLocaleString()}
      </span>
    ),
  },
];

export function TopProductsTable() {
  const { data: topProductsResp, isLoading } = useTopProducts({
    limit: DASHBOARD_TABLE_LIMIT,
  });
  const topProducts = topProductsResp?.data ?? [];

  if (isLoading) {
    return (
      <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardHeader className="py-4 border-b border-gray-50">
          <Skeleton className="h-4 w-24" />
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
    <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      <CardHeader className="py-4 border-b border-gray-50 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xs font-medium text-black">
            Best Sellers
          </CardTitle>
          <p className="text-[9px] font-medium text-gray-400">
            High volume movers
          </p>
        </div>
        <TrendingUp className="h-3.5 w-3.5 text-[#166534] opacity-20" />
      </CardHeader>
      <CardContent className="p-6">
        {topProducts.length > 0 ? (
          <DataTable
            columns={columns}
            data={topProducts}
            isLoading={false}
            initialPageSize={DASHBOARD_TABLE_LIMIT}
          />
        ) : (
          <div className="py-12 text-center bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
            <Package className="h-5 w-5 text-gray-200 mx-auto mb-2" />
            <p className="text-[10px] font-medium text-gray-400">
              No sales data found
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
