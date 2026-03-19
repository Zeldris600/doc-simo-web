import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <Skeleton className="aspect-square w-full rounded-xl bg-black/5" />
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-1/4 bg-black/5" />
          <Skeleton className="h-3 w-8 bg-black/5" />
        </div>
        <Skeleton className="h-5 w-3/4 bg-black/5" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full bg-black/5" />
          <Skeleton className="h-3 w-2/3 bg-black/5" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-1/3 bg-black/5" />
          <Skeleton className="h-3 w-1/6 bg-black/5" />
        </div>
      </div>
    </div>
  );
}
