import { cn } from "../../../lib/cn";
import { Skeleton } from "../Skeleton";
import { tableRowDividerClassName } from "./tableDividerStyles";

export function TableBodySkeleton({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`table-skeleton-row-${rowIndex}`} className="group">
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <td
              key={`table-skeleton-cell-${rowIndex}-${columnIndex}`}
              className={cn(
                "px-4 py-3",
                rowIndex < rows - 1 && tableRowDividerClassName,
              )}
            >
              <Skeleton className="h-4 w-full max-w-[12rem]" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
