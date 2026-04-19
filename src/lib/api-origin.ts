/**
 * Socket.IO and Pusher auth use the API host. `NEXT_PUBLIC_API_URL` is typically
 * `https://api.example.com/api` — strip the `/api` suffix for the HTTP origin only.
 */
export function getApiHttpOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return "";
  const noTrail = raw.replace(/\/+$/, "");
  return noTrail.endsWith("/api") ? noTrail.slice(0, -4) : noTrail;
}
