"use client";

import React from "react";

/** In-thread hint (typing / attachment / sending) with a light typing-style affordance. */
export function SupportPresenceTypingRow({ line }: { line: string | null }) {
  if (!line) return null;
  return (
    <div
      className="flex min-h-[36px] shrink-0 items-center gap-2 border-t border-[#D1D7DB]/60 bg-[#F0F2F5]/80 px-3 py-1.5 md:px-6"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
      </span>
      <span className="text-[11px] font-medium text-emerald-700">{line}</span>
    </div>
  );
}
