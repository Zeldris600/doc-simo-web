"use client";

import { CustomerProfile } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@/i18n/routing";
import { MoreHorizontal, MessageSquare, User } from "@/lib/icons";
import { useSupportThreads } from "@/hooks/use-support";
import { useCan } from "@/hooks/use-can";
import { toast } from "sonner";

export function CustomerRowActions({
  customer,
}: {
  customer: CustomerProfile;
}) {
  const router = useRouter();
  const { can } = useCan();
  const canMessage = can("support:read");
  const { data: threads = [] } = useSupportThreads(undefined, {
    enabled: canMessage,
  });

  const handleMessage = () => {
    const thread = threads.find((t) => t.customerUserId === customer.userId);
    if (thread) {
      router.push(`/admin/support/${thread.id}`);
      return;
    }
    toast.info(
      "No support conversation yet. The customer can start one from Consultation.",
    );
    router.push("/admin/support");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-9 p-0"
          type="button"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-lg border border-black/8 bg-white shadow-sm p-1 min-w-[180px]"
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5">
          Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-black/5" />
        <DropdownMenuItem asChild className="rounded-md cursor-pointer text-sm">
          <Link
            href={`/admin/customers/${customer.id}`}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            View profile
          </Link>
        </DropdownMenuItem>
        {canMessage && (
          <DropdownMenuItem
            className="rounded-md cursor-pointer text-sm"
            onClick={handleMessage}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message customer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
