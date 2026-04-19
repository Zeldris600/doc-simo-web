"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
  Updater,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "@/lib/icons";
import { DataTablePagination } from "./data-table-pagination";
import { TableSkeleton } from "../skeletons/table-skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  action?: React.ReactNode;
  pageCount?: number;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  isLoading?: boolean;
  /** Default page size for client-side pagination (default 10). */
  initialPageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  action,
  pageCount,
  pagination,
  onPaginationChange,
  isLoading,
  initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && onPaginationChange
      ? {
          pageCount,
          manualPagination: true,
          onPaginationChange,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      ...(pagination && { pagination }),
    },
  });

  if (isLoading) {
    return <TableSkeleton columnCount={columns.length} rowCount={10} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-4 pt-2">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          <div className="relative flex-1">
            <Input
              placeholder="Search"
              value={
                (table
                  .getColumn(searchKey ?? "")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchKey ?? "")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>

      <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Table>
          <TableHeader className="bg-gray-50/30 border-b border-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-gray-100"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-xs font-medium text-black/60 py-2.5 px-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-gray-100 hover:bg-gray-50/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-6 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-400 font-medium capitalize text-sm"
                >
                  {isLoading ? "Loading..." : "No records found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
