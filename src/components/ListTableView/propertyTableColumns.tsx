import { cn } from "../../lib/cn";
import { textBodySmClasses } from "../../lib/typography";
import type { PropertyListing } from "../PropertyCardList/types";
import type { TableColumn } from "../ui/Table";
import type { UiControlSize } from "../ui/commonTypes";
import { ListingStatusBadge } from "./ListingStatusBadge";
import { PropertyTableRowActions } from "./PropertyTableRowActions";
import type { PropertyTableRowActionsInput } from "./rowActionTypes";

type Locale = keyof PropertyListing["title"];

function resolveTitle(listing: PropertyListing, locale: Locale): string {
  return listing.title[locale] || listing.title.en;
}

function resolveLocation(listing: PropertyListing): string {
  return [listing.areaName, listing.city].filter(Boolean).join(", ");
}

function parsePriceValue(price: string): number {
  const match = price.match(/[\d,]+/);
  if (!match) return 0;
  return Number(match[0].replace(/,/g, ""));
}

export function buildPropertyTableColumns({
  locale = "en",
  buttonSize = "md",
  onClick,
  rowActions,
}: {
  locale?: Locale;
  buttonSize?: UiControlSize;
  onClick?: (listing: PropertyListing) => void;
  rowActions?: PropertyTableRowActionsInput;
}): TableColumn<PropertyListing>[] {
  const showActions = Boolean(rowActions);

  const columns: TableColumn<PropertyListing>[] = [
    {
      id: "reference",
      header: "Reference",
      align: "start",
      sortable: true,
      getSortValue: (row) => row.reference_number ?? row.property_id,
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.reference_number ?? row.property_id}
        </span>
      ),
    },
    {
      id: "title",
      header: "Property",
      align: "start",
      sortable: true,
      getSortValue: (row) => resolveTitle(row, locale),
      render: (row) =>
        onClick ? (
          <button
            type="button"
            onClick={() => onClick(row)}
            className={cn(
              textBodySmClasses,
              "block w-full min-w-0 truncate text-start font-medium text-secondary underline-offset-2 hover:underline",
            )}
          >
            {resolveTitle(row, locale)}
          </button>
        ) : (
          <span className="block w-full min-w-0 truncate text-start">
            {resolveTitle(row, locale)}
          </span>
        ),
    },
    {
      id: "location",
      header: "Location",
      align: "start",
      sortable: true,
      getSortValue: (row) => resolveLocation(row),
      render: (row) => (
        <span className="block w-full min-w-0 truncate text-text/80">
          {resolveLocation(row)}
        </span>
      ),
    },
    {
      id: "propertyType",
      header: "Type",
      align: "start",
      sortable: true,
      getSortValue: (row) => row.propertyType,
      cellClassName: "truncate",
      render: (row) => (
        <span className="block w-full min-w-0 truncate">{row.propertyType}</span>
      ),
    },
    {
      id: "price",
      header: "Price",
      align: "end",
      sortable: true,
      cellClassName: "font-medium text-secondary whitespace-nowrap tabular-nums",
      getSortValue: (row) => parsePriceValue(row.price),
      render: (row) => row.price,
    },
    {
      id: "beds",
      header: "Beds",
      align: "end",
      sortable: true,
      cellClassName: "tabular-nums",
      getSortValue: (row) => row.beds,
      render: (row) => row.beds,
    },
    {
      id: "baths",
      header: "Baths",
      align: "end",
      sortable: true,
      cellClassName: "tabular-nums",
      getSortValue: (row) => row.baths,
      render: (row) => row.baths,
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      sortable: true,
      getSortValue: (row) => row.status.label,
      width: 140,
      minWidth: 120,
      cellClassName: "whitespace-nowrap",
      render: (row) => (
        <div className="flex justify-center">
          <ListingStatusBadge status={row.status} />
        </div>
      ),
    },
  ];

  if (showActions) {
    columns.push({
      id: "actions",
      header: "",
      align: "center",
      width: 48,
      minWidth: 48,
      maxWidth: 80,
      resizable: false,
      headerClassName: "w-12 overflow-visible p-0",
      cellClassName: "overflow-visible p-0",
      render: (row) => (
        <div className="flex justify-center">
          <PropertyTableRowActions
            listing={row}
            buttonSize={buttonSize}
            rowActions={rowActions}
          />
        </div>
      ),
    });
  }

  return columns;
}
