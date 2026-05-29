# @abdoun/abdoun-library

Shared React UI component library for Abdoun applications. Built with Tailwind CSS, Headless UI, and Storybook.

## Install

Consumers must install peer dependencies:

```bash
npm install @abdoun/abdoun-library react react-dom
# optional, for Next.js apps
npm install next
```

## Usage

Import global styles once in your app root (Next.js `app/layout.tsx`, etc.):

```tsx
import "@abdoun/abdoun-library/styles.css";
```

```tsx
import {
  Button,
  PropertyCard,
  PropertyList,
  PropertyCardImageGallery,
  cn,
} from "@abdoun/abdoun-library";

export function Example() {
  return <Button color="primary">Click me</Button>;
}
```

Override CSS variables in your app for Abdoun or MLS branding (see `src/.storybook/theme_*.css` in this repo for token values).

Styles are Tailwind v4–first: `@abdoun/abdoun-library/styles.css` does not reference a `tailwind.config` inside the package, so it works from `node_modules` in Next.js (Turbopack) and Vite. Ensure your app uses Tailwind v4 (`tailwindcss` ^4 and `@tailwindcss/postcss` or the Vite plugin) so PostCSS can process `@import "tailwindcss"` in that file.

## Development

```bash
npm run dev          # watch library build (tsup)
npm run build        # production build
npm run storybook    # component docs & playground
npm run test         # Vitest (Storybook browser tests)
```

## Scripts

| Script | Description |
|--------|-------------|
| `build` | Bundle library to `dist/` |
| `dev` | Watch mode for library build |
| `storybook` | Start Storybook on port 6006 |
| `build-storybook` | Static Storybook export |
| `test` | Run Vitest (includes Storybook tests) |
| `test:coverage` | Vitest with coverage |
