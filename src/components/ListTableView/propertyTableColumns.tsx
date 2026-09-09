import { cn } from "../../lib/cn";
import { textBodySmClasses, textMetaClasses } from "../../lib/typography";
import type { PropertyListing } from "../PropertyCardList/types";
import type { TableColumn } from "../ui/Table";
import type { UiControlSize } from "../ui/commonTypes";
import { ListingStatusBadge } from "./ListingStatusBadge";
import {
  formatListingSubmissionDate,
  resolveListingLocation,
  resolveListingReference,
  resolveListingSubmittedBy,
  resolveListingTitle,
} from "./listTableListingFields";
import { PropertyTableRowActions } from "./PropertyTableRowActions";
import type { PropertyTableRowActionsInput } from "./rowActionTypes";

type Locale = keyof PropertyListing["title"];

function parsePriceValue(price: string): number {
  const match = price.match(/[\d,]+/);
  if (!match) return 0;
  return Number(match[0].replace(/,/g, ""));
}

function PropertyTitleCell({
  listing,
  locale,
  onClick,
}: {
  listing: PropertyListing;
  locale: Locale;
  onClick?: (listing: PropertyListing) => void;
}) {
  const title = resolveListingTitle(listing, locale);
  const reference = resolveListingReference(listing);

  const content = (
    <div className="flex min-w-0 flex-col gap-0.5 text-start">
      <span
        className={cn(
          "truncate font-medium text-secondary",
          textBodySmClasses,
        )}
      >
        {title}
      </span>
      {reference ? (
        <span className={cn("truncate", textMetaClasses)}>{reference}</span>
      ) : null}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(listing)}
        className="block w-full min-w-0 underline-offset-2 hover:underline"
      >
        {content}
      </button>
    );
  }

  return <div className="block w-full min-w-0">{content}</div>;
}

const EMPTY_CELL_VALUE = "—";

function SubmissionMetaCell({ listing }: { listing: PropertyListing }) {
  const submittedBy = resolveListingSubmittedBy(listing);
  const submittedOn = formatListingSubmissionDate(listing.submitted_on);
  const assignedAgent = listing.agent?.name?.trim();

  if (!submittedOn && !submittedBy && !assignedAgent) {
    return <span className={textMetaClasses}>{EMPTY_CELL_VALUE}</span>;
  }

  return (
    <div className="flex min-w-0 flex-col gap-0.5 text-start">
      <span
        className={cn(
          "truncate font-medium text-text",
          textBodySmClasses,
        )}
      >
        {submittedBy || EMPTY_CELL_VALUE}
      </span>
      {submittedOn ? (
        <span className={cn("truncate", textMetaClasses)}>{submittedOn}</span>
      ) : null}
      {assignedAgent ? (
        <span className={cn("truncate", textMetaClasses)}>
          Assigned: {assignedAgent}
        </span>
      ) : null}
    </div>
  );
}

export function buildPropertyTableColumns({
  locale = "en",
  buttonSize = "md",
  onClick,
  rowActions,
  includeSubmissionColumn = false,
}: {
  locale?: Locale;
  buttonSize?: UiControlSize;
  onClick?: (listing: PropertyListing) => void;
  rowActions?: PropertyTableRowActionsInput;
  /** When true, adds a stacked Submitted by / Submitted on column. */
  includeSubmissionColumn?: boolean;
}): TableColumn<PropertyListing>[] {
  const showActions = Boolean(rowActions);

  const columns: TableColumn<PropertyListing>[] = [
    {
      id: "title",
      header: "Property",
      align: "start",
      sortable: true,
      minWidth: 160,
      getSortValue: (row) => resolveListingTitle(row, locale),
      render: (row) => (
        <PropertyTitleCell listing={row} locale={locale} onClick={onClick} />
      ),
    },
    {
      id: "location",
      header: "Location",
      align: "start",
      sortable: true,
      getSortValue: (row) => resolveListingLocation(row),
      render: (row) => (
        <span className="block w-full min-w-0 truncate text-text/80">
          {resolveListingLocation(row)}
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
  ];

  if (includeSubmissionColumn) {
    columns.push({
      id: "submission",
      header: "Submitted",
      align: "start",
      sortable: true,
      minWidth: 148,
      getSortValue: (row) => row.submitted_on ?? "",
      render: (row) => <SubmissionMetaCell listing={row} />,
    });
  }

  columns.push(
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
  );

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
