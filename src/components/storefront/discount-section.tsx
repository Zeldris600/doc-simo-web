"use client";

import * as React from "react";
import { Tag, Copy, Check, ArrowRight, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useDiscounts } from "@/hooks/use-discount";

const AFRICAN_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none'%3E%3Cpolygon points='30,4 56,18 56,42 30,56 4,42 4,18' stroke='%23ffffff' stroke-width='0.7' fill='none' opacity='0.06'/%3E%3Cpolygon points='30,14 46,23 46,37 30,46 14,37 14,23' stroke='%23f2c94c' stroke-width='0.5' fill='none' opacity='0.05'/%3E%3C/g%3E%3C/svg%3E")`;

// Fallback offer shown when no active discount is found in the DB
const FALLBACK = {
  code: "FIRSTORDER",
  label: "First Order Discount",
  description: "Get a special discount on your first order. Use this code at checkout and save on your first Doctasimo herbal formulation.",
  badge: "Welcome Offer",
};

export function DiscountSection() {
  const [copied, setCopied] = React.useState(false);
  const { data: res } = useDiscounts({ activeOnly: "true", limit: 1 });
  const active = res?.data?.[0];

  const isPercent = active?.type === "PERCENT";
  const saving = active
    ? isPercent
      ? `${active.value}% OFF`
      : `${Number(active.value).toLocaleString()} XAF OFF`
    : "Special Discount";

  const code = active?.code ?? FALLBACK.code;
  const badge = active ? "Active Promo" : FALLBACK.badge;
  const description = active
    ? `Enjoy ${saving} on your entire basket. Apply code at checkout — valid${active.expiresAt ? ` until ${new Date(active.expiresAt).toLocaleDateString()}` : " while stocks last"}.`
    : FALLBACK.description;

  function copyCode() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-6">
      <div className="container max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl bg-primary"
          style={{ backgroundImage: AFRICAN_PATTERN, backgroundSize: "60px 60px" }}
        >
          {/* Gold glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#f2c94c]/10 -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 px-8 md:px-14 py-14">

            {/* ── Left: Code display ── */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#f2c94c]/15 border border-[#f2c94c]/30 rounded-full px-4 py-1.5">
                <Zap className="w-3.5 h-3.5 text-[#f2c94c]" />
                <span className="text-[10px] font-black text-[#f2c94c] uppercase tracking-widest">
                  {badge}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                  {active ? saving : "Special Offer"}
                  <br />
                  <span className="text-[#f2c94c]">Just for You</span>
                </h2>
                <p className="text-sm text-white/60 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                  {description}
                </p>
              </div>

              {/* Coupon code box */}
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3">
                <Tag className="w-4 h-4 text-[#f2c94c] shrink-0" />
                <span className="text-xl font-black text-white tracking-widest">
                  {code}
                </span>
                <button
                  onClick={copyCode}
                  className="ml-2 flex items-center gap-1.5 bg-[#f2c94c] hover:bg-[#f0c040] text-[#142c1b] text-[10px] font-black px-3 py-1.5 rounded-xl transition-colors"
                >
                  {copied
                    ? <><Check className="w-3 h-3" /> Copied!</>
                    : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-white/90 transition-all shadow-lg shadow-black/10 group"
              >
                Shop Now — Use Code at Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* ── Right: Circular discount badge ── */}
            <div className="hidden md:flex shrink-0 items-center justify-center">
              <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-white/15 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center px-2">
                  <span className="text-[9px] text-[#f2c94c] font-black uppercase tracking-widest mb-1">
                    Save
                  </span>
                  <span className="text-3xl font-black text-white leading-none">
                    {active ? (isPercent ? active.value + "%" : "XAF") : "🌿"}
                  </span>
                  {active && !isPercent && (
                    <span className="text-xs font-black text-white/60 mt-1">
                      {Number(active.value).toLocaleString()}
                    </span>
                  )}
                  <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">
                    At checkout
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
