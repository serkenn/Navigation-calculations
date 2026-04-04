# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (SvelteKit, http://localhost:5173)
npm run build        # Build for production → dist/
npm run preview      # Preview production build

npm run electron:dev        # Build + run as Electron desktop app
npm run electron:build      # Build Windows NSIS installer
npm run cap:sync            # Build + sync to Android (Capacitor)
```

Type checking (no test suite exists):
```bash
npx svelte-check         # Type-check all Svelte/TS files
```

Releases are triggered by pushing a `v*` tag — CI builds web zip + Windows installer + creates GitHub Release automatically.

## Architecture

**NavCalc** is a maritime navigation calculator app. It ships as a static SvelteKit web app, an Electron desktop app (Windows/Mac), and an Android app (Capacitor). All three targets share the same `src/` codebase and build from `npm run build` → `dist/`.

### Stack
- **SvelteKit 2 + Svelte 5** with `adapter-static` (fully pre-rendered SPA, `index.html` fallback)
- **Tailwind CSS v4** (Vite plugin, imported via `src/app.css`)
- **TypeScript 5.7**
- Dark mode via `.dark` class on `<html>` (custom Tailwind variant `dark`), stored in `localStorage`

### Route structure

```
src/routes/
  +layout.svelte          # App shell: sidebar + mobile header + <main> wrapper
  +page.svelte            # Landing page (category list, no calculator loaded)
  calc/[id]/+page.svelte  # All calculators — one route, switches component by id
  guide/+page.svelte      # Usage guide
  theory/+page.svelte     # Calculation theory docs
```

The `calc/[id]/+page.svelte` is the core page. It holds a `componentMap` keyed by calculator id that maps each id to its `{ calc, result }` Svelte component pair. Adding a new calculator requires: (1) adding to `componentMap` in this file, (2) registering in `calculatorRegistry.ts`, (3) creating `*Calc.svelte` + `*Result.svelte` under the appropriate category folder.

### Calculator pattern

Every calculator follows the same two-component pattern:

- **`*Calc.svelte`** — left panel, input form. Receives `onResult` callback prop, calls it with the result object on submit.
- **`*Result.svelte`** — right panel ("Calculation Sheet", paper-like `bg-[#fffdf5]`). Receives `result` prop and renders the formatted output.

Shared input components (`src/lib/components/shared/`): `DMSInput`, `PositionInput`, `NumberInput`, `TimeInput`, `SectionCard`, `ResultBox`, `ResultRow`, `ResultSection`, `CalculateButton`, `EmptyResult`.

### Calculation logic

All math is in `src/lib/utils/` — pure TypeScript functions, no side effects:

| File | Purpose |
|------|---------|
| `navigationMath.ts` | Core helpers: `rad/deg`, `formatDMS`, `toDecimal`, `toDMS` |
| `mercatorSailing.ts` | Course/distance, dead reckoning (WGS84 meridional parts) |
| `greatCircle.ts` | Great circle and composite sailing |
| `astronomy.ts` | Twilight, amplitude, star finder |
| `ephemeris.ts` | Sun GHA/declination approximation |
| `tide.ts` | Tide height (cosine interpolation) |
| `wind.ts` | True wind vector |
| `currentVector.ts` | CMG/SMG, set/drift |
| `sextant.ts` | Altitude corrections, distance to object |
| `timeConversion.ts` | Arc↔time, HMS arithmetic |
| `examNavigation.ts` | Exam problem calculations (3N navigation category) |
| `examOperation.ts` | Exam problem calculations (3N operation category) |

### Calculator registry

`src/lib/data/calculatorRegistry.ts` is the single source of truth for all calculator metadata (id, category, Japanese/English names, SEO title/description, accent colors). `CategoryId` union type is defined in `src/lib/types/calculator.ts`.

### Print styles

`src/app.css` contains all `@media print` rules. The print layout hides the left panel and sidebar, expands the right panel to full A4 width, and compresses all spacing/font sizes to fit on one page. When modifying result component layout, check that the print CSS selectors (`main > div:last-child`, `div.border-b-2`, etc.) still match.

### App version

`__APP_VERSION__` is injected at build time in `vite.config.ts` from the latest git tag (falls back to `package.json` version). Use this constant anywhere version display is needed.
