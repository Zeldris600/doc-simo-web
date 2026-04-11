"use client";

import { Star } from "@/lib/icons";
import { cn } from "@/lib/utils";

type StarRatingDisplayProps = {
  value: number | null | undefined;
  className?: string;
  starClassName?: string;
};

export function StarRatingDisplay({
  value,
  className,
  starClassName,
}: StarRatingDisplayProps) {
  const v =
    value == null || Number.isNaN(Number(value))
      ? 0
      : Math.min(5, Math.max(0, Number(value)));
  const filled = Math.round(v);

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            i <= filled
              ? "fill-[#f2c94c] text-[#f2c94c]"
              : "fill-none text-black/20",
            starClassName,
          )}
        />
      ))}
    </div>
  );
}
