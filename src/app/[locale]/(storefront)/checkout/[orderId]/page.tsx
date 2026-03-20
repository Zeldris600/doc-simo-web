"use client";

import { useParams } from "next/navigation";
import { useOrder } from "@/hooks/use-order";
import { useInitiatePayment } from "@/hooks/use-payment";
import { useMe } from "@/hooks/use-user";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  Lock,
  ChevronRight
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  const { mutate: initiatePayment, isPending: isInitiating } = useInitiatePayment();
  
  const [paymentOperator, setPaymentOperator] = useState<"MTN" | "ORANGE">("MTN");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePayment = () => {
    const email = user?.email || user?.customer?.email;
    if (!email) {
      toast.error("User email not found. Please update your profile.");
      return;
    }

    if (!phoneNumber) {
      toast.error(t("fillDetails"));
      return;
    }

    initiatePayment({
      orderId,
      data: {
        redirectUrl: `${window.location.origin}/account/orders`,
        email
      }
    }, {
      onSuccess: (response) => {
        if (response.link) {
          window.location.href = response.link;
        } else {
          toast.success("Payment initiated. Please check your phone.");
        }
      },
      onError: (err: ApiError) => {
        const errorMessage = err.response?.data?.message || "Failed to initiate payment";
        toast.error(errorMessage);
      }
    });
  };

  if (isLoadingOrder) {
    return <CheckoutSkeleton />;
  }

  if (!order) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-black mb-4 tracking-tight">Order Not Found</h1>
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
          className="flex items-center text-xs font-bold text-black/40 hover:text-primary transition-all tracking-tight"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          Back to Registry
        </Link>
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-black mb-12 tracking-tight leading-none uppercase">
        Final Procurement
      </h1>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Smartphone className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-black tracking-tight uppercase">{t("payment")}</h2>
            </div>
            
            <RadioGroup 
              value={paymentOperator} 
              onValueChange={(v: "MTN" | "ORANGE") => setPaymentOperator(v)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="ORANGE" id="orange" className="peer sr-only" />
                <Label
                  htmlFor="orange"
                  className="flex flex-col items-center justify-center p-6 border rounded-xl cursor-pointer hover:bg-black/[0.02] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/[0.02] transition-all gap-3 overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FF7900] flex items-center justify-center text-white font-black text-xs">
                    OR
                  </div>
                  <span className="font-bold text-[10px] uppercase tracking-widest">{t("orange")}</span>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="MTN" id="mtn" className="peer sr-only" />
                <Label
                  htmlFor="mtn"
                  className="flex flex-col items-center justify-center p-6 border rounded-xl cursor-pointer hover:bg-black/[0.02] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/[0.02] transition-all gap-3 overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#FFCB05] flex items-center justify-center text-black font-black text-xs">
                    MTN
                  </div>
                  <span className="font-bold text-[10px] uppercase tracking-widest">{t("mtn")}</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-4">
              <div className="space-y-2 px-1">
                <Label htmlFor="paymentPhone" className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                  {t("enterNumber", { operator: paymentOperator })}
                </Label>
                <Input 
                  id="paymentPhone" 
                  placeholder="6... or 237..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-11 rounded-md border-black/10 focus:border-primary px-4 bg-white text-base shadow-none font-bold" 
                />
              </div>
              <p className="text-[10px] text-black/30 font-medium leading-relaxed px-1">
                {t("paymentNote")}
              </p>
            </div>
          </section>

          <Button 
            onClick={handlePayment}
            disabled={isInitiating}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-md py-6 h-auto font-black text-lg transition-all active:scale-[0.98] shadow-none tracking-[0.2em]"
          >
            {isInitiating ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4 opacity-50" />
                Proceed to Pay
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-4 pt-6 pb-20">
            <div className="flex items-center gap-3 text-[10px] text-black/40 font-bold uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>{t("secureNote")}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-black/40 font-bold uppercase tracking-widest">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{t("guarantee")}</span>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
           <Card className="border-black/5 rounded-xl bg-black/[0.02] shadow-none overflow-hidden sticky top-24">
             <div className="p-8 space-y-6">
               <div className="flex justify-between items-start">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/60">Procurement Registry</h3>
                 {order.orderNumber && (
                   <span className="text-[10px] font-bold text-black/20 font-mono">{order.orderNumber}</span>
                 )}
               </div>
               
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {order.items.map((item: OrderItem) => (
                   <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                     <div className="flex flex-col">
                       <span className="text-black">{item.product?.name || "Formulation"}</span>
                       <span className="text-[10px] text-black/40">Qty: {item.quantity}</span>
                     </div>
                     <span className="text-black">{(item.price * item.quantity).toLocaleString()} XAF</span>
                   </div>
                 ))}
               </div>

               <Separator className="bg-black/5" />

                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold text-black/40">
                    <span>Registry Total</span>
                    <span>{Number(order.amount).toLocaleString()} {order.currency || "XAF"}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-black/40">
                    <span>Shipping Fees</span>
                    <span className="text-emerald-500">FREE</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4">
                    <span className="text-base font-black tracking-tight text-black">Total to pay</span>
                    <span className="text-2xl font-black text-primary">{Number(order.amount).toLocaleString()} {order.currency || "XAF"}</span>
                  </div>
                </div>
             </div>
           </Card>
        </aside>
      </div>
    </div>
  );
}
