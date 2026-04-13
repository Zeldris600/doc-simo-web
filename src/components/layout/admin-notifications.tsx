"use client";

import { Bell } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useNotificationsInfinite,
  useMarkNotificationRead,
} from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/** Simple relative time formatter since date-fns could not be installed */
function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  } catch (e) {
    return "";
  }
}

export function AdminNotifications() {
  const { data, isLoading } = useNotificationsInfinite({
    unreadOnly: false,
    limit: 10,
  });
  const { mutate: markRead } = useMarkNotificationRead();

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 border-none bg-transparent hover:bg-gray-100/80 transition-colors rounded-full"
        >
          <Bell className="h-5 w-5 text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 rounded-xl border-gray-100 shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-medium text-black ">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full ">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-2 w-2/3" />
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-gray-50 transition-colors border-b border-gray-50 last:border-0",
                    !notification.isRead && "bg-primary/[0.02]",
                  )}
                  onClick={() =>
                    !notification.isRead && markRead(notification.id)
                  }
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span className="font-medium text-xs text-black line-clamp-1">
                      {notification.title}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                      {formatRelativeTime(notification.createdAt || "")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
              <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">
                No notifications yet
              </p>
              <p className="text-xs text-gray-300 mt-1">
                We&apos;ll let you know when something happens.
              </p>
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center">
          <Button
            variant="link"
            className="text-[10px] font-medium text-primary h-auto p-0 hover:no-underline"
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
