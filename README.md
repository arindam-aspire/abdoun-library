# @abdoun/abdoun-library

Shared React UI component library for Abdoun applications. Components use your app’s CSS variables — the library does not ship colors.

## Install

```bash
npm install @abdoun/abdoun-library react react-dom
```

## Theme + styles (single `globals.css`)

### Do not

- `import "@abdoun/abdoun-library/styles.css"` in `layout.tsx` (second CSS bundle).
- `@import "@abdoun/abdoun-library/theme.css"` in CSS — **`@import` is hoisted above `:root`**, so Tailwind can map `page` / `surface` before your variables exist and colors look swapped.

### Do

Use **one** `globals.css`. Order matters:

1. `@import "tailwindcss"` (+ plugins)
2. `:root` / `.dark` / `.light` — your hex values
3. `@theme inline` — map `--color-page` → `var(--page)`, `--color-surface` → `var(--surface)` (in this file, after `:root`)
4. `@import "@abdoun/abdoun-library/integration.css"` — library scan only

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --page: #f8fafc;       /* app background */
  --surface: #ffffff;    /* cards, panels */
  --card-background: var(--surface);
  /* …primary, secondary, text, etc.… */
}

/* .dark / .light / prefers-color-scheme blocks */

@theme inline {
  --color-page: var(--page);
  --color-surface: var(--surface);
  --color-page-ghost: color-mix(in srgb, var(--page) 20%, var(--surface));
  --color-card-background: var(--card-background);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-text: var(--text);
  --color-muted: var(--muted);
  /* …see src/styles/theme.css (commented reference)… */
}

@import "@abdoun/abdoun-library/integration.css";
```

```tsx
// layout.tsx
import "./globals.css";
```

### Token semantics (do not swap)

| Variable | Role | Example (light) |
|----------|------|-----------------|
| `--page` | App / body background | `#f8fafc` |
| `--surface` | Cards, elevated panels | `#ffffff` |
| `--card-background` | `Card` component fill | `var(--surface)` |

## Components

The package exports **four components**:

```tsx
import {
  PropertyView,
  PropertyCardList,
  SimilarProperties,
  PropertyListCard,
} from "@abdoun/abdoun-library";
```

| Component | Purpose | Loading |
|-----------|---------|---------|
| `PropertyView` | Property detail page (gallery, tabs, agent/owner, pricing) | `isLoading={true}` |
| `PropertyCardList` | Property list page (toolbar, cards, pagination, empty state) | `isLoading={true}` |
| `SimilarProperties` | Horizontal carousel of similar listings on a detail page | `isLoading={true}` |
| `PropertyListCard` | Single listing card (`layoutVariant`: `"grid"` or `"list"`) | Used inside `PropertyCardList`; no standalone loading prop |

Types are not separate package exports. Infer props in your app:

```tsx
import type { ComponentProps } from "react";
import {
  PropertyView,
  PropertyCardList,
  SimilarProperties,
  PropertyListCard,
} from "@abdoun/abdoun-library";

type PropertyViewProps = ComponentProps<typeof PropertyView>;
type PropertyCardListProps = ComponentProps<typeof PropertyCardList>;
type SimilarPropertiesProps = ComponentProps<typeof SimilarProperties>;
type PropertyListCardProps = ComponentProps<typeof PropertyListCard>;
```

---

## Component API reference

Detailed props for all exported components. Optional props are marked **optional**; all others are required unless noted.

