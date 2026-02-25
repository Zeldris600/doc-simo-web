import * as React from "react";
import { ProductCard, type Product } from "./product-card";
import { ArrowRight } from "lucide-react";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionUrl?: string;
  products: Product[];
}

export function ProductGrid({
  title,
  subtitle,
  actionText = "View All",
  actionUrl = "/products",
  products,
}: ProductGridProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-gray-500">{subtitle}</p>
            )}
          </div>
          {actionUrl && (
            <div className="mt-6 flex md:ml-4 md:mt-0">
              <a
                href={actionUrl}
                className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-bold uppercase text-white shadow-lg hover:shadow-primary/30 transition-all group hover:scale-105"
              >
                {actionText}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
