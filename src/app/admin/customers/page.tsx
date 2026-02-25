"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  avatar?: string;
};

const data: Customer[] = [
  {
    id: "c-101",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+33 6 12 34 56 78",
    orders: 12,
    totalSpent: 450.5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
  },
  {
    id: "c-102",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    phone: "+44 20 7123 4567",
    orders: 3,
    totalSpent: 120.0,
  },
  {
    id: "c-103",
    name: "Charlie Davis",
    email: "charlie@webmail.fr",
    phone: "+33 7 88 99 00 11",
    orders: 25,
    totalSpent: 1250.75,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
  },
  {
    id: "c-104",
    name: "Dr. Emily White",
    email: "ewhite@clinic.org",
    phone: "+1 202 555 0178",
    orders: 8,
    totalSpent: 890.2,
  },
];

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const avatar = row.original.avatar;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-gray-100 shadow-none rounded">
            <AvatarImage src={avatar} className="rounded" />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold rounded">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-black">{name}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
              ID: {row.original.id}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Mail className="w-3 h-3 text-gray-400" /> {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <Phone className="w-3 h-3 text-gray-400" /> {row.original.phone}
      </div>
    ),
  },
  {
    accessorKey: "orders",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 text-xs font-bold uppercase tracking-wider"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Orders
      </Button>
    ),
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalSpent"));
      return (
        <span className="font-bold text-black">${amount.toLocaleString()}</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded border-gray-100 shadow-none"
        >
          <DropdownMenuLabel className="text-xs font-bold uppercase text-gray-400">
            Settings
          </DropdownMenuLabel>
          <DropdownMenuItem className="text-sm font-medium">
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm font-medium">
            Message customer
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm font-medium text-destructive">
            Block account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black capitalize">
          Customer Management
        </h2>
        <p className="text-[10px] font-bold text-gray-400 capitalize tracking-widest">
          Track and manage your community of wellness seekers.
        </p>
      </div>

      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  );
}
