import { cn } from "../../../lib/cn";
import { textMetaClasses } from "../../../lib/typography";
import { Skeleton } from "../Skeleton";
import { tableColumnDividerClassName } from "./tableDividerStyles";
import {
  tableHeaderCellPaddingClassName,
  tableHeaderRowClassName,
  tablePinnedHeaderColumnClassName,
} from "./tableHeaderStyles";

const pinnedColumnClassName = cn(
  "sticky left-0 min-w-[7.5rem]",
  tablePinnedHeaderColumnClassName,
);

export function TableTransposedViewSkeleton({
  fieldRows = 6,
  dataColumns = 3,
}: {
  fieldRows?: number;
  dataColumns?: number;
}) {
  return (
    <div className="w-full overflow-x-auto" aria-hidden>
      <table className="w-full min-w-full border-separate border-spacing-0">
        <thead>
          <tr className={tableHeaderRowClassName}>
            <th
              className={cn(
                tableHeaderCellPaddingClassName,
                pinnedColumnClassName,
                tableColumnDividerClassName,
              )}
            >
              <Skeleton variant="text" className="h-3.5 w-16" />
            </th>
            {Array.from({ length: dataColumns }).map((_, index) => (
              <th
                key={`transposed-skeleton-head-${index}`}
                className={cn(
                  "min-w-[8.5rem]",
                  tableHeaderCellPaddingClassName,
                  tablePinnedHeaderColumnClassName,
                  index < dataColumns - 1 && tableColumnDividerClassName,
                )}
              >
                <Skeleton variant="text" className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: fieldRows }).map((_, rowIndex) => (
            <tr key={`transposed-skeleton-row-${rowIndex}`}>
              <th
                scope="row"
                className={cn(
                  "px-3 py-2.5 align-top",
                  pinnedColumnClassName,
                  tableColumnDividerClassName,
                  textMetaClasses,
                )}
              >
                <Skeleton variant="text" className="h-3.5 w-16" />
              </th>
              {Array.from({ length: dataColumns }).map((_, colIndex) => (
                <td
                  key={`transposed-skeleton-cell-${rowIndex}-${colIndex}`}
                  className={cn(
                    "min-w-[8.5rem] bg-page px-3 py-2.5 text-left",
                    colIndex < dataColumns - 1 && tableColumnDividerClassName,
                  )}
                >
                  <Skeleton variant="text" className="h-4 w-full max-w-[6rem]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
