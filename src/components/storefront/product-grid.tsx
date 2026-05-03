import * as React from "react";
import { ProductCard } from "./product-card";
import { ArrowRight } from "@/lib/icons";
import { Product } from "@/types/api";
import { Link } from "@/i18n/routing";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionUrl?: string;
  products: Product[];
  isLoading?: boolean;
  className?: string;
}

export function ProductGrid({
  title,
  subtitle,
  actionText = "View All",
  actionUrl = "/products",
  products,
  isLoading,
  className,
}: ProductGridProps) {
  return (
    <section className={cn("py-8 sm:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-primary leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 text-sm font-medium text-foreground/50 max-w-lg leading-relaxed hidden md:block">
                {subtitle}
              </p>
            )}
          </div>
          {actionUrl && (
            <div className="flex shrink-0">
              <Link
                href={actionUrl}
                className="inline-flex items-center text-[10px] font-black tracking-widest text-primary hover:opacity-70 transition-all group uppercase bg-primary/5 px-4 py-2 rounded-full"
              >
                {actionText}
                <ArrowRight className="ml-1.5 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-12 no-scrollbar pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[200px] md:min-w-0">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-12 no-scrollbar pb-4">
            {products.map((product) => (
              <div key={product.id} className="min-w-[200px] md:min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