### PropertyView props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `isLoading` | `boolean` | `false` | No | When `true`, shows the built-in skeleton UI instead of property content. |
| `applicationKey` | `"abdoun_web"` \| `"mls_web"` | `"abdoun_web"` | No | Branding key for badges, gallery overlays, and app-specific UI. |
| `propertyDetails` | `object` (see below) | — | Yes* | Full property record. *Required when `isLoading` is `false`. |
| `isFavouriteLoading` | `boolean` | `false` | No | Shows spinner on favourite control; blocks clicks while loading. |
| `onClickFavourite` | `(id: number) => void` | — | No | Favourite toggle; receives `propertyDetails.id`. |
| `tabs` | `object` (see `tabs` below) | — | No | Controlled tab bar: options, active tab, change handler. |
| `features` | `array` (see `features[]` below) | `[]` | No | Feature/amenity catalog; matched to `propertyDetails.features_list` by `id`. |
| `showAgent` | `boolean` | `true` | No | Show listing agent block and contact actions in sidebar. |
| `showOwner` | `boolean` | `true` | No | Show owner block when `propertyDetails.owner.is_private` is `false`. |
| `onClickAgentEmail` | `(id: number) => void` | — | No | Agent email button handler. |
| `onClickAgentPhone` | `(id: number) => void` | — | No | Agent phone button handler. |
| `onClickAgentWhatsApp` | `(id: number) => void` | — | No | Agent WhatsApp button handler. |
| `onClickAgent` | `(id: number) => void` | — | No | Generic agent click (e.g. open agent profile). |
| `onClickOwnerEmail` | `(id: number) => void` | — | No | Owner email button handler. |
| `onClickOwnerPhone` | `(id: number) => void` | — | No | Owner phone button handler. |
| `onClickOwnerWhatsApp` | `(id: number) => void` | — | No | Owner WhatsApp button handler. |
| `onClickOwner` | `(id: number) => void` | — | No | Generic owner click. |
| `locale` | `"en"` \| `"ar"` \| `"esp"` \| `"fr"` | — | No | Locale for localized fields (`title`, `description`, address, etc.). |
| `className` | `string` | — | No | Extra CSS classes on the root `<article>`. |

#### `tabs` object

| Field | Type | Description |
|-------|------|-------------|
| `tabOptions` | `array` | Each item: `{ label: string; value: string; icon?: ReactNode }`. Icons default for `overview`, `features`, `locations`, and `documents` when omitted. `iconStart` is accepted as an alias of `icon`. |
| `activeTab` | `string` | Current tab value (controlled). |
| `onTabChange` | `(value: string) => void` | Called when user selects a tab. |

#### `features[]` item

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Must match `propertyDetails.features_list[].id`. |
| `type` | `"feature"` \| `"amenities"` | Feature category. |
| `slug` | `string` | Stable slug. |
| `label` | `string` | Label shown in the features tab. |

#### `propertyDetails` object

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Property id (passed to all callbacks). |
| `reference_number` | `string` | Listing reference code. |
| `url` | `string \| null` | Canonical property URL. |
| `title` | `{ en, ar, esp, fr: string }` | Localized title. |
| `description` | `{ en, ar, esp, fr: string \| null }` | Localized description. |
| `category` | `string` | e.g. residential, commercial. |
| `property_type` | `string` | e.g. apartment, villa. |
| `status` | `string` | Listing status. |
| `listing_type` | `string` | `"sale"` or rent-related value. |
| `selling_price_amount` | `number \| null` | Sale price amount. |
| `selling_price_currency` | `string \| null` | Sale currency. |
| `rent_price_amount` | `number \| null` | Rent price amount. |
| `rent_price_currency` | `string \| null` | Rent currency. |
| `bedrooms` | `number \| null` | Bedroom count (summary). |
| `bathrooms` | `number \| null` | Bathroom count (summary). |
| `built_up_area` | `number \| null` | Built-up area (summary). |
| `more_features` | `string[] \| null` | Extra feature strings for overview tab. |
| `latitude` | `number \| null` | Map latitude. |
| `longitude` | `number \| null` | Map longitude. |
| `location_name` | `string \| null` | Short location label. |
| `is_exclusive` | `boolean` | Exclusive listing badge. |
| `media` | `object` | See `propertyDetails.media` below. |
| `location_detail` | `object` | See `propertyDetails.location_detail` below. |
| `general` | `object` | See `propertyDetails.general` below. |
| `details` | `object` | See `propertyDetails.details` below. |
| `features` | `{ amenities: string[] }` | Raw amenity strings. |
| `features_list` | `{ id: number; feature_group: "FEATURE" \| "AMENITIES" }[]` | Selected catalog items. |
| `pricing` | `object` | See `propertyDetails.pricing` below. |
| `created_at` | `string` | ISO created timestamp. |
| `updated_at` | `string` | ISO updated timestamp. |
| `published_at` | `string \| null` | Publish date. |
| `expires_at` | `string \| null` | Expiry date. |
| `sold_at` | `string \| null` | Sold date. |
| `rented_at` | `string \| null` | Rented date. |
| `agent` | `object` | `{ id, name, phone, whatsapp, email, photo, license_number }`. |
| `owner` | `object` | `{ id, name, phone, email, is_private }`. |
| `created_by` | `object` | `{ id, name, role }`. |
| `agency` | `object \| null` | `{ agency_id, agency_name, email?, phone?, website?, ... }`. |

