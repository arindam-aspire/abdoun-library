import { cn } from "../../lib/cn";
import type { BadgeVariant } from "../ui/Badge";
import { Badge } from "../ui/Badge";
import type { OwnerStatus, OwnerStatusKey } from "./types";

const OWNER_STATUS_BADGE_VARIANT: Record<OwnerStatusKey, BadgeVariant> = {
  active: "success",
  suspended: "destructive",
};

const OWNER_STATUS_BADGE_CLASSNAME: Partial<Record<OwnerStatusKey, string>> = {};

type OwnerStatusBadgeProps = {
  status: OwnerStatus;
};

export function OwnerStatusBadge({ status }: OwnerStatusBadgeProps) {
  return (
    <Badge
      variant={OWNER_STATUS_BADGE_VARIANT[status.key]}
      appearance="soft"
      className={cn(
        "w-fit max-w-max shrink-0 whitespace-nowrap",
        OWNER_STATUS_BADGE_CLASSNAME[status.key],
      )}
    >
      {status.label}
    </Badge>
  );
}
