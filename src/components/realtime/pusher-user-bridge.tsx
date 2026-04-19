"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getPusherClient } from "@/lib/pusher";

/**
 * Subscribes to `private-user-{userId}` for `notification.new` and `order.assigned`.
 */
export function PusherUserBridge() {
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const token = session?.user?.token;

  useEffect(() => {
    if (status !== "authenticated" || !userId || !token) return;

    const pusher = getPusherClient(token);
    if (!pusher) return;

    const channel = pusher.subscribe(`private-user-${userId}`);

    channel.bind("notification.new", () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    channel.bind("order.assigned", (payload: { orderId?: string }) => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.info("New delivery assignment", {
        description: payload?.orderId ? `Order ${payload.orderId.slice(0, 8)}…` : undefined,
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [status, userId, token, queryClient]);

  return null;
}
