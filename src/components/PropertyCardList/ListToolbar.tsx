import { LayoutGrid, List, ListFilter } from "lucide-react";
import { cn } from "../../lib/cn";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import { ToggleButton } from "../ui/ToggleButton";
import { ListToolbarSkleton } from "./ListToolbarSkleton";
import type { PropertyCardListToolbarProps } from "./types";

export function ListToolbar({
  isLoading = false,
  title = "Properties",
  layoutVariant,
  totalCount,
  listingsLabel = "listings",
  sortOptions,
  sortValue,
  defaultSortValue = "newest",
  onSortChange,
  onViewChange,
  className,
}: PropertyCardListToolbarProps) {
  if (isLoading) {
    return <ListToolbarSkleton className={className} />;
  }

  const showCount = totalCount != null;
  const showSort = Boolean(sortOptions && sortOptions.length > 0);
  const resolvedSortOptions = sortOptions ?? [];

  return (
    <div
      className={cn(
        "flex flex-col gap-2 md:gap-4 lg:gap-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <h2 className="text-xl font-bold text-secondary">
        {title}
        {showCount ? (
          <span className="ms-1 text-base font-normal text-muted sm:hidden">
            ({totalCount} {listingsLabel})
          </span>
        ) : null}
      </h2>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center md:gap-4 lg:gap-6">
        {showSort ? (
          <div className="relative w-full sm:w-auto">
            <ListFilter
              className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <SelectDropdown
              options={resolvedSortOptions}
              placeholder="Sort by"
              value={sortValue}
              defaultValue={defaultSortValue}
              onChange={(value) => {
                if (value !== SELECT_DROPDOWN_EMPTY_VALUE) {
                  onSortChange?.(value);
                }
              }}
              fullWidth
              wrapperClassName="w-full sm:w-auto"
              triggerClassName="h-11 min-w-[8.75rem] rounded-lg ps-9 pe-3 text-sm font-medium md:min-w-[11rem] lg:min-w-[12rem]"
              variant="outline"
              size="md"
              aria-label="Sort properties"
            />
          </div>
        ) : null}

        <ToggleButton
          items={[
            {
              value: "grid",
              label: "Grid",
              iconStart: <LayoutGrid />,
            },
            {
              value: "list",
              label: "List",
              iconStart: <List />,
            },
          ]}
          value={layoutVariant}
          onChange={(view) => onViewChange?.(view as "grid" | "list")}
          color="primary"
          variant="solid"
          size="md"
          fullWidth
          className="w-full sm:w-40 md:min-w-[11rem] lg:min-w-[12rem]"
          aria-label="Property view"
        />

        {showCount ? (
          <span className="hidden text-sm text-muted sm:inline sm:text-start">
            {totalCount} {listingsLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
