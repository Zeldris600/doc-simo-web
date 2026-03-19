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
    <div className="relative w-full min-h-[850px] flex items-center overflow-hidden bg-primary pt-16">
      {/* Deep Background pattern/image layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/forest-bg.jpg" // Large forest background
          alt="Papaya leaves background"
          fill
          className="object-cover opacity-[0.05] grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary/50" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl text-center lg:text-left space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f2c94c]/10 text-[#f2c94c] text-xs font-bold tracking-tight">
            Clinical specialist selection
          </div>
          <h1 className="text-6xl text-white sm:text-8xl font-black leading-[1.05] text-balance tracking-tight">
            {title}
          </h1>
          <p className="text-sm md:text-base lg:text-xl text-white/80 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4">
            <Link
              href={ctaLink}
              className="rounded-full bg-white px-10 py-5 text-sm font-bold text-primary hover:scale-105 active:scale-95 border border-primary/10"
            >
              {ctaText}
            </Link>
            <Link
              href="/about"
              className="rounded-full border-2 border-white px-10 py-5 text-sm font-bold text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right Product Image Area */}
        <div className="flex-1 relative w-full h-[450px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
          {/* Main image container */}
          <div className="relative w-[70%] md:w-[50%] lg:w-[65%] max-w-sm lg:max-w-md aspect-[3/4] z-10 rounded-xl overflow-hidden border border-white/10">
            <Image
              src={displayImage}
              alt={product?.name || imageAlt}
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-10 left-10 right-10">
              <p className="text-white text-3xl font-black leading-tight tracking-tight">
                {displayName}
                <br />
                <span className="text-[#f2c94c] text-sm font-bold tracking-normal">
                  {displayDesc}
                </span>
              </p>
            </div>
          </div>

          {/* Floating Info Cards */}
          <div className="absolute top-[10%] right-0 lg:-right-8 bg-white/90 px-8 py-8 rounded-xl z-20 w-52 transition-transform">
            <div className="bg-[#f2c94c]/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5 text-[#f2c94c]" />
            </div>
            <h4 className="font-black text-xs text-[#f2c94c] mb-1">Purity</h4>
            <p className="font-extrabold text-xl leading-tight text-black">
              100% Organic
            </p>
          </div>

          <div className="absolute bottom-[10%] left-0 lg:-left-12 bg-white/90 px-8 py-8 rounded-xl z-20 w-56 transition-transform">
            <div className="bg-yellow-400/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <span className="text-yellow-600 text-lg font-bold">✓</span>
            </div>
            <h4 className="font-black text-xs text-yellow-600 mb-1">
              Standard
            </h4>
            <p className="font-extrabold text-xl leading-tight text-black">
              Verified pure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
