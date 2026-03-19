import { Skeleton } from "@/components/ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div 
          key={i}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/[0.02] border border-black/5"
        >
          <Skeleton className="w-full h-full bg-black/5" />
          <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 bg-black/10" />
              <Skeleton className="h-6 w-3/4 bg-black/10" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-full bg-black/10" />
              <Skeleton className="h-3 w-1/2 bg-black/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
