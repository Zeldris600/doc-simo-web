"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { PhoneCall, ArrowRight } from "@/lib/icons";
import Image from "next/image";

import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";

// African-inspired geometric SVG pattern (Kente / Ndebele diamonds)
const AFRICAN_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none'%3E%3Cpolygon points='30,4 56,18 56,42 30,56 4,42 4,18' stroke='%23173b27' stroke-width='0.8' fill='none' opacity='0.16'/%3E%3Cpolygon points='30,12 48,22 48,38 30,48 12,38 12,22' stroke='%23f2c94c' stroke-width='0.5' fill='none' opacity='0.13'/%3E%3Ccircle cx='30' cy='30' r='2' fill='%23173b27' opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`;

interface HeroProps {
  isLoading?: boolean;
}

export function Hero({ isLoading }: HeroProps) {
  if (isLoading) return <HeroSkeleton />;

  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden bg-white">
      {/* ── African geometric pattern: strongest at center, fades to white at edges ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: AFRICAN_PATTERN,
            backgroundSize: "60px 60px",
            WebkitMaskImage:
              "radial-gradient(ellipse 72% 58% at 50% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0) 74%)",
            maskImage:
              "radial-gradient(ellipse 72% 58% at 50% 46%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0) 74%)",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
        {/* Very subtle warmth (still reads on white) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#f2c94c]/6 -translate-y-1/4 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-primary/4 translate-y-1/4 -translate-x-1/4 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* ── LEFT CONTENT ── */}
        <div className="flex-1 max-w-2xl text-center lg:text-left space-y-7">
          {/* Clinic badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2c94c]/15 text-[#8a6e00] text-xs font-bold border border-[#f2c94c]/40 tracking-wide">
            <span className="text-base">🌿</span>
            African Herbal &amp; Antiviral Medicine
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight text-primary text-balance">
            Ancestral Wisdom,
            <br />
            <span className="relative">
              Modern&nbsp;
              <span className="text-primary">Healing.</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 opacity-30"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 6 Q50 0 100 6 Q150 0 200 6"
                  stroke="#f2c94c"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-foreground/70 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Rooted in centuries of African botanical tradition — validated by
            modern clinical science. Herbal &amp; antiviral remedies your body
            recognises, crafted by Dr. Simo&apos;s clinic.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white hover:bg-[#142c1b] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-primary/25"
            >
              <PhoneCall className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
              Book Free Consultation
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/60 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Learn Our Story
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>

        {/* ── RIGHT DOCTOR IMAGE ── */}
        <div className="flex-1 relative w-full max-w-md lg:max-w-none flex items-end justify-center">
          {/* Doctor photo container */}
          <div className="relative w-full max-w-sm lg:max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-primary/10">
            <Image
              src="/dr-simeon.png"
              alt="Dr. Simeon - Doctasimo Chief Medical Officer"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 90vw, 45vw"
            />
            {/* Subtle gradient at base */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating card — top right — Organic */}
          <div className="absolute top-8 -right-4 lg:-right-10 bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-xl shadow-black/5 border border-[#f2c94c]/20 z-20 w-44 hover:-translate-y-1 transition-transform duration-500">
            <span className="text-4xl leading-none block mb-2">🌿</span>
            <p className="font-semibold text-sm text-primary leading-tight">
              Pure African Botanicals
            </p>
            <p className="text-[11px] text-foreground/50 font-medium mt-0.5">
              Wild-harvested &amp; organic
            </p>
          </div>

          {/* Floating card — bottom left — Traditional + Modern */}
          <div className="absolute bottom-12 -left-4 lg:-left-10 bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-xl shadow-black/5 border border-primary/10 z-20 w-48 hover:-translate-y-1 transition-transform duration-500 delay-150">
            <span className="text-4xl leading-none block mb-2">⚕️</span>
            <p className="font-semibold text-sm text-primary leading-tight">
              Clinically Validated
            </p>
            <p className="text-[11px] text-foreground/50 font-medium mt-0.5">
              Traditional meets science
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
