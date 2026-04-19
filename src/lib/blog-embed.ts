/** Turn common YouTube/Vimeo page URLs into iframe-friendly embed URLs (fallback: return as-is). */
export function toBlogEmbedSrc(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const id = u.searchParams.get("v");
      if (id) {
        const base = host === "youtube-nocookie.com" ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
        return `${base}/embed/${id}`;
      }
    }
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* ignore */
  }
  return trimmed;
}
