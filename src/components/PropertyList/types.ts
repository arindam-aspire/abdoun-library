import { PropertyCardDetails } from "../PropertyCard";

export type PropertyListView = "grid" | "list";

export type PropertyListSortOption = {
  label: string;
  value: string;
};

export type PropertyListToolbarProps = {
  title: string;
  layoutVariant: PropertyListView;
  showSort?: boolean;
  showViewToggle?: boolean;
  listingCount?: number;
  /** Defaults to `"listings"`. */
  listingsLabel?: string;
  sortOptions?: PropertyListSortOption[];
  sortValue?: string;
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
  onViewChange?: (view: PropertyListView) => void;
  className?: string;
};

export type PropertyListGridViewProps = {
  layoutVariant: PropertyListView;
  data: PropertyCardDetails[];
  isAuthenticated?: boolean;
  showOwners?: boolean;
  showAgents?: boolean;
  showBadges?: boolean;
  onEmail?: (propertyId: number) => void;
  onCall?: (propertyId: number) => void;
  onWhatsApp?: (propertyId: number) => void;
  onFavourite?: (propertyId: number) => void;
  onDetailsClick?: (propertyId: number) => void;
};

export type PropertyListPagination = {
  totalResults: number;
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export type PropertyListProps = {
  isLoading?: boolean;
  data: PropertyCardDetails[];
  toolbar: PropertyListToolbarProps;
  layoutVariant: PropertyListView;
  isAuthenticated?: boolean;
  showOwners?: boolean;
  showAgents?: boolean;
  showBadges?: boolean;
  onEmail?: (propertyId: number) => void;
  onCall?: (propertyId: number) => void;
  onWhatsApp?: (propertyId: number) => void;
  onFavourite?: (propertyId: number) => void;
  onDetailsClick?: (propertyId: number) => void;
  pagination: PropertyListPagination;
  className?: string;
  /** Shown when `!isLoading` and `data` is empty. Defaults to `"No data found"`. */
  emptyTitle?: string;
  emptyDescription?: string;
};
