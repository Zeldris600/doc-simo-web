"use client";

import * as React from "react";
import { 
  Package, 
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Search,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyOrders } from "@/hooks/use-order";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function OrdersPage() {
  const t = useTranslations("account.orders");
  const navT = useTranslations("navigation");
  const { data: ordersResponse, isLoading } = useMyOrders();
  const orders = ordersResponse?.data || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-4">
        <Link 
          href="/account"
          className="flex items-center text-xs font-black text-black/30 hover:text-primary transition-all uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          {navT("account")}
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase">
              {t("title")}
            </h1>
            <p className="text-sm font-medium text-black/40 max-w-md">
              {t("subtitle")}
            </p>
          </div>
          <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by order ID..." 
              className="w-full bg-black/[0.02] border border-black/5 rounded-2xl h-12 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-black/[0.02] animate-pulse rounded-2xl border border-black/5" />
          ))
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="border-black/5 rounded-2xl overflow-hidden bg-white hover:border-primary/20 transition-all duration-300 group">
              <div className="p-8 flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-black/[0.02] border border-black/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500">
                    <Package className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-black/30 tracking-widest uppercase">Batch {order.id.slice(0, 8)}</span>
                      <Badge className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-wider border-none">
                        {order.status?.toLowerCase()}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-black text-black tracking-tight leading-none">
                      {order.items?.[0]?.product?.name || "Multiple Formulations"}
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><ShoppingBag className="h-3 w-3" /> {order.items?.length || 0} items</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-10 border-t lg:border-t-0 lg:border-l border-black/5 pt-6 lg:pt-0 lg:pl-10">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-black/30 font-black uppercase tracking-widest leading-none mb-1">Total Value</p>
                    <span className="text-2xl font-black text-black">
                      {Number(order.total).toLocaleString()} <span className="text-xs uppercase">XAF</span>
                    </span>
                  </div>
                  <Button asChild className="rounded-xl h-12 px-6 font-black text-[11px] uppercase tracking-widest bg-black text-white hover:bg-black/80 transition-all active:scale-95 shadow-xl shadow-black/10">
                    <Link href={`/orders/${order.id}`}>
                      Trace Log <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 border-black/5 p-20 flex flex-col items-center justify-center text-center space-y-8 rounded-3xl bg-black/[0.01]">
            <div className="h-24 w-24 rounded-full bg-black/[0.02] flex items-center justify-center">
              <Package className="h-12 w-12 text-black/10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-black/20 uppercase tracking-tighter">{t("empty")}</h3>
              <p className="text-sm font-medium text-black/20 max-w-xs">{t("subtitle")}</p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20">
              <Link href="/products">{t("shopNow")}</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
