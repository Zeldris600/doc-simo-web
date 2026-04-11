"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Star, Loader2, Trash2, Pencil } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingDisplay } from "@/components/storefront/star-rating-display";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateProductReview,
  useDeleteProductReview,
  useProductReviews,
  useReviewStats,
  useUpdateProductReview,
} from "@/hooks/use-product-reviews";
import { useMyOrders } from "@/hooks/use-order";
import { ApiError, ProductReview } from "@/types/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

function isVerifiedPurchaserForProduct(
  orders: { status: string; items?: { productId: string }[] }[] | undefined,
  productId: string,
) {
  if (!orders?.length) return false;
  return orders.some(
    (o) =>
      o.status === "DELIVERED" &&
      (o.items ?? []).some((i) => i.productId === productId),
  );
}

function reviewFormPayload(rating: number, comment: string) {
  const trimmed = comment.trim();
  const body: { rating: number; comment?: string } = { rating };
  if (trimmed.length >= 3) body.comment = trimmed;
  return body;
}

type ProductReviewsSectionProps = {
  productId: string;
  /** Optional aggregates from product payload while stats load */
  productReviewCount?: number;
  productAverageRating?: number | null;
};

export function ProductReviewsSection({
  productId,
  productReviewCount,
  productAverageRating,
}: ProductReviewsSectionProps) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [page, setPage] = React.useState(1);
  const [formRating, setFormRating] = React.useState(5);
  const [formComment, setFormComment] = React.useState("");
  const [editingReview, setEditingReview] = React.useState<ProductReview | null>(
    null,
  );

  const { data: stats, isLoading: statsLoading } = useReviewStats(productId);
  const { data: listRes, isLoading: listLoading } = useProductReviews(
    productId,
    { page, limit: PAGE_SIZE },
  );
  /** Scan first page (up to 100) so we detect the current user's review even when paginated list is on another page. */
  const { data: wideListRes } = useProductReviews(productId, {
    page: 1,
    limit: 100,
  });
  const { data: ordersRes } = useMyOrders({
    enabled: sessionStatus === "authenticated",
  });

  const orders = ordersRes?.data;
  const verified = isVerifiedPurchaserForProduct(orders, productId);

  const createReview = useCreateProductReview(productId, {
    onSuccess: () => {
      toast.success(t("posted"));
      setFormRating(5);
      setFormComment("");
    },
    onError: (error: ApiError) => {
      const status = error.response?.status;
      const msg = error.response?.data?.message;
      if (status === 403) toast.error(msg || t("notVerified"));
      else if (status === 409) {
        queryClient.invalidateQueries({
          queryKey: ["product-reviews", productId],
        });
        toast.message(t("alreadyReviewed"));
        setPage(1);
      } else toast.error(msg || t("errorGeneric"));
    },
  });

  const updateReview = useUpdateProductReview({
    onSuccess: () => {
      toast.success(t("updated"));
      setEditingReview(null);
      setFormComment("");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || t("errorGeneric"));
    },
  });

  const deleteReview = useDeleteProductReview({
    onSuccess: () => {
      toast.success(t("deleted"));
      setEditingReview(null);
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || t("errorGeneric"));
    },
  });

  const reviews = listRes?.data ?? [];
  const total = listRes?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const reviewCount =
    stats?.reviewCount ?? productReviewCount ?? total ?? 0;
  const averageRating =
    stats?.averageRating !== undefined
      ? stats.averageRating
      : (productAverageRating ?? null);

  const myReview = React.useMemo(() => {
    const uid = session?.user?.id;
    if (!uid) return null;
    return (wideListRes?.data ?? []).find((r) => r.user.id === uid) ?? null;
  }, [wideListRes?.data, session?.user?.id]);

  React.useEffect(() => {
    if (editingReview) {
      setFormRating(editingReview.rating);
      setFormComment(editingReview.comment ?? "");
    }
  }, [editingReview]);

  const startEdit = (r: ProductReview) => {
    setEditingReview(r);
    setFormRating(r.rating);
    setFormComment(r.comment ?? "");
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setFormComment("");
    setFormRating(5);
  };

  const submitCreate = () => {
    const trimmed = formComment.trim();
    if (trimmed.length > 0 && trimmed.length < 3) {
      toast.error(t("commentTooShort"));
      return;
    }
    createReview.mutate(reviewFormPayload(formRating, formComment));
  };

  const submitUpdate = () => {
    if (!editingReview) return;
    const trimmed = formComment.trim();
    if (trimmed.length > 0 && trimmed.length < 3) {
      toast.error(t("commentTooShort"));
      return;
    }
    const data: { rating?: number; comment?: string } = {};
    if (formRating !== editingReview.rating) data.rating = formRating;
    const prev = (editingReview.comment ?? "").trim();
    if (trimmed !== prev) {
      data.comment = trimmed.length === 0 ? "" : trimmed;
    }
    if (Object.keys(data).length === 0) {
      cancelEdit();
      return;
    }
    updateReview.mutate({ reviewId: editingReview.id, data });
  };

  const confirmDelete = (r: ProductReview) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    deleteReview.mutate({ reviewId: r.id, productId });
  };

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
      new Date(iso),
    );

  const showForm =
    sessionStatus === "authenticated" &&
    verified &&
    !myReview &&
    !editingReview;

  return (
    <section className="mt-16 md:mt-24 border-t border-black/10 pt-12 md:pt-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
            {t("title")}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRatingDisplay value={averageRating} />
            <span className="text-sm font-bold text-primary">
              {averageRating != null ? averageRating.toFixed(1) : "—"}
            </span>
            <span className="text-xs text-black/45 font-medium">
              {statsLoading ? "…" : t("count", { count: reviewCount })}
            </span>
          </div>
        </div>
      </div>

      {sessionStatus === "unauthenticated" && (
        <p className="text-sm text-black/55 font-medium mb-8">
          {t("signInToReview")}{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            {t("signIn")}
          </Link>
        </p>
      )}

      {sessionStatus === "authenticated" && !verified && (
        <p className="text-sm text-black/55 font-medium mb-8 rounded-xl bg-[#f5faf6] border border-primary/10 px-4 py-3">
          {t("verifiedOnly")}
        </p>
      )}

      {showForm && (
        <div className="mb-10 rounded-2xl border border-black/10 bg-white p-5 md:p-6 space-y-4">
          <p className="text-sm font-bold text-black">{t("writeReview")}</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFormRating(n)}
                className="p-1 rounded-md hover:bg-primary/5 transition-colors"
                aria-label={t("starAria", { n })}
              >
                <Star
                  className={cn(
                    "h-7 w-7",
                    n <= formRating
                      ? "fill-[#f2c94c] text-[#f2c94c]"
                      : "text-black/15",
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            placeholder={t("commentPlaceholder")}
            rows={4}
            className="resize-y min-h-[100px] text-sm"
            maxLength={2000}
          />
          <Button
            type="button"
            onClick={submitCreate}
            disabled={createReview.isPending}
            className="font-bold"
          >
            {createReview.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {t("submit")}
          </Button>
        </div>
      )}

      {sessionStatus === "authenticated" && myReview && !editingReview && (
        <div className="mb-10 rounded-2xl border border-primary/20 bg-[#f5faf6] p-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-primary">{t("yourReview")}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-bold"
                onClick={() => startEdit(myReview)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                {t("edit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-bold text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => confirmDelete(myReview)}
                disabled={deleteReview.isPending}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                {t("delete")}
              </Button>
            </div>
          </div>
          <StarRatingDisplay value={myReview.rating} />
          {myReview.comment ? (
            <p className="text-sm text-black/70 font-medium whitespace-pre-wrap">
              {myReview.comment}
            </p>
          ) : (
            <p className="text-xs text-black/40 font-medium italic">
              {t("ratingOnly")}
            </p>
          )}
        </div>
      )}

      {editingReview && (
        <div className="mb-10 rounded-2xl border border-black/10 bg-white p-5 md:p-6 space-y-4">
          <p className="text-sm font-bold text-black">{t("editReview")}</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFormRating(n)}
                className="p-1 rounded-md hover:bg-primary/5 transition-colors"
              >
                <Star
                  className={cn(
                    "h-7 w-7",
                    n <= formRating
                      ? "fill-[#f2c94c] text-[#f2c94c]"
                      : "text-black/15",
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={formComment}
            onChange={(e) => setFormComment(e.target.value)}
            placeholder={t("commentPlaceholder")}
            rows={4}
            className="resize-y min-h-[100px] text-sm"
            maxLength={2000}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={submitUpdate}
              disabled={updateReview.isPending}
              className="font-bold"
            >
              {updateReview.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {t("update")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={cancelEdit}
              className="font-bold"
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {listLoading && page === 1 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-black/50 font-medium py-6">{t("noReviews")}</p>
        ) : (
          reviews.map((r) => (
            <article
              key={r.id}
              className="pb-6 border-b border-black/8 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                {r.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.user.image}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover bg-black/5 shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">
                    {(r.user.name || "?").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-black">
                      {r.user.name || t("anonymous")}
                    </span>
                    <span className="text-[11px] text-black/35 font-medium">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1">
                    <StarRatingDisplay value={r.rating} starClassName="h-3 w-3" />
                  </div>
                  {r.comment ? (
                    <p className="mt-2 text-sm text-black/70 font-medium whitespace-pre-wrap">
                      {r.comment}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || listLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="font-bold"
          >
            {t("previous")}
          </Button>
          <span className="text-xs font-bold text-black/40">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages || listLoading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="font-bold"
          >
            {t("next")}
          </Button>
        </div>
      )}
    </section>
  );
}
