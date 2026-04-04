"use client";

import * as React from "react";
import { Play, X, Clock, Eye } from "lucide-react";
import Image from "next/image";

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  category: string;
  duration: string;
  views: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: "1",
    youtubeId: "0_H84t1SWZ4",
    title: "Moringa: Africa's Miracle Tree & Its Healing Powers",
    category: "African Botanicals",
    duration: "12:34",
    views: "248K",
  },
  {
    id: "2",
    youtubeId: "gqvqlMtKKKA",
    title: "Natural Antiviral Herbs Used in Traditional African Medicine",
    category: "Antiviral Remedies",
    duration: "18:22",
    views: "132K",
  },
  {
    id: "3",
    youtubeId: "nSnSb4EFKRQ",
    title: "Bitter Leaf & Neem — The Herbal Duo Against Infections",
    category: "Immune Support",
    duration: "9:47",
    views: "95K",
  },
  {
    id: "4",
    youtubeId: "YVH0gLmQFqI",
    title: "Baobab: The Superfood of the African Savanna",
    category: "Nutrition & Wellness",
    duration: "14:10",
    views: "310K",
  },
  {
    id: "5",
    youtubeId: "3zFH6u_5X2A",
    title: "How Herbal Extracts Are Clinically Formulated",
    category: "Clinic Insights",
    duration: "21:05",
    views: "78K",
  },
  {
    id: "6",
    youtubeId: "RdnI7tECx8c",
    title: "Dr. Simo on Integrating African Herbs into Modern Medicine",
    category: "Expert Talk",
    duration: "28:44",
    views: "56K",
  },
];

function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function HealthVideos() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const active = VIDEOS.find((v) => v.id === activeId);

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-20 bg-[#f5faf6]">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
            🎥 Doctasimo Health Channel
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
            Watch &amp; Learn
          </h2>
          <p className="text-sm text-foreground/50 font-medium max-w-md mx-auto leading-relaxed">
            Expert videos on African herbal medicine, antiviral remedies, and
            clinical wellness — straight from our doctors and researchers.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEOS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveId(v.id)}
              className="group text-left bg-white rounded-3xl overflow-hidden border border-black/5 hover:shadow-lg hover:shadow-black/8 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={ytThumb(v.youtubeId)}
                  alt={v.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {v.duration}
                </div>
                {/* Category */}
                <div className="absolute top-3 left-3 bg-[#f2c94c] text-[#142c1b] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {v.category}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-2">
                <h3 className="text-sm font-black text-primary leading-snug line-clamp-2 group-hover:text-primary/80 transition-colors">
                  {v.title}
                </h3>
                <div className="flex items-center gap-4 text-[11px] text-foreground/40 font-medium">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {v.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {v.duration}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setActiveId(null)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1`}
              title={active.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <button
            onClick={() => setActiveId(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
