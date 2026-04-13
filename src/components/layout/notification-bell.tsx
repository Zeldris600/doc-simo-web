"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { Bell } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
 useNotificationsInfinite,
 useMarkNotificationRead,
} from "@/hooks/use-notifications";
import type { UserNotification } from "@/types/notification";

function notificationUrl(n: UserNotification): string | null {
 const d = n.data;
 if (d && typeof d === "object" && "url" in d && typeof d.url === "string") {
 return d.url;
 }
 return null;
}

export function NotificationBell({ headerActive }: { headerActive: boolean }) {
 const t = useTranslations("navigation");
 const { data: session } = useSession();
 const user = session?.user;
 const [open, setOpen] = React.useState(false);
 const router = useRouter();

 const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
 useNotificationsInfinite({ limit: 15 }, { enabled: !!user?.token });

 const markRead = useMarkNotificationRead();

 const items = React.useMemo(
 () => data?.pages.flatMap((p) => p.data) ?? [],
 [data],
 );

 const unreadCount = React.useMemo(
 () => items.filter((n) => !n.isRead).length,
 [items],
 );

 if (!user?.token) return null;

 const handleOpenItem = (n: UserNotification) => {
 if (!n.isRead) markRead.mutate(n.id);
 const url = notificationUrl(n);
 if (url) {
 if (url.startsWith("http://") || url.startsWith("https://")) {
 window.open(url, "_blank", "noopener,noreferrer");
 } else {
 router.push(url as Parameters<typeof router.push>[0]);
 }
 setOpen(false);
 }
 };

 return (
 <DropdownMenu open={open} onOpenChange={setOpen}>
 <DropdownMenuTrigger asChild>
 <button
 type="button"
 className={cn(
 "relative p-1.5 rounded-full transition-all active:scale-90",
 headerActive
 ? "bg-primary/5 text-primary/80 hover:bg-primary/10"
 : "bg-black/5 text-primary hover:bg-black/10",
 )}
 aria-label={t("notifications")}
 >
 <Bell className="h-3.5 w-3.5" />
 {unreadCount > 0 && (
 <Badge className="absolute -top-0.5 -right-0.5 min-h-4 min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full p-0 text-[9px] font-medium border border-white bg-primary text-white leading-none">
 {unreadCount > 99 ? "99+" : unreadCount}
 </Badge>
 )}
 </button>
 </DropdownMenuTrigger>
 <DropdownMenuContent
 align="end"
 className="w-[min(100vw-2rem,22rem)] rounded-lg border border-black/10 bg-white p-0 shadow-sm"
 sideOffset={8}
 >
 <div className="border-b border-black/5 px-3 py-2">
 <p className="text-[10px] font-medium text-muted-foreground">
 {t("notifications")}
 </p>
 </div>
 <div className="max-h-80 overflow-y-auto">
 {isLoading && (
 <p className="px-3 py-8 text-center text-xs text-muted-foreground">
 {t("notificationsLoading")}
 </p>
 )}
 {isError && (
 <p className="px-3 py-8 text-center text-xs text-destructive">
 {t("notificationsError")}
 </p>
 )}
 {!isLoading && !isError && items.length === 0 && (
 <p className="px-3 py-8 text-center text-xs text-muted-foreground">
 {t("notificationsEmpty")}
 </p>
 )}
 {!isLoading &&
 !isError &&
 items.map((n) => (
 <button
 key={n.id}
 type="button"
 onClick={() => handleOpenItem(n)}
 className={cn(
 "w-full text-left border-b border-black/5 px-3 py-2.5 text-xs transition-colors hover:bg-primary/5 last:border-0",
 !n.isRead && "bg-primary/6",
 )}
 >
 <p
 className={cn(
 "font-semibold text-foreground line-clamp-1",
 !n.isRead && "text-primary",
 )}
 >
 {n.title}
 </p>
 {n.description ? (
 <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
 {n.description}
 </p>
 ) : null}
 <p className="mt-1 text-[10px] text-muted-foreground/80">
 {new Date(n.createdAt).toLocaleString()}
 </p>
 </button>
 ))}
 </div>
 {hasNextPage && (
 <div className="border-t border-black/5 p-2">
 <Button
 variant="ghost"
 size="sm"
 className="w-full h-8 text-xs"
 disabled={isFetchingNextPage}
 onClick={() => fetchNextPage()}
 >
 {isFetchingNextPage ? "…" : t("notificationsLoadMore")}
 </Button>
 </div>
 )}
 </DropdownMenuContent>
 </DropdownMenu>
 );
}
