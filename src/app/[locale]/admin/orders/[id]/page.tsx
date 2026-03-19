"use client";

import { useParams } from "next/navigation";
import { useOrder, useUpdateOrderStatus } from "@/hooks/use-order";
import { OrderStatus } from "@/types/api";
import DashboardHeader from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, Package, Phone, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCan } from "@/hooks/use-can";
import Image from "next/image";

const statusColorMap: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading } = useOrder(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
  const { can } = useCan();

  const handleStatusChange = (status: string) => {
    updateStatus(
      { id, data: { status: status as OrderStatus } },
      {
        onSuccess: () => toast.success(`Order status updated to ${status}`),
        onError: () => toast.error("Failed to update order status"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs">
        Order not found.
      </div>
    );
  }

  const total = typeof order.total === "number" ? order.total : parseFloat(String(order.total));

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-8">
      <DashboardHeader
        title={`Order #${order.id.substring(0, 8)}`}
        description={`Placed on ${new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`}
      />

      {/* Status & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Current Status:</span>
          <Badge className={`rounded-lg px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-none ${statusColorMap[order.status] || "bg-gray-100 text-gray-700"}`}>
            {order.status}
          </Badge>
        </div>

        {can("orders:update_status") && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Update:</span>
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-[180px] h-9 bg-white border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100">
                {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                  <SelectItem key={s} value={s} className="text-[10px] font-bold uppercase tracking-widest">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card className="border-gray-100 shadow-none rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-2">
                <Package className="h-4 w-4" /> Order Items ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={item.product?.images?.[0] || item.product?.image || "/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-black truncate">{item.product?.name || `Product ${item.productId.substring(0, 8)}`}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Qty: {item.quantity} × {Number(item.price).toLocaleString()} XAF
                    </p>
                  </div>
                  <span className="font-black text-sm text-black">
                    {(item.quantity * Number(item.price)).toLocaleString()} XAF
                  </span>
                </div>
              ))}

              {(!order.items || order.items.length === 0) && (
                <p className="text-center text-gray-400 text-sm py-8">No items found for this order.</p>
              )}

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-black uppercase tracking-widest text-black/40">Order Total</span>
                <span className="text-lg font-black text-black">{total.toLocaleString()} XAF</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery & Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-gray-100 shadow-none rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-black/60 flex items-center gap-2">
                <Truck className="h-4 w-4" /> Delivery Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.deliveryAddress ? (
                <>
                  {order.deliveryAddress.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-black/30" />
                      <span className="text-sm font-bold">{order.deliveryAddress.phone}</span>
                    </div>
                  )}
                  {order.deliveryAddress.address && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 text-black/30 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold">{order.deliveryAddress.address}</p>
                        <p className="text-xs text-gray-400 font-medium">
                          {[order.deliveryAddress.city, order.deliveryAddress.region].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400 font-medium">No delivery address provided.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-none rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-black/60">
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Created</span>
                <span className="font-bold">{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Updated</span>
                <span className="font-bold">{new Date(order.updatedAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => window.history.back()}
          >
            ← Back to Orders
          </Button>
        </div>
      </div>
    </div>
  );
}