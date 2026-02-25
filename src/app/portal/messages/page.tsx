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

const data: Message[] = [
  {
    id: "M-1",
    from: "Support Team",
    preview: "Welcome to the Doctasime portal! Here is how you can manage...",
    status: "read",
    receivedAt: "2h ago",
  },
  {
    id: "M-2",
    from: "Alice Johnson",
    preview: "I have a question regarding the dosage of the enzyme extract...",
    status: "unread",
    receivedAt: "15m ago",
  },
  {
    id: "M-3",
    from: "System",
    preview: "Your password was successfully updated.",
    status: "read",
    receivedAt: "1d ago",
  },
];

const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => (
      <div
        className={`h-2 w-2 rounded-full ${row.getValue("status") === "unread" ? "bg-primary" : "bg-transparent"}`}
      />
    ),
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => (
      <span
        className={`font-bold ${row.original.status === "unread" ? "text-black" : "text-gray-500"}`}
      >
        {row.getValue("from")}
      </span>
    ),
  },
  {
    accessorKey: "preview",
    header: "Message",
    cell: ({ row }) => (
      <span className="text-gray-500 line-clamp-1 truncate max-w-md">
        {row.getValue("preview")}
      </span>
    ),
  },
  {
    accessorKey: "receivedAt",
    header: "Received",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-primary"
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

export default function PortalMessagesPage() {
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

      <DataTable columns={columns} data={data} searchKey="from" />
    </div>
  );
}
