"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ShoppingBag, ArrowRight, Flame } from "lucide-react";
import { Product } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProductsProps {
  products: Product[];
  isLoading?: boolean;
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[520px]">
      <Skeleton className="lg:col-span-3 rounded-3xl bg-black/5 h-full" />
      <div className="lg:col-span-2 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="flex-1 rounded-2xl bg-black/5" />
        ))}
      </div>
    </div>
  );
}

function price(p: Product) {
  return `${Number(p.price).toLocaleString()} XAF`;
}

function thumb(p: Product) {
  return p.images?.[0] || p.image || "/forest-bg.jpg";
}

export function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  const [hero, ...rest] = products;
  const side = rest.slice(0, 3);

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-20 bg-white">
      <div className="container max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
              🌿 Dr. Simo&apos;s Personal Selection
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight leading-tight">
              Signature Remedies
            </h2>
            <p className="text-sm text-foreground/50 font-medium max-w-sm">
              Hand-picked from our clinic dispensary — the formulations our patients ask for most.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-black text-primary hover:opacity-70 transition-all group uppercase tracking-widest shrink-0"
          >
            Browse all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <FeaturedSkeleton />
        ) : products.length === 0 ? null : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* ── HERO PRODUCT ── */}
            {hero && (
              <Link
                href={`/products/${hero.id}`}
                className="group lg:col-span-3 relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[480px] bg-primary/5 block"
              >
                <Image
                  src={thumb(hero)}
                  alt={hero.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Badge */}
                {hero.isHot && (
                  <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-[#f2c94c] text-[#142c1b] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Flame className="w-3 h-3 fill-current" />
                    Best Seller
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-7 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {hero.category?.name || "Signature Formula"}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {hero.name}
                  </h3>
                  <p className="text-sm text-white/70 font-medium leading-relaxed line-clamp-2 max-w-md">
                    {hero.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-black text-white">
                      {price(hero)}
                    </span>
                    <div className="flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full text-xs font-black group-hover:bg-[#f2c94c] group-hover:text-[#142c1b] transition-colors">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Order Now
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* ── SIDE PRODUCTS ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {side.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group flex gap-4 bg-[#f5faf6] hover:bg-[#eaf2e8] rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5 flex-1 min-h-[140px]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0 ring-1 ring-black/5">
                    <Image
                      src={thumb(p)}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="96px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                        {p.category?.name || "Formula"}
                      </p>
                      <h4 className="text-sm font-black text-primary leading-tight line-clamp-2 group-hover:underline underline-offset-2">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-foreground/50 font-medium leading-relaxed line-clamp-1">
                        {p.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-primary">{price(p)}</span>
                      <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                        Shop →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Browse all — mobile CTA inside panel */}
              <Link
                href="/products"
                className="sm:hidden flex items-center justify-center gap-2 text-xs font-black text-primary border-2 border-primary/20 rounded-2xl py-4 hover:bg-primary/5 transition-colors"
              >
                Browse all products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
