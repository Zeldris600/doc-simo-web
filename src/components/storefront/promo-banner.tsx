"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { useDiscounts } from "@/hooks/use-discount";

export function PromoBanner() {
  const { data: res, isLoading } = useDiscounts({ activeOnly: "true", limit: 1 });
  const discounts = res?.data || [];
  const activePromo = discounts[0];

  if (isLoading) return null;
  if (!activePromo) return null;

  const isPercent = activePromo.type === "PERCENT";
  const amount = isPercent ? `${activePromo.value}%` : `${Number(activePromo.value).toLocaleString()} ${activePromo.currency || 'XAF'}`;

  return (
    <section className="px-6 lg:px-12 py-4">
 <div className="container max-w-7xl mx-auto">
 <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary to-emerald-800">
 {/* Background Image */}
 <div className="absolute inset-0 opacity-10">
 <Image
 src="https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=2000&auto=format&fit=crop"
 alt="Background"
 fill
 className="object-cover"
 />
 </div>

 <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 md:px-14 py-12 md:py-16">
 {/* Left */}
 <div className="space-y-4 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold text-[#f2c94c]">
                <Sparkles className="w-3.5 h-3.5" />
                Special Offer
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight uppercase">
                {activePromo.code}
              </h2>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                Enjoy a {amount} discount on your current basket. Elevate your wellness journey with our premium clinical formulations. Don&apos;t miss out on this exclusive opportunity.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#f2c94c] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#f2c94c]/90 transition-all"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {activePromo.expiresAt && (
                  <div className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Valid until {new Date(activePromo.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>

 </div>

 {/* Right - Decorative price/badge */}
 <div className="hidden md:flex flex-col items-center justify-center">
 <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
 <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                  <span className="text-[10px] text-white/60 font-bold">Save up to</span>
                  <span className="text-3xl font-bold text-[#f2c94c]">{amount}</span>
                  <span className="text-[10px] text-white/60 font-bold">On your order</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}
