"use client";

import DashboardHeader from "@/components/dashboard-header";
import { useAnalyticsOverview } from "@/hooks/use-analytics";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CreditCard,
  TrendingUp,
  Truck,
  ArrowRight
} from "@/lib/icons";
import { RevenueChart } from "@/components/analytics/revenue-chart";
import { OrdersChart } from "@/components/analytics/orders-chart";
import { DeliveriesChart } from "@/components/analytics/deliveries-chart";
import { TopProductsTable } from "@/components/analytics/top-products-table";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  const { data: overviewResp, isLoading } = useAnalyticsOverview();

  if (isLoading) {
    return <PageSkeleton />;
  }

  const overview = overviewResp?.data;

  const deliveryStats = [
    { label: "Processing", count: overview?.ordersByStatus?.PROCESSING ?? 0, color: "bg-blue-500" },
    { label: "Shipped", count: overview?.ordersByStatus?.SHIPPED ?? 0, color: "bg-orange-500" },
    { label: "Delivered", count: overview?.ordersByStatus?.DELIVERED ?? 0, color: "bg-emerald-600" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <DashboardHeader
        title="Business Intelligence"
        description="Comprehensive analysis of your clinical herbal metrics."
        action={<Button variant="outline" size="sm" className="font-medium rounded-xl border-gray-100">Export PDF Report</Button>}
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main Analytics Engine */}
        <div className="lg:col-span-2 space-y-6">
           <RevenueChart />
           <OrdersChart />
           <DeliveriesChart />

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Payment Liquidity</h4>
                    <CreditCard className="h-4 w-4 text-gray-200" />
                 </div>
                 <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-emerald-50/50">
                       <p className="text-[10px] font-medium text-emerald-600 mb-1">Success</p>
                       <p className="text-lg font-medium text-black">{overview?.paymentsByStatus?.success ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/50">
                       <p className="text-[10px] font-medium text-amber-600 mb-1">Pending</p>
                       <p className="text-lg font-medium text-black">{overview?.paymentsByStatus?.pending ?? 0}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50/50">
                       <p className="text-[10px] font-medium text-red-600 mb-1">Failed</p>
                       <p className="text-lg font-medium text-black">{overview?.paymentsByStatus?.failed ?? 0}</p>
                    </div>
                 </div>
              </Card>

              <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Movement Grid</h4>
                    <Truck className="h-4 w-4 text-gray-200" />
                 </div>
                 <div className="space-y-4">
                    {deliveryStats.map(stat => (
                       <div key={stat.label} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-medium">
                             <span className="text-gray-500">{stat.label}</span>
                             <span className="text-black">{stat.count}</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                             <div 
                                className={`h-full ${stat.color} transition-all duration-1000`} 
                                style={{ width: `${overview?.totalOrders ? (stat.count / overview.totalOrders) * 100 : 0}%` }} 
                             />
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
           <TopProductsTable />
           
           <Card className="border-none bg-[#166534] text-white rounded-xl p-6 shadow-xl shadow-[#166534]/10 relative overflow-hidden group">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-medium opacity-60">Success Insight</h4>
                 <p className="text-sm font-medium mt-2 leading-relaxed">
                    Growth is up 18.4% compared to the same period last year. Focus on replenishing high-movers.
                 </p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                 <TrendingUp className="h-32 w-32" />
              </div>
           </Card>

           <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6">
              <h4 className="text-xs font-medium text-gray-400 mb-4">Orders Summary</h4>
              <div className="space-y-3">
                 {Object.entries(overview?.ordersByStatus ?? {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between group">
                       <span className="text-[10px] font-medium text-gray-400 group-hover:text-black transition-colors">{status}</span>
                       <span className="text-[10px] font-medium text-black">{count}</span>
                    </div>
                 ))}
                 <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-black">Aggregate Volume</span>
                    <span className="text-lg font-medium text-primary">{overview?.totalOrders ?? 0}</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
