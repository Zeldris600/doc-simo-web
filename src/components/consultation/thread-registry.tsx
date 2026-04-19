"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Search, Plus, Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseMutationResult } from "@tanstack/react-query";
import {
  SupportThread,
  CreateThreadResponse,
  getSupportThreadDisplayName,
  getSupportThreadInitials,
} from "@/services/support.service";
import { ApiError } from "@/types/api";
import Image from "next/image";

interface ThreadRegistryProps {
  threads: SupportThread[];
  activeThreadId: string | null;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onThreadSelect: (id: string) => void;
  createMutation: UseMutationResult<
    CreateThreadResponse,
    ApiError,
    string | undefined,
    unknown
  >;
  getDateLabel: (dateStr: string) => string;
}

export function ThreadRegistry({
  threads,
  activeThreadId,
  searchQuery,
  onSearchChange,
  onThreadSelect,
  createMutation,
  getDateLabel,
}: ThreadRegistryProps) {
  const t = useTranslations("supportChat.customer");
  const unnamed = (suffix: string) => t("unnamedThread", { suffix });

  return (
    <aside
      className={cn(
        "flex h-full w-full shrink-0 flex-col border-r border-black/5 bg-white transition-all md:w-[340px] lg:w-[380px]",
      )}
    >
      {/* WhatsApp-style list header */}
      <header className="flex h-[60px] shrink-0 items-center justify-between gap-3 bg-[#F0F2F5] px-3">
        <div className="min-w-0 pl-1">
          <h2 className="text-[16px] font-bold tracking-tight text-[#111B21]">
            {t("sidebarTitle")}
          </h2>
          <p className="text-[11px] font-medium text-[#54656F]">
            {t("consultationCount", { count: threads.length })}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => createMutation.mutate(undefined)}
          disabled={createMutation.isPending}
          aria-label={t("newChatAria")}
          className="h-10 w-10 shrink-0 rounded-full text-[#54656F] hover:bg-[#D9DDE1] hover:text-[#111B21]"
        >
          {createMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </Button>
      </header>

      <div className="border-b border-black/5 px-2 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#54656F]" />
          <Input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 border-0 bg-[#F0F2F5] pl-9 text-[14px] text-[#111B21] placeholder:text-[#54656F] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => {
          const active = activeThreadId === thread.id;
          const displayName = getSupportThreadDisplayName(thread, unnamed);
          const initials = getSupportThreadInitials(thread, unnamed);
          const avatarUrl = thread.customer?.image;
          return (
            <button
              key={thread.id}
              type="button"
              onClick={() => onThreadSelect(thread.id)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-black/5 px-3 py-3 text-left transition-colors hover:bg-[#F0F2F5]",
                active &&
                  "border-l-[3px] border-l-primary bg-[#F0F2F5] pl-[9px]",
              )}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-primary/10">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[15px] font-bold text-primary">
                    {initials}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-bold text-[#111B21]">
                    {displayName}
                  </span>
                  <span className="shrink-0 text-[10px] font-bold text-[#54656F]">
                    {getDateLabel(thread.updatedAt || thread.createdAt)}
                  </span>
                </div>
                <p className="truncate text-[12px] font-medium text-[#54656F]">
                  {t("threadPreview", { id: thread.id.slice(-4) })}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
