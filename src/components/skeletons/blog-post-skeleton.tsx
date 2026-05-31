import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full max-w-2xl" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="aspect-[16/9] w-full rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  );
}
