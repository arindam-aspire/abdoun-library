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
  PropertyDetails,
  PropertyCardImageGallery,
  cn,
} from "@abdoun/abdoun-library";

export function Example() {
  return <Button color="primary">Click me</Button>;
}
```

Override CSS variables in your app for Abdoun or MLS branding (see `.storybook/theme_*.css` for token values).

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
