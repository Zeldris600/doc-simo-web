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
  Play
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { useCart } from "@/store/use-cart";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ProductDetailsSkeleton } from "@/components/skeletons/product-details-skeleton";

export default function ProductDetailsPage() {
  const t = useTranslations("products");
  const { id } = useParams() as { id: string };
  const { data: product, isLoading, isError } = useProduct(id);
  const [selectedMedia, setSelectedMedia] = useState({ type: 'image', index: 0 });
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();
  const createOrder = useCreateOrder();
  const { addItem } = useCart();

  const handleOrder = () => {
    if (!session) {
      toast.error("Please login to place an order");
      return;
    }
    createOrder.mutate({
      items: [{ productId: id, quantity }]
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
          <h2 className="text-xl font-black text-black mb-2">Formula Not Found</h2>
          <p className="text-sm text-black/40 font-medium">The requested clinical entry could not be retrieved from our local registry.</p>
        </div>
        <Link 
          href="/products" 
          className="px-8 py-3 bg-primary text-white text-xs font-bold tracking-widest rounded-xl"
        >
          Return to dispensary
        </Link>
      </div>
    );
  }

  const media = [
    ...(product.images || []).map(url => ({ type: 'image', url })),
    ...(product.videos || []).map(url => ({ type: 'video', url })),
    ...(product.image && !product.images?.includes(product.image) ? [{ type: 'image', url: product.image }] : [])
  ];

  if (media.length === 0) media.push({ type: 'image', url: "/placeholder.png" });

  const currentMedia = media[selectedMedia.index] || media[0];
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-xs font-bold tracking-tight text-black/30 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">{t("home")}</Link>
          <span className="text-black/10">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">{t("dispensary")}</Link>
          <span className="text-black/10">/</span>
          <span className="text-black text-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Media Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-black/[0.02] border border-black/5">
              {currentMedia.type === 'video' ? (
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
                  className="object-cover transition-all duration-700 hover:scale-105"
                  priority
                />
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isHot && (
                  <div className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-tight">
                    Hot badge
                  </div>
                )}
                {product.isPromotion && (
                  <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-tight">
                    Special offer
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white transition-all border border-black/5"
              >
                <Heart className={`h-5 w-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-black/40"}`} />
              </button>
            </div>
            
            {media.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {media.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMedia({ type: m.type as 'image' | 'video', index: idx })}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedMedia.index === idx ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {m.type === 'video' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white opacity-50" />
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
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-lg bg-black/5 text-black/40 text-sm font-bold tracking-tight">
                  {t("category")}: {product.category?.name || t("generalRegistry")}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-xs font-black">4.9</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-black mb-4 tracking-tighter leading-[1.1]">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-8">
                <div className={`w-2 h-2 rounded-full ${product.inventoryLevel && product.inventoryLevel > 0 ? "bg-primary animate-pulse" : "bg-black/20"}`} />
                <span className="text-sm font-bold tracking-tight text-black/60">
                  {product.inventoryLevel && product.inventoryLevel > 0 
                    ? `${t("inventoryAvailable")} (${product.inventoryLevel} ${t("units")})` 
                    : t("inventoryRestocking")}
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black text-black">
                  {Number(product.price).toLocaleString()} <span className="text-sm font-bold text-black/40">{product.currency || "XAF"}</span>
                </span>
                {product.isPromotion && (
                  <span className="text-lg text-black/20 line-through font-bold">
                    {(Number(product.price) * 1.2).toLocaleString()} {product.currency || "XAF"}
                  </span>
                )}
              </div>

              <p className="text-lg text-black/50 font-medium leading-[1.8] mb-10">
                {product.description}
              </p>
            </div>

            {/* User Interaction */}
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-black/[0.03] rounded-2xl p-1 border border-black/5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3.5 text-black/40 hover:text-black transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-black text-black">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3.5 text-black/20 hover:text-black transition-colors"
                  >
                    <Plus className="h-4 w-4 text-primary" />
                  </button>
                </div>
                
                <Button 
                  onClick={handleOrder}
                  disabled={createOrder.isPending || (product.inventoryLevel !== undefined && product.inventoryLevel === 0)}
                  className="flex-1 h-14 rounded-2xl text-sm font-bold tracking-tight bg-primary hover:bg-primary/90 transition-all gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                  {createOrder.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingBag className="h-5 w-5" />
                  )}
                  {createOrder.isPending ? t("processing") : t("initiateOrder")}
                </Button>

                <Button 
                  variant="outline"
                  onClick={handleAddToCart}
                  disabled={product.inventoryLevel !== undefined && product.inventoryLevel === 0}
                  className="flex-1 h-14 rounded-2xl text-sm font-bold tracking-tight border-primary text-primary hover:bg-primary/5 transition-all gap-3 active:scale-[0.98]"
                >
                  {t("addToCart")}
                </Button>
                
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-black/5 hover:bg-black/[0.02] transition-all">
                  <Share2 className="h-5 w-5 text-black/40" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-black/5">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-black/[0.02] transition-colors hover:bg-black/[0.04]">
                  <ShieldCheck className="h-6 w-6 text-primary mb-3" />
                  <span className="text-sm font-bold tracking-tight text-black/40">{t("secureRepository")}</span>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-black/[0.02] transition-colors hover:bg-black/[0.04]">
                  <Truck className="h-6 w-6 text-primary mb-3" />
                  <span className="text-sm font-bold tracking-tight text-black/40">{t("clinicalLogistics")}</span>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-black/[0.02] transition-colors hover:bg-black/[0.04]">
                  <RotateCcw className="h-6 w-6 text-primary mb-3" />
                  <span className="text-sm font-bold tracking-tight text-black/40">{t("registryPolicy")}</span>
                </div>
              </div>
            </div>

            {/* Clinical Specifications */}
            <div className="mt-8 border-t border-black/5 pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-none">
                  <AccordionTrigger className="text-base font-bold tracking-tight hover:no-underline py-6">{t("registryDetails")}</AccordionTrigger>
                  <AccordionContent className="text-base text-black/50 leading-relaxed font-medium pb-8 pl-4 border-l-2 border-primary/20">
                    {product.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-none">
                  <AccordionTrigger className="text-base font-bold tracking-tight hover:no-underline py-6">{t("protocol")}</AccordionTrigger>
                  <AccordionContent className="space-y-6 pb-8 pl-4 border-l-2 border-primary/20">
                    <div>
                      <h4 className="text-base font-bold text-black tracking-tight mb-2">{t("recommendedProtocol")}</h4>
                      <p className="text-base text-black/50 font-medium leading-relaxed">{t("protocolDesc")}</p>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-black tracking-tight mb-2">{t("activeComponents")}</h4>
                      <p className="text-base text-black/50 font-medium leading-relaxed">{t("componentsDesc")}</p>
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