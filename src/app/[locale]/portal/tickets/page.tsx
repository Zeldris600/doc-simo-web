"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



import { useSupportThreads } from "@/hooks/use-support";
import { SupportThread } from "@/services/support.service";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const router = useRouter();
  const { data: threads = [], isLoading } = useSupportThreads();

  const columns: ColumnDef<SupportThread>[] = [
    {
      accessorKey: "id",
      header: "Ticket ID",
      cell: ({ row }) => <span className="text-[10px] font-black underline decoration-primary/20 cursor-pointer" onClick={() => router.push(`/portal/tickets/${row.original.id}`)}>#{row.original.id.substring(0, 8)}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            className={`rounded px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
              status === "OPEN"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <span className="text-[10px] font-bold text-gray-400">{new Date(row.original.createdAt).toLocaleDateString()}</span>
    },
    {
      accessorKey: "updatedAt",
      header: "Last Update",
      cell: ({ row }) => <span className="text-[10px] font-bold text-gray-400">{new Date(row.original.updatedAt).toLocaleString()}</span>
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded border-gray-100 shadow-none"
            >
              <DropdownMenuLabel className="text-xs font-bold uppercase text-gray-400">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem className="text-sm font-medium" onClick={() => router.push(`/portal/tickets/${row.original.id}`)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm font-medium text-destructive">
                Close thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing Tickets...</p>
      </div>
    );
  }

  const addAction = (
    <Button 
      className="rounded px-6 py-6 bg-black text-white font-bold uppercase text-[10px] tracking-widest transition-all hover:scale-105 border-none shadow-xl shadow-black/10"
      onClick={() => router.push('/portal/tickets/new')}
    >
      Open Consultation
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black capitalize">
          Consultations
        </h2>
        <p className="text-[10px] font-bold text-gray-400 capitalize tracking-widest">
          Your direct synchronization with our clinical team.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={threads as SupportThread[]}
        searchKey="id"
        action={addAction}
      />
    </div>
  );
}
