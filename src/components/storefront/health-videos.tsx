"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { BlogPostWithAuthor } from "@/types/blog";
import { blogPostPreviewImage } from "@/lib/blog-embed";
import { Loader2, Play, Calendar } from "@/lib/icons";

type HealthVideosProps = {
  posts: BlogPostWithAuthor[];
  isLoading?: boolean;
};

export function HealthVideos({ posts, isLoading }: HealthVideosProps) {
  const grid = posts.slice(0, 6);

  if (!isLoading && grid.length === 0) {
    return null;
  }

  return (
    <section id="videos" className="px-4 sm:px-6 lg:px-12 py-20 bg-[#f5faf6]">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#f2c94c]">
            Doctasimo blog
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
            Stories, videos &amp; clinical insight
          </h2>
          <p className="text-sm text-foreground/50 font-medium max-w-md mx-auto leading-relaxed">
            Pulled from our published articles — herbal medicine, wellness, and
            what happens inside the clinic.
          </p>
          <Link
            href="/blog"
            className="inline-block text-sm font-bold text-primary hover:underline mt-2"
          >
            View all posts →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {grid.map((post) => {
              const thumb = blogPostPreviewImage(post);
              const tag = post.tags[0] ?? (post.kind === "VIDEO" ? "Video" : "Article");
              const hasVideo = Boolean(
                post.embedUrl?.trim() || post.primaryVideoUrl?.trim(),
              );

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group text-left bg-white rounded-3xl overflow-hidden border border-black/5 hover:shadow-lg hover:shadow-black/8 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted shrink-0">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary/50 text-xs font-semibold px-4 text-center">
                        {post.title}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/15 group-hover:bg-primary/5 transition-colors" />
                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#f2c94c] text-[#142c1b] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider max-w-[85%] truncate">
                      {tag}
                    </div>
                  </div>

                  <div className="p-5 space-y-2 flex-1 flex flex-col">
                    <h3 className="text-sm font-black text-primary leading-snug line-clamp-2 group-hover:text-primary/80 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-[11px] text-foreground/50 line-clamp-2 font-medium">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-foreground/40 font-medium mt-auto pt-2">
                      <span className="truncate">
                        {post.author.name ?? "Doctasimo"}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center gap-1 shrink-0 ml-auto">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.publishedAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
