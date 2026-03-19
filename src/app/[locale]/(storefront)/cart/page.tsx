"use client";

import { Link, useRouter } from "@/i18n/routing";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCart } from "@/store/use-cart";
import { useCreateOrder } from "@/hooks/use-order";
import { toast } from "sonner";

const checkoutSchema = z.object({
  recipientName: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  region: z.string().optional(),
  phone: z.string().min(9, "Valid phone is required"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CartPage() {
  const t = useTranslations("cart");
  const checkoutT = useTranslations("checkout");
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal: getSubtotal, clearCart } = useCart();
  const { mutate: createOrder, isPending: isCreating } = useCreateOrder();
  
  const [promoCode] = useState("");
  
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: "",
      address: "",
      city: "",
      region: "",
      phone: "",
    },
  });

  const subtotal = getSubtotal();
  const shipping = 0;
  const total = subtotal + shipping;

  const onSubmit = (values: CheckoutValues) => {
    createOrder({
      items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      deliveryAddress: {
        address: values.address,
        city: values.city,
        region: values.region,
        phone: values.phone
      },
      code: promoCode || undefined
    }, {
      onSuccess: (order) => {
        clearCart();
        router.push(`/checkout/${order.id}`);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to create order");
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-black mb-4 tracking-tight">
          {t("empty")}
        </h1>
        <p className="text-black/40 mb-10 text-sm max-w-md mx-auto font-medium leading-relaxed">
          {t("emptyDesc")}
        </p>
        <Button asChild className="rounded-md px-10 h-11 text-xs font-bold bg-primary hover:bg-primary/90 transition-all active:scale-95 shadow-none">
          <Link href="/products">{t("continue")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex items-center gap-2 mb-10 group">
        <Link
          href="/products"
          className="flex items-center text-xs font-bold text-black/40 hover:text-primary transition-all tracking-tight"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          {t("continue")}
        </Link>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-black mb-12 tracking-tight leading-none">
        {t("title")}
      </h1>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="hidden md:grid grid-cols-12 pb-5 text-[10px] font-bold text-black/30 border-b border-black/5 tracking-wider uppercase">
            <div className="col-span-6">{t("product")}</div>
            <div className="col-span-2 text-center">{t("price")}</div>
            <div className="col-span-2 text-center">{t("quantity")}</div>
            <div className="col-span-2 text-right">{t("total")}</div>
          </div>

          <div className="divide-y border-t md:border-t-0 border-black/5">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 items-center"
              >
                <div className="col-span-1 md:col-span-6 flex gap-4">
                  <div className="relative aspect-square w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-black/[0.02] border border-black/5">
                    <Image
                      src={item.images?.[0] || item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[9px] text-primary font-bold uppercase tracking-widest mb-1">
                      {item.category?.name || "Herbal Formulation"}
                    </p>
                    <h3 className="text-sm font-bold text-black mb-1">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center text-[10px] text-black/30 font-bold hover:text-red-500 transition-colors mt-2 tracking-tight"
                    >
                      <Trash2 className="h-3 w-3 mr-1.5" />
                      {t("remove")}
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 text-center">
                  <span className="text-[10px] md:hidden text-black/40 font-bold mr-2 uppercase tracking-widest">
                    {t("price")}:
                  </span>
                  <span className="text-sm font-bold text-black">
                    {Number(item.price).toLocaleString()} <span className="text-[10px]">XAF</span>
                  </span>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-center">
                  <div className="flex items-center border border-black/5 rounded-md px-3 py-1 bg-black/[0.02]">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-black/40 hover:text-black transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-black">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-black/40 hover:text-black transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 text-right">
                  <span className="text-[10px] md:hidden text-black/40 font-bold mr-2 uppercase tracking-widest">
                    {t("total")}:
                  </span>
                  <span className="text-sm font-bold text-black">
                    {(Number(item.price) * item.quantity).toLocaleString()} <span className="text-[10px]">XAF</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary + Delivery */}
        <div className="lg:col-span-5">
          <div className="bg-black/[0.02] rounded-md p-8 sticky top-24 border border-black/5 space-y-8 shadow-none">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-black/60">{t("summary")}</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-black/40">{t("subtotal")}</span>
                <span className="text-black">{subtotal.toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-black/40">{t("shipping")}</span>
                <span className="text-emerald-500 font-bold tracking-widest text-[10px]">{t("free")}</span>
              </div>

              <Separator className="bg-black/5" />

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-base font-black tracking-tight">{t("total")}</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-primary">
                    {total.toLocaleString()} XAF
                  </span>
                  <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest mt-1">
                    {t("taxes")}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-6 pt-6 border-t border-black/5">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-black/30" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{checkoutT("delivery")}</span>
              </div>
              
              <Form {...form}>
                <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">{checkoutT("recipient")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={checkoutT("recipientPlaceholder")}
                            {...field}
                            className="h-11 rounded-md text-sm font-medium bg-white border-black/5 px-4 focus:border-primary/50 transition-all shadow-none"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-medium" />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">{checkoutT("city")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={checkoutT("cityPlaceholder")}
                              {...field}
                              className="h-11 rounded-md text-sm font-medium bg-white border-black/5 px-4 focus:border-primary/50 transition-all shadow-none"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">Region</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g. Center"
                              {...field}
                              className="h-11 rounded-md text-sm font-medium bg-white border-black/5 px-4 focus:border-primary/50 transition-all shadow-none"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">{checkoutT("phone")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+237 ..."
                            {...field}
                            className="h-11 rounded-md text-sm font-medium bg-white border-black/5 px-4 focus:border-primary/50 transition-all shadow-none"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">{checkoutT("street")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={checkoutT("streetPlaceholder")}
                            {...field}
                            className="h-11 rounded-md text-sm font-medium bg-white border-black/5 px-4 focus:border-primary/50 transition-all shadow-none"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-medium" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            <Button 
              form="checkout-form"
              type="submit"
              disabled={isCreating}
              className="w-full rounded-md h-11 text-xs font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-none"
            >
              {isCreating ? (
                checkoutT("processing")
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 mr-2 opacity-50" />
                  {t("checkout")}
                </>
              )}
            </Button>

            <div className="space-y-4 pt-6 border-t border-black/5">
              <div className="flex items-center gap-4 text-[10px] text-black/40 font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>{t("secureNote")}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-black/40 font-bold uppercase tracking-widest">
                <Truck className="h-4 w-4 text-emerald-500" />
                <span>{t("carbonNote")}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-black/40 font-bold uppercase tracking-widest">
                <RotateCcw className="h-4 w-4 text-emerald-500" />
                <span>{t("guarantee")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
