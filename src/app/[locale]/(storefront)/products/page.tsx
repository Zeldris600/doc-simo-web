"use client";

import * as React from "react";
import { ProductCard } from "@/components/storefront/product-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LayoutGrid, List, SlidersHorizontal, Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useProducts } from "@/hooks/use-product";
import { useCategories } from "@/hooks/use-category";
import { Input } from "@/components/ui/input";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { useTranslations } from "next-intl";

export default function ProductsPage() {
  const t = useTranslations("products");
  const [priceRange, setPriceRange] = React.useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 9;

  const { data: productsRes, isLoading: isLoadingProducts } = useProducts({
    category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
    search: searchQuery,
    page: currentPage,
    limit,
  });

  const { data: categoriesRes } = useCategories();
  const categories = categoriesRes?.data || [];
  const products = productsRes?.data || [];
  const total = productsRes?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
    setCurrentPage(1); // Reset to page 1 on filter
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-black/5">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tighter leading-none">
              {t("dispensary")}
            </h1>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search formulas by name or clinical property..." 
                className="pl-12 h-14 bg-white border-black/5 rounded-xl shadow-none focus:border-primary transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-black/30">
          <Link href="/" className="hover:text-primary transition-colors">{t("home")}</Link>
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
                <h3 className="text-[11px] font-black text-black uppercase tracking-[0.2em]">
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
                        checked={selectedCategories.includes(cat.id)}
                        onCheckedChange={() => handleCategoryToggle(cat.id)}
                        className="h-4 w-4 rounded-md border-black/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-xs font-bold text-black/60 group-hover:text-black transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-black/20">
                      {cat._count?.products || 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Registry */}
            <div className="space-y-6 pt-6 border-t border-black/5">
              <h3 className="text-[11px] font-black text-black uppercase tracking-[0.2em]">
                {t("price")} Registry (XAF)
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
              <div className="flex items-center justify-between font-black text-black gap-2">
                <div className="bg-black/[0.02] px-4 py-2 rounded-lg border border-black/5 flex-1 flex flex-col">
                  <span className="text-[9px] text-black/30 uppercase tracking-tighter">Min</span>
                  <span className="text-xs">{priceRange[0].toLocaleString()} XAF</span>
                </div>
                <div className="bg-black/[0.02] px-4 py-2 rounded-lg border border-black/5 flex-1 flex flex-col items-end">
                  <span className="text-[9px] text-black/30 uppercase tracking-tighter">Max</span>
                  <span className="text-xs">{priceRange[1].toLocaleString()} XAF</span>
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
                  <button className="p-2 rounded-lg bg-white text-primary">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-black/40 hover:text-black transition-colors">
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-bold text-black/40 ml-2">
                  {total} {t("units")} cataloged
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black px-5 py-3 bg-black/[0.02] rounded-xl border border-black/5 outline-none transition-all">
                  Sort: Optimized <ChevronDown className="w-3 h-3 text-primary" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-black/5 p-1 bg-white shadow-2xl shadow-black/5">
                  <DropdownMenuItem className="text-xs font-bold p-3 rounded-lg focus:bg-primary/5 focus:text-primary">
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs font-bold p-3 rounded-lg focus:bg-primary/5 focus:text-primary">
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs font-bold p-3 rounded-lg focus:bg-primary/5 focus:text-primary">
                    Latest Formulations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <p className="text-xs text-black/40 font-medium">Try adjusting your clinical filters.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange([0, 50000]);
                    setSelectedCategories([]);
                  }}
                  className="mt-6 text-[10px] font-bold text-primary tracking-widest hover:underline"
                >
                  Clear All Registries
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Logic */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-6">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="text-[10px] font-black tracking-widest text-black/20 hover:text-black transition-colors disabled:opacity-5 underline-offset-4 hover:underline"
                >
                  Prev Sheet
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-xs font-black transition-all ${
                        currentPage === i + 1 
                          ? "bg-primary text-white" 
                          : "bg-black/[0.02] border border-black/5 text-black/40 hover:bg-black/5"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="text-[10px] font-black tracking-widest text-black/20 hover:text-black transition-colors disabled:opacity-5 underline-offset-4 hover:underline"
                >
                  Next Sheet
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
