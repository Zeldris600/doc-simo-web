import * as React from "react";
import { ProductCard } from "./product-card";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/api";
import { Link } from "@/i18n/routing";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
interface ProductGridProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionUrl?: string;
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({
  title,
  subtitle,
  actionText = "View All",
  actionUrl = "/products",
  products,
  isLoading,
}: ProductGridProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="max-w-2xl">
            <h2 className="text-xl md:text-3xl font-black tracking-tighter text-primary">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-sm font-medium text-foreground/60 max-w-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {actionUrl && (
            <div className="mt-6 flex md:ml-4 md:mt-0">
              <Link
                href={actionUrl}
                className="inline-flex items-center text-xs font-black tracking-widest text-primary hover:opacity-70 transition-all group uppercase"
              >
                {actionText}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
