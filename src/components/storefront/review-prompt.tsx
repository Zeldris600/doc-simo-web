"use client";

import { Star, MessageSquare, CheckCircle2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Session } from "next-auth";

interface ReviewPromptProps {
  session: Session | null;
  sessionStatus: "authenticated" | "unauthenticated" | "loading";
  reviewCount: number;
  averageRating: number | null;
}

export function ReviewPrompt({
  session,
  sessionStatus,
  reviewCount,
  averageRating,
}: ReviewPromptProps) {
  const scrollToReviews = () => {
    document.getElementById("customer-reviews")?.scrollIntoView({ behavior: "smooth" });
  };

  // Unauthenticated: nudge to sign in
  if (sessionStatus === "unauthenticated") {
    return (
      <div className="mt-2 flex items-center justify-between gap-4 rounded-2xl border border-black/8 bg-[#f5faf6] px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-3.5 w-3.5 ${
                  averageRating && n <= Math.round(averageRating)
                    ? "fill-[#f2c94c] text-[#f2c94c]"
                    : "text-black/10"
                }`}
              />
            ))}
            <span className="text-[10px] font-medium text-black/40 ml-1">
              {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? "s" : ""}` : "No reviews yet"}
            </span>
          </div>
          <p className="text-xs font-medium text-black/55">
            Tried this formula? Share your experience.
          </p>
        </div>
        <Link href="/login">
          <Button size="sm" className="font-bold shrink-0 rounded-xl text-xs gap-2">
            <MessageSquare className="h-3.5 w-3.5" />
            Sign in to review
          </Button>
        </Link>
      </div>
    );
  }

  // Authenticated: invite to scroll down and review
  return (
    <div className="mt-2 flex items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-[#f5faf6] px-5 py-4">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-3.5 w-3.5 ${
                averageRating && n <= Math.round(averageRating)
                  ? "fill-[#f2c94c] text-[#f2c94c]"
                  : "text-black/10"
              }`}
            />
          ))}
          <span className="text-[10px] font-medium text-black/40 ml-1">
            {reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? "s" : ""}` : "Be the first to review"}
          </span>
        </div>
        <p className="text-xs font-medium text-black/55">
          {session?.user?.name
            ? `${session.user.name.split(" ")[0]}, would you like to leave a review?`
            : "Would you like to share your experience?"}
        </p>
      </div>
      <Button
        size="sm"
        onClick={scrollToReviews}
        className="font-bold shrink-0 rounded-xl text-xs gap-2"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Write a Review
      </Button>
    </div>
  );
}
