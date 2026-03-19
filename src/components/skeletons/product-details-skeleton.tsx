import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
        <nav className="flex items-center gap-3 mb-12">
          <Skeleton className="h-3 w-40 bg-black/5" />
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6">
            <Skeleton className="aspect-[4/5] w-full rounded-3xl bg-black/[0.02]" />
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <Skeleton className="w-24 h-24 shrink-0 rounded-2xl bg-black/[0.02]" />
              <Skeleton className="w-24 h-24 shrink-0 rounded-2xl bg-black/[0.02]" />
              <Skeleton className="w-24 h-24 shrink-0 rounded-2xl bg-black/[0.02]" />
              <Skeleton className="w-24 h-24 shrink-0 rounded-2xl bg-black/[0.02]" />
            </div>
          </div>

          <div className="flex flex-col space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-32 bg-black/5" />
                <Skeleton className="h-6 w-16 bg-black/5" />
              </div>
              <Skeleton className="h-14 w-full md:h-20 bg-black/5" />
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-4 w-4 rounded-full bg-black/5" />
                <Skeleton className="h-4 w-40 bg-black/5" />
              </div>
              <div className="flex items-baseline gap-4 pt-4">
                <Skeleton className="h-12 w-32 bg-black/5" />
                <Skeleton className="h-8 w-24 bg-black/5" />
              </div>
              <div className="space-y-2 pt-4">
                <Skeleton className="h-4 w-full bg-black/5" />
                <Skeleton className="h-4 w-full bg-black/5" />
                <Skeleton className="h-4 w-3/4 bg-black/5" />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <Skeleton className="h-16 w-32 rounded-2xl bg-black/5" />
                <Skeleton className="flex-1 h-16 rounded-2xl bg-black/5" />
                <Skeleton className="h-16 w-16 rounded-2xl bg-black/5" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-black/5">
                <Skeleton className="h-32 w-full rounded-2xl bg-black/[0.02]" />
                <Skeleton className="h-32 w-full rounded-2xl bg-black/[0.02]" />
                <Skeleton className="h-32 w-full rounded-2xl bg-black/[0.02]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
