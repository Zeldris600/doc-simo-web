"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import { useSupportThreads } from "@/hooks/use-support";
import { SupportThread } from "@/services/support.service";
import { useRouter } from "next/navigation";

const STATS = (threads: SupportThread[]) => [
  {
    title: "Open Threads",
    value: threads.filter(t => t.status === 'OPEN').length,
    description: "Threads awaiting response",
    icon: Ticket,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Unread Messages",
    value: "5", // Placeholder as API doesn't specify unread count per thread yet
    description: "New notifications",
    icon: MessageSquare,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Closed Cases",
    value: threads.filter(t => t.status === 'CLOSED').length,
    description: "Resolved cases",
    icon: CheckCircle2,
    color: "text-orange-400",
    bg: "bg-orange-50",
  },
  {
    title: "Total Threads",
    value: threads.length,
    description: "Global ticket volume",
    icon: Clock,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function AdminSupportDashboard() {
  const router = useRouter();
  const { data: threads = [], isLoading } = useSupportThreads();

  const columns: ColumnDef<SupportThread>[] = [
    {
      accessorKey: "id",
      header: "Thread ID",
      cell: ({ row }) => <span className="text-[10px] font-black text-black/40">#{row.original.id.substring(0, 8)}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isOpen = row.original.status === 'OPEN';
        return (
          <Badge className={`border-none font-bold text-[8px] uppercase tracking-widest ${isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-black/5 text-black/40'}`}>
            {row.original.status}
          </Badge>
        );
      }
    },
    {
      accessorKey: "customerUserId",
      header: "Customer Reference",
      cell: ({ row }) => <span className="font-bold text-black/60 truncate max-w-[120px]">{row.original.customerUserId}</span>
    },
    {
      accessorKey: "updatedAt",
      header: "Last Activity",
      cell: ({ row }) => <span className="text-[10px] font-bold text-black/40 uppercase tracking-tighter">{new Date(row.original.updatedAt).toLocaleString()}</span>
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm" 
          className="font-black uppercase text-[8px] tracking-widest h-7 border-black/10 hover:bg-black/5"
          onClick={() => router.push(`/admin/support/${row.original.id}`)}
        >
          Manage Chat
        </Button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Connecting to Support Node...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader
        title="Support Center"
        description="Synchronized customer synchronization and consulting."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STATS(threads as SupportThread[]).map((stat) => (
          <Card
            key={stat.title}
            className="border-none bg-white rounded-xl overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-[10px] font-bold uppercase text-black/30 tracking-widest">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-black">{stat.value}</div>
              <p className="text-[10px] font-bold text-black/30 mt-1 uppercase tracking-tight">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black text-black uppercase tracking-widest">
          Active Support Threads
        </h3>
        <DataTable columns={columns} data={threads as SupportThread[]} searchKey="customerUserId" />
      </div>
    </div>
  );
}
