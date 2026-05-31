"use client";

import DashboardHeader from "@/components/dashboard-header";
import { useAnalyticsOverview } from "@/hooks/use-analytics";
import { useCustomers } from "@/hooks/use-customers";
import { useOrders } from "@/hooks/use-orders";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Bell,
} from "@/lib/icons";
import { RecentOrdersTable } from "@/components/analytics/recent-orders-table";
import { RecentCustomersTable } from "@/components/analytics/recent-customers-table";
import { RecentPaymentsTable } from "@/components/analytics/recent-payments-table";
import { TopProductsTable } from "@/components/analytics/top-products-table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useCan } from "@/hooks/use-can";
import { Can } from "@/components/rbac/can";

export default function AdminDashboard() {
  const { can, isLoading: isLoadingCan } = useCan();
  const canAnalytics = can("analytics:read");
  const canCustomers = can("customers:read");
  const canOrders = can("orders:read");
  const canPayments = can("payments:read");

  const { data: overviewResp, isLoading: isLoadingAnalytics } =
    useAnalyticsOverview(undefined, { enabled: canAnalytics });
  const { data: customersResp, isLoading: isLoadingCustomers } = useCustomers(
    { limit: 1 },
    { enabled: canCustomers },
  );
  const { data: ordersResp, isLoading: isLoadingOrders } = useOrders(
    { limit: 100 },
    { enabled: canOrders && !canAnalytics },
  );

  const isLoading =
    isLoadingCan ||
    (canAnalytics && isLoadingAnalytics) ||
    (canCustomers && isLoadingCustomers) ||
    (canOrders && !canAnalytics && isLoadingOrders);

  if (isLoading) {
    return <PageSkeleton />;
  }

  const overview = overviewResp?.data;
  const totalCustomers = customersResp?.data?.total || 0;
  const orders = ordersResp?.data ?? [];

  const activeOrdersFromOverview =
    (overview?.ordersByStatus?.PENDING ?? 0) +
    (overview?.ordersByStatus?.PROCESSING ?? 0);

  const activeOrdersFromList = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PROCESSING",
  ).length;

  const activeOrders = canAnalytics
    ? activeOrdersFromOverview
    : activeOrdersFromList;

  const totalPayments =
    (overview?.paymentsByStatus?.success ?? 0) +
    (overview?.paymentsByStatus?.pending ?? 0) +
    (overview?.paymentsByStatus?.failed ?? 0);
  const successRate =
    totalPayments > 0
      ? Math.round(
          ((overview?.paymentsByStatus?.success ?? 0) / totalPayments) * 100,
        )
      : 0;

  const stats: {
    title: string;
    value: string;
    description: string;
    icon: typeof CreditCard;
    color: string;
    bg: string;
    href: string;
  }[] = [];

  if (canAnalytics) {
    stats.push(
      {
        title: "Total Revenue",
        value: `XAF ${(overview?.totalRevenue ?? 0).toLocaleString()}`,
        description: "Direct sales volume",
        icon: CreditCard,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        href: "/admin/analytics",
      },
      {
        title: "System Health",
        value: `${successRate}%`,
        description: "Payment success rate",
        icon: CheckCircle2,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        href: "/admin/analytics",
      },
    );
  }

  if (canCustomers) {
    stats.push({
      title: "Registered Users",
      value: totalCustomers.toLocaleString(),
      description: "Customer accounts",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/customers",
    });
  }

  if (canOrders) {
    stats.push({
      title: "Active Orders",
      value: String(activeOrders),
      description: "Awaiting fulfillment",
      icon: ShoppingBag,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/orders",
    });
  }

  return (
    <div className="space-y-6 pb-12 overflow-x-hidden">
      <DashboardHeader
        title="Admin Command Center"
        description="Unified hub for clinical herbal extraction operations."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-gray-400"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Can perform="analytics:read">
              <Link href="/admin/analytics">
                <Button className="font-medium rounded-xl h-9 px-4 text-xs">
                  Analyze Performance
                </Button>
              </Link>
            </Can>
          </div>
        }
      />

      {stats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href}>
              <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden group hover:shadow-md transition-all duration-300 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-semibold text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-medium text-black">
                    {stat.value}
                  </div>
                  <p className="text-[10px] font-medium text-gray-400 mt-1 flex items-center gap-1">
                    {stat.description}
                    <ArrowUpRight className="h-2 w-2 text-emerald-500" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="space-y-6">
        <Can perform="orders:read">
          <RecentOrdersTable />
        </Can>
        <Can perform="analytics:read">
          <TopProductsTable />
        </Can>
        <Can perform="payments:read">
          <RecentPaymentsTable />
        </Can>
        <Can perform="customers:read">
          <RecentCustomersTable />
        </Can>

        <Can perform="analytics:read">
          <Link href="/admin/analytics">
            <Card className="border-none bg-[#166534] text-white rounded-xl p-6 shadow-xl shadow-[#166534]/10 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-sm font-semibold opacity-80">
                  Full Performance Analytics
                </h4>
                <p className="text-base font-medium mt-2 leading-relaxed">
                  View deep-dive metrics on revenue streams, delivery logistics,
                  and product movers.
                </p>
                <ArrowUpRight className="h-5 w-5 mt-4 text-white p-1 rounded-full bg-white/20" />
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="h-32 w-32" />
              </div>
            </Card>
          </Link>
        </Can>
      </div>
    </div>
  );
}
