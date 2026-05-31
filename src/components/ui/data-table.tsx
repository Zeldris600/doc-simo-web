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
  FilterFn,
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
import { selectColumn } from "@/lib/data-table-columns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type DataTableFilterDef = {
  columnId: string;
  label: string;
  options: { label: string; value: string }[];
};

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function createGlobalFilterFn<TData>(
  searchKeys?: string[],
): FilterFn<TData> {
  return (row, _columnId, filterValue) => {
    const q = String(filterValue ?? "")
      .trim()
      .toLowerCase();
    if (!q) return true;

    if (searchKeys?.length) {
      return searchKeys.some((key) => {
        const val = getNestedValue(row.original, key);
        return val != null && String(val).toLowerCase().includes(q);
      });
    }

    return Object.values(row.original as object).some((val) => {
      if (val == null) return false;
      if (typeof val === "object") return false;
      return String(val).toLowerCase().includes(q);
    });
  };
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Single-column filter (legacy). Prefer globalFilter + searchKeys. */
  searchKey?: string;
  /** Dot-path keys for global search, e.g. `user.name`, `email`. */
  searchKeys?: string[];
  searchPlaceholder?: string;
  filters?: DataTableFilterDef[];
  filterSlot?: React.ReactNode;
  action?: React.ReactNode;
  pageCount?: number;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  isLoading?: boolean;
  initialPageSize?: number;
  showToolbar?: boolean;
  enableRowSelection?: boolean;
  /** When true, omits outer card border (use inside a parent Card). */
  embedded?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchKeys,
  searchPlaceholder = "Search…",
  filters = [],
  filterSlot,
  action,
  pageCount,
  pagination,
  onPaginationChange,
  isLoading,
  initialPageSize = 10,
  showToolbar = true,
  enableRowSelection = true,
  embedded = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const useGlobalSearch = Boolean(searchKeys?.length || !searchKey);

  const tableColumns = React.useMemo(() => {
    const cols = enableRowSelection
      ? [selectColumn<TData>(), ...columns]
      : columns;
    return cols;
  }, [columns, enableRowSelection]);

  const globalFilterFn = React.useMemo(
    () => createGlobalFilterFn<TData>(searchKeys),
    [searchKeys],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
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
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: useGlobalSearch ? globalFilterFn : undefined,
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: initialPageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      ...(useGlobalSearch ? { globalFilter } : {}),
      ...(pagination && { pagination }),
    },
  });

  const clearAllFilters = () => {
    setGlobalFilter("");
    table.resetColumnFilters();
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue("");
    }
  };

  const hasActiveFilters =
    Boolean(globalFilter) ||
    columnFilters.length > 0 ||
    (searchKey &&
      Boolean(table.getColumn(searchKey)?.getFilterValue()));

  const renderFilterSelect = (filter: DataTableFilterDef, compact = false) => {
    const col = table.getColumn(filter.columnId);
    if (!col) return null;
    const current = (col.getFilterValue() as string) ?? "all";

    return (
      <Select
        key={filter.columnId}
        value={current === "" ? "all" : current}
        onValueChange={(value) =>
          col.setFilterValue(value === "all" ? undefined : value)
        }
      >
        <SelectTrigger
          className={
            compact
              ? "h-10 w-[min(160px,100%)] shrink-0 text-sm border-gray-200 rounded-lg"
              : "h-10 w-[140px] shrink-0 text-sm border-gray-200 rounded-lg"
          }
          aria-label={filter.label}
        >
          <SelectValue placeholder={filter.label} />
        </SelectTrigger>
        <SelectContent className="rounded-lg">
          {filter.options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  if (isLoading) {
    return (
      <TableSkeleton
        columnCount={tableColumns.length}
        rowCount={initialPageSize}
      />
    );
  }

  return (
    <div className="space-y-4">
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2 pb-2 pt-1">
          <div className="relative flex-1 min-w-[180px] max-w-md">
            <Input
              placeholder={searchPlaceholder}
              value={
                useGlobalSearch
                  ? (globalFilter ?? "")
                  : ((table
                      .getColumn(searchKey ?? "")
                      ?.getFilterValue() as string) ?? "")
              }
              onChange={(event) => {
                const v = event.target.value;
                if (useGlobalSearch) {
                  setGlobalFilter(v);
                } else if (searchKey) {
                  table.getColumn(searchKey)?.setFilterValue(v);
                }
              }}
              className="h-10"
            />
          </div>
          {filters.map((f) => renderFilterSelect(f, true))}
          {filterSlot}
          {filters.length > 4 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  type="button"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">More filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Filters</p>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      type="button"
                      onClick={clearAllFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  {filters.slice(4).map((f) => (
                    <div key={f.columnId} className="space-y-1">
                      <Label className="text-xs font-medium text-muted-foreground">
                        {f.label}
                      </Label>
                      {renderFilterSelect(f)}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 text-sm shrink-0"
              type="button"
              onClick={clearAllFilters}
            >
              Clear filters
            </Button>
          )}
          {action && (
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {action}
            </div>
          )}
        </div>
      )}

      <div
        className={
          embedded
            ? "overflow-hidden"
            : "rounded-xl border border-black/8 overflow-hidden bg-white shadow-sm"
        }
      >
        <Table>
          <TableHeader className="bg-muted/40 border-b border-black/6">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-black/6"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-sm font-semibold text-foreground/80 py-3 px-4"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-black/6 hover:bg-muted/30 transition-colors data-[state=selected]:bg-primary/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 text-sm">
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
                  colSpan={tableColumns.length}
                  className="h-32 text-center text-muted-foreground font-medium text-sm"
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        showSelection={enableRowSelection}
      />
    </div>
  );
}
