"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getPusherClient } from "@/lib/pusher";

type PaymentStatusPayload = {
  orderId: string;
  status: "success" | "failed";
};

export function CheckoutPaymentPusher({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;

  useEffect(() => {
    if (!orderId || !token) return;

    const pusher = getPusherClient(token);
    if (!pusher) return;

    const channel = pusher.subscribe(`private-order-${orderId}`);

    channel.bind("payment.status", (payload: PaymentStatusPayload) => {
      void queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      if (payload.status === "success") {
        toast.success("Payment confirmed");
        router.push("/checkout/success");
      } else {
        toast.error("Payment did not complete");
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [orderId, token, queryClient, router]);

  return null;
}
