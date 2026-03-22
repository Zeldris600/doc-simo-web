import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="relative w-full min-h-[850px] flex items-center overflow-hidden bg-white pt-16">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 max-w-2xl text-center lg:text-left space-y-8">
          <Skeleton className="h-8 w-40 rounded-full bg-gray-100" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full md:h-24 bg-gray-100" />
            <Skeleton className="h-16 w-4/5 md:h-24 bg-gray-100" />
          </div>
          <Skeleton className="h-6 w-3/4 mx-auto lg:mx-0 bg-gray-100" />
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            <Skeleton className="h-14 w-40 rounded-full bg-gray-100" />
            <Skeleton className="h-14 w-40 rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="flex-1 w-full max-w-xl aspect-[4/5] relative">
          <Skeleton className="w-full h-full rounded-3xl bg-gray-50" />
        </div>
      </div>
    </div>
  );
}
