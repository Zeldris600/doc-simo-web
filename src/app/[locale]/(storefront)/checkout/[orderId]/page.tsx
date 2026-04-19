"use client";

import * as React from "react";
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
  Truck,
  Clock,
  MapPin,
  AlertTriangle,
} from "@/lib/icons";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApiError, Discount, OrderItem } from "@/types/api";
import { CheckoutSkeleton } from "@/components/skeletons/checkout-skeleton";
import { useDiscounts } from "@/hooks/use-discount";
import { Tag, X } from "@/lib/icons";
import { DELIVERY_TIMELINES, DELIVERY_CITIES } from "@/lib/delivery-config";
import { CheckoutPaymentPusher } from "@/components/realtime/checkout-payment-pusher";

export default function OrderCheckoutPage() {
  const t = useTranslations("checkout");
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: order, isLoading: isLoadingOrder } = useOrder(orderId);
  const { data: user } = useMe();
  const { mutate: initiatePayment, isPending: isInitiating } =
    useInitiatePayment();

  // Coupon state
  const [couponInput, setCouponInput] = React.useState("");
  const [appliedDiscount, setAppliedDiscount] = React.useState<Discount | null>(
    null,
  );
  const [couponError, setCouponError] = React.useState("");
  const [isValidating, setIsValidating] = React.useState(false);
  const { data: discountsRes } = useDiscounts({
    activeOnly: "true",
    limit: 100,
  });

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setIsValidating(true);
    setCouponError("");
    const match = discountsRes?.data?.find(
      (d) => d.code.toUpperCase() === code && d.active,
    );
    setTimeout(() => {
      if (match) {
        setAppliedDiscount(match);
        toast.success(`Coupon "${match.code}" applied!`);
      } else {
        setCouponError("Invalid or expired coupon code.");
        setAppliedDiscount(null);
      }
      setIsValidating(false);
    }, 600);
  };

  const discountAmount = (() => {
    if (!appliedDiscount || !order) return 0;
    const total = Number(order.amount);
    if (appliedDiscount.type === "PERCENT")
      return Math.round((total * Number(appliedDiscount.value)) / 100);
    return Math.min(Number(appliedDiscount.value), total);
  })();
  const finalTotal = order
    ? Math.max(0, Number(order.amount) - discountAmount)
    : 0;

  const handlePayment = () => {
    const email = user?.email || user?.customer?.email;
    if (!email) {
      toast.error("User email not found. Please update your profile.");
      return;
    }

    if (!order) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${origin}/checkout/success`;

    initiatePayment(
      { orderId, data: { email, redirectUrl } },
      {
        onSuccess: (res) => {
          if (res.link) window.location.href = res.link;
          else toast.error("Payment link not returned.");
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
    <div className="container mx-auto max-w-6xl px-4 pt-24 md:pt-32 pb-8 md:pb-16">
      <CheckoutPaymentPusher orderId={orderId} />
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

          {/* ── Medical Disclaimer ── */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-xs font-black text-amber-800 uppercase tracking-wider">
                Health Disclaimer
              </p>
            </div>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Doctasimo products are traditional herbal &amp; antiviral
              formulations rooted in African botanical medicine. They are{" "}
              <strong>not intended to diagnose, treat, cure, or replace</strong>{" "}
              any prescribed medical treatment. Always consult your licensed
              healthcare provider before use, especially if you are pregnant,
              nursing, or on prescription medication. Results may vary.
            </p>
          </div>

          {/* ── Delivery Timeline ── */}
          <div className="rounded-2xl border border-black/5 bg-[#f5faf6] p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="h-4 w-4 text-primary" />
              <p className="text-xs font-black text-primary uppercase tracking-wider">
                Estimated Delivery
              </p>
            </div>
            <div className="space-y-3">
              {DELIVERY_TIMELINES.map((timeline, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-primary">
                      {timeline.title}
                    </p>
                    <p className="text-xs text-black/50 font-medium mt-0.5">
                      <span className={`font-bold ${timeline.colorClass}`}>
                        {timeline.duration}
                      </span>{" "}
                      · {timeline.locations}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Available Delivery Locations ── */}
          <div className="rounded-2xl border border-black/5 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-xs font-black text-primary uppercase tracking-wider">
                We Deliver To
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {DELIVERY_CITIES.map((city) => (
                <span
                  key={city}
                  className="text-[10px] font-bold bg-[#f5faf6] text-primary/70 border border-primary/10 rounded-full px-2.5 py-1"
                >
                  {city}
                </span>
              ))}
              <span className="text-[10px] font-bold text-black/30 px-2.5 py-1">
                + worldwide
              </span>
            </div>
            <p className="text-[11px] text-black/40 font-medium">
              Don&apos;t see your city? Contact us at{" "}
              <a
                href="mailto:orders@doctasimo.com"
                className="text-primary font-bold hover:underline"
              >
                orders@doctasimo.com
              </a>{" "}
              — we ship to most destinations globally.
            </p>
          </div>

          {/* ── Payment button ── */}
          <Button
            onClick={handlePayment}
            disabled={isInitiating}
            className="w-full bg-primary hover:bg-[#142c1b] rounded-xl h-13 shadow-lg shadow-primary/20 font-bold"
            size={"lg"}
          >
            {isInitiating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4 opacity-70" />
                Proceed to Secure Payment
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-4 pt-2 pb-20">
            <div className="flex items-center gap-2 text-xs text-black/40 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>{t("secureNote")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-black/40 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>{t("guarantee")}</span>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <Card className="border-black/5 rounded-xl bg-black/[0.02] shadow-none overflow-hidden sticky top-24">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm font-medium text-black/60 shrink-0">
                  Procurement Registry
                </h3>
                {order.orderNumber && (
                  <span className="text-sm font-bold text-black text-right whitespace-nowrap">
                    {order.orderNumber}
                  </span>
                )}
              </div>

              <Separator className="bg-black/5" />

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {order.items.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start text-sm font-bold py-2 border-b border-black/5 last:border-0"
                  >
                    <div className="flex flex-col gap-1 pr-4">
                      <span className="text-black leading-snug">
                        {item.product?.name || "Formulation"}
                      </span>
                      <span className="text-[11px] text-black/50 uppercase tracking-widest">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="text-primary whitespace-nowrap font-black">
                      {(Number(item.price) * item.quantity).toLocaleString()}{" "}
                      XAF
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="bg-black/5" />

              {/* ── Coupon code input ── */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-primary" />
                  <p className="text-xs font-black text-primary uppercase tracking-wider">
                    Promo / Coupon Code
                  </p>
                </div>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-xs font-black text-emerald-700">
                        {appliedDiscount.code}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        {appliedDiscount.type === "PERCENT"
                          ? `${appliedDiscount.value}% off applied`
                          : `${Number(appliedDiscount.value).toLocaleString()} ${order.currency || "XAF"} off applied`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedDiscount(null);
                        setCouponInput("");
                      }}
                      className="text-emerald-600 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError("");
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyCoupon()
                        }
                        className="h-8 text-[11px] font-bold uppercase tracking-wider border-black/10 focus:border-primary/30 rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={isValidating || !couponInput.trim()}
                        className="h-8 px-4 text-[11px] font-black border-primary/20 text-primary hover:bg-primary/5 rounded-lg shrink-0"
                      >
                        {isValidating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-500 font-medium">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Separator className="bg-black/5" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold text-black/40">
                  <span>Subtotal</span>
                  <span>
                    {Number(order.amount).toLocaleString()}{" "}
                    {order.currency || "XAF"}
                  </span>
                </div>
                {appliedDiscount && discountAmount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-emerald-600">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>
                      − {discountAmount.toLocaleString()}{" "}
                      {order.currency || "XAF"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t border-black/5">
                  <span className="text-base font-black text-black">
                    Total to pay
                  </span>
                  <span className="text-2xl font-black text-primary">
                    {finalTotal.toLocaleString()} {order.currency || "XAF"}
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
