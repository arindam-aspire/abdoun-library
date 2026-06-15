import type { ReactNode } from "react";
import type { PaginitionContent } from "../PropertyCardList/types";
import type { UiControlSize } from "../ui/commonTypes";
import type { DraftListEmptyContent } from "./DraftListEmpty";

export type { PaginitionContent as DraftListPagination };

export type DraftListItem = {
  id: string | number;
  /** Empty or whitespace-only values display as `Untitled`. */
  title: string;
  /** Pre-formatted label, e.g. `Updated Just now`. */
  updatedAtLabel: string;
  thumbnailUrl?: string | null;
  /** Taxonomy category, e.g. `Residential` — reserved for future use. */
  categoryLabel?: string;
  /** Property type, e.g. `Apartment`. Empty shows `Type not specified`. */
  propertyType: string;
  /** e.g. `For Sale`, `For Rent`. */
  listingPurposeLabel: string;
  /** Current step (1-based), aligned with `PropertyForm` `activeStep`. */
  currentStep: number;
  totalSteps: number;
  /** Optional override; otherwise derived from `currentStep / totalSteps`. */
  progressPercent?: number;
};

export interface DraftListColumnLabels {
  propertyDetails?: string;
  typePurpose?: string;
  progress?: string;
}

export interface DraftListItemProps {
  item: DraftListItem;
  onResume?: (item: DraftListItem) => void;
  onDelete?: (item: DraftListItem) => void;
  isDeleteLoading?: boolean;
  resumeLabel?: string;
  size?: UiControlSize;
  className?: string;
}

export interface DraftListProps {
  items: DraftListItem[];
  isLoading?: boolean;
  /** Skeleton row count; defaults to `pagination.pageSize` or `4`. */
  loadingCount?: number;
  onResume?: (item: DraftListItem) => void;
  onDelete?: (item: DraftListItem) => void;
  getDeleteLoading?: (item: DraftListItem) => boolean;
  resumeLabel?: string;
  size?: UiControlSize;
  /**
   * @deprecated Table headers removed. Kept for backward compatibility; ignored.
   */
  columnLabels?: DraftListColumnLabels;
  /** Full empty-state override. When omitted, the default empty design is shown. */
  emptyState?: ReactNode;
  emptyStateContent?: DraftListEmptyContent;
  onCreateNew?: () => void;
  createLabel?: string;
  /** Same pagination contract as `PropertyCardList`. Hidden when the list is empty. */
  pagination?: PaginitionContent;
  className?: string;
  itemClassName?: string;
}

export const UNTITLED_DRAFT_LABEL = "Untitled";

export function resolveDraftTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : UNTITLED_DRAFT_LABEL;
}

export function resolveDraftProgressPercent(item: DraftListItem): number {
  if (item.progressPercent != null) {
    return Math.min(Math.max(item.progressPercent, 0), 100);
  }

  if (item.totalSteps <= 0) {
    return 0;
  }

  const clampedStep = Math.min(
    Math.max(item.currentStep, 0),
    item.totalSteps,
  );

  return Math.round((clampedStep / item.totalSteps) * 100);
}
