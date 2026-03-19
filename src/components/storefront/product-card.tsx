import * as React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Star, Heart, ShoppingBag, Flame, Zap } from "lucide-react";
import { Product } from "@/types/api";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {

  if (layout === "list") {
    return (
      <div className="group relative flex flex-col md:flex-row gap-8 overflow-hidden rounded-2xl bg-white border border-black/5 p-6 transition-all duration-300 hover:border-primary/20">
        {/* Visual Workspace */}
        <div className="relative aspect-square md:w-64 shrink-0 overflow-hidden rounded-xl bg-black/[0.02]">
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            <Image
              src={product.images?.[0] || product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, 256px"
            />
          </Link>
          <button className="absolute top-3 right-3 z-10 p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-black/60 hover:text-red-500 hover:bg-white transition-all border border-black/5 opacity-0 group-hover:opacity-100">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Product Information */}
        <div className="flex flex-col flex-grow py-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-black/60">
              {product.category?.name || "General Catalog"}
            </span>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-bold text-black">4.9 Specialist Rating</span>
            </div>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-black/70 line-clamp-3 mb-8 leading-relaxed max-w-2xl">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-8 pt-6 border-t border-black/5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-black">
                {Number(product.price).toLocaleString()} <span className="text-sm font-semibold">XAF</span>
              </span>
              {product.isPromotion && (
                <span className="text-lg text-black/20 line-through font-medium">
                  {(Number(product.price) * 1.2).toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="outline"
                className="rounded-xl h-12 px-6 text-xs font-bold transition-all hover:bg-black/5"
                asChild
              >
                <Link href={`/products/${product.id}`}>View details</Link>
              </Button>
              <Button 
                className="rounded-xl h-12 px-8 text-xs font-bold bg-black text-white hover:bg-black/90 transition-all font-bold"
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-white border border-black/5 transition-all duration-300 hover:border-primary/20">
      {/* Visual Workspace */}
      <div className="relative aspect-square overflow-hidden bg-black/[0.01]">
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {product.isHot && (
            <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-500/20">
              <Flame className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-bold">Trending</span>
            </div>
          )}
          {product.isPromotion && (
            <div className="bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/20">
              <Zap className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-bold">Offer</span>
            </div>
          )}
          {product.inventoryLevel === 0 && (
            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="text-[10px] font-bold">Out of stock</span>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-4 right-4 z-10 p-3 rounded-2xl bg-white/80 backdrop-blur-xl text-black/60 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-black/5 shadow-xl">
          <Heart className="h-4 w-4" />
        </button>

        {/* Product Image */}
        <Link
          href={`/products/${product.id}`}
          className="block w-full h-full p-6"
        >
          <Image
            src={product.images?.[0] || product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 p-8"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-black/50">
            {product.category?.name || "General Catalog"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-[11px] font-bold text-black">4.9 Specialist</span>
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-bold text-black line-clamp-1 mb-2 hover:text-primary transition-all">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-black/60 line-clamp-2 mb-6 leading-relaxed font-medium">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5 border-t border-black/5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-black">
              {Number(product.price).toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold text-black/40">XAF</span>
            {product.isPromotion && (
              <span className="text-xs text-black/10 line-through font-medium ml-1">
                {(Number(product.price) * 1.2).toLocaleString()}
              </span>
            )}
          </div>
          <Link 
            href={`/products/${product.id}`}
            className="p-2.5 rounded-xl bg-black/[0.02] text-black hover:bg-black hover:text-white transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

