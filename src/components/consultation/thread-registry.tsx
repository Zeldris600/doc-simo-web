"use client";

import React from "react";
import { Search, Plus, Loader2 } from "lucide-react";
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
      "w-full md:w-[320px] lg:w-[380px] border-r border-black/5 bg-white flex flex-col shrink-0 transition-all z-30"
    )}>
      <header className="px-6 h-16 flex flex-col justify-center border-b border-black/5 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-black text-black/40 tracking-[0.2em] uppercase">Registry</h2>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => createMutation.mutate(undefined)} 
            disabled={createMutation.isPending} 
            className="h-7 w-7 rounded-sm"
          >
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/20" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-9 text-[10px] bg-black/[0.02] border-none rounded-none focus-visible:ring-0"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => onThreadSelect(t.id)}
            className={cn(
              "w-full p-4 rounded-lg text-left transition-all border-l-2 mb-1 mx-2 w-[calc(100%-1rem)]",
              activeThreadId === t.id ? "bg-[#1f3d2b] border-primary text-white" : "hover:bg-black/[0.02] border-transparent text-black"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase">Session #{t.id.slice(-4)}</span>
                  <span className={cn("text-[8px] font-black uppercase", activeThreadId === t.id ? "text-white/40" : "text-black/20")}>
                    {getDateLabel(t.updatedAt || t.createdAt)}
                  </span>
                </div>
                <p className={cn("text-[9px] font-black truncate mt-1 uppercase tracking-wider opacity-60", activeThreadId === t.id ? "text-white" : "text-black")}>
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
