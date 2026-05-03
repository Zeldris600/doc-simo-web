"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ArrowRight } from "@/lib/icons";
import { useBlogPosts } from "@/hooks/use-blog";
import { Skeleton } from "@/components/ui/skeleton";

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-16/10 rounded-2xl w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function BlogPosts() {
  const { data: res, isLoading } = useBlogPosts({ limit: 3 });
  const posts = res?.data || [];

  return (
    <section className="px-6 py-24 lg:px-12 bg-white">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-primary/40 tracking-[0.2em]">
              Clinical Journal
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-primary tracking-tight">
              Herbal Insights
            </h2>
            <p className="text-foreground/50 max-w-xl font-medium leading-relaxed">
              Explore our latest research on botanical extracts, clinical
              trials, and natural wellness protocols.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center text-[10px] font-black tracking-widest text-primary hover:opacity-70 transition-all group uppercase bg-primary/5 px-6 py-3 rounded-full"
          >
            View All Articles <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <BlogSkeleton />
        ) : posts.length === 0 ? (
          <p className="text-center py-20 text-foreground/30 font-bold">No articles published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group cursor-pointer block">
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-6 transition-transform duration-700 group-hover:scale-[1.03] shadow-lg shadow-black/5 ring-1 ring-black/5">
                  <Image
                    src={post.image || "/extract_blog.png"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-[#f2c94c] uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                  <h3 className="text-xl font-black text-primary mb-3 group-hover:text-primary/70 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-foreground/50 line-clamp-2 font-medium leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
