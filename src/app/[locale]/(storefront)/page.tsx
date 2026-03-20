"use client";

import { Hero } from "@/components/storefront/hero";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Features } from "@/components/storefront/features";
import { MeetDoctor } from "@/components/storefront/meet-doctor";
import { AboutSection } from "@/components/storefront/about-section";
import { BlogPosts } from "@/components/storefront/blog-posts";
import { FaqSection } from "@/components/storefront/faq-section";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { TrustBanner } from "@/components/storefront/trust-banner";
import { ProcessSection } from "@/components/storefront/process-section";
import { useProducts } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { Category } from "@/types/api";
export default function HomePage() {
  // Fetch real data for storefront sections
  const { data: hotProductsRes, isLoading: isLoadingHot } = useProducts({
    isHot: true,
    limit: 6,
  });

  const { data: promotionProductsRes, isLoading: isLoadingPromo } = useProducts({
    isPromotion: true,
    limit: 6,
  });

  const { data: categoriesRes, isLoading: isLoadingCats } = useCategories();

  const hotProducts = hotProductsRes?.data || [];
  const promotionProducts = promotionProductsRes?.data || [];
  const categories = categoriesRes?.data || [];

  return (
    <div className="flex flex-col pb-0">
      {/* 1. Hero — First impression with CTA */}
      <Hero 
        title="Botanical Excellence" 
        subtitle="Specialized herbal formulations designed for physiological optimization and clinical-grade wellness."
        product={promotionProducts[0]}
        isLoading={isLoadingPromo}
      />

      {/* 2. Trust Features — Immediate credibility (organic, lab-tested, free shipping) */}
      <Features />

      {/* 3. Category Showcase — Let users browse by interest */}
      <CategoryShowcase />

      {/* 4. Recommended Formulations — What's currently trending in clinic */}
      <ProductGrid
        title="Recommended products"
        subtitle="Our most sought-after botanical formulations, selected by leading specialists."
        products={hotProducts}
        actionText="View all"
        actionUrl="/products"
        isLoading={isLoadingHot}
      />

      <PromoBanner />

      {/* Dynamic Category sections */}
      {!isLoadingCats && categories.map((category) => (
        <CategoryProductRow key={category.id} category={category} />
      ))}

      <PromoBanner />

      {/* 8. Process — How it's made (transparency & trust) */}
      <ProcessSection />

      {/* 9. Meet the Doctor — Human connection & authority */}
      <MeetDoctor />

      {/* 10. Trust Banner — Stats & social proof numbers */}
      <TrustBanner />

      {/* 11. About Section — Brand story */}
      <AboutSection />



      {/* 14. Blog Posts — Thought leadership */}
      <BlogPosts />

      {/* 15. FAQ — Address concerns */}
      <FaqSection />

    </div>
  );
}

function CategoryProductRow({ category }: { category: Category }) {
  const { data: res, isLoading } = useProducts({ category: category.slug, limit: 6 });
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
