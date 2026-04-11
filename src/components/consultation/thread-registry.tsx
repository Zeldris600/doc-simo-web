"use client";

import React from "react";
import { Search, Plus, Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseMutationResult } from "@tanstack/react-query";
import { SupportThread, CreateThreadResponse } from "@/services/support.service";
import { ApiError } from "@/types/api";

interface ThreadRegistryProps {
  threads: SupportThread[];
  activeThreadId: string | null;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onThreadSelect: (id: string) => void;
  createMutation: UseMutationResult<CreateThreadResponse, ApiError, string | undefined, unknown>;
  getDateLabel: (dateStr: string) => string;
}

export function ThreadRegistry({ 
  threads, 
  activeThreadId, 
  searchQuery, 
  onSearchChange, 
  onThreadSelect,
  createMutation,
  getDateLabel
}: ThreadRegistryProps) {
  return (
    <aside className={cn(
      "w-full md:w-[320px] lg:w-[360px] border-r border-black/5 bg-white flex flex-col shrink-0 transition-all z-30"
    )}>
      <header className="px-5 h-16 flex flex-col justify-center border-b border-black/5 bg-white/80 backdrop-blur shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold text-black tracking-tight">
              Consultations
            </h2>
            <p className="text-[12px] text-black/40 leading-none">
              {threads.length} session{threads.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => createMutation.mutate(undefined)} 
            disabled={createMutation.isPending} 
            className="h-9 w-9 rounded-full border border-black/10 hover:bg-black/5"
          >
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/25" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-10 text-[13px] bg-black/2 border border-black/10 rounded-full focus-visible:ring-0"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-2">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => onThreadSelect(t.id)}
            className={cn(
              "w-full px-4 py-3 rounded-2xl text-left transition-all border mb-1",
              activeThreadId === t.id
                ? "bg-primary/10 border-primary/20"
                : "hover:bg-black/2 border-transparent",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        activeThreadId === t.id ? "bg-primary" : "bg-black/15",
                      )}
                      aria-hidden
                    />
                    <span className="text-[13px] font-semibold text-black truncate">
                      Session #{t.id.slice(-4)}
                    </span>
                  </div>
                  <span className="text-[12px] text-black/35">
                    {getDateLabel(t.updatedAt || t.createdAt)}
                  </span>
                </div>
                <p className="text-[12px] text-black/45 truncate mt-1">
                  Secure record active
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
