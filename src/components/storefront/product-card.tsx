"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Star, Heart, ShoppingBag, Flame, Zap } from "@/lib/icons";
import { Product } from "@/types/api";
import { Button } from "@/components/ui/button";
import { StarRatingDisplay } from "@/components/storefront/star-rating-display";
import { useFavouriteIds } from "@/hooks/use-favourites";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { toggle, isFavourite } = useFavouriteIds();
  const saved = isFavourite(product.id);

  const ratingBlock =
    product.reviewCount != null &&
    product.reviewCount > 0 &&
    product.averageRating != null ? (
      <div className="flex items-center gap-1.5">
        <StarRatingDisplay
          value={product.averageRating}
          starClassName="h-3 w-3"
        />
        <span className="text-xs font-bold text-primary tabular-nums">
          {Number(product.averageRating).toFixed(1)}
        </span>
        <span className="text-[10px] text-black/40 font-medium">
          ({product.reviewCount})
        </span>
      </div>
    ) : null;

  if (layout === "list") {
    return (
      <div className="group relative flex flex-col md:flex-row gap-6 overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
        {/* Visual Workspace */}
        <div className="relative aspect-square md:w-64 shrink-0 overflow-hidden rounded-2xl bg-primary/[0.02]">
          <Link
            href={`/products/${product.id}`}
            className="block w-full h-full"
          >
            <Image
              src={product.images?.[0] || product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, 256px"
            />
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); toggle(product.id); }}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-xl backdrop-blur-md transition-all border border-black/5 opacity-0 group-hover:opacity-100 ${
              saved ? "bg-red-50 text-red-500" : "bg-white/80 text-foreground/40 hover:text-red-500 hover:bg-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Product Information */}
        <div className="flex flex-col flex-grow py-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">
              {product.category?.name || "General Catalog"}
            </span>
            {ratingBlock ?? (
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs font-bold text-primary">
                  Specialist Grade
                </span>
              </div>
            )}
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="text-2xl font-black text-primary mb-3 transition-colors underline-offset-4 group-hover:underline">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-foreground/60 line-clamp-3 mb-8 leading-relaxed max-w-2xl font-medium">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-8 pt-6 border-t border-black/5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary">
                {Number(product.price).toLocaleString()}{" "}
                <span className="text-xs font-bold text-primary/40">XAF</span>
              </span>
              {product.isPromotion && (
                <span className="text-lg text-foreground/20 line-through font-medium">
                  {(Number(product.price) * 1.2).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 text-[11px] font-black tracking-widest uppercase transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                asChild
              >
                <Link href={`/products/${product.id}`}>Details</Link>
              </Button>
              <Button className="rounded-full h-11 px-8 text-[11px] font-black tracking-widest uppercase bg-primary text-white hover:bg-[#142c1b] transition-all">
                Reserve now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/40 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
      {/* Visual Workspace */}
      <div className="relative aspect-square overflow-hidden bg-[#f5faf6]">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isHot && (
            <div className="bg-primary text-white border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shadow-primary/10">
              <Flame className="h-3 w-3 fill-current" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                Best Seller
              </span>
            </div>
          )}
          {product.isPromotion && (
            <div className="bg-emerald-500 text-white border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shadow-emerald-500/10">
              <Zap className="h-3 w-3 fill-current" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                Clinical Offer
              </span>
            </div>
          )}
          {product.inventoryLevel === 0 && (
            <div className="bg-foreground/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider">
                Restocking
              </span>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          className={`absolute top-4 right-4 z-10 p-3 rounded-2xl backdrop-blur-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-black/5 ${
            saved ? "bg-red-50 text-red-500" : "bg-white/70 text-primary/40 hover:text-red-500 hover:bg-white"
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>

        {/* Product Image */}
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={product.images?.[0] || product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-contain transition-all duration-700 group-hover:scale-105 p-4"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-primary/30">
            {product.category?.name || "General Catalog"}
          </span>
          {ratingBlock ? (
            <div className="flex items-center gap-1 shrink-0">{ratingBlock}</div>
          ) : (
            <div className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-primary text-primary" />
              <span className="text-[10px] font-black text-primary">
                SPECIALIST
              </span>
            </div>
          )}
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-black text-primary line-clamp-1 mb-1 hover:underline underline-offset-4 transition-all tracking-tight">
            {product.name}
          </h3>
        </Link>

        <p className="text-[11px] text-foreground/50 line-clamp-1 mb-4 leading-relaxed font-medium">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-black/5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] font-black text-primary">
              {Number(product.price).toLocaleString()}
            </span>
            <span className="text-[9px] font-black text-primary/30 tracking-tight">
              XAF
            </span>
            {product.isPromotion && (
              <span className="text-[11px] text-foreground/20 line-through font-medium ml-1">
                {(Number(product.price) * 1.2).toLocaleString()}
              </span>
            )}
          </div>
          <Link
            href={`/products/${product.id}`}
            className="p-2.5 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
