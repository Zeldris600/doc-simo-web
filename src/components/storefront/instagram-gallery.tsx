import Image from "next/image";
import { Instagram } from "lucide-react";

const GALLERY_IMAGES = [
 {
 src: "https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=600&auto=format&fit=crop",
 alt: "Fresh papaya fruits",
 },
 {
 src: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
 alt: "Herbal supplements",
 },
 {
 src: "https://images.unsplash.com/photo-1598263597405-eeb52243e8bb?q=80&w=600&auto=format&fit=crop",
 alt: "Hemp extract drops",
 },
 {
 src: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600&auto=format&fit=crop",
 alt: "Natural ingredients",
 },
 {
 src: "https://images.unsplash.com/photo-1590233461234-a740439f0e13?q=80&w=600&auto=format&fit=crop",
 alt: "Ginger root",
 },
 {
 src: "https://images.unsplash.com/photo-1622484211148-7bf331d27993?q=80&w=600&auto=format&fit=crop",
 alt: "Elderberry products",
 },
];

export function InstagramGallery() {
 return (
 <section className="py-20 bg-white">
 <div className="text-center mb-12 px-6 space-y-3">
 <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#f2c94c] tracking-tight">
 <Instagram className="w-4 h-4" />
 Follow @doctasime
 </div>
 <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
 Join our community
 </h2>
 <p className="text-sm text-gray-500 max-w-md mx-auto font-medium">
 See how our community integrates Doctasime into their daily wellness
 routines.
 </p>
 </div>

 <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
 {GALLERY_IMAGES.map((image, index) => (
 <a
 key={index}
 href="https://instagram.com"
 target="_blank"
 rel="noopener noreferrer"
 className="relative aspect-square overflow-hidden group"
 >
 <Image
 src={image.src}
 alt={image.alt}
 fill
 className="object-cover transition-transform duration-500 group-hover:scale-110"
 />
 {/* Hover overlay */}
 <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
 <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 </div>
 </a>
 ))}
 </div>
 </section>
 );
}
