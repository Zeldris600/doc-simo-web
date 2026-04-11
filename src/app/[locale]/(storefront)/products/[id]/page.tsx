"use client";

import { Link } from "@/i18n/routing";
import {
  ShoppingBag,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
  Play,
  Leaf,
  PackageCheck,
} from "@/lib/icons";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/use-product";
import { useReviewStats } from "@/hooks/use-product-reviews";
import { StarRatingDisplay } from "@/components/storefront/star-rating-display";
import { ProductReviewsSection } from "@/components/storefront/product-reviews-section";
import { useCreateOrder } from "@/hooks/use-order";
import { useInitiatePayment } from "@/hooks/use-payment";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ProductDetailsSkeleton } from "@/components/skeletons/product-details-skeleton";

export default function ProductDetailsPage() {
  const t = useTranslations("products");
  const tRev = useTranslations("reviews");
  const { id } = useParams() as { id: string };
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: reviewStats } = useReviewStats(id);
  const [selectedMedia, setSelectedMedia] = useState({
    type: "image",
    index: 0,
  });
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();
  const { addItem } = useCart();

  const initiatePayment = useInitiatePayment({
    onSuccess: (res) => {
      window.location.href = res.link;
    },
    onError: () => {
      toast.error("Failed to initiate payment.");
    },
  });

  const createOrder = useCreateOrder({
    onSuccess: (order) => {
      initiatePayment.mutate({
        orderId: order.id,
        data: {
          email: session?.user?.email || "customer@doctasimo.com",
          redirectUrl: `${window.location.origin}/account/orders?status=SUCCESSFUL`,
        },
      });
    },
  });

  const handleOrder = () => {
    if (!session) {
      toast.error("Please login to place an order");
      return;
    }
    createOrder.mutate({
      items: [{ productId: id, quantity }],
    });
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} added to cart`);
    }
  };

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <AlertCircle className="h-16 w-16 text-black/10" />
        <div className="text-center">
          <h2 className="text-xl font-black text-black mb-2">
            Product Not Found
          </h2>
          <p className="text-sm text-black/40 font-medium">
            The requested product could not be retrieved from our collection.
          </p>
        </div>
        <Link href="/products">
          <Button size="lg" className="font-bold">
            Return to products
          </Button>
        </Link>
      </div>
    );
  }

  const media = [
    ...(product.images || []).map((url) => ({ type: "image", url })),
    ...(product.videos || []).map((url) => ({ type: "video", url })),
    ...(product.image && !product.images?.includes(product.image)
      ? [{ type: "image", url: product.image }]
      : []),
  ];

  if (media.length === 0)
    media.push({ type: "image", url: "/placeholder.png" });

  const currentMedia = media[selectedMedia.index] || media[0];

  const averageRating =
    reviewStats?.averageRating !== undefined
      ? reviewStats.averageRating
      : (product.averageRating ?? null);
  const reviewCount =
    reviewStats?.reviewCount ?? product.reviewCount ?? 0;

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      <div className="container mx-auto max-w-6xl px-4 py-4 md:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-4 text-sm font-bold text-black/40 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("home")}
          </Link>
          <span className="text-black/10">/</span>
          <Link
            href="/products"
            className="hover:text-primary transition-colors"
          >
            {t("dispensary")}
          </Link>
          <span className="text-black/10">/</span>
          <span className="text-black/80">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Media Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-black/[0.01] border border-black/5 shadow-2xl shadow-black/5">
              {currentMedia.type === "video" ? (
                <video
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <Image
                  src={currentMedia.url}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-1000 hover:scale-110"
                  priority
                />
              )}

              <div className="absolute top-8 left-8 flex flex-col gap-3">
                {product.isHot && (
                  <Badge className="bg-orange-500 text-white rounded-full px-5 py-1.5 text-xs font-bold border-none shadow-lg shadow-orange-500/20">
                    High Demand
                  </Badge>
                )}
                {product.isPromotion && (
                  <Badge className="bg-primary text-white rounded-full px-5 py-1.5 text-xs font-bold border-none shadow-lg shadow-primary/20">
                    Botanical Offer
                  </Badge>
                )}
              </div>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-8 right-8 p-5 rounded-3xl bg-white/80 backdrop-blur-xl hover:bg-white transition-all border border-black/5 shadow-xl active:scale-90 group"
              >
                <Heart
                  className={`h-6 w-6 transition-all duration-500 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-black/20 group-hover:text-black/40"}`}
                />
              </button>
            </div>

            {media.length > 1 && (
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {media.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setSelectedMedia({
                        type: m.type as "image" | "video",
                        index: idx,
                      })
                    }
                    className={`relative w-28 h-28 shrink-0 rounded-[28px] overflow-hidden border-2 transition-all snap-start ${
                      selectedMedia.index === idx
                        ? "border-primary scale-95 shadow-lg shadow-primary/10"
                        : "border-transparent opacity-40 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    {m.type === "video" ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white opacity-40" />
                      </div>
                    ) : (
                      <Image
                        src={m.url}
                        alt={`${product.name} formula view ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-6 flex flex-col gap-6 py-2">
            {/* ── Category + Rating ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <Badge className="bg-[#f5faf6] text-primary rounded-full px-4 py-1.5 text-[11px] font-bold border border-primary/10">
                🌿 {product.category?.name || t("generalRegistry")}
              </Badge>
              <div className="flex items-center gap-1.5">
                <StarRatingDisplay value={averageRating} />
                <span className="text-xs font-bold text-primary ml-1 tabular-nums">
                  {averageRating != null
                    ? Number(averageRating).toFixed(1)
                    : "—"}
                </span>
                <span className="text-[11px] text-black/30 font-medium">
                  ({tRev("count", { count: reviewCount })})
                </span>
              </div>
            </div>

            {/* ── Name ── */}
            <h1 className="text-2xl md:text-3xl font-black text-primary leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* ── Stock status ── */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${product.inventoryLevel && product.inventoryLevel > 0 ? "bg-emerald-500" : "bg-red-400"}`}
              />
              <span className="text-xs font-bold text-black/50 uppercase tracking-wider">
                {product.inventoryLevel && product.inventoryLevel > 0
                  ? `In Stock — ${product.inventoryLevel} ${t("units")} available`
                  : "Out of Stock — Restocking Active"}
              </span>
            </div>

            {/* ── Price ── */}
            <div className="flex items-baseline gap-3 bg-[#f5faf6] rounded-2xl px-5 py-4 border border-primary/8">
              <span className="text-3xl font-black text-primary">
                {Number(product.price).toLocaleString()}
              </span>
              <span className="text-sm font-black text-primary/40 uppercase tracking-widest">
                {product.currency || "XAF"}
              </span>
              {product.isPromotion && (
                <span className="text-sm text-black/25 line-through font-medium ml-1">
                  {(Number(product.price) * 1.2).toLocaleString()} XAF
                </span>
              )}
              {product.isPromotion && (
                <span className="ml-auto text-[10px] font-black bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  20% OFF
                </span>
              )}
            </div>

            {/* ── Short description ── */}
            <p className="text-sm text-black/60 font-medium leading-relaxed">
              {product.description}
            </p>

            {/* ── Delivery hint ── */}
            <div className="flex items-start gap-3 bg-[#f5faf6] rounded-xl px-4 py-3 border border-primary/8">
              <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs font-medium text-black/60 leading-relaxed">
                <span className="font-black text-primary">Fast delivery:</span>{" "}
                2–4 days within Cameroon · 5–8 days across Africa · 7–14 days
                international
              </div>
            </div>

            {/* ── Quantity + Actions ── */}
            <div className="space-y-3">
              {/* Quantity selector */}
              <div className="inline-flex items-center border border-black/10 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-11 w-11 flex items-center justify-center text-black/30 hover:text-primary hover:bg-primary/5 transition-all active:scale-90 disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-black text-primary border-x border-black/10 h-11 flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-11 w-11 flex items-center justify-center text-black/30 hover:text-primary hover:bg-primary/5 transition-all active:scale-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Buy + Cart buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  onClick={handleOrder}
                  disabled={
                    createOrder.isPending ||
                      initiatePayment.isPending ||
                    (product.inventoryLevel !== undefined &&
                      product.inventoryLevel === 0)
                  }
                  className="gap-2 font-bold bg-primary hover:bg-[#142c1b] rounded-xl h-12 shadow-lg shadow-primary/20"
                >
                  {createOrder.isPending || initiatePayment.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                  {createOrder.isPending
                    ? "Processing…"
                    : initiatePayment.isPending
                      ? "Connecting…"
                    : "Buy Now"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={
                    product.inventoryLevel !== undefined &&
                    product.inventoryLevel === 0
                  }
                  className="gap-2 font-bold rounded-xl h-12 border-primary/20 text-primary hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-black/30 hover:text-black gap-2 text-xs"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share this product
                </Button>
              </div>
            </div>

            {/* ── Trust strip ── */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-black/5">
              {[
                {
                  icon: ShieldCheck,
                  label: "Secure payment",
                  sub: "256-bit SSL",
                },
                { icon: PackageCheck, label: "Authentic", sub: "Lab verified" },
                { icon: RotateCcw, label: "Easy returns", sub: "7-day policy" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-[#f5faf6] hover:bg-[#eaf2e8] transition-colors"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-black text-primary leading-tight">
                      {label}
                    </p>
                    <p className="text-[10px] text-black/35 font-medium">
                      {sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Herbal credentials strip ── */}
            <div className="flex flex-wrap gap-2">
              {[
                { emoji: "🌿", text: "100% Organic" },
                { emoji: "🧪", text: "Lab Tested" },
                { emoji: "🌍", text: "African Botanicals" },
                { emoji: "⚕️", text: "Clinically Guided" },
              ].map((t) => (
                <span
                  key={t.text}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-white border border-primary/10 text-primary/70 rounded-full px-3 py-1.5"
                >
                  <span>{t.emoji}</span>
                  {t.text}
                </span>
              ))}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-3 py-1.5 border transition-colors ${isFavorite ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-black/10 text-black/40 hover:text-red-400"}`}
              >
                <Heart
                  className={`h-3 w-3 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? "Saved" : "Wishlist"}
              </button>
            </div>

            {/* ── Product accordion ── */}
            <div className="pt-2 border-t border-black/5">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem
                  value="description"
                  className="border-b border-black/5"
                >
                  <AccordionTrigger className="text-sm font-bold hover:no-underline py-4 hover:text-primary transition-colors">
                    Full Description
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-black/60 leading-relaxed font-medium pb-4 space-y-2">
                    <div className="flex gap-2 items-start">
                      <Leaf className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <p>{product.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="usage"
                  className="border-b border-black/5"
                >
                  <AccordionTrigger className="text-sm font-bold hover:no-underline py-4 hover:text-primary transition-colors">
                    Usage &amp; Directions
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-black/60 leading-relaxed font-medium pb-4 space-y-3">
                    <p>
                      <span className="font-bold text-primary">
                        Directions:{" "}
                      </span>
                      {t("protocolDesc")}
                    </p>
                    <p>
                      <span className="font-bold text-primary">
                        Composition:{" "}
                      </span>
                      High-potency organic extract — specialist-grade botanical
                      essence, wild-harvested &amp; clinically processed.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="delivery" className="border-none">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline py-4 hover:text-primary transition-colors">
                    Delivery &amp; Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-black/60 leading-relaxed font-medium pb-4 space-y-2">
                    <p>
                      <span className="font-bold text-primary">
                        Inbound (Cameroon):{" "}
                      </span>
                      2–4 business days — Yaoundé, Douala, Bafoussam &amp; all
                      regions.
                    </p>
                    <p>
                      <span className="font-bold text-primary">Africa: </span>
                      5–8 business days — Nigeria, Côte d&apos;Ivoire, Senegal,
                      Gabon, Congo &amp; more.
                    </p>
                    <p>
                      <span className="font-bold text-primary">
                        International:{" "}
                      </span>
                      7–14 business days — Europe, USA, Canada &amp; beyond.
                    </p>
                    <p className="pt-1">
                      <span className="font-bold text-primary">Returns: </span>
                      7-day return policy on unopened items. Contact support
                      within 7 days of receipt.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <ProductReviewsSection
          productId={product.id}
          productReviewCount={product.reviewCount}
          productAverageRating={product.averageRating}
        />
      </div>
    </div>
  );
}
