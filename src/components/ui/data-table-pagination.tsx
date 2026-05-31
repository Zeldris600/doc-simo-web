"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "@/lib/icons";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  showSelection?: boolean;
}

export function DataTablePagination<TData>({
  table,
  showSelection = true,
}: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1 py-3">
      {showSelection ? (
        <div className="text-sm text-muted-foreground font-medium">
          {selectedCount} of {filteredCount} row(s) selected.
        </div>
      ) : (
        <div className="text-sm text-muted-foreground font-medium">
          {filteredCount} row(s)
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-black/60 whitespace-nowrap">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-[72px] border-gray-200 rounded-lg text-sm">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="rounded-lg border-gray-200">
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="text-sm">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm font-medium text-black/80 whitespace-nowrap">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(table.getPageCount(), 1)}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="hidden h-9 w-9 p-0 lg:flex border-gray-200 rounded-lg"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            type="button"
          >
            <span className="sr-only">Go to first page</span>
            <div className="flex -space-x-2">
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-gray-200 rounded-lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            type="button"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-gray-200 rounded-lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            type="button"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-9 w-9 p-0 lg:flex border-gray-200 rounded-lg"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            type="button"
          >
            <span className="sr-only">Go to last page</span>
            <div className="flex -space-x-2">
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