##### `propertyDetails.media`

| Field | Type | Description |
|-------|------|-------------|
| `thumbnail` | `string \| null` | Hero thumbnail URL. |
| `images` | `array` | `{ id, url, thumb_url, is_primary, order, caption }[]`. |
| `videos` | `string[]` | Video URLs. |
| `virtual_tour_url` | `string \| null` | Virtual tour link. |
| `floor_plan_images` | `array` | Same shape as `images`. |
| `documents` | `array` | Same shape as `images`. |

##### `propertyDetails.location_detail`

| Field | Type | Description |
|-------|------|-------------|
| `country_id`, `city_id`, `region_id` | `number` | Location ids. |
| `country`, `city`, `region` | `string` | Location names. |
| `address` | `{ en, ar, esp, fr: string }` | Localized address. |
| `latitude`, `longitude` | `number \| null` | Coordinates. |
| `map_embed_url` | `string \| null` | Embed URL for map iframe. |
| `local_highlights` | `string[]` | Optional neighborhood bullets. |
| `lifestyle_description` | `string \| null` | Optional neighborhood copy. |

##### `propertyDetails.general`

| Field | Type |
|-------|------|
| `floor_type`, `building_status`, `furniture_status`, `furniture_condition`, `garage_type` | `string \| null` |
| `floor_number`, `built_in_year`, `total_floors_in_building` | `number \| null` |

##### `propertyDetails.details`

| Field | Type |
|-------|------|
| `built_up_area`, `land_area`, `garden_area`, `terrace_area` | `number \| null` |
| `bedrooms`, `master_bedrooms`, `bathrooms`, `living_rooms`, `salons`, `balconies`, `entrances`, `kitchens`, `maid_rooms`, `driver_rooms`, `store_rooms` | `number \| null` |
| `area_unit`, `kitchen_type` | `string \| null` |

##### `propertyDetails.pricing`

| Field | Type | Description |
|-------|------|-------------|
| `listing_type` | `string` | Sale or rent type. |
| `selling_price` | `number \| null` | Price amount. |
| `currency` | `string \| null` | Currency code. |
| `price_on_request` | `boolean` | Hide numeric price. |
| `rent_commission_percent` | `number \| null` | Rent commission. |
| `contract_duration` | `number \| null` | Contract length. |
| `payment_method` | `string \| null` | Payment method label. |
| `is_negotiable` | `boolean` | Negotiable flag. |
| `installment_available` | `boolean` | Installment flag. |

#### PropertyView example

```tsx
import { PropertyView } from "@abdoun/abdoun-library";

<PropertyView
  isLoading={false}
  applicationKey="abdoun_web"
  propertyDetails={property}
  locale="en"
  showAgent
  showOwner
  features={featureCatalog}
  tabs={{ tabOptions, activeTab, onTabChange }}
  onClickFavourite={(id) => toggleFavourite(id)}
  onClickAgentEmail={(id) => openAgentEmail(id)}
/>
```

