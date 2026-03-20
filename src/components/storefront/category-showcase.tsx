"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/hooks/use-category";
import { useTranslations } from "next-intl";
import { CategorySkeleton } from "@/components/skeletons/category-skeleton";

export function CategoryShowcase() {
  const t = useTranslations("categoryShowcase");
  const { data: categoriesRes, isLoading } = useCategories({ limit: 4 });
  const categories = categoriesRes?.data || [];

  return (
    <section className="px-6 py-20 lg:px-12 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-4">
          <span className="text-xs font-black text-primary tracking-[0.2em] uppercase">
            {t("label")}
          </span>
          <h2 className="text-xl md:text-3xl font-black text-black tracking-tighter">
            {t("title")}
          </h2>
          <p className="text-base text-black/40 max-w-lg mx-auto font-medium leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {isLoading ? (
          <CategorySkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/[0.02] border border-black/5"
              >
                <Image
                  src={
                    category.image ||
                    "https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-4 bg-primary/60" />
                    <span className="text-[10px] text-white/80 font-black tracking-widest uppercase">
                      {t("node")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/60 font-medium line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary text-xs font-black tracking-widest mt-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 uppercase">
                    {t("access")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
