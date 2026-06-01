import { LayoutGrid, List, ListFilter } from "lucide-react";
import { cn } from "../../lib/cn";
import { selectLeadingIconPositionClasses } from "../ui/controlSizes";
import {
  textPageTitleClasses,
  textPageTitleMetaClasses,
  textToolbarCountClasses,
} from "../../lib/typography";
import { SelectDropdown } from "../ui/SelectDropdown";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "../ui/SelectDropdown/types";
import { ToggleButton } from "../ui/ToggleButton";
import type { ToggleButtonItem } from "../ui/ToggleButton/types";
import { ListToolbarSkleton } from "./ListToolbarSkleton";
import type { CardLayoutVariant, PropertyCardListToolbarProps } from "./types";

type ListToolbarProps = PropertyCardListToolbarProps & {
  layoutVariant: CardLayoutVariant;
  title?: string;
};

export function ListToolbar({
  isLoading = false,
  layoutVariant,
  title = "Properties",
  totalCount,
  listingsLabel = "listings",
  sortOptions,
  sortValue,
  onSortChange,
  onViewChange,
  className,
}: ListToolbarProps) {
  if (isLoading) {
    return <ListToolbarSkleton className={className} />;
  }

  const showCount = totalCount != null;
  const showSort = Boolean(sortOptions && sortOptions.length > 0);
  const resolvedSortOptions = sortOptions ?? [];

  const viewToggleItems: ToggleButtonItem<CardLayoutVariant>[] = [
    {
      value: "grid",
      label: <span className="hidden md:inline">Grid</span>,
      iconStart: <LayoutGrid />,
    },
    {
      value: "list",
      label: <span className="hidden md:inline">List</span>,
      iconStart: <List />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between md:gap-4 lg:gap-6",
        className,
      )}
    >
      <h2 className={cn("font-bold text-secondary", textPageTitleClasses)}>
        {title}
        {showCount ? (
          <span className={cn("ms-1 sm:hidden", textPageTitleMetaClasses)}>
            ({totalCount} {listingsLabel})
          </span>
        ) : null}
      </h2>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center md:gap-4 lg:gap-6">
        <div className="flex w-full flex-row flex-nowrap items-center gap-2 md:contents">
          {showSort ? (
            <div className="relative min-w-0 flex-1 md:w-auto md:flex-none">
              <ListFilter
                className={cn(
                  "pointer-events-none absolute z-10 text-muted",
                  selectLeadingIconPositionClasses.md,
                )}
                aria-hidden
              />
              <SelectDropdown
                options={resolvedSortOptions}
                placeholder="Sort by"
                value={sortValue}
                onChange={(value) => {
                  if (value !== SELECT_DROPDOWN_EMPTY_VALUE) {
                    onSortChange?.(value);
                  }
                }}
                fullWidth
                hasLeadingIcon
                wrapperClassName="w-full min-w-0 md:w-auto"
                triggerClassName="min-w-[8.75rem] rounded-lg md:min-w-[11rem] lg:min-w-[12rem]"
                variant="outline"
                size="md"
                aria-label="Sort properties"
              />
            </div>
          ) : null}

          <ToggleButton
            items={viewToggleItems}
            value={layoutVariant}
            onChange={(view) => onViewChange?.(view as CardLayoutVariant)}
            color="primary"
            variant="solid"
            size="md"
            className="shrink-0 sm:w-auto md:min-w-[11rem] lg:min-w-[12rem]"
            aria-label="Property view"
          />
        </div>

        {showCount ? (
          <span
            className={cn("hidden sm:inline sm:text-start", textToolbarCountClasses)}
          >
            {totalCount} {listingsLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
