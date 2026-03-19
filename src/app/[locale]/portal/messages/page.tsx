"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash2 } from "lucide-react";

type Message = {
  id: string;
  from: string;
  preview: string;
  status: "read" | "unread";
  receivedAt: string;
};

import { useSupportThreads } from "@/hooks/use-support";
import { SupportThread } from "@/services/support.service";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PortalMessagesPage() {
  const router = useRouter();
  const { data: threads = [], isLoading } = useSupportThreads();

  const columns: ColumnDef<SupportThread>[] = [
    {
      accessorKey: "status",
      header: "",
      cell: ({ row }) => (
        <div
          className={`h-2 w-2 rounded-full ${row.original.status === "OPEN" ? "bg-primary" : "bg-transparent"}`}
        />
      ),
    },
    {
      accessorKey: "id",
      header: "From",
      cell: ({ row }) => (
        <span
          className={`font-bold ${row.original.status === "OPEN" ? "text-black" : "text-gray-500"}`}
        >
          Clinical Support #{row.original.id.substring(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Update",
      cell: ({ row }) => <span className="text-gray-500">{new Date(row.original.updatedAt).toLocaleString()}</span>
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-primary"
            onClick={() => router.push(`/portal/tickets/${row.original.id}`)}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Inbox...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black capitalize">
          Inbox
        </h2>
        <p className="text-[10px] font-bold text-gray-400 capitalize">
          Your latest conversations and system notifications.
        </p>
      </div>

      <DataTable columns={columns} data={threads as SupportThread[]} searchKey="id" />
    </div>
  );
}
