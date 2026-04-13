"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  useOrder,
  useUpdateOrderStatus,
  useAssignOrder,
  useSubmitShippingProof,
} from "@/hooks/use-order";
import { useUsers } from "@/hooks/use-users";
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
import {
  Loader2,
  MapPin,
  Package,
  Phone,
  Truck,
  ExternalLink,
  User,
  ChevronLeft,
  Calendar,
  CreditCard,
  FileText,
} from "@/lib/icons";
import { toast } from "sonner";
import { useCan } from "@/hooks/use-can";
import Image from "next/image";
import { UserRole } from "@/lib/rbac/types";
import { Link, useRouter } from "@/i18n/routing";

export default function AdminOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: response, isLoading } = useOrder(id);
  const order = response;

  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();
  const { mutate: assignOrder, isPending: isAssigning } = useAssignOrder();
  const { mutate: submitProof, isPending: isSubmittingProof } =
    useSubmitShippingProof();
  const uploadMedia = useUploadMedia();
  const { can, role, user: currentUser } = useCan();
  const proofInputRef = React.useRef<HTMLInputElement>(null);

  const { data: usersResponse } = useUsers({ role: UserRole.DELIVERY });
  const deliveryUsers = usersResponse?.data || [];

  const [assigneeId, setAssigneeId] = React.useState<string>("");

  const handleStatusChange = (status: string) => {
    updateStatus(
      { id, data: { status: status as OrderStatus } },
      {
        onSuccess: () => toast.success(`Order status updated to ${status}`),
        onError: () => toast.error("Failed to update order status"),
      },
    );
  };

  const handleAssign = () => {
    if (!assigneeId) {
      toast.error("Choose a delivery professional.");
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
          submitProof(
            { id, data: { proofUrl: res.url } },
            {
              onSuccess: () =>
                toast.success(
                  "Shipping proof submitted. Order marked shipped.",
                ),
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
      <div className="p-8 text-center text-gray-400 font-medium text-xs">
        Order not found.
      </div>
    );
  }

  const isSalesOrAdmin = role === "SALES" || role === "ADMIN";
  const canAssignDelivery =
    can("orders:update_status") &&
    isSalesOrAdmin &&
    order.status === "PROCESSING";

  const canSubmitShippingProof =
    order.status === "PROCESSING" &&
    can("orders:update_status") &&
    (role === "ADMIN" ||
      (role === "DELIVERY" && order.assignedToUserId === currentUser?.id));

  const amount = parseFloat(String(order.amount));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl h-9 w-9 border-gray-100"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <DashboardHeader
          title={`Order #${order.id.substring(0, 8)}`}
          description={`Manage fulfillment and tracking for this transaction.`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <CardHeader className="border-b border-gray-50 pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Items & Cart
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center gap-4 group"
                  >
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[#F5F7F5] border border-gray-100 shrink-0">
                      <Image
                        src={
                          item.product?.images?.[0] ||
                          item.product?.image ||
                          "/placeholder.png"
                        }
                        alt="Product"
                        fill
                        className="object-cover transition-transform group-hover:scale-110 duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-black truncate">
                        {item.product?.name || "Premium Herbal Product"}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-1">
                        {item.quantity} Unit{item.quantity > 1 ? "s" : ""} × XAF{" "}
                        {parseFloat(String(item.price)).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-black">
                        XAF{" "}
                        {(
                          item.quantity * parseFloat(String(item.price))
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-[#F5F7F5]/50 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Order Subtotal
                  </span>
                  <span className="text-lg font-medium text-black">
                    XAF {amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Tracking (Placeholder for functionality) */}
          {order.status === "SHIPPED" && (
            <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6">
              <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-orange-500" />
                Real-time Tracking
              </h3>
              <div className="h-[200px] w-full bg-[#F5F7F5] rounded-xl flex items-center justify-center border border-dashed border-gray-200">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2 animate-bounce" />
                  <p className="text-[10px] font-medium text-gray-400">
                    Live GPS data will be displayed once the courier is in
                    route.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Status Controls */}
          <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6">
            <h3 className="text-xs font-medium text-gray-400 mb-4 flex items-center gap-2">
              Fulfillment Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  className={`rounded-full px-4 py-1.5 text-[9px] font-medium border-none text-white ${
                    order.status === "DELIVERED"
                      ? "bg-[#166534]"
                      : order.status === "PENDING"
                        ? "bg-[#D97706]"
                        : order.status === "SHIPPED"
                          ? "bg-[#EA580C]"
                          : order.status === "PROCESSING"
                            ? "bg-blue-600"
                            : "bg-gray-400"
                  }`}
                >
                  {order.status}
                </Badge>
                <span className="text-[10px] font-medium text-gray-300 italic">
                  Updated {new Date(order.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {can("orders:update_status") && (
                <div className="space-y-2 pt-2">
                  <Label className="text-[10px] font-medium text-gray-400">
                    Change State
                  </Label>
                  <Select
                    value={order.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="rounded-xl border-gray-100 font-medium text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100">
                      {[
                        "PENDING",
                        "PAID",
                        "PROCESSING",
                        "SHIPPED",
                        "DELIVERED",
                        "CANCELLED",
                      ].map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="font-medium text-xs"
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          {/* Delivery Assignment */}
          <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6">
            <h3 className="text-xs font-medium text-gray-400 mb-4 flex items-center gap-2">
              <Truck className="h-3.5 w-3.5" />
              Logistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#F5F7F5] flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-black">Assignee</p>
                  <p className="text-[10px] font-medium text-gray-400 truncate max-w-[150px]">
                    {order.assignedToUserId
                      ? `ID: ${order.assignedToUserId.substring(0, 12)}...`
                      : "Unassigned"}
                  </p>
                </div>
              </div>

              {canAssignDelivery && (
                <div className="space-y-2 pt-2 border-t border-gray-50">
                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger className="rounded-xl border-gray-100 font-medium text-xs h-10">
                      <SelectValue placeholder="Choose dispatcher" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100">
                      {deliveryUsers.map((u) => (
                        <SelectItem
                          key={u.id}
                          value={u.id}
                          className="font-medium text-xs"
                        >
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full rounded-xl font-medium h-10"
                    onClick={handleAssign}
                    disabled={isAssigning || !assigneeId}
                  >
                    {isAssigning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Confirm Assignment"
                    )}
                  </Button>
                </div>
              )}

              {canSubmitShippingProof && (
                <div className="space-y-2 pt-2 border-t border-gray-50">
                  <Label className="text-[10px] font-medium text-gray-400">
                    Proof of Delivery
                  </Label>
                  <input
                    ref={proofInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleProofFile}
                  />
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-dashed border-gray-200 font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                    onClick={() => proofInputRef.current?.click()}
                    disabled={uploadMedia.isPending}
                  >
                    {uploadMedia.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Upload Receipt/Proof"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Customer Details */}
          <Card className="border-none bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6">
            <h3 className="text-xs font-medium text-gray-400 mb-4 flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              Customer Profile
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-black">
                  {order.user?.name || "Guest Checkout"}
                </p>
                <p className="text-xs font-medium text-gray-400">
                  {order.user?.email || "Anonymous"}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-300" />
                  <span className="text-xs font-medium text-gray-600">
                    {order.deliveryAddress?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-300 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      {order.deliveryAddress?.address || "No address"}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                      {[
                        order.deliveryAddress?.city,
                        order.deliveryAddress?.region,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Metadata Timeline */}
          <div className="px-4">
            <div className="flex items-center justify-between text-[10px] font-medium text-gray-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>
                  Modified: {new Date(order.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
