import Image from "next/image";
import { Star } from "lucide-react";

const IMAGE_TESTIMONIALS = [
 {
 id: 1,
 content: "My skin has never looked this radiant. The papaya enzyme is a miracle worker!",
 author: "Sarah Jenkins",
 role: "Clinical Nutritionist",
 rating: 5,
 image:
 "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
 },
 {
 id: 2,
 content: "25 years of practice and this is the best herbal brand I've recommended.",
 author: "Dr. Mark Thompson",
 role: "Holistic Practitioner",
 rating: 5,
 image:
 "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop",
 },
 {
 id: 3,
 content: "I start every morning with their Ashwagandha. Completely changed my energy levels.",
 author: "Elena Rodriguez",
 role: "Wellness Coach",
 rating: 5,
 image:
 "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
 },
 {
 id: 4,
 content: "The sleep bundle is incredible. Best rest I've had in years.",
 author: "James Okafor",
 role: "Retired Athlete",
 rating: 5,
 image:
 "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
 },
];

export function ImageTestimonials() {
 return (
 <section className="py-20 px-6 lg:px-12 bg-white">
 <div className="container max-w-7xl mx-auto">
 <div className="text-center mb-14 space-y-3">
 <p className="text-xs font-bold text-[#f2c94c] tracking-tight">
 Real people, real results
 </p>
 <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
 Faces of wellness
 </h2>
 <p className="text-sm text-gray-500 max-w-lg mx-auto font-medium">
 Meet the people behind our five-star reviews.
 </p>
 </div>

 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {IMAGE_TESTIMONIALS.map((t) => (
 <div
 key={t.id}
 className="group relative aspect-[3/4] rounded-lg overflow-hidden"
 >
 <Image
 src={t.image}
 alt={t.author}
 fill
 className="object-cover transition-transform duration-700 group-hover:scale-105"
 />
 {/* Dark gradient overlay */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

 {/* Content at bottom */}
 <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-2">
 {/* Stars */}
 <div className="flex items-center gap-0.5">
 {Array.from({ length: t.rating }).map((_, i) => (
 <Star
 key={i}
 className="w-3 h-3 fill-[#f2c94c] text-[#f2c94c]"
 />
 ))}
 </div>

 {/* Quote */}
 <p className="text-xs text-white/90 font-medium leading-relaxed line-clamp-3">
 &quot;{t.content}&quot;
 </p>

 {/* Author */}
 <div className="pt-1">
 <p className="text-xs font-bold text-white">{t.author}</p>
 <p className="text-[10px] text-white/60 font-medium">
 {t.role}
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
