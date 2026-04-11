"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Clock, Sparkles } from "@/lib/icons";
import { useDiscounts } from "@/hooks/use-discount";

export function PromoBanner() {
  const { data: res, isLoading } = useDiscounts({
    activeOnly: "true",
    limit: 1,
  });
  const discounts = res?.data || [];
  const activePromo = discounts[0];

  if (isLoading) return null;
  if (!activePromo) return null;

  const isPercent = activePromo.type === "PERCENT";
  const amount = isPercent
    ? `${activePromo.value}%`
    : `${Number(activePromo.value).toLocaleString()} ${activePromo.currency || "XAF"}`;

  return (
    <section className="px-6 lg:px-12 py-4">
      <div className="container max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary to-emerald-800">
          {/* Background Image */}
          <div className="absolute inset-0 opacity-20 grayscale hover:grayscale-0 transition-all duration-1000">
            <Image
              src="/composition-notebook-stethoscope.jpg"
              alt="Background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 md:px-14 py-12 md:py-16">
            {/* Left */}
            <div className="space-y-4 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-black text-white uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Special Clinical Offer
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight uppercase">
                {activePromo.code}
              </h2>
              <p className="text-sm text-white/70 font-medium leading-relaxed">
                Enjoy a {amount} discount on your current basket. Elevate your
                wellness journey with our premium clinical formulations.
                Don&apos;t miss out on this exclusive opportunity.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2.5 md:px-8 md:py-3 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase hover:bg-white/90 transition-all shadow-xl shadow-black/10"
                >
                  Access Formulary
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {activePromo.expiresAt && (
                  <div className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Valid until{" "}
                    {new Date(activePromo.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Decorative price/badge */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                    Saving
                  </span>
                  <span className="text-4xl font-black text-white">
                    {amount}
                  </span>
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                    Off Formulary
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
