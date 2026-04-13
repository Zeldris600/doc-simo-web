"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CheckCircle2, ArrowRight, Package, Home } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 md:py-32 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-50" />
        <CheckCircle2 className="h-12 w-12 text-emerald-500 z-10" />
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-primary mb-4 tracking-tight drop-shadow-sm">
        Payment Successful!
      </h1>
      <p className="text-base text-black/50 font-medium max-w-md mx-auto mb-10 leading-relaxed">
        Thank you for your purchase. Your order has been securely processed and is
        now preparing for shipment. A confirmation email has been sent to your
        registered address.
      </p>

      <div className="bg-[#f5faf6] border border-primary/10 rounded-3xl p-6 md:p-8 w-full max-w-lg mb-10 shadow-xl shadow-primary/5">
        <h2 className="text-sm font-black text-primary uppercase tracking-wider mb-6">
          What happens next?
        </h2>
        <div className="space-y-6 text-left">
          <div className="flex gap-4 items-start">
            <div className="bg-white border border-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Order Processing</p>
              <p className="text-xs text-black/50 font-medium mt-1">
                Your herbs are being carefully prepared and packaged by our fulfillment team.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-white border border-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Shipment Tracking</p>
              <p className="text-xs text-black/50 font-medium mt-1">
                You will receive a tracking link via SMS or Email once your package leaves our herbal dispensary.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
        <Button
          asChild
          className="bg-primary hover:bg-[#142c1b] h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
        >
          <Link href="/account/orders">
            <Package className="mr-2 h-4 w-4 opacity-70" />
            Track My Order
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 px-8 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4 opacity-70" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
