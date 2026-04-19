"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getPusherClient } from "@/lib/pusher";
import { hasPermission } from "@/lib/rbac/permissions";
import { useCan } from "@/hooks/use-can";

/**
 * Ops feed: `private-sales-orders` for SALES/ADMIN with orders:read.
 */
export function SalesOrdersPusherBridge() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { role } = useCan();
  const token = session?.user?.token;

  useEffect(() => {
    if (!token || !hasPermission(role, "orders:read")) return;

    const pusher = getPusherClient(token);
    if (!pusher) return;

    const channel = pusher.subscribe("private-sales-orders");

    channel.bind(
      "order.paid",
      (payload: { orderId?: string; orderNumber?: string; amount?: string }) => {
        void queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.success("Order paid", {
          description: [payload.orderNumber, payload.amount].filter(Boolean).join(" · "),
        });
      },
    );

    channel.bind("order.shipped", (payload: { orderId?: string }) => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.info("Order shipped", {
        description: payload.orderId ? `Order ${payload.orderId.slice(0, 8)}…` : undefined,
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [token, role, queryClient]);

  return null;
}
