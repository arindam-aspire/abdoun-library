import type { PropertyListingStatus } from "../PropertyCardList/listingStatus";
import {
  getPropertyListingStatusColorScheme,
  statusColorSchemeToBadgeVariant,
} from "../PropertyCardList/listingStatus";
import { Badge } from "../ui/Badge";

type ListingStatusBadgeProps = {
  status: PropertyListingStatus;
};

export function ListingStatusBadge({ status }: ListingStatusBadgeProps) {
  const colorScheme = getPropertyListingStatusColorScheme(status.key);

  return (
    <Badge
      variant={statusColorSchemeToBadgeVariant(colorScheme)}
      appearance="soft"
      className="w-fit max-w-max shrink-0 whitespace-nowrap"
    >
      {status.label}
    </Badge>
  );
}
