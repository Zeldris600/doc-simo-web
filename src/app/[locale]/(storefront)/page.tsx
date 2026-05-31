"use client";

import { Hero } from "@/components/storefront/hero";
import { BlogPosts } from "@/components/storefront/blog-posts";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { ProductGrid } from "@/components/storefront/product-grid";
import { useProducts } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { Link } from "@/i18n/routing";
import { ShoppingBag, Heart, Play } from "@/lib/icons";

export default function HomePage() {
  const { data: hotProductsRes, isLoading: isLoadingHot } = useProducts({
    isHot: true,
    limit: 8,
  });
  const { data: promotionProductsRes, isLoading: isLoadingPromo } = useProducts(
    { isPromotion: true, limit: 6 },
  );
  const { data: categoriesRes, isLoading: isLoadingCats } = useCategories();

  const hotProducts = hotProductsRes?.data || [];
  const promotionProducts = promotionProductsRes?.data || [];
  const categories = categoriesRes?.data || [];

  return (
    <div className="flex flex-col pb-20 md:pb-0">
      {/* ── MOBILE HERO ── */}
      <section className="md:hidden pt-28  bg-white">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative w-full aspect-square max-w-sm overflow-hidden shadow-2xl shadow-black/5">
            <div className="">
              <h1 className="text-2xl font-semibold text-primary tracking-tight">
                DOCTASIMO
              </h1>
              <p className="text-lg text-primary font-medium">
                Natural Health Platform
              </p>
            </div>
            <img
              src="/doctor.png"
              alt="Dr. Simo"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-primary tracking-tight">
              Welcome to <span className="text-primary/70">Doctasimo</span>
            </h1>
            <p className="text-sm font-bold text-foreground/30">
              Your trusted naturopath
            </p>
          </div>

          {/* Quick Action Tabs */}
          <div className="grid grid-cols-3 w-full gap-2 px-5 pt-2">
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 py-3 bg-primary rounded-2xl active:scale-95 transition-all shadow-lg shadow-primary/10 border border-primary/10"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="text-[13px] font-bold text-white">Shop</span>
            </Link>
            <Link
              href="/consultation"
              className="flex items-center justify-center gap-2 py-3 bg-[#f5faf6] rounded-2xl border border-primary/5 active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-[13px] font-bold text-primary">
                Consult
              </span>
            </Link>
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 py-3 bg-[#f5faf6] rounded-2xl border border-primary/5 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 text-primary" />
              <span className="text-[13px] font-bold text-primary whitespace-nowrap">
                Videos
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DESKTOP HERO ── */}
      <div className="hidden md:block">
        <Hero />
      </div>

      {/* Popular Products */}
      <section className="py-12">
        <ProductGrid
          title="Popular Products"
          subtitle="Our most sought-after botanical formulations, hand-selected by Dr. Simo's medical team."
          products={hotProducts}
          actionText="View All"
          actionUrl="/products"
          isLoading={isLoadingHot}
        />
      </section>

      {/* Featured Products */}
      <FeaturedProducts
        products={promotionProducts}
        isLoading={isLoadingPromo}
      />

      {/* Categories */}
      <CategoryShowcase />

      {/* Latest Blog Posts / Health Insights */}
      <BlogPosts />

      {/* Simple CTA for Mobile */}
      <div className="md:hidden px-6 py-16">
        <div className="bg-primary rounded-[40px] p-10 text-center space-y-8 shadow-2xl shadow-primary/20">
          <h2 className="text-3xl font-semibold text-white tracking-tighter leading-tight">
            Ready to start your natural healing journey?
          </h2>
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center w-full bg-[#f2c94c] text-primary font-semibold py-4 rounded-2xl active:scale-95 transition-all shadow-lg uppercase tracking-widest text-xs"
          >
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
