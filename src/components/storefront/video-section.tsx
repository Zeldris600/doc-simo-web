"use client";

import * as React from "react";
import { Play, X } from "lucide-react";
import Image from "next/image";

const VIDEO_STATS = [
  { value: "3,500+", label: "Patients Treated" },
  { value: "25 yrs", label: "Clinical Experience" },
  { value: "98%", label: "Satisfaction Rate" },
];

// Replace with your actual YouTube video ID
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

export function VideoSection() {
  const [open, setOpen] = React.useState(false);

  return (
    <section
      id="how-it-works"
      className="relative bg-primary overflow-hidden py-20 px-4 sm:px-6 lg:px-12"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left text */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
              Inside Doctasimo
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              See How We Combine Nature &amp; Clinical Science
            </h2>
            <p className="text-base text-white/60 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              Take a guided tour inside our botanical clinic — from
              ethically-sourced raw herbs to lab-verified clinical extracts
              delivered to your door.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
              {VIDEO_STATS.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — video thumbnail */}
          <div className="flex-1 relative w-full max-w-xl">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10 group cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Image
                src="/composition-notebook-stethoscope.jpg"
                alt="Doctasimo clinic walkthrough video"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/40" />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                </div>
              </div>
              {/* Caption */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-black text-sm">
                  Doctasimo Clinic Tour
                </p>
                <p className="text-white/50 text-xs font-medium mt-0.5">
                  3 min · How our botanicals are made
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1`}
              title="Doctasimo Clinic Video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
