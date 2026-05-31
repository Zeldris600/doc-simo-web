import { CustomerProfile } from "@/types/api";

export function customerFullName(c: CustomerProfile): string {
  return (
    c.user?.name ||
    [c.firstName, c.lastName].filter(Boolean).join(" ") ||
    "Unnamed"
  );
}

export function customerInitials(c: CustomerProfile): string {
  return (
    customerFullName(c)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

export function customerEmail(c: CustomerProfile): string | null {
  return c.user?.email || c.email || null;
}

export function customerPhone(c: CustomerProfile): string | null {
  return c.phoneNumber || c.user?.phoneNumber || null;
}

export function customerImage(c: CustomerProfile): string | null {
  return (c.user as { image?: string | null } | undefined)?.image ?? null;
}
