"use client";

import * as React from "react";
import { Play, X, Loader2 } from "@/lib/icons";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { BlogPostWithAuthor } from "@/types/blog";
import { toBlogEmbedSrc, blogPostPreviewImage } from "@/lib/blog-embed";

const VIDEO_STATS = [
  { value: "2,800+", label: "Patients (CMR)" },
  { value: "17 yrs", label: "Clinical practice" },
  { value: "98%", label: "Would recommend" },
];

function hasPlayableVideo(post: BlogPostWithAuthor) {
  return Boolean(post.embedUrl?.trim() || post.primaryVideoUrl?.trim());
}

function embedIframeAutoplaySrc(embedUrl: string) {
  const base = toBlogEmbedSrc(embedUrl);
  return `${base}${base.includes("?") ? "&" : "?"}autoplay=1`;
}

type VideoSectionProps = {
  posts: BlogPostWithAuthor[];
  isLoading?: boolean;
};

export function VideoSection({ posts, isLoading }: VideoSectionProps) {
  const [open, setOpen] = React.useState(false);

  const featured =
    posts.find((p) => hasPlayableVideo(p)) ?? posts[0] ?? null;
  const thumb = featured ? blogPostPreviewImage(featured) : null;

  if (!isLoading && posts.length === 0) {
    return null;
  }

  return (
    <section
      id="how-it-works"
      className="relative bg-primary overflow-hidden py-20 px-4 sm:px-6 lg:px-12"
    >
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
          <div className="flex-1 text-center lg:text-left space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
              Inside Doctasimo
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">
              {featured
                ? featured.title
                : "See How We Combine Nature & Clinical Science"}
            </h2>
            <p className="text-base text-white/60 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
              {featured?.excerpt ??
                "Take a guided tour inside our botanical clinic — from ethically-sourced raw herbs to lab-verified clinical extracts delivered to your door."}
            </p>

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

            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-block text-sm font-bold text-[#f2c94c] hover:underline"
              >
                Read full story →
              </Link>
            )}
          </div>

          <div className="flex-1 relative w-full max-w-xl">
            {isLoading ? (
              <div className="aspect-video rounded-3xl bg-white/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
            ) : featured && hasPlayableVideo(featured) ? (
              <button
                type="button"
                className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10 group cursor-pointer text-left"
                onClick={() => setOpen(true)}
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/80" />
                )}
                <div className="absolute inset-0 bg-primary/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white font-black text-sm line-clamp-2">
                    {featured.title}
                  </p>
                  <p className="text-white/50 text-xs font-medium mt-0.5">
                    From our blog · Tap to play
                  </p>
                </div>
              </button>
            ) : featured ? (
              <Link
                href={`/blog/${featured.slug}`}
                className="block relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
              >
                {thumb ? (
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-white/70 text-sm font-medium px-6 text-center">
                    {featured.title}
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/20 transition-colors" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white font-black text-sm">Open article</p>
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {open && featured && hasPlayableVideo(featured) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {featured.embedUrl ? (
              <iframe
                src={embedIframeAutoplaySrc(featured.embedUrl)}
                title={featured.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : featured.primaryVideoUrl ? (
              <video
                src={featured.primaryVideoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            ) : null}
          </div>
          <button
            type="button"
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
