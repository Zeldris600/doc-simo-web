"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/use-order";
import { useInitiatePayment } from "@/hooks/use-payment";
import { useMe } from "@/hooks/use-user";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiError, OrderItem } from "@/types/api";
import { CheckoutSkeleton } from "@/components/skeletons/checkout-skeleton";

export default function OrderCheckoutPage() {
  const t = useTranslations("checkout");
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: order, isLoading: isLoadingOrder } = useOrder(orderId);
  const { data: user } = useMe();
  const { mutate: initiatePayment, isPending: isInitiating } =
    useInitiatePayment();

  const handlePayment = () => {
    const email = user?.email || user?.customer?.email;
    if (!email) {
      toast.error("User email not found. Please update your profile.");
      return;
    }

    initiatePayment(
      {
        orderId,
        data: {
          redirectUrl: process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/account/orders`
            : "https://doctasimo.com/account/orders",
          email,
        },
      },
      {
        onSuccess: (response) => {
          if (response.link) {
            window.location.href = response.link;
          } else {
            toast.success("Payment initiated. Please check your phone.");
          }
        },
        onError: (err: ApiError) => {
          const errorMessage =
            err.response?.data?.message || "Failed to initiate payment";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isLoadingOrder) {
    return <CheckoutSkeleton />;
  }

  if (!order) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-black mb-4 ">
          Order Not Found
        </h1>
        <Button asChild>
          <Link href="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-16">
      <div className="flex items-center gap-2 mb-8 group">
        <Link
          href="/cart"
          className="flex items-center text-sm font-semibold text-black/40 hover:text-primary transition-all "
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Registry
        </Link>
      </div>

      <h1 className="text-xl md:text-2xl font-semibold text-black mb-12  leading-none">
        Final Procurement
      </h1>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold ">{t("payment")}</h2>
            </div>

            <div className="p-8 border border-dashed border-black/10 rounded-2xl bg-black/[0.01] flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500/40" />
              <div className="space-y-2">
                <p className="text-base font-semibold text-black">
                  {t("paymentFast")}
                </p>
                <p className="text-sm text-black/40 font-medium max-w-xs">
                  {t("paymentNote")}
                </p>
              </div>
            </div>
          </section>

          <Button
            onClick={handlePayment}
            disabled={isInitiating}
            className="w-full"
            size={"lg"}
          >
            {isInitiating ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4 opacity-50" />
                Proceed to Secure Payment
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-4 pt-6 pb-20">
            <div className="flex items-center gap-3 text-sm text-black/40 font-medium ">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>{t("secureNote")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-black/40 font-medium ">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{t("guarantee")}</span>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <Card className="border-black/5 rounded-xl bg-black/[0.02] shadow-none overflow-hidden sticky top-24">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-black/60">
                  Procurement Registry
                </h3>
                {order.orderNumber && (
                  <span className="text-sm font-bold ">
                    {order.orderNumber}
                  </span>
                )}
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {order.items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm font-bold"
                  >
                    <div className="flex flex-col">
                      <span className="text-black">
                        {item.product?.name || "Formulation"}
                      </span>
                      <span className="text-sm text-black/70">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="text-black">
                      {(item.price * item.quantity).toLocaleString()} XAF
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-black/5" />

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-black/40">
                  <span>Registry Total</span>
                  <span>
                    {Number(order.amount).toLocaleString()}{" "}
                    {order.currency || "XAF"}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black/40">
                  <span>Shipping Fees</span>
                  <span className="text-emerald-500">FREE</span>
                </div>
                <div className="flex justify-between items-baseline pt-4">
                  <span className="text-base font-black  text-black">
                    Total to pay
                  </span>
                  <span className="text-2xl font-black text-primary">
                    {Number(order.amount).toLocaleString()}{" "}
                    {order.currency || "XAF"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
