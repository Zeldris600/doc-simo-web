const DEFAULT_AFTER_AUTH = "/";

/** Only same-origin relative paths; blocks open redirects (`//evil.com`). */
export function resolveAuthCallbackUrl(
  raw: string | null | undefined,
): string {
  if (raw == null || typeof raw !== "string") return DEFAULT_AFTER_AUTH;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//"))
    return DEFAULT_AFTER_AUTH;
  return trimmed;
}

export function buildAuthPathWithCallback(
  pathname: string,
  callbackUrl: string | null | undefined,
): string {
  if (!callbackUrl?.trim()) return pathname;
  const q = new URLSearchParams();
  q.set("callbackUrl", callbackUrl.trim());
  return `${pathname}?${q.toString()}`;
}
