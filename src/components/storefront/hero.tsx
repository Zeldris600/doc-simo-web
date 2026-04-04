"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { Star } from "lucide-react";
import Image from "next/image";

import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";

// African-inspired geometric SVG pattern (Kente / Ndebele diamonds)
const AFRICAN_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none'%3E%3Cpolygon points='30,4 56,18 56,42 30,56 4,42 4,18' stroke='%23173b27' stroke-width='0.8' fill='none' opacity='0.12'/%3E%3Cpolygon points='30,12 48,22 48,38 30,48 12,38 12,22' stroke='%23f2c94c' stroke-width='0.5' fill='none' opacity='0.10'/%3E%3Ccircle cx='30' cy='30' r='2' fill='%23173b27' opacity='0.08'/%3E%3C/g%3E%3C/svg%3E")`;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeroProps {
  isLoading?: boolean;
}

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80&auto=format&fit=crop",
];

export function Hero({ isLoading }: HeroProps) {
  if (isLoading) return <HeroSkeleton />;

  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#f5faf6]">
      {/* ── African geometric background pattern ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Pattern tile */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: AFRICAN_PATTERN,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Soft vignette so it fades toward the center */}
        <div className="absolute inset-0 bg-radial-[ellipse_80%_60%_at_50%_50%] from-transparent via-transparent to-[#f5faf6]/70" />
        {/* Warm glow top-right behind doctor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#f2c94c]/8 -translate-y-1/4 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-primary/6 translate-y-1/4 -translate-x-1/4 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pt-36 lg:pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* ── LEFT CONTENT ── */}
        <div className="flex-1 max-w-2xl text-center lg:text-left space-y-7">
          {/* Clinic badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2c94c]/15 text-[#8a6e00] text-xs font-bold border border-[#f2c94c]/40 tracking-wide">
            <span className="text-base">🌿</span>
            African Herbal &amp; Antiviral Medicine
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight text-primary text-balance">
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
              <span className="text-base">📞</span>
              Book Free Consultation
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white/60 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              How it works →
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
            <div className="flex -space-x-2">
              {AVATARS.map((src, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white overflow-hidden ring-1 ring-primary/10"
                >
                  <Image
                    src={src}
                    alt="Patient"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="w-9 h-9 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-[10px] font-black ring-1 ring-primary/10">
                +3k
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#f2c94c] text-[#f2c94c]"
                  />
                ))}
                <span className="ml-1 text-sm font-bold text-foreground">
                  4.9
                </span>
              </div>
              <p className="text-xs text-foreground/50 font-medium">
                Trusted by 3,500+ patients
              </p>
            </div>
          </div>

          {/* Quick feature row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#f2c94c]/20">
            {[
              {
                emoji: "💬",
                label: "Book a Consultation",
                sub: "Douala clinic or online",
              },
              {
                emoji: "🌱",
                label: "Personalised Plan",
                sub: "Tailored to your body",
              },
              {
                emoji: "🇨🇲",
                label: "Made in Cameroon",
                sub: "Bamileke · Beti · Fulbe",
              },
            ].map((f) => (
              <div key={f.label} className="text-center lg:text-left">
                <span className="text-xl">{f.emoji}</span>
                <p className="text-xs font-bold text-primary leading-tight mt-1">
                  {f.label}
                </p>
                <p className="text-[11px] text-foreground/50 font-medium mt-0.5">
                  {f.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT DOCTOR IMAGE ── */}
        <div className="flex-1 relative w-full max-w-md lg:max-w-none flex items-end justify-center">
          {/* Doctor photo container */}
          <div className="relative w-full max-w-sm lg:max-w-md aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-primary/10">
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
            <p className="font-black text-sm text-primary leading-tight">
              Pure African Botanicals
            </p>
            <p className="text-[11px] text-foreground/50 font-medium mt-0.5">
              Wild-harvested &amp; organic
            </p>
          </div>

          {/* Floating card — bottom left — Traditional + Modern */}
          <div className="absolute bottom-12 -left-4 lg:-left-10 bg-white/90 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-xl shadow-black/5 border border-primary/10 z-20 w-48 hover:-translate-y-1 transition-transform duration-500 delay-150">
            <span className="text-4xl leading-none block mb-2">⚕️</span>
            <p className="font-black text-sm text-primary leading-tight">
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
