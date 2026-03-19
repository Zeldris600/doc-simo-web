import * as React from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Star, Heart, ShoppingBag, Flame, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("products");
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white border border-black/5 transition-all duration-300 hover:border-primary/20">
      {/* Visual Workspace */}
      <div className="relative aspect-square overflow-hidden bg-black/[0.02]">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isHot && (
            <div className="bg-orange-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Flame className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-bold tracking-tight uppercase">{t("hot")}</span>
            </div>
          )}
          {product.isPromotion && (
            <div className="bg-primary text-white px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Zap className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-bold tracking-tight uppercase">{t("special")}</span>
            </div>
          )}
          {product.inventoryLevel === 0 && (
            <div className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg flex items-center gap-1">
              <span className="text-[10px] font-bold tracking-tight uppercase">{t("outOfStock")}</span>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 z-10 p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-black/40 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-black/5">
          <Heart className="h-4 w-4" />
        </button>

        {/* Product Image */}
        <Link
          href={`/products/${product.id}`}
          className="block w-full h-full"
        >
          <Image
            src={product.images?.[0] || product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Quick Interaction Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link href={`/products/${product.id}`} className="w-full bg-primary text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
            <ShoppingBag className="h-3.5 w-3.5" />
            {t("viewSpecs")}
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-black/30 tracking-widest uppercase">
            {product.category?.name || t("generalRegistry")}
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-bold text-black">4.9</span>
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-black line-clamp-1 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-black/40 line-clamp-2 mb-4 font-medium leading-relaxed">
          {product.description}
        </p>

        {/* Price Registry */}
        <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-black">
              {Number(product.price).toLocaleString()} <span className="text-[10px]">XAF</span>
            </span>
            {product.isPromotion && (
              <span className="text-xs text-black/20 line-through font-medium">
                {(Number(product.price) * 1.2).toLocaleString()} XAF
              </span>
            )}
          </div>
          <Link 
            href={`/products/${product.id}`}
            className="text-xs font-bold text-primary hover:underline underline-offset-4 uppercase tracking-tighter"
          >
            {t("viewSpecs")}
          </Link>
        </div>
      </div>
    </div>
  );
}

