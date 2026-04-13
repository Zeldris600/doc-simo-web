"use client";

import * as React from "react";
import { useProducts } from "@/hooks/use-product";
import type { Product } from "@/types/api";

const STORAGE_KEY = "doctasimo_favourites";

function getFavouriteIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setFavouriteIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useFavouriteIds() {
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setIds(getFavouriteIds());

    const onStorage = () => setIds(getFavouriteIds());

    // Listen to cross-tab storage changes
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) onStorage();
    });

    // Listen to same-tab custom events
    window.addEventListener("doctasimo-favourites-updated", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("doctasimo-favourites-updated", onStorage);
    };
  }, []);

  const toggle = React.useCallback((productId: string) => {
    setIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      setFavouriteIds(next);
      window.dispatchEvent(new Event("doctasimo-favourites-updated"));
      return next;
    });
  }, []);

  const isFavourite = React.useCallback(
    (productId: string) => ids.includes(productId),
    [ids],
  );

  return { ids, toggle, isFavourite };
}

export function useFavouriteProducts() {
  const { ids } = useFavouriteIds();
  const { data: productsResponse, isLoading } = useProducts();

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const favourites: Product[] = React.useMemo(() => {
    if (!productsResponse?.data || ids.length === 0) return [];
    return productsResponse.data.filter((p: Product) => ids.includes(p.id));
  }, [productsResponse?.data, ids]);

  return { favourites, isLoading, count: ids.length };
}
