"use client";

import * as React from "react";
import { ProductCard } from "@/components/storefront/product-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useProducts } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { useTranslations } from "next-intl";

export default function ProductsPage() {
  const t = useTranslations("products");
  const [priceRange, setPriceRange] = React.useState([0, 50000]);
  const [selectedCategorySlug, setSelectedCategorySlug] = React.useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const limit = 9;

  const { data: productsRes, isLoading: isLoadingProducts } = useProducts({
    category: selectedCategorySlug || undefined,
    search: searchQuery,
    page: currentPage,
    limit,
  });

  const { data: categoriesRes } = useCategories();
  const categories = categoriesRes?.data || [];
  const products = productsRes?.data || [];
  const total = productsRes?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategorySlug((prev) =>
      prev === categorySlug ? null : categorySlug,
    );
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategorySlug, priceRange]);

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32">
      {/* Search Header */}
      <div className="bg-white border-b border-black/5">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-black mb-3">
              {t("dispensary")}
            </h1>
            <div className="relative group">
              <DebouncedInput
                className="max-w-xl h-10 bg-black/[0.02] border-transparent rounded-lg shadow-none focus:border-primary/20 transition-all font-medium pl-6 text-sm"
                placeholder="Search products..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-medium text-black/30">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("home")}
          </Link>
          <span className="mx-4 text-black/10">/</span>
          <span className="text-black">{t("dispensary")}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-12 shrink-0">
            {/* Classification */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-black  ">
                  {t("category")}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-transparent hover:border-black/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={cat.id}
                        checked={selectedCategorySlug === cat.slug}
                        onCheckedChange={() => handleCategoryToggle(cat.slug)}
                        className="h-4 w-4 rounded-md border-black/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-xs font-bold text-black group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-black/40">
                      {cat._count?.products || 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Registry */}
            <div className="space-y-6 pt-6 border-t border-black/5">
              <h3 className="text-sm font-semibold text-black">
                {t("price")} Range (XAF)
              </h3>
              <div className="px-1">
                <Slider
                  defaultValue={[0, 50000]}
                  max={50000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>
              <div className="flex items-center justify-between font-bold text-black gap-2">
                <div className="flex-1 flex flex-col">
                  <span className="text-[9px] text-black/30 font-medium">
                    Min
                  </span>
                  <span className="text-xs">
                    {priceRange[0].toLocaleString()} XAF
                  </span>
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <span className="text-[9px] text-black/30 font-medium">
                    Max
                  </span>
                  <span className="text-xs">
                    {priceRange[1].toLocaleString()} XAF
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 p-1 bg-black/[0.05] rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-black/40 hover:text-black"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-black/40 hover:text-black"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-bold text-black/60 ml-2">
                  {total} {t("units")} cataloged
                </p>
              </div>

              {/* Top Pagination Control */}
              {totalPages > 1 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-black/5 bg-white text-black/60 disabled:opacity-20 hover:text-black transition-all"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[10px] font-bold text-black px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-black/5 bg-white text-black/60 disabled:opacity-20 hover:text-black transition-all"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Grid */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: limit }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-black/[0.01] rounded-2xl border border-dashed border-black/10">
                <Search className="h-10 w-10 text-black/10 mb-4" />
                <h3 className="font-bold text-black mb-1">No formulas found</h3>
                <p className="text-xs text-black/60 font-medium">
                  Try adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange([0, 50000]);
                    setSelectedCategorySlug(null);
                  }}
                  className="mt-6 text-xs font-bold text-primary hover:underline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                    : "flex flex-col gap-8"
                }
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination Logic */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="text-xs font-semibold text-black/60 hover:text-black transition-colors disabled:opacity-5 underline-offset-4 hover:underline"
                >
                  Prev Page
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-primary text-white"
                          : "bg-black/[0.1] border border-black/5 text-black/60 hover:bg-black/20"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="text-xs font-semibold text-black/60 hover:text-black transition-colors disabled:opacity-5 underline-offset-4 hover:underline"
                >
                  Next Page
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
