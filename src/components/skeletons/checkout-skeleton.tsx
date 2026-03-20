import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-16">
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-32" />
      </div>

      <Skeleton className="h-10 w-64 mb-12" />

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-48" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-3 w-64" />
            </div>
          </section>

          <Skeleton className="h-16 w-full rounded-md" />

          <div className="grid grid-cols-2 gap-4 pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <aside className="lg:col-span-5">
           <div className="border border-black/5 rounded-xl bg-black/[0.02] p-8 space-y-6">
             <Skeleton className="h-4 w-32" />
             <div className="space-y-4">
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
             </div>
             <div className="h-px bg-black/5" />
             <div className="space-y-4">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-10 w-full" />
             </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
