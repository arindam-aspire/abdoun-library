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

```tsx
import {
  PropertyView,
  PropertyViewSkeleton,
  PropertyCardList,
  PropertyCardListSkeleton,
  PropertyListCard,
  PropertyListCardSkeleton,
  type PropertyViewProps,
  type PropertyDetails,
  type PropertyCardListProps,
  type PropertyListings,
  type PropertyListCardProps,
} from "@abdoun/abdoun-library";
```

## Development

```bash
npm run build
npm run storybook
```
