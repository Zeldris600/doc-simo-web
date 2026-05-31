"use client";

import { Link } from "@/i18n/routing";
import { Lock } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export default function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-xl border border-black/8 bg-white p-10 text-center shadow-none">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Lock className="size-8" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Access denied</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You do not have permission to perform this action. Contact an
          administrator if you need additional access.
        </p>
      </div>
      <Button asChild className="rounded-lg">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
