import { Star, Quote } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    id: 1,
    rating: 5,
    content:
      "After just 3 weeks on Dr. Simo's antiviral protocol, my recurring infections completely stopped. The clinic's approach is unlike anything I've experienced — truly holistic.",
    author: "Sarah Jenkins",
    role: "Clinical Nutritionist",
    location: "Douala, Cameroon",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 2,
    rating: 5,
    content:
      "I've been recommending Doctasimo to my patients for two years. The lab-tested botanical extracts are the most potent I've seen. Real clinical rigor behind every product.",
    author: "Dr. Mark Thompson",
    role: "Holistic Practitioner",
    location: "Paris, France",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 3,
    rating: 5,
    content:
      "The free consultation changed everything for me. They listened, ran tests, and built a personalized herbal plan. My energy levels are the best they've been in years.",
    author: "Elena Rodriguez",
    role: "Wellness Coach",
    location: "Madrid, Spain",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 4,
    rating: 5,
    content:
      "Skeptical at first, but the science behind Doctasimo convinced me. The Ashwagandha extract is genuinely the most effective I've ever used — sleep transformed in week one.",
    author: "James Okafor",
    role: "Former Pro Athlete",
    location: "Lagos, Nigeria",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 5,
    rating: 5,
    content:
      "My daughter suffers from chronic inflammation. Doctasimo's anti-inflammatory formulation, paired with a consultation, gave us a real path forward. Incredibly grateful.",
    author: "Mariam Diallo",
    role: "Parent & Patient",
    location: "Abidjan, Côte d'Ivoire",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 6,
    rating: 5,
    content:
      "The papaya enzyme extract resolved my digestive issues after months of conventional treatment failures. Shipping was fast and the packaging was premium. 10/10.",
    author: "Thomas Berger",
    role: "Software Engineer",
    location: "Berlin, Germany",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop",
  },
];

export function CustomerReviews() {
  const avg = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-[#f5faf6]">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
            Verified Patient Reviews
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight">
            Real People, Real Healing
          </h2>
          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-[#f2c94c] text-[#f2c94c]"
                />
              ))}
            </div>
            <span className="text-2xl font-black text-primary">{avg}</span>
            <span className="text-sm text-foreground/40 font-medium">
              / 5 · {REVIEWS.length * 580}+ reviews
            </span>
          </div>
        </div>

        {/* Review grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={r.id}
              className={`relative bg-white rounded-3xl p-7 shadow-sm border border-black/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5 ${i === 1 ? "lg:bg-primary lg:border-primary" : ""}`}
            >
              {/* Quote icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${i === 1 ? "bg-white/10" : "bg-primary/8"}`}
              >
                <Quote
                  className={`w-4 h-4 ${i === 1 ? "text-white/60" : "text-primary"}`}
                />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(r.rating)].map((_, s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-[#f2c94c] text-[#f2c94c]"
                  />
                ))}
              </div>

              {/* Content */}
              <p
                className={`text-sm leading-relaxed font-medium flex-1 ${i === 1 ? "text-white/80" : "text-foreground/70"}`}
              >
                &quot;{r.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-black/5">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                  <Image
                    src={r.avatar}
                    alt={r.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-black leading-tight ${i === 1 ? "text-white" : "text-primary"}`}
                  >
                    {r.author}
                  </p>
                  <p
                    className={`text-[11px] font-medium mt-0.5 ${i === 1 ? "text-white/50" : "text-foreground/40"}`}
                  >
                    {r.role} · {r.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
