"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "@/lib/icons";
import { useCategories } from "@/hooks/use-category";
import { useTranslations } from "next-intl";
import { CategorySkeleton } from "@/components/skeletons/category-skeleton";

export function CategoryShowcase() {
  const t = useTranslations("categoryShowcase");
  const { data: categoriesRes, isLoading } = useCategories({ limit: 4 });
  const categories = categoriesRes?.data || [];

  return (
    <section className="px-6 py-24 lg:px-12 bg-transparent relative overflow-hidden">
      {/* Soft medical background layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/composition-notebook-stethoscope.jpg"
          alt="Natural clinical selection"
          fill
          className="object-cover opacity-[0.1] scale-105"
        />
        {/* Soft elegant gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/80 to-secondary/10" />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 tracking-[0.1em] uppercase">
            {t("label")}
          </span>
          <h2 className="text-xl md:text-2xl font-black text-[#173b27] tracking-tighter leading-none">
            {t("title")}
          </h2>
          <p className="text-base text-[#173b27]/80 max-w-lg mx-auto font-medium leading-relaxed">
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
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-primary/[0.02] transition-all duration-500 hover:-translate-y-2"
              >
                <Image
                  src={
                    category.image ||
                    "https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-115"
                />

                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a11]/95 via-[#0a1a11]/40 to-transparent opacity-80 transition-opacity duration-500" />

                <div className="absolute inset-x-0 bottom-0 p-8 pt-20 flex flex-col gap-3 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-white/80 font-black tracking-[0.2em] uppercase">
                      {t("node")}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white tracking-tight leading-tight group-hover:scale-105 transition-transform origin-left">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/70 font-medium line-clamp-1 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-white text-[10px] font-black tracking-widest mt-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 uppercase">
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
