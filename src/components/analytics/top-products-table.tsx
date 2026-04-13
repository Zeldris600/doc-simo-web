"use client";

import { useTopProducts } from "@/hooks/use-analytics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, TrendingUp, ArrowUpRight } from "@/lib/icons";

export function TopProductsTable() {
  const { data: topProductsResp, isLoading } = useTopProducts({ limit: 4 });
  const topProducts = topProductsResp?.data?.data ?? [];

  if (isLoading) {
    return (
      <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        <CardHeader className="py-4 border-b border-gray-50">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
      <CardHeader className="py-4 border-b border-gray-50 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xs font-medium text-black">Best Sellers</CardTitle>
          <p className="text-[9px] font-medium text-gray-400">High volume movers</p>
        </div>
        <TrendingUp className="h-3.5 w-3.5 text-[#166534] opacity-20" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {topProducts.length > 0 ? (
          topProducts.map((product) => (
            <div 
              key={product.productId} 
              className="group p-3 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 border border-transparent hover:border-gray-100 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                   <Package className="h-5 w-5 text-[#166534]/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-medium text-black truncate mb-1">
                    {product.productName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-[#166534]/5 text-[#166534] border-none font-medium text-[8px] h-4 px-1.5 rounded-md">
                      {product.quantitySold} sold
                    </Badge>
                    <span className="text-[9px] font-medium text-gray-400">
                      XAF {parseFloat(String(product.revenue)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                   <ArrowUpRight className="h-3 w-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-10 transition-opacity">
                 <TrendingUp className="h-12 w-12 -mr-4 -mt-4" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
            <Package className="h-5 w-5 text-gray-200 mx-auto mb-2" />
            <p className="text-[10px] font-medium text-gray-400">No sales data found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