---

### PropertyCardList props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | `array` (see `data[]` below) | — | **Yes** | Listings to render as cards. |
| `toolbar` | `object` (see `toolbar` below) | — | **Yes** | Sort, count label, and grid/list toggle config. |
| `isLoading` | `boolean` | `false` | No | When `true`, shows built-in skeleton UI only. |
| `layoutVariant` | `"grid"` \| `"list"` | `"grid"` | No | Card layout for the list. |
| `listTitle` | `string` | — | No | Optional heading above the cards. |
| `pagination` | `object` (see `pagination` below) | — | No | Pagination state and handlers; omit to hide pagination. |
| `noDataFound` | `object` (see `noDataFound` below) | — | No | Empty state when `data.length === 0` and not loading. |
| `canViewOwners` | `boolean` | — | No | Show **Owners** section on cards when `data[].owners` has items. |
| `canViewAgents` | `boolean` | — | No | Show agent block on each card. |
| `canViewBadges` | `boolean` | — | No | Show badges (exclusive, etc.) on card images. |
| `onClick` | `(item) => void` | — | No | Card click; receives the listing object from `data`. |
| `onClickEmail` | `(item) => void` | — | No | Email contact on a card. |
| `onClickCall` | `(item) => void` | — | No | Phone contact on a card. |
| `onClickWhatsApp` | `(item) => void` | — | No | WhatsApp contact on a card. |
| `onClickFavourite` | `(item) => void` | — | No | Favourite toggle on a card. |
| `className` | `string` | — | No | Extra CSS classes on the root wrapper. |

#### `toolbar` object

| Field | Type | Description |
|-------|------|-------------|
| `listingsLabel` | `string` | Label beside total count (e.g. `"Properties"`). |
| `sortOptions` | `array` | Sort dropdown items (see below). |
| `sortValue` | `string` | Current selected sort value (controlled). |
| `onSortChange` | `(value: string) => void` | Called when sort selection changes. |
| `onViewChange` | `(view: "grid" \| "list") => void` | Called when grid/list toggle changes. |

##### `toolbar.sortOptions[]` item

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Dropdown label. |
| `value` | `string` | Value passed to `onSortChange`. |
| `disabled` | `boolean` | Optional; disable this option. |

#### `pagination` object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `total` | `number` | **Yes** | Total listings across all pages. |
| `page` | `number` | **Yes** | Current page (1-based). |
| `pageOptions` | `number[]` | No | Page-size choices (e.g. `[10, 20, 50]`). |
| `pageSize` | `number` | No | Items per page. |
| `totalPages` | `number` | No | Total pages; derived from `total` / `pageSize` if omitted. |
| `hasNext` | `boolean` | No | Enable next button. |
| `hasPrevious` | `boolean` | No | Enable previous button. |
| `maxPageButtons` | `number` | No | Max numbered page buttons shown. |
| `onPageSizeChange` | `(pageSize: number) => void` | No | Page size change handler. |
| `onPageChange` | `(page: number) => void` | No | Page change handler. |

#### `noDataFound` object

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Empty state heading. |
| `description` | `string` | Empty state body text. |
| `actions` | `ReactNode` | Optional buttons or links below the message. |

