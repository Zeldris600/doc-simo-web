"use client";

import * as React from "react";
import { 
 ArrowLeft, 
 MapPin, 
 ShieldCheck, 
 Smartphone,
 CheckCircle2,
 ChevronRight,
 ShoppingCart,
 Loader2
} from "@/lib/icons";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCreateOrder } from "@/hooks/use-order";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import { useTranslations } from "next-intl";



export function CheckoutClient() {
  const t = useTranslations("checkout");
  const createOrderMutation = useCreateOrder();
  const { items, subtotal: getSubtotal } = useCart();

 const [deliveryData, setDeliveryData] = React.useState({
 fullName: "",
 phoneNumber: "",
 city: "",
 street: "",
 });

 const [paymentOperator, setPaymentOperator] = React.useState<"ORANGE_MONEY" | "MTN_MOBILE_MONEY">("ORANGE_MONEY");
 const [paymentPhoneNumber, setPaymentPhoneNumber] = React.useState("");

  const subtotal = getSubtotal();
  const total = subtotal;

 const handlePlaceOrder = async (e: React.FormEvent) => {
 e.preventDefault();
 
 // Basic Validation
 if (!deliveryData.fullName || !deliveryData.phoneNumber || !deliveryData.city || !deliveryData.street) {
 toast.error("Please fill in all delivery details");
 return;
 }
 if (!paymentPhoneNumber) {
 toast.error("Please provide the payment phone number");
 return;
 }

  const payload = {
    items: items.map(it => ({ productId: it.id, quantity: it.quantity })),
    deliveryAddress: deliveryData,
    paymentMethod: paymentOperator,
    paymentPhoneNumber: paymentPhoneNumber
  };

  createOrderMutation.mutate(payload);
};

 return (
 <div className="container mx-auto max-w-5xl px-4 py-8 md:py-16">
  <div className="flex items-center gap-2 mb-8">
  <Link 
  href="/cart" 
  className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-all text-black/40"
  >
  <ArrowLeft className="h-5 w-5" />
  </Link>
  <h1 className="text-2xl font-black tracking-tight">{t("title")}</h1>
  </div>

 <div className="grid lg:grid-cols-12 gap-12">
 {/* Checkout Form */}
 <div className="lg:col-span-7 space-y-8">
 <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
 {/* Delivery Section */}
 <section className="space-y-6">
  <div className="flex items-center gap-3">
  <div className="bg-primary text-white p-2 rounded-lg ">
  <MapPin className="h-4 w-4" />
  </div>
  <h2 className="text-lg font-bold">{t("delivery")}</h2>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
  <Label htmlFor="fullName" className="text-black/60 font-bold text-sm">{t("recipient")}</Label>
  <Input 
  id="fullName" 
  placeholder={t("recipientPlaceholder")}
  value={deliveryData.fullName}
  onChange={(e) => setDeliveryData({...deliveryData, fullName: e.target.value})}
  className="rounded-xl border-black/10 focus:border-black py-6 text-base" 
  />
  </div>
  <div className="space-y-2">
  <Label htmlFor="phoneNumber" className="text-black/60 font-bold text-sm">{t("phone")}</Label>
  <Input 
  id="phoneNumber" 
  placeholder="+237 ..."
  value={deliveryData.phoneNumber}
  onChange={(e) => setDeliveryData({...deliveryData, phoneNumber: e.target.value})}
  className="rounded-xl border-black/10 focus:border-black py-6 text-base" 
  />
  </div>
  <div className="space-y-2">
  <Label htmlFor="city" className="text-black/60 font-bold text-sm">{t("city")}</Label>
  <Input 
  id="city" 
  placeholder={t("cityPlaceholder")}
  value={deliveryData.city}
  onChange={(e) => setDeliveryData({...deliveryData, city: e.target.value})}
  className="rounded-xl border-black/10 focus:border-black py-6 text-base" 
  />
  </div>
  <div className="space-y-2">
  <Label htmlFor="street" className="text-black/60 font-bold text-sm">{t("street")}</Label>
  <Input 
  id="street" 
  placeholder={t("streetPlaceholder")}
  value={deliveryData.street}
  onChange={(e) => setDeliveryData({...deliveryData, street: e.target.value})}
  className="rounded-xl border-black/10 focus:border-black py-6 text-base" 
  />
  </div>
  </div>
 </section>

 {/* Payment Section */}
 <section className="space-y-6 pt-4">
  <div className="flex items-center gap-3">
  <div className="bg-primary text-white p-2 rounded-lg ">
  <Smartphone className="h-4 w-4" />
  </div>
  <h2 className="text-lg font-bold">{t("payment")}</h2>
  </div>
 
 <RadioGroup 
 value={paymentOperator} 
 onValueChange={(v: "ORANGE_MONEY" | "MTN_MOBILE_MONEY") => setPaymentOperator(v)}
 className="grid grid-cols-1 md:grid-cols-2 gap-4"
 >
 <div>
 <RadioGroupItem value="ORANGE_MONEY" id="orange" className="peer sr-only" />
  <Label
  htmlFor="orange"
  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-black/[0.02] peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black/[0.02] transition-all"
  >
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-lg bg-[#FF7900] flex items-center justify-center text-white font-black text-xs">
  OR
  </div>
  <div className="flex flex-col">
  <span className="font-bold text-sm">{t("orange")}</span>
  <span className="text-[10px] text-black/40">{t("paymentSafe")}</span>
  </div>
  </div>
  <div className="w-5 h-5 rounded-full border border-primary/20 peer-data-[state=checked]:border-primary flex items-center justify-center p-1">
  {paymentOperator === "ORANGE_MONEY" && <div className="w-full h-full bg-primary rounded-full" />}
  </div>
  </Label>
 </div>

 <div>
 <RadioGroupItem value="MTN_MOBILE_MONEY" id="mtn" className="peer sr-only" />
  <Label
  htmlFor="mtn"
  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-black/[0.02] peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black/[0.02] transition-all"
  >
  <div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-lg bg-[#FFCB05] flex items-center justify-center text-black font-black text-xs">
  MTN
  </div>
  <div className="flex flex-col">
  <span className="font-bold text-sm">{t("mtn")}</span>
  <span className="text-[10px] text-black/40">{t("paymentFast")}</span>
  </div>
  </div>
  <div className="w-5 h-5 rounded-full border border-primary/20 peer-data-[state=checked]:border-primary flex items-center justify-center p-1">
  {paymentOperator === "MTN_MOBILE_MONEY" && <div className="w-full h-full bg-primary rounded-full" />}
  </div>
  </Label>
 </div>
 </RadioGroup>

 <div className="p-6 bg-black/[0.02] rounded-lg border border-black/5 space-y-4">
  <div className="space-y-2">
  <Label htmlFor="paymentPhone" className="text-black/60 font-bold text-sm">
  {t("enterNumber", { operator: paymentOperator === "ORANGE_MONEY" ? "Orange" : "MTN" })}
  </Label>
  <p className="text-[10px] text-black/40 -mt-1 mb-2">
  {t("paymentNote")}
  </p>
  <Input 
  id="paymentPhone" 
  placeholder="6... or 6..."
  value={paymentPhoneNumber}
  onChange={(e) => setPaymentPhoneNumber(e.target.value)}
  className="rounded-xl border-black/10 focus:border-black py-6 bg-white text-base" 
  />
  </div>
 </div>
 </section>
 </form>
 </div>

 {/* Sidebar Order Summary */}
 <aside className="lg:col-span-5 space-y-6">
 <Card className="border-black/5 sticky top-24 overflow-hidden">
  <div className="bg-primary p-6 text-white flex items-center justify-between ">
  <div className="flex items-center gap-3">
  <ShoppingCart className="h-5 w-5 text-white/60" />
  <CardTitle className="text-lg font-black uppercase tracking-tight ">{t("summary")}</CardTitle>
  </div>
  <Badge variant="secondary" className="bg-white/10 text-white border-none">
  {t("items", { count: items.length })}
  </Badge>
  </div>
 <CardContent className="p-0">
  <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
  {items.map((item) => (
  <div key={item.id} className="flex items-center justify-between gap-4 text-sm font-medium">
  <div className="flex flex-col">
  <span className="font-bold text-black">{item.name}</span>
  <span className="text-[10px] text-black/40">Qty: {item.quantity}</span>
  </div>
  <span className="font-bold">{(Number(item.price) * item.quantity).toLocaleString()} XAF</span>
  </div>
  ))}
  </div>
 
 <Separator className="bg-black/5" />
  <div className="p-6 space-y-3">
  <div className="flex justify-between text-xs text-black/60">
  <span>{t("subtotal")}</span>
  <span className="font-bold text-black">{subtotal.toLocaleString()} XAF</span>
  </div>
  <div className="flex justify-between text-xs text-black/60">
  <span>{t("shipping")}</span>
  <span className="font-bold text-emerald-600">{t("free")}</span>
  </div>
 
 <Separator className="bg-black/5 my-2" />
  <div className="flex justify-between items-baseline pt-2">
  <span className="text-lg font-black uppercase tracking-tighter">{t("total")}</span>
  <div className="text-right">
  <span className="text-3xl font-black">{total.toLocaleString()} XAF</span>
  <p className="text-[10px] text-black/40 font-medium">{t("vat")}</p>
  </div>
  </div>
 
 <Button 
 form="checkout-form"
 type="submit"
 disabled={createOrderMutation.isPending}
 className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-8 h-auto font-black text-xl mt-6 transition-all hover:scale-[1.02] active:scale-95 group uppercase tracking-widest "
 >
  {createOrderMutation.isPending ? (
  <>
  <Loader2 className="mr-3 h-6 w-6 animate-spin text-white/40" />
  {t("processing")}
  </>
  ) : (
  <>
  {t("placeOrder")}
  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
  </>
  )}
 </Button>
 
 <div className="flex flex-col gap-3 pt-6">
  <div className="flex items-center gap-3 text-[10px] text-black/40 font-medium leading-tight">
  <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
  <span>{t("secureNote")}</span>
  </div>
  <div className="flex items-center gap-3 text-[10px] text-black/40 font-medium leading-tight">
  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
  <span>{t("guarantee")}</span>
  </div>
 </div>
 </div>
 </CardContent>
 </Card>
 </aside>
 </div>
 </div>
 );
}
