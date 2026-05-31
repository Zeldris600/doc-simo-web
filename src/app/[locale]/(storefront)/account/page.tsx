"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useMe } from "@/hooks/use-user";
import { useMyOrders } from "@/hooks/use-order";
import { useFavouriteProducts } from "@/hooks/use-favourites";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  User,
  ShoppingBag,
  Heart,
  RotateCcw,
  ExternalLink,
  Package,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Settings,
} from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { Order, Product } from "@/types/api";
import { cn } from "@/lib/utils";

const accountCardClass =
  "border border-black/8 bg-white rounded-xl shadow-none overflow-hidden";

function formatMoney(n: number, currency = "XAF") {
  return `XAF ${n.toLocaleString()}`;
}

export default function AccountDashboardPage() {
  const tHub = useTranslations("account.hub");
  const { data: user, isLoading: isLoadingUser } = useMe();
  const { data: ordersPage, isLoading: loadingOrders } = useMyOrders();
  const { favourites, isLoading: loadingFavourites } = useFavouriteProducts();
  const { addItem } = useCart();

  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const handleReorder = (order: Order) => {
    setReorderingId(order.id);
    try {
      for (const item of order.items || []) {
        if (item.product) {
          addItem(item.product as Product, item.quantity);
        }
      }
      toast.success("Items added to cart");
    } catch {
      toast.error("Failed to reorder");
    } finally {
      setTimeout(() => setReorderingId(null), 800);
    }
  };

  if (isLoadingUser || loadingOrders || loadingFavourites) {
    return (
      <div className="min-h-screen bg-[#EEF2EE]">
        <div className="container mx-auto max-w-6xl px-4 pt-32 pb-16">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  const orders: Order[] = ordersPage?.data ?? [];
  const totalSpent = orders.reduce((sum: number, o: Order) => sum + Number(o.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#EEF2EE]">
      <div className="container mx-auto max-w-6xl px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{tHub("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{tHub("subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-lg h-10 text-sm font-medium">
              <Link href="/account/settings">
                <Settings className="h-4 w-4 mr-2" />
                {tHub("openSettings")}
              </Link>
            </Button>
            <Link href="/products">
              <Button className="font-semibold rounded-lg h-10 px-5 text-sm">
                {tHub("browseProducts")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Stats — same pattern as admin stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {[
            {
              title: "Total Orders",
              value: orders.length.toString(),
              description: "Placed to date",
              icon: ShoppingBag,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "Total Spent",
              value: formatMoney(totalSpent),
              description: "Lifetime value",
              icon: ArrowUpRight,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              title: "Saved Items",
              value: favourites.length.toString(),
              description: "In your wishlist",
              icon: Heart,
              color: "text-rose-600",
              bg: "bg-rose-50",
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className={cn(accountCardClass, "group transition-colors hover:border-primary/20")}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-6 pt-5">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:scale-110 duration-300`}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  {stat.description}
                  <ArrowUpRight className="h-2 w-2 text-emerald-500" />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs — clean, left-aligned, understated */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-white border border-black/8 rounded-xl h-11 p-1 shadow-none w-auto mb-6">
            <TabsTrigger
              value="orders"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none font-medium text-sm gap-1.5 px-4 transition-all"
            >
              <ShoppingBag className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger
              value="favourites"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none font-medium text-sm gap-1.5 px-4 transition-all"
            >
              <Heart className="h-4 w-4" /> Favourites
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none font-medium text-sm gap-1.5 px-4 transition-all"
            >
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none font-medium text-sm gap-1.5 px-4 transition-all"
            >
              <Bell className="h-4 w-4" /> Alerts
            </TabsTrigger>
          </TabsList>

          {/* ─── Orders ─── */}
          <TabsContent value="orders">
            <Card className={accountCardClass}>
              <CardHeader className="py-4 px-6 border-b border-black/6 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold text-foreground">
                    Order History
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your recent purchases and their status
                  </p>
                </div>
                <span
                  className="text-[10px] font-medium text-primary"
                >
                  All orders shown below
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {orders.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <Package className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                      No orders yet
                    </p>
                    <p className="text-[10px] font-medium text-gray-300 mt-1">
                      Your order history will appear here
                    </p>
                    <Button asChild className="mt-4 rounded-xl font-medium h-9 px-4 text-xs">
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-3 text-[11px] font-semibold text-black">
                            Product
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black">
                            Status
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 10).map((order: Order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-black text-xs truncate max-w-[200px]">
                                    {order.items?.[0]?.product?.name ||
                                      "Order #" +
                                        (order.orderNumber?.slice(-8) ||
                                          order.id.slice(0, 8))}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {new Date(order.createdAt).toLocaleDateString(
                                      undefined,
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={cn(
                                  "border-none font-medium text-[9px] px-2 py-0 h-5 rounded-full text-white",
                                  order.status === "DELIVERED"
                                    ? "bg-[#166534]"
                                    : order.status === "PENDING"
                                    ? "bg-[#D97706]"
                                    : order.status === "SHIPPED"
                                    ? "bg-[#EA580C]"
                                    : order.status === "PROCESSING"
                                    ? "bg-blue-600"
                                    : "bg-gray-400"
                                )}
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-medium text-black text-xs">
                                {formatMoney(Number(order.amount))}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {order.status === "PENDING" ? (
                                  <Button
                                    asChild
                                    size="sm"
                                    className="h-7 px-3 text-[10px] font-medium rounded-lg"
                                  >
                                    <Link href={`/checkout/${order.id}`}>
                                      Complete Payment
                                    </Link>
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-[10px] font-medium text-gray-500 hover:text-primary rounded-lg"
                                      onClick={() => handleReorder(order)}
                                      disabled={reorderingId === order.id}
                                    >
                                      {reorderingId === order.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <RotateCcw className="h-3 w-3" />
                                      )}
                                      <span className="ml-1">Reorder</span>
                                    </Button>
                                    <Link
                                      href={`/checkout/${order.id}`}
                                      className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition-colors"
                                    >
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Favourites ─── */}
          <TabsContent value="favourites">
            <Card className={accountCardClass}>
              <CardHeader className="py-4 px-6 border-b border-black/6 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold text-foreground">
                    Saved Items
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Products you&apos;ve added to your wishlist
                  </p>
                </div>
                <Link
                  href="/products"
                  className="text-[10px] font-medium text-primary hover:underline"
                >
                  Browse Products
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {favourites.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                      <Heart className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                      No saved items
                    </p>
                    <p className="text-[10px] font-medium text-gray-300 mt-1">
                      Tap the heart icon on products to save them here
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-3 text-[11px] font-semibold text-black">
                            Product
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Price
                          </th>
                          <th className="px-6 py-3 text-[11px] font-semibold text-black text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {favourites.map((product: Product) => (
                          <tr
                            key={product.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                  <Image
                                    src={
                                      product.images?.[0] ||
                                      product.image ||
                                      "/placeholder.png"
                                    }
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-black text-xs truncate max-w-[220px]">
                                    {product.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400">
                                    {product.category?.name || "Product"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-medium text-black text-xs">
                                {formatMoney(Number(product.price))}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Link
                                href={`/products/${product.id}`}
                                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-primary transition-colors inline-flex"
                              >
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Profile ─── */}
          <TabsContent value="profile">
            <Card className={accountCardClass}>
              <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold shrink-0">
                  {user?.name?.slice(0, 2).toUpperCase() || "?"}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{tHub("profileCtaTitle")}</h3>
                  <p className="text-sm text-muted-foreground max-w-lg">
                    {tHub("profileCtaBody")}
                  </p>
                  {user?.email && (
                    <p className="text-sm text-foreground/80">{user.email}</p>
                  )}
                </div>
                <Button asChild className="rounded-lg h-11 shrink-0 font-semibold">
                  <Link href="/account/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    {tHub("openSettings")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Alerts ─── */}
          <TabsContent value="alerts">
            <Card className={accountCardClass}>
              <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Bell className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{tHub("profileCtaTitle")}</h3>
                  <p className="text-sm text-muted-foreground max-w-lg">
                    {tHub("alertsCtaBody")}
                  </p>
                </div>
                <Button asChild variant="outline" className="rounded-lg h-11 shrink-0 font-semibold">
                  <Link href="/account/settings#notifications">
                    {tHub("openSettings")}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
