"use client";

import { Hero } from "@/components/storefront/hero";
import { LogosStrip } from "@/components/storefront/logos-strip";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { MeetDoctor } from "@/components/storefront/meet-doctor";
import { VideoSection } from "@/components/storefront/video-section";
import { Features } from "@/components/storefront/features";
import { CustomerReviews } from "@/components/storefront/customer-reviews";
import { ProcessSection } from "@/components/storefront/process-section";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { ProductGrid } from "@/components/storefront/product-grid";
import { DiscountSection } from "@/components/storefront/discount-section";
import { TrustBanner } from "@/components/storefront/trust-banner";
import { HealthVideos } from "@/components/storefront/health-videos";
import { FaqSection } from "@/components/storefront/faq-section";
import { useProducts } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { useBlogPosts } from "@/hooks/use-blog";
import { Category } from "@/types/api";

export default function HomePage() {
  const { data: blogList, isLoading: isLoadingBlog } = useBlogPosts({
    page: 1,
    limit: 12,
  });
  const blogPosts = blogList?.data ?? [];

  const { data: hotProductsRes, isLoading: isLoadingHot } = useProducts({
    isHot: true,
    limit: 6,
  });
  const { data: promotionProductsRes, isLoading: isLoadingPromo } = useProducts(
    { isPromotion: true, limit: 6 },
  );
  const { data: categoriesRes, isLoading: isLoadingCats } = useCategories();

  const hotProducts = hotProductsRes?.data || [];
  const promotionProducts = promotionProductsRes?.data || [];
  const categories = categoriesRes?.data || [];

  return (
    <div className="flex flex-col pb-0">
      {/* 1. Hero — Clinic-first, full-screen impression */}
      <Hero />

      {/* 2. Trust logos — African herbal traditions */}
      <LogosStrip />

      {/* 3. Featured Products — Prominent product advertising */}
      <FeaturedProducts
        products={promotionProducts}
        isLoading={isLoadingPromo}
      />

      {/* 4. Meet the Doctor — Human authority & connection */}
      <MeetDoctor />

      {/* 5. Featured blog video / story */}
      <VideoSection posts={blogPosts} isLoading={isLoadingBlog} />

      {/* 5. Why Doctasimo — 6-feature trust grid */}
      <Features />

      {/* 6. Customer Reviews — Social proof grid */}
      <CustomerReviews />

      {/* 7. Process — Transparency (soil to supplement) */}
      <ProcessSection />

      {/* 8. Discount — Coupon code offer */}
      <DiscountSection />

      {/* 9. Category Showcase — Browse by need */}
      <CategoryShowcase />

      {/* 10. Hot Products — Clinic-recommended formulations */}
      <ProductGrid
        title="Clinic-Recommended Formulations"
        subtitle="Our most sought-after botanical formulations, hand-selected by Dr. Simo's medical team."
        products={hotProducts}
        actionText="Browse All Products"
        actionUrl="/products"
        isLoading={isLoadingHot}
      />

      {/* 11. Dynamic Category product rows */}
      {!isLoadingCats &&
        categories.map((category) => (
          <CategoryProductRow key={category.id} category={category} />
        ))}

      {/* 12. Stats Banner */}
      <TrustBanner />

      {/* 13. Blog highlights (replaces static video grid) */}
      <HealthVideos posts={blogPosts} isLoading={isLoadingBlog} />

      {/* 15. FAQ */}
      <FaqSection />
    </div>
  );
}

function CategoryProductRow({ category }: { category: Category }) {
  const { data: res, isLoading } = useProducts({
    category: category.slug,
    limit: 6,
  });
  const products = res?.data || [];

  if (!isLoading && products.length === 0) return null;

  return (
    <ProductGrid
      title={category.name}
      subtitle={category.description}
      products={products}
      actionText={`Explore ${category.name}`}
      actionUrl={`/products?category=${category.slug}`}
      isLoading={isLoading}
    />
  );
}