#### `data[]` item (listing)

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Listing id. |
| `property_id` | `string` | External property id. |
| `reference_number` | `string \| null` | Reference code. |
| `title` | `{ en, ar, esp, fr: string }` | Localized title. |
| `description` | `{ en, ar, esp, fr: string \| null }` | Localized description. |
| `price` | `string` | Formatted price (e.g. `"JOD 250,000"`). |
| `status` | `string` | Listing status. |
| `category` | `string` | Property category. |
| `searchPropertyType` | `string` | Search/filter type key. |
| `city` | `string` | City name. |
| `areaName` | `string` | Area or neighborhood. |
| `propertyType` | `string` | Display property type. |
| `media` | `object` | `thumbnail`, `images[]`, `videos[]`, `virtual_tour_url`, `floor_plan_images[]`, `documents[]`. |
| `location` | `object` | Same shape as `location_detail`. |
| `location_detail` | `object` | `country_id`, `country`, `city_id`, `city`, `region_id`, `region`, `address` (localized), `latitude`, `longitude`, `map_embed_url`. |
| `beds` | `number` | Bedroom count. |
| `baths` | `number` | Bathroom count. |
| `area` | `string \| null` | Area string (e.g. sqft). |
| `acres` | `string \| null` | Land size. |
| `highlights` | `string` | Short summary on list cards. |
| `badges` | `string[]` | Badge labels on card image. |
| `handover` | `string \| null` | Handover info. |
| `paymentPlan` | `string \| null` | Payment plan summary. |
| `validatedDate` | `string` | Validation date. |
| `brokerName` | `string` | Broker display name. |
| `brokerLogo` | `string \| null` | Broker logo URL. |
| `owners` | `array` | `{ owner_id, full_name, email, phone, nationality, ... }[]`. |
| `agency` | `object` | Optional agency details. |
| `agent` | `object` | Optional `{ id, name, phone, whatsapp, email, photo, license_number }`. |
| `is_exclusive` | `boolean` | Exclusive listing flag. |
| `is_favourite` | `boolean` | Favourite state. |
| `is_favourite_loading` | `boolean` | Per-card favourite loading spinner. |
| `favourite_id` | `string` | Favourite record id. |
| `property_hash` | `string` | Hash for sharing/deep links. |
| `user_id` | `string` | Associated user id. |

#### PropertyCardList example

```tsx
import { PropertyCardList } from "@abdoun/abdoun-library";

<PropertyCardList
  data={listings}
  layoutVariant="grid"
  listTitle="Properties for sale"
  toolbar={{
    listingsLabel: "Properties",
    sortOptions: [
      { label: "Newest", value: "newest" },
      { label: "Price: low to high", value: "price_asc" },
    ],
    sortValue,
    onSortChange: setSort,
    onViewChange: setLayout,
  }}
  pagination={{
    total: 1469,
    page: 1,
    pageSize: 10,
    pageOptions: [10, 20, 50],
    onPageChange: setPage,
    onPageSizeChange: setPageSize,
  }}
  noDataFound={{
    title: "No properties found",
    description: "Try adjusting your filters.",
  }}
  canViewAgents
  canViewOwners
  canViewBadges
  onClick={(item) => router.push(`/property/${item.id}`)}
  onClickFavourite={toggleFavourite}
/>
```

---

### SimilarProperties props

Horizontal **Similar Properties** section for property detail pages. Renders `GridCard` slides in a snap carousel. Agent and owner blocks are hidden on each card. When not loading and `data` is empty, shows a **No similar properties** placeholder instead of the carousel.

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | `"Similar Properties"` | No | Section heading. |
| `viewMoreLabel` | `string` | `"View More"` | No | Label for the optional header action. |
| `onViewMore` | `() => void` | — | No | Header action handler. Omit to hide View More. |
| `data` | `PropertyListing[]` | — | **Yes** | Listings to show (same shape as `PropertyCardList` `data[]` item — see above). |
| `isLoading` | `boolean` | `false` | No | Shows skeleton grid cards instead of listings. |
| `skeletonCount` | `number` | `4` | No | Number of skeleton slides while loading. |
| `noSimilarProperties` | `object` | — | No | Empty-state copy when `data` is `[]` and not loading (see below). |
| `canViewBadges` | `boolean` | `true` | No | Show badges on card image galleries. |
| `applicationKey` | `"abdoun-web"` \| `"mls-web"` | — | No | Branding for badges and gallery overlays. |
| `className` | `string` | — | No | Extra classes on the root `<section>`. |
| `onClick` | `(item) => void` | — | No | Card click; receives the listing. |
| `onClickEmail` | `(item) => void` | — | No | Email contact button. |
| `onClickCall` | `(item) => void` | — | No | Phone contact button. |
| `onClickWhatsApp` | `(item) => void` | — | No | WhatsApp contact button. |
| `onClickFavourite` | `(item) => void` | — | No | Favourite toggle; receives the listing. |

