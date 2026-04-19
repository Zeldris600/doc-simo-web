"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useBlogPost } from "@/hooks/use-blog";
import { BlogBodyHtml } from "@/components/blog/blog-body-html";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "@/lib/icons";
import { toBlogEmbedSrc } from "@/lib/blog-embed";

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const t = useTranslations("blog");
  const { data: post, isLoading, isError } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-destructive text-sm mb-4">{t("notFound")}</p>
        <Button asChild variant="outline">
          <Link href="/blog">{t("backToBlog")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-8 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/blog" className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          {t("backToBlog")}
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{post.author.name ?? t("authorFallback")}</span>
          {post.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </>
          )}
        </div>
      </header>

      {post.coverImageUrl && (
        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-muted mb-10">
          <Image
            src={post.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {post.embedUrl && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-black/8 aspect-video bg-black">
          <iframe
            src={toBlogEmbedSrc(post.embedUrl)}
            title={post.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {post.primaryVideoUrl && !post.embedUrl && (
        <div className="mb-10 rounded-2xl overflow-hidden border border-black/8">
          <video
            src={post.primaryVideoUrl}
            controls
            className="w-full max-h-[480px]"
          />
        </div>
      )}

      <BlogBodyHtml html={post.body} />
    </article>
  );
}
