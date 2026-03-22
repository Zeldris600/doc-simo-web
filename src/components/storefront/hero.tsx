import * as React from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";
import Image from "next/image";

import { Product } from "@/types/api";
import { HeroSkeleton } from "@/components/skeletons/hero-skeleton";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  imageAlt?: string;
  product?: Product;
  isLoading?: boolean;
}

export function Hero({
  title,
  subtitle,
  ctaText = "Explore Our Products",
  ctaLink = "/products",
  imageSrc = "/forest-bg.jpg",
  imageAlt = "Premium Papaya plant and products",
  product,
  isLoading,
}: HeroProps) {
  if (isLoading) return <HeroSkeleton />;
  const displayImage = product?.images?.[0] || product?.image || imageSrc;
  const displayName = product?.name || "Papaya Pure";
  const displayDesc = product?.categoryId
    ? "Clinical formulation"
    : "Essential clinical extract";

  return (
    <div className="relative w-full min-h-[850px] flex items-center overflow-hidden bg-white">
      {/* Soft medical background layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/forest-bg.jpg"
          alt="Natural forest background - clinical botanical excellence"
          fill
          className="object-cover opacity-[0.9] scale-105"
          priority
        />
        {/* Soft elegant gradient from white to very subtle green/gray to enhance the medical look */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/40 to-secondary/10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl text-center lg:text-left space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            Clinical specialist selection
          </div>
          <h1 className="text-4xl text-primary sm:text-6xl font-black leading-[1.05] text-balance tracking-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-foreground/80 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4">
            <Link
              href={ctaLink}
              className="rounded-full bg-primary px-6 py-3 md:px-10 md:py-4 text-xs md:text-sm font-bold text-white hover:bg-[#142c1b] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {ctaText}
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-primary/20 px-6 py-3 md:px-10 md:py-4 text-xs md:text-sm font-bold text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right Product Image Area */}
        <div className="flex-1 relative w-full h-[450px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
          {/* Main image container */}
          <div className="relative w-[70%] md:w-[50%] lg:w-[65%] max-w-sm lg:max-w-md aspect-[3/4] z-10 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/40 ring-1 ring-white/60">
            <Image
              src={displayImage}
              alt={product?.name || imageAlt}
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-white text-3xl font-black leading-tight tracking-tight">
                {displayName}
                <br />
                <span className="text-emerald-300 text-sm font-bold tracking-normal">
                  {displayDesc}
                </span>
              </p>
            </div>
          </div>

          {/* Floating Info Cards - Glassmorphism */}
          <div className="absolute top-[10%] right-0 lg:-right-8 bg-white/70 backdrop-blur-lg px-8 py-8 rounded-3xl border border-white/60 z-20 w-52 transition-transform hover:-translate-y-2 duration-500">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-black text-xs text-primary mb-1">Purity</h4>
            <p className="font-extrabold text-xl leading-tight text-foreground">
              100% Organic
            </p>
          </div>

          <div className="absolute bottom-[10%] left-0 lg:-left-12 bg-white/70 backdrop-blur-lg px-8 py-8 rounded-3xl border border-white/60 z-20 w-56 transition-transform hover:-translate-y-2 duration-500 delay-100">
            <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <span className="text-emerald-600 text-lg font-bold">✓</span>
            </div>
            <h4 className="font-black text-xs text-emerald-600 mb-1">
              Standard
            </h4>
            <p className="font-extrabold text-xl leading-tight text-foreground">
              Verified clinical
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
