"use client";

import { useTranslations } from "next-intl";
import { MeetDoctor } from "@/components/storefront/meet-doctor";
import { Features } from "@/components/storefront/features";
import { ProcessSection } from "@/components/storefront/process-section";
import { TrustBanner } from "@/components/storefront/trust-banner";
import { FaqSection } from "@/components/storefront/faq-section";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { Star } from "@/lib/icons";
import Image from "next/image";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80&auto=format&fit=crop",
];

const QUICK_FEATURES = [
  {
    emoji: "💬",
    label: "Book a Consultation",
    sub: "Douala clinic or online",
  },
  {
    emoji: "🌱",
    label: "Personalised Plan",
    sub: "Tailored to your body",
  },
  {
    emoji: "🇨🇲",
    label: "Made in Cameroon",
    sub: "Bamileke · Beti · Fulbe",
  },
];

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-700 pt-24 md:pt-32">
      {/* Header section with mission */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="space-y-6 text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight uppercase">
            {t("title")}
          </h1>
          <p className="text-lg text-foreground/60 font-medium leading-relaxed">
            {t("subtitle")}
          </p>
          
          {/* Social proof moved from Home */}
          <div className="flex flex-col items-center gap-4 pt-6 border-t border-black/5">
            <div className="flex -space-x-2">
              {AVATARS.map((src, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden ring-1 ring-primary/10 shadow-sm"
                >
                  <Image
                    src={src}
                    alt="Patient"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-[10px] font-black ring-1 ring-primary/10">
                +2.8k
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#f2c94c] text-[#f2c94c]"
                  />
                ))}
                <span className="ml-1 text-base font-black text-foreground">
                  4.9
                </span>
              </div>
              <p className="text-xs text-foreground/50 font-bold">
                Trusted by 2,800+ patients in Cameroon
              </p>
            </div>
          </div>
        </div>

        {/* Quick features moved from Home */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-20 border-b border-black/5">
          {QUICK_FEATURES.map((f) => (
            <div key={f.label} className="text-center space-y-2">
              <span className="text-4xl">{f.emoji}</span>
              <p className="text-sm font-black text-primary leading-tight">
                {f.label}
              </p>
              <p className="text-xs text-foreground/40 font-bold">
                {f.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Meet the Doctor - Detailed view */}
      <MeetDoctor />

      {/* Why Doctasimo - Feature grid */}
      <Features />

      {/* Our Process - Transparency */}
      <ProcessSection />

      {/* Trust Stats */}
      <TrustBanner />

      {/* Collections Overview */}
      <div className="py-20 bg-[#f5faf6]">
        <CategoryShowcase />
      </div>

      {/* FAQ - Common questions about our practice */}
      <div className="pb-20">
        <FaqSection />
      </div>
    </div>
  );
}
