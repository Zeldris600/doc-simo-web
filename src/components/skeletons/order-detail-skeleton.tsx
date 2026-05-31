import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-black/8 bg-white rounded-xl shadow-none overflow-hidden">
            <CardHeader className="border-b border-gray-50 pb-4">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="p-0">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 flex items-center gap-4 border-b border-gray-50 last:border-0"
                >
                  <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
              <div className="p-6 bg-muted/30 border-t border-gray-50 flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-7 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="border border-black/8 bg-white rounded-xl shadow-none p-6"
            >
              <Skeleton className="h-4 w-36 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                {i === 1 && <Skeleton className="h-10 w-full rounded-lg" />}
              </div>
            </Card>
          ))}
          <div className="flex justify-between px-4">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
