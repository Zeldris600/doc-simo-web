import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  imageSrc: string;
  category: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg bg-white transition-all duration-300">
      {/* Badges - clean and rectangular */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-primary px-3 py-1 text-[10px] uppercase font-bold text-white rounded">
            New
          </span>
        )}
        {discount > 0 && (
          <span className="bg-destructive px-3 py-1 text-[10px] uppercase font-bold text-white rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button className="absolute top-3 right-3 z-10 p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart className="h-4 w-4" />
      </button>

      {/* Image Container - Flat */}
      <Link
        href={`/products/${product.id}`}
        className="block relative aspect-[1/1] overflow-hidden bg-muted/20"
      >
        <Image
          src={product.imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-primary text-white px-6 py-2 text-xs font-bold uppercase transition-colors rounded-full hover:bg-primary/90">
            Quick Add
          </button>
        </div>
      </Link>

      {/* Content - Minimal spacing */}
      <div className="py-4 flex flex-col flex-grow px-2">
        <div className="text-[10px] text-muted-foreground mb-1 uppercase font-bold">
          {product.category}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-foreground line-clamp-1 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price - Simple line */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground/60 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating - very small and subtle */}
        <div className="flex items-center gap-0.5 mt-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(product.rating)
                  ? "fill-[#f2c94c] text-[#f2c94c]"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="text-[10px] text-muted-foreground ml-2">
            {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
}
