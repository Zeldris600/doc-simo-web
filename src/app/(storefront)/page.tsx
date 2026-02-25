import { Hero } from "@/components/storefront/hero";
import { ProductGrid } from "@/components/storefront/product-grid";
import { TestimonialSlider } from "@/components/storefront/testimonial-slider";
import { Features } from "@/components/storefront/features";
import { MeetDoctor } from "@/components/storefront/meet-doctor";
import { AboutSection } from "@/components/storefront/about-section";
import { BlogPosts } from "@/components/storefront/blog-posts";
import { FaqSection } from "@/components/storefront/faq-section";
import { Newsletter } from "@/components/storefront/newsletter";

const PRODUCTS = [
  {
    id: "hbt-001",
    name: "Organic Ashwagandha Root Extract (1000mg)",
    price: 34.0,
    originalPrice: 40.0,
    rating: 4.8,
    reviewsCount: 142,
    imageSrc:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    category: "Stress Relief",
    isNew: true,
  },
  {
    id: "hbt-002",
    name: "Premium Hemp Extract Drops",
    price: 55.0,
    rating: 4.9,
    reviewsCount: 89,
    imageSrc:
      "https://images.unsplash.com/photo-1598263597405-eeb52243e8bb?q=80&w=1000&auto=format&fit=crop",
    category: "Wellness",
  },
  {
    id: "hbt-003",
    name: "Turmeric Curcumin with Black Pepper",
    price: 24.5,
    originalPrice: 28.0,
    rating: 4.6,
    reviewsCount: 312,
    imageSrc:
      "https://images.unsplash.com/photo-1624462615598-f2b7b51b2fc8?q=80&w=1000&auto=format&fit=crop",
    category: "Joint Health",
    isNew: false,
  },
  {
    id: "hbt-004",
    name: "Elderberry Immunity Gummies",
    price: 19.99,
    rating: 5.0,
    reviewsCount: 104,
    imageSrc:
      "https://images.unsplash.com/photo-1622484211148-7bf331d27993?q=80&w=1000&auto=format&fit=crop",
    category: "Immunity",
    isNew: true,
  },
];

const BEST_SELLERS = [
  {
    id: "bs-001",
    name: "Pure Papaya Enzyme Extract",
    price: 39.0,
    rating: 5.0,
    reviewsCount: 420,
    imageSrc:
      "https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=1000&auto=format&fit=crop",
    category: "Digestion",
  },
  {
    id: "bs-002",
    name: "Clinical Ginger Root Formula",
    price: 28.0,
    rating: 4.8,
    reviewsCount: 156,
    imageSrc:
      "https://images.unsplash.com/photo-1590233461234-a740439f0e13?q=80&w=1000&auto=format&fit=crop",
    category: "Inflammation",
  },
  {
    id: "bs-003",
    name: "Specialist Sleep Support Bundle",
    price: 89.0,
    originalPrice: 110.0,
    rating: 4.9,
    reviewsCount: 203,
    imageSrc:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1000&auto=format&fit=crop",
    category: "Sleep",
  },
  {
    id: "bs-004",
    name: "Vitality Papaya Seed Complex",
    price: 45.0,
    rating: 4.7,
    reviewsCount: 98,
    imageSrc:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
    category: "Vitality",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-y-16 pb-16">
      <Hero
        title="Botanical Excellence Redefined"
        subtitle="Experience clinical-grade papaya extracts and rare herbal formulations crafted by our specialist doctors for your holistic health."
        ctaText="Shop Collection"
      />

      <Features />

      <ProductGrid
        title="Best Sellers"
        subtitle="Our community's favorite herbal solutions for daily wellness."
        products={BEST_SELLERS}
        actionText="Shop Best Sellers"
      />

      <ProductGrid
        title="Clinical Selections"
        subtitle="Our most potent herbal extractions, verified by our medical specialists for purity and effect."
        products={PRODUCTS}
      />

      <MeetDoctor />

      <AboutSection />

      <BlogPosts />

      <FaqSection />

      <Newsletter />

      <TestimonialSlider />
    </div>
  );
}
