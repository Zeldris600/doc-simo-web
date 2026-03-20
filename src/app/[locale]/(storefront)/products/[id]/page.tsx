"use client";

import { Link } from "@/i18n/routing";
import {
  Star,
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
} from "lucide-react";
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
import { useCreateOrder } from "@/hooks/use-order";
import { useInitiatePayment } from "@/hooks/use-payment";
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ProductDetailsSkeleton } from "@/components/skeletons/product-details-skeleton";

export default function ProductDetailsPage() {
  const t = useTranslations("products");
  const { id } = useParams() as { id: string };
  const { data: product, isLoading, isError } = useProduct(id);
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
      toast.error("Failed to initiate clinical payment.");
    },
  });

  const createOrder = useCreateOrder({
    onSuccess: (order) => {
      initiatePayment.mutate({
        orderId: order.id,
        data: {
          email: session?.user?.email || "customer@doctasimo.com",
          redirectUrl: `${window.location.origin}/orders/${order.id}/success`,
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

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700">
      <div className="container mx-auto max-w-6xl px-4 py-4 md:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/40 mb-8">
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
          <div className="lg:col-span-6 flex flex-col py-2">
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between">
                <Badge className="bg-black/5 text-black/60 rounded-full px-5 py-2 text-xs font-bold border-none">
                  {product.category?.name || t("generalRegistry")}
                </Badge>
                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-bold text-primary">
                    4.9 Specialist Rating
                  </span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-black leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                  {product.inventoryLevel && product.inventoryLevel > 0
                    ? `In Stock: ${product.inventoryLevel} ${t("units")} Available`
                    : "Currently Out of Stock: Restocking Active"}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-black">
                  {Number(product.price).toLocaleString()}
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary tracking-widest uppercase">
                    {product.currency || "XAF"}
                  </span>
                  {product.isPromotion && (
                    <span className="text-sm text-black/10 line-through font-black leading-none mt-1">
                      {(Number(product.price) * 1.2).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-black/60 font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interaction Matrix */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-black/[0.02] border border-black/5 rounded-xl p-1 transition-all hover:bg-black/[0.03]">
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 flex items-center justify-center text-black/20 hover:text-black transition-all active:scale-90"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-lg font-bold text-black">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 flex items-center justify-center text-black/20 hover:text-black transition-all active:scale-95"
                    >
                      <Plus className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                  <span className="text-[9px] font-bold text-black/20 uppercase tracking-widest pr-4">
                    Batch quantity
                  </span>
                </div>

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
                    className="gap-2 font-bold"
                  >
                    {createOrder.isPending || initiatePayment.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                    {createOrder.isPending
                      ? "Processing..."
                      : initiatePayment.isPending
                        ? "Connecting to payment..."
                        : "Initiate Checkout"}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={
                      product.inventoryLevel !== undefined &&
                      product.inventoryLevel === 0
                    }
                    className="gap-2 font-bold"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black/40 hover:text-black gap-2"
                  >
                    <Share2 className="h-4 w-4" /> Share Collection
                  </Button>
                </div>
              </div>

              {/* Specialist Trust Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-black/5">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group hover:bg-primary transition-all">
                    <ShieldCheck className="h-6 w-6 group-hover:text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-black/60">
                    Purchase Secure
                  </span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Truck className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold text-black/60">
                    Local Delivery
                  </span>
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <RotateCcw className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold text-black/60">
                    Return Policy
                  </span>
                </div>
              </div>
            </div>

            {/* Product Documentation */}
            <div className="mt-12 pt-8 border-t border-black/5">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-none mb-4">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline py-6 data-[state=open]:text-primary transition-colors">
                    Product Description
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-black/60 leading-relaxed font-medium pb-8 pl-6 border-l-2 border-primary/20 bg-black/[0.01] rounded-b-3xl mt-2 p-6">
                    {product.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-none">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline py-6 data-[state=open]:text-primary transition-colors">
                    Usage & Details
                  </AccordionTrigger>
                  <AccordionContent className="space-y-8 pb-10 pl-6 border-l-2 border-primary/20 bg-black/[0.01] rounded-b-3xl mt-2 p-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-black">
                        Directions
                      </h4>
                      <p className="text-base text-black/60 font-medium leading-relaxed">
                        {t("protocolDesc")}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-black">
                        Composition
                      </h4>
                      <p className="text-base text-black/60 font-medium leading-relaxed">
                        High-potency organic extract concentration. Primary
                        active components: specialist-grade botanical essence.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
