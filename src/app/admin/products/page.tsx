"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "draft" | "archived";
  image: string;
};

const data: Product[] = [
  {
    id: "p-001",
    name: "Organic Ashwagandha Root Extract",
    price: 34.0,
    stock: 156,
    category: "Stress Relief",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=100",
  },
  {
    id: "p-002",
    name: "Pure Papaya Enzyme Drops",
    price: 39.0,
    stock: 89,
    category: "Digestion",
    status: "active",
    image:
      "https://images.unsplash.com/photo-1596541249704-54fd0c326cfd?q=80&w=100",
  },
  {
    id: "p-003",
    name: "Elderberry Immunity Syrup",
    price: 24.5,
    stock: 0,
    category: "Immunity",
    status: "draft",
    image:
      "https://images.unsplash.com/photo-1622484211148-7bf331d27993?q=80&w=100",
  },
  {
    id: "p-004",
    name: "Nightly Sleep Support Bundle",
    price: 89.0,
    stock: 42,
    category: "Sleep",
    status: "archived",
    image:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=100",
  },
];

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={row.getValue("image")}
            alt={row.getValue("name")}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-bold text-black">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <span className="font-bold text-black">${price.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "stock",
    header: "Inventory",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return (
        <span
          className={`font-bold ${stock === 0 ? "text-destructive" : "text-gray-500"}`}
        >
          {stock} in stock
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={`rounded px-3 py-0.5 text-[10px] font-bold uppercase border-none ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : status === "draft"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </Badge>
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
            Manage
          </DropdownMenuLabel>
          <DropdownMenuItem className="text-sm font-medium">
            Edit details
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm font-medium">
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem className="text-sm font-medium text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function AdminProductsPage() {
  const addAction = (
    <Button className="rounded px-6 py-6 bg-primary text-white font-bold uppercase text-[10px] tracking-widest transition-all hover:scale-105 gap-2 border-none">
      <Plus className="w-4 h-4" /> Add Product
    </Button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black capitalize">
          Product Catalog
        </h2>
        <p className="text-[10px] font-bold text-gray-400 capitalize tracking-widest">
          View and manage your clinical herbal products.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        action={addAction}
      />
    </div>
  );
}
