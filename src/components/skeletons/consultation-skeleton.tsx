import { Skeleton } from "@/components/ui/skeleton";

export function ConsultationSkeleton() {
  return (
    <div className="fixed inset-0 z-40 flex overflow-hidden bg-[#0B141A] pt-[72px] md:pt-0">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-1 overflow-hidden md:my-4 md:max-h-[calc(100vh-2rem)] md:rounded-lg md:border md:border-[#2A3942]">
        {/* Sidebar — WhatsApp-style dark */}
        <aside className="hidden w-[340px] shrink-0 flex-col border-r border-[#2A3942] bg-[#111B21] md:flex">
          <div className="flex h-[60px] shrink-0 items-center justify-between bg-[#202C33] px-3">
            <Skeleton className="h-4 w-20 bg-[#2A3942]" />
            <Skeleton className="h-9 w-9 rounded-full bg-[#2A3942]" />
          </div>
          <div className="border-b border-[#2A3942] px-2 py-2">
            <Skeleton className="h-9 w-full rounded-lg bg-[#202C33]" />
          </div>
          <div className="flex-1 space-y-0 p-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b border-[#222D34] px-3 py-3"
              >
                <Skeleton className="h-12 w-12 shrink-0 rounded-full bg-[#2A3942]" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between gap-2">
                    <Skeleton className="h-3 w-24 bg-[#2A3942]" />
                    <Skeleton className="h-2 w-10 bg-[#2A3942]" />
                  </div>
                  <Skeleton className="h-2 w-32 bg-[#2A3942]" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat panel */}
        <main className="flex min-w-0 flex-1 flex-col bg-[#EFEAE2]">
          <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-[#D1D7DB] bg-[#F0F2F5] px-4">
            <Skeleton className="h-10 w-10 rounded-full bg-[#D9DDE1]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 bg-[#D9DDE1]" />
              <Skeleton className="h-3 w-16 bg-[#D9DDE1]" />
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4 py-4">
            <div className="flex justify-start">
              <Skeleton className="h-16 w-[72%] max-w-md rounded-lg rounded-bl-none bg-white/80" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-14 w-[55%] max-w-sm rounded-lg rounded-br-none bg-[#D9FDD3]/90" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-24 w-[80%] max-w-lg rounded-lg rounded-bl-none bg-white/80" />
            </div>
          </div>

          <div className="flex shrink-0 items-end gap-2 border-t border-[#D1D7DB] bg-[#F0F2F5] px-3 py-2">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-[#D9DDE1]" />
            <Skeleton className="h-11 flex-1 rounded-lg bg-white" />
            <Skeleton className="h-11 w-11 shrink-0 rounded-full bg-[#00A884]/50" />
          </div>
        </main>
      </div>
    </div>
  );
}
