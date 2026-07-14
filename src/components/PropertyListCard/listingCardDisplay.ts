import { getLocalizedText } from "../PropertyView/utils";
import type {
  ListingLocale,
  PropertyListing,
} from "../PropertyCardList/types";

export type { ListingLocale };

export function resolveListingTitle(
  title: PropertyListing["title"],
  locale: ListingLocale = "en",
): string {
  return getLocalizedText(title, locale);
}

/**
 * Formats listing price for display as `{amount} {CURRENCY}`.
 * Prefers a currency prefix already present in `price` (e.g. `"JOD 12000"`),
 * otherwise appends optional `currency` when provided.
 */
export function formatListingPrice(
  price: string,
  currency?: string | null,
): string {
  const normalized = price.trim();
  if (!normalized) {
    const code = currency?.trim();
    return code ? code.toUpperCase() : "";
  }

  const match = normalized.match(/^([A-Za-z]{3})\s+(.+)$/);
  if (match) {
    const [, code, amount] = match;
    return `${amount} ${code.toUpperCase()}`;
  }

  const code = currency?.trim();
  if (code) {
    return `${normalized} ${code.toUpperCase()}`;
  }

  return normalized;
}
