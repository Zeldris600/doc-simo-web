"use client";

import { cn } from "@/lib/utils";

/**
 * Renders sanitized HTML from the API (`body`). Server allowlists tags; client keeps minimal styling.
 */
export function BlogBodyHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "blog-body max-w-none text-foreground/90 text-base leading-relaxed",
        "[&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:mt-8 [&_h1]:mb-4",
        "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3",
        "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2",
        "[&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-7",
        "[&_a]:text-primary [&_a]:underline underline-offset-2",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4",
        "[&_li]:mb-1",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4",
        "[&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto",
        "[&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-6",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
