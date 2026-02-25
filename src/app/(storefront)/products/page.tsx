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
import { ChevronDown, LayoutGrid, List } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "stress", label: "Stress Relief (12)" },
  { id: "digestion", label: "Digestion (8)" },
  { id: "immunity", label: "Immunity (15)" },
  { id: "inflammation", label: "Inflammation (6)" },
  { id: "sleep", label: "Sleep Support (4)" },
];

const FEATURES = [
  { id: "organic", label: "100% Organic" },
  { id: "gmo", label: "Non-GMO" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten", label: "Gluten-Free" },
];

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
  },
];

export default function ProductsPage() {
  const [priceRange, setPriceRange] = React.useState([0, 200]);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-black">All Products</span>
        </nav>

        <h1 className="text-4xl font-black text-black mb-12 tracking-tight">
          All Products
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-10 shrink-0">
            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-lg font-black text-black uppercase tracking-tight">
                Categories
              </h3>
              <div className="space-y-4">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center space-x-3 group cursor-pointer"
                  >
                    <Checkbox
                      id={cat.id}
                      className="border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={cat.id}
                      className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors cursor-pointer"
                    >
                      {cat.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-black text-black uppercase tracking-tight">
                Price
              </h3>
              <div className="px-1">
                <Slider
                  defaultValue={[0, 200]}
                  max={500}
                  step={10}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-black">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-black text-black uppercase tracking-tight">
                Features
              </h3>
              <div className="space-y-4">
                {FEATURES.map((feat) => (
                  <div
                    key={feat.id}
                    className="flex items-center space-x-3 group cursor-pointer"
                  >
                    <Checkbox
                      id={feat.id}
                      className="border-gray-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={feat.id}
                      className="text-sm font-medium text-gray-500 group-hover:text-primary transition-colors cursor-pointer"
                    >
                      {feat.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg bg-gray-50 text-black shadow-sm">
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:text-black transition-colors">
                  <List className="w-5 h-5" />
                </button>
                <p className="text-sm font-medium text-gray-400 ml-2">
                  Showing 1-12 of 48 products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center ml-auto gap-2 text-sm font-bold text-black px-4 py-2 bg-gray-50 rounded-lg outline-none">
                    Sort by: Recommended <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-xl border-gray-100 shadow-xl">
                    <DropdownMenuItem className="font-medium text-sm">
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-medium text-sm">
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem className="font-medium text-sm">
                      Newest Arrivals
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {/* Duplicate for demo grid completeness */}
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id + "-copy"} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex items-center justify-center gap-4">
              <button className="px-6 py-3 rounded-full border border-gray-100 text-sm font-bold text-black hover:bg-gray-50 transition-all">
                Previous
              </button>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold">
                  1
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-50 text-sm font-bold text-black transition-all">
                  2
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-gray-50 text-sm font-bold text-black transition-all">
                  3
                </button>
              </div>
              <button className="px-6 py-3 rounded-full border border-gray-100 text-sm font-bold text-black hover:bg-gray-50 transition-all">
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
