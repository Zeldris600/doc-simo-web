"use client";

import * as React from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TESTIMONIALS = [
  {
    id: 1,
    content:
      "The Papaya Enzyme Extract has completely transformed my digestive health. As a nutritionist, I highly recommend Doctasimo for their clinical standards.",
    author: "Sarah Jenkins",
    role: "Clinical Nutritionist",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    content:
      "Finally, an organic brand that actually backs its claims with laboratory testing. The Ashwagandha is the most potent I've ever used.",
    author: "Dr. Mark Thompson",
    role: "Holistic Practitioner",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    content:
      "The sleep support bundle is a game changer. I've never felt more rested. The attention to detail in their clinical formulations is unmatched.",
    author: "Elena Rodriguez",
    role: "Wellness Coach",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
];

export function TestimonialSlider() {
  return (
    <section className="bg-white py-24 px-6 lg:px-12 overflow-hidden">
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase text-[#f2c94c] tracking-tight">
              Verified Results
            </p>
            <h2 className="text-4xl font-black text-black tracking-tight">
              Community Voices
            </h2>
          </div>

          <div className="relative w-full px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {TESTIMONIALS.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <div className="flex flex-col items-center space-y-8 min-h-[300px] justify-center text-center">
                      <div className="bg-[#f2c94c]/5 p-4 rounded-full">
                        <Quote className="w-10 h-10 text-[#f2c94c] fill-[#f2c94c]/10" />
                      </div>

                      <p className="text-2xl lg:text-3xl font-medium text-black leading-relaxed max-w-3xl">
                        &quot;{testimonial.content}&quot;
                      </p>

                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden grayscale">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <h4 className="font-black text-black text-lg">
                            {testimonial.author}
                          </h4>
                          <p className="text-sm text-gray-400 font-bold uppercase tracking-tight">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-[#f2c94c] text-[#f2c94c]"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-none bg-gray-50 hover:bg-white text-gray-400 hover:text-black transition-all" />
              <CarouselNext className="border-none bg-gray-50 hover:bg-white text-gray-400 hover:text-black transition-all" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