**Responsive behavior**

- **Header:** Title and View More share one row. Below `md`, View More is an underlined text link (`text-xs`, normal weight). From `md` up, View More is a secondary solid button.
- **Carousel:** Swipe on viewports below `md`. Prev/next icon buttons appear from `md` up when the track overflows (start → next only, end → prev only, middle → both).
- **Empty:** View More is hidden. Placeholder defaults: title `"No similar properties"`, description about no matches found.

**`noSimilarProperties`**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | `"No similar properties"` | Empty-state heading. |
| `description` | `string` | (built-in copy) | Supporting message; omit field to hide description. |

#### SimilarProperties example

```tsx
import { SimilarProperties } from "@abdoun/abdoun-library";

<SimilarProperties
  title="Similar Properties"
  viewMoreLabel="View More"
  onViewMore={() => router.push("/properties?similar=1")}
  data={similarListings}
  isLoading={isSimilarLoading}
  skeletonCount={4}
  applicationKey="abdoun-web"
  canViewBadges
  onClick={(item) => router.push(`/property/${item.id}`)}
  onClickFavourite={toggleFavourite}
/>

<SimilarProperties
  title="Similar Properties"
  data={[]}
  noSimilarProperties={{
    title: "No similar property",
    description: "Browse all listings to find more options.",
  }}
/>
```

---

### PropertyListCard props

Single property listing card. Use on its own for custom layouts, or rely on `PropertyCardList` which renders this internally.

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `layoutVariant` | `"grid"` \| `"list"` | — | **Yes** | Card layout variant. |
| `propertyDetails` | `object` | — | **Yes** | One listing record (same shape as `PropertyCardList` `data[]` item — see above). |
| `applicationKey` | `"abdoun-web"` \| `"mls-web"` | — | No | Branding for badges and gallery overlays. |
| `isFavouriteLoading` | `boolean` | — | No | Favourite spinner on the card; falls back to `propertyDetails.is_favourite_loading` when omitted. |
| `canViewOwners` | `boolean` | — | No | Show **Owners** section when `propertyDetails.owners` has items. |
| `canViewAgents` | `boolean` | — | No | Show agent block on the card. |
| `canViewBadges` | `boolean` | — | No | Show badges (exclusive, etc.) on the image gallery. |
| `onClick` | `(item) => void` | — | No | Card click; receives `propertyDetails`. |
| `onClickEmail` | `(item) => void` | — | No | Email contact button. |
| `onClickCall` | `(item) => void` | — | No | Phone contact button. |
| `onClickWhatsApp` | `(item) => void` | — | No | WhatsApp contact button. |
| `onClickFavourite` | `(item) => void` | — | No | Favourite toggle; receives `propertyDetails`. |

#### PropertyListCard example

```tsx
import { PropertyListCard } from "@abdoun/abdoun-library";

<PropertyListCard
  layoutVariant="list"
  propertyDetails={listing}
  applicationKey="abdoun-web"
  canViewAgents
  canViewOwners
  canViewBadges
  onClick={(item) => router.push(`/property/${item.id}`)}
  onClickFavourite={toggleFavourite}
/>
```

### CSS entry points

| Import | Purpose |
|--------|---------|
| `@abdoun/abdoun-library/integration.css` | Tailwind `@source` scan for library classes (use in `globals.css`) |
| `@abdoun/abdoun-library/styles.css` | Alias of `integration.css` |
| `@abdoun/abdoun-library/theme.css` | Reference `@theme` tokens — paste into your `globals.css` after `:root`, do not `@import` alone |

## Development

```bash
npm run build
npm run storybook
```
