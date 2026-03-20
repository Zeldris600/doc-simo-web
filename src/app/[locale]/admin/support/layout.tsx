"use client";

import React from "react";
import { Channel } from "pusher-js";
import { useSupportThreads } from "@/hooks/use-support";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { MessageSquare, ArrowLeft, Search } from "lucide-react";
import { getPusherClient } from "@/lib/pusher";
import { useCan } from "@/hooks/use-can";
import { useQueryClient } from "@tanstack/react-query";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const { data: threads = [], isLoading } = useSupportThreads();
  const [showSidebar, setShowSidebar] = React.useState(!id);

  const { user } = useCan();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (id) setShowSidebar(false);
    else setShowSidebar(true);
  }, [id]);

  // Realtime updates for the thread list
  React.useEffect(() => {
    if (!user?.token) return;
    const pusher = getPusherClient(user.token);
    
    // If we're viewing a specific thread, listen to it to update the list
    let channel: Channel | undefined;
    if (id) {
      channel = pusher.subscribe(`private-thread-${id}`);
      channel.bind("support.message.new", () => {
        queryClient.invalidateQueries({ queryKey: ["support-threads"] });
      });
    }

    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [id, user?.token, queryClient]);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-white overflow-hidden border border-black/5 rounded-lg">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Thread List Sidebar */}
        <aside
          className={cn(
            "flex flex-col bg-white border-r border-black/5 shrink-0",
            showSidebar
              ? "absolute inset-0 z-20 md:relative md:w-72"
              : "hidden md:flex md:w-72",
          )}
        >
          {/* Sidebar Header */}
          <div className="px-4 py-4 border-b border-black/5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-black">Messages</h2>
              <span className="text-[10px] font-bold text-black/40 bg-black/[0.04] px-2 py-0.5 rounded-full">
                {threads.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/30" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-8 pl-9 pr-3 text-xs font-medium bg-black/[0.03] border-none rounded-lg outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-black/30"
              />
            </div>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center gap-3"
                  >
                    <div className="h-9 w-9 rounded-full bg-black/5 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-black/5 rounded w-2/3" />
                      <div className="h-2 bg-black/[0.03] rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <MessageSquare className="h-6 w-6 text-black/15 mb-3" />
                <p className="text-xs font-bold text-black/40">
                  No conversations
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {threads.map((thread) => {
                  const isActive = id === thread.id;
                  const isOpen = thread.status === "OPEN";
                  return (
                    <Link
                      key={thread.id}
                      href={`/admin/support/${thread.id}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 border-b border-black/[0.03] transition-colors hover:bg-black/[0.02] relative",
                        isActive && "bg-primary/[0.04]",
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-primary" />
                      )}
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold",
                          isOpen
                            ? "bg-primary/10 text-primary"
                            : "bg-black/5 text-black/40",
                        )}
                      >
                        {thread.customerUserId.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-black truncate">
                            Customer
                          </span>
                          <span className="text-[9px] font-medium text-black/30 shrink-0 ml-2">
                            {new Date(thread.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              isOpen ? "bg-emerald-500" : "bg-black/15",
                            )}
                          />
                          <span className="text-[10px] text-black/40 truncate">
                            #{thread.id.substring(0, 8)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden bg-white flex flex-col">
          {id && (
            <button
              onClick={() => {
                setShowSidebar(true);
                router.push("/admin/support");
              }}
              className="flex md:hidden items-center gap-2 px-4 py-2.5 text-xs font-medium text-black/60 border-b border-black/5 bg-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
