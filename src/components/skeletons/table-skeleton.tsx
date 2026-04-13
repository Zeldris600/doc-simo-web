import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

export function TableSkeleton({
  rowCount = 5,
  columnCount = 5,
}: TableSkeletonProps) {
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <Table>
        <TableHeader className="bg-gray-50/30 border-b border-gray-100">
          <TableRow className="hover:bg-transparent border-gray-100">
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead key={i} className="py-2.5 px-6">
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i} className="border-gray-100">
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableCell key={j} className="py-4 px-6">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
