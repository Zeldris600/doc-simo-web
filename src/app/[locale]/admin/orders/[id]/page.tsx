"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  useOrder,
  useUpdateOrderStatus,
  useAssignOrder,
  useSubmitShippingProof,
} from "@/hooks/use-order";
import { useUsers } from "@/hooks/use-user";
import { useUploadMedia } from "@/hooks/use-media";
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
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Package, Phone, Truck, ExternalLink } from "@/lib/icons";
import { toast } from "sonner";
import { useCan } from "@/hooks/use-can";
import Image from "next/image";
import { UserRole } from "@/lib/rbac/types";

const statusColorMap: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PAID: "bg-amber-100 text-amber-900",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-slate-100 text-slate-700",
};

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export default function AdminOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const { data: order, isLoading } = useOrder(id);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus();
  const { mutate: assignOrder, isPending: isAssigning } = useAssignOrder();
  const { mutate: submitProof, isPending: isSubmittingProof } = useSubmitShippingProof();
  const uploadMedia = useUploadMedia();
  const { can, role, user } = useCan();
  const proofInputRef = React.useRef<HTMLInputElement>(null);

  const { data: deliveryUsersRes } = useUsers({
    role: UserRole.DELIVERY,
    limit: 100,
  });
  const { data: adminUsersRes } = useUsers({
    role: UserRole.ADMIN,
    limit: 100,
  });

  const assigneeOptions = React.useMemo(() => {
    const rows = [
      ...(deliveryUsersRes?.data || []),
      ...(adminUsersRes?.data || []),
    ];
    const byId = new Map(rows.map((u) => [u.id, u]));
    return Array.from(byId.values());
  }, [deliveryUsersRes?.data, adminUsersRes?.data]);

  const [assigneeId, setAssigneeId] = React.useState<string>("");

  const handleStatusChange = (status: string) => {
    updateStatus(
      { id, data: { status: status as OrderStatus } },
      {
        onSuccess: () => toast.success(`Order status updated to ${status}`),
        onError: () => toast.error("Failed to update order status"),
      }
    );
  };

  const handleAssign = () => {
    if (!assigneeId) {
      toast.error("Choose a delivery assignee.");
      return;
    }
    assignOrder(
      { id, data: { assigneeUserId: assigneeId } },
      {
        onSuccess: () => {
          toast.success("Delivery assignee updated.");
          setAssigneeId("");
        },
        onError: () => toast.error("Failed to assign order."),
      },
    );
  };

  const handleProofFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    uploadMedia.mutate(
      { file },
      {
        onSuccess: (res) => {
          if (!res.url?.startsWith("https://")) {
            toast.error("Upload must return an HTTPS URL for shipping proof.");
            return;
          }
          submitProof(
            { id, data: { proofUrl: res.url } },
            {
              onSuccess: () => toast.success("Shipping proof submitted. Order marked shipped."),
              onError: () => toast.error("Failed to submit shipping proof."),
            },
          );
        },
        onError: () => toast.error("Receipt upload failed."),
      },
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

  const isSalesOrAdmin =
    role === UserRole.SALES || role === UserRole.ADMIN || role === "SALES" || role === "ADMIN";

  const canAssignDelivery =
    can("orders:update_status") && isSalesOrAdmin && order.status === "PROCESSING";

  const canSubmitShippingProof =
    order.status === "PROCESSING" &&
    can("orders:update_status") &&
    can("documents:write") &&
    (role === UserRole.ADMIN ||
      role === "ADMIN" ||
      (String(role).toUpperCase() === "DELIVERY" &&
        order.assignedToUserId &&
        user?.id &&
        order.assignedToUserId === user.id));

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

        <div className="flex flex-wrap items-center gap-3">
          {can("orders:update_status") && order.status === "PAID" && isSalesOrAdmin && (
            <Button
              type="button"
              size="sm"
              className="rounded-lg text-[10px] font-black uppercase tracking-widest"
              disabled={isUpdatingStatus}
              onClick={() =>
                updateStatus(
                  { id, data: { status: "PROCESSING" } },
                  {
                    onSuccess: () => toast.success("Order moved to processing."),
                    onError: () => toast.error("Could not move to processing."),
                  },
                )
              }
            >
              Start fulfillment
            </Button>
          )}
          {can("orders:update_status") && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Status
              </span>
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className="w-[200px] h-9 bg-white border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100">
                  {ALL_STATUSES.map((s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="text-[10px] font-bold uppercase tracking-widest"
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </div>
          )}
        </div>
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
              <CardTitle className="text-xs font-black uppercase tracking-widest text-black/60">
                Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-400 font-medium">Assignee</span>
                <span className="font-mono text-xs font-bold text-right break-all max-w-[60%]">
                  {order.assignedToUserId || "—"}
                </span>
              </div>
              {order.shippingProofUrl && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">
                    Shipping receipt
                  </p>
                  <a
                    href={order.shippingProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View proof
                  </a>
                </div>
              )}

              {canAssignDelivery && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                    Assign delivery
                  </Label>
                  <Select
                    value={assigneeId || undefined}
                    onValueChange={setAssigneeId}
                  >
                    <SelectTrigger className="h-9 rounded-lg text-xs font-semibold">
                      <SelectValue placeholder="Select user (delivery or admin)" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {assigneeOptions.map((u) => (
                        <SelectItem key={u.id} value={u.id} className="text-xs">
                          {(u.name || u.email || u.id).slice(0, 40)}
                          {u.role ? ` · ${u.role}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    className="w-full rounded-lg"
                    disabled={isAssigning || !assigneeId}
                    onClick={handleAssign}
                  >
                    {isAssigning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Assigning…
                      </>
                    ) : (
                      "Assign"
                    )}
                  </Button>
                </div>
              )}

              {canSubmitShippingProof && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                    Upload shipping proof
                  </Label>
                  <p className="text-xs text-gray-500">
                    Upload a receipt image; we send the HTTPS URL to the server as proof.
                  </p>
                  <input
                    ref={proofInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProofFile}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-lg"
                    disabled={uploadMedia.isPending || isSubmittingProof}
                    onClick={() => proofInputRef.current?.click()}
                  >
                    {uploadMedia.isPending || isSubmittingProof ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading…
                      </>
                    ) : (
                      "Choose receipt image"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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