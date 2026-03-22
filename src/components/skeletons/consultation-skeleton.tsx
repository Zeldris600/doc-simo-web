import { Skeleton } from "@/components/ui/skeleton";

export function ConsultationSkeleton() {
  return (
    <div className="fixed inset-0 bg-white flex overflow-hidden pt-[80px]">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:flex flex-col w-[320px] lg:w-[380px] border-r border-black/5 bg-[#fcfdfc] shrink-0">
        <div className="h-20 shrink-0 border-b border-black/5 flex items-center justify-between px-6 bg-white">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-10" />
                  </div>
                  <Skeleton className="h-2 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Skeleton */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="flex items-center justify-between gap-4 px-6 h-20 border-b border-black/5 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-32 rounded-full hidden sm:block" />
        </header>

        <div className="flex-1 overflow-hidden px-4 md:px-12 py-8 flex flex-col gap-8">
          <div className="flex flex-col items-start gap-2">
            <Skeleton className="h-20 w-[60%] rounded-[24px]" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-16 w-[40%] rounded-[24px]" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Skeleton className="h-32 w-[70%] rounded-[24px]" />
          </div>
        </div>

        <div className="px-4 md:px-12 py-6 border-t border-black/5 bg-white shrink-0">
          <div className="max-w-4xl mx-auto flex items-end gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
            <Skeleton className="h-14 flex-1 rounded-[20px]" />
            <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
          </div>
        </div>
      </main>
    </div>
  );
}
