import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

export function PromoBanner() {
 return (
 <section className="px-6 lg:px-12 py-4">
 <div className="container max-w-7xl mx-auto">
 <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary to-emerald-800">
 {/* Background Image */}
 <div className="absolute inset-0 opacity-10">
 <Image
 src="https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=2000&auto=format&fit=crop"
 alt="Background"
 fill
 className="object-cover"
 />
 </div>

 <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-8 md:px-14 py-12 md:py-16">
 {/* Left */}
 <div className="space-y-4 text-center lg:text-left max-w-xl">
 <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold text-[#f2c94c]">
 <Sparkles className="w-3.5 h-3.5" />
 Limited time offer
 </div>
 <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">
 Get your first clinical wellness box at 30% off
 </h2>
 <p className="text-sm text-white/70 font-medium leading-relaxed">
 Curated by our specialist doctors — includes a personalized selection of
 our premium papaya extract, immunity booster, and stress-relief formulation.
 </p>
 <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
 <Link
 href="/products"
 className="inline-flex items-center gap-2 bg-[#f2c94c] text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#f2c94c]/90 transition-all"
 >
 Claim your box
 <ArrowRight className="w-4 h-4" />
 </Link>
 <div className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
 <Clock className="w-3.5 h-3.5" />
 Offer ends in 48 hours
 </div>
 </div>
 </div>

 {/* Right - Decorative price/badge */}
 <div className="hidden md:flex flex-col items-center justify-center">
 <div className="relative w-40 h-40 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
 <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
 <span className="text-[10px] text-white/60 font-bold">Save up to</span>
 <span className="text-3xl font-bold text-[#f2c94c]">30%</span>
 <span className="text-[10px] text-white/60 font-bold">First order</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
}
