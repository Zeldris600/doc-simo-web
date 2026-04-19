"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/use-blog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "@/lib/icons";
import { useState } from "react";

export default function BlogIndexPage() {
  const t = useTranslations("blog");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useBlogPosts({ page, limit: 12 });

  const posts = data?.data ?? [];
  const total = data?.total ?? 0;
  const take = data?.take ?? 12;
  const hasMore = page * take < total;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="mb-10 md:mb-14 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted-foreground text-sm md:text-base">
          {t("subtitle")}
        </p>
      </header>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <p className="text-center text-destructive text-sm">{t("loadError")}</p>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <p className="text-center text-muted-foreground">{t("empty")}</p>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col rounded-2xl border border-black/6 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/blog/${post.slug}`} className="block aspect-[16/10] relative bg-muted">
              {post.coverImageUrl ? (
                <Image
                  src={post.coverImageUrl}
                  alt=""
                  fill
                  className="object-cover transition-transform group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center text-primary/40 text-xs font-medium">
                  {t("noCover")}
                </div>
              )}
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-wider font-semibold text-primary/80 bg-primary/8 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-foreground leading-snug">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.author.name ?? t("authorFallback")}</span>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!isLoading && posts.length > 0 && (page > 1 || hasMore) && (
        <div className="flex justify-center gap-3 mt-12">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t("prev")}
          </Button>
          <Button
            variant="outline"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}
