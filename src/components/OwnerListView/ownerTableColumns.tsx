import { Mail, Phone } from "lucide-react";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textMetaClasses } from "../../lib/typography";
import type { TableColumn } from "../ui/Table";
import type { UiControlSize } from "../ui/commonTypes";
import { OwnerRowActions } from "./OwnerRowActions";
import { OwnerStatusBadge } from "./OwnerStatusBadge";
import {
  formatOptionalOwnerText,
  formatOwnerJoinedAt,
  resolveOwnerContacts,
  resolveOwnerDisplayName,
} from "./ownerListFields";
import {
  buildOwnerRowActions,
  hasOwnerWorkflowActions,
  type OwnerWorkflowActionsConfig,
} from "./ownerWorkflowActions";
import type { Owner } from "./types";

function OwnerNameCell({
  owner,
  onClick,
}: {
  owner: Owner;
  onClick?: (owner: Owner) => void;
}) {
  const content = (
    <span
      className={cn(
        "block w-full min-w-0 truncate font-medium text-secondary",
        textBodySmClasses,
      )}
    >
      {owner.name}
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(owner)}
        className="block w-full min-w-0 text-start underline-offset-2 hover:underline"
      >
        {content}
      </button>
    );
  }

  return content;
}

function OwnerContactsCell({ owner }: { owner: Owner }) {
  const { email, phone } = resolveOwnerContacts(owner);

  if (!email && !phone) {
    return <span className={textMetaClasses}>{formatOptionalOwnerText()}</span>;
  }

  return (
    <div className="flex min-w-0 flex-col gap-0.5 text-start">
      {email ? (
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1.5 truncate",
            textBodySmClasses,
          )}
        >
          <Mail className="size-3.5 shrink-0 text-muted" aria-hidden />
          <span className="truncate">{email}</span>
        </span>
      ) : null}
      {phone ? (
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1.5 truncate",
            textMetaClasses,
          )}
        >
          <Phone className="size-3.5 shrink-0 text-muted" aria-hidden />
          <span className="truncate">{phone}</span>
        </span>
      ) : null}
    </div>
  );
}

export function buildOwnerTableColumns({
  buttonSize = "md",
  onClick,
  workflowActions,
}: {
  buttonSize?: UiControlSize;
  onClick?: (owner: Owner) => void;
  workflowActions?: OwnerWorkflowActionsConfig;
} = {}): TableColumn<Owner>[] {
  const rowActions = hasOwnerWorkflowActions(workflowActions)
    ? buildOwnerRowActions(workflowActions)
    : undefined;
  const showActions = Boolean(rowActions);

  const columns: TableColumn<Owner>[] = [
    {
      id: "name",
      header: "Name",
      align: "start",
      sortable: true,
      minWidth: 160,
      getSortValue: (row) => row.name,
      render: (row) => <OwnerNameCell owner={row} onClick={onClick} />,
    },
    {
      id: "contacts",
      header: "Contacts",
      align: "start",
      sortable: true,
      minWidth: 180,
      getSortValue: (row) =>
        [row.email, row.phone].filter(Boolean).join(" "),
      render: (row) => <OwnerContactsCell owner={row} />,
    },
    {
      id: "joinedAt",
      header: "Joined at",
      align: "start",
      sortable: true,
      minWidth: 140,
      getSortValue: (row) => row.joinedAt,
      cellClassName: "whitespace-nowrap tabular-nums",
      render: (row) => formatOwnerJoinedAt(row.joinedAt),
    },
    {
      id: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: 140,
      minWidth: 120,
      getSortValue: (row) => row.status.label,
      cellClassName: "whitespace-nowrap",
      render: (row) => (
        <div className="flex justify-center">
          <OwnerStatusBadge status={row.status} />
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
          <OwnerRowActions
            row={row}
            buttonSize={buttonSize}
            rowActions={rowActions}
            ariaLabel={`Actions for ${resolveOwnerDisplayName(row)}`}
          />
        </div>
      ),
    });
  }

  return columns;
}
