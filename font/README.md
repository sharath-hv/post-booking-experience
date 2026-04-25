# Euclid Circular B (typography)

This app uses **Euclid Circular B** for UI text. The font must be loaded from **font files** you add to the project—not from ad-hoc one-off URLs in components.

## Where to put the files

1. Add the font binaries under **`public/font/`** (create the folder if it does not exist).  
   Next.js serves everything in `public/` at the site root, so a file at `public/font/EuclidCircularB-Regular.otf` is available as **`/font/EuclidCircularB-Regular.otf`**.

2. Use the **OTF** (or **woff2**) files that match your license and the design system. Typical weights used in the app:

   | Weight | Suggested filename (OTF) |
   |--------|---------------------------|
   | 300 (Light) | `EuclidCircularB-Light.otf` |
   | 400 (Regular) | `EuclidCircularB-Regular.otf` |
   | 500 (Medium) | `EuclidCircularB-Medium.otf` |
   | 600 (Semibold) | `EuclidCircularB-Semibold.otf` |
   | 700 (Bold) | `EuclidCircularB-Bold.otf` |

## Wire-up after files are in place

Keep these three places **in sync** (same family name, same paths, same weights):

1. **`app/globals.css`**  
   Each `@font-face` rule must use `url("/font/…")` (or the correct path under `public/font/`).

2. **`lib/euclid-font-preload.ts`**  
   Preload / base URL for `<link rel="preload">` in the root layout must point at the same files (usually same-origin paths like `/font/EuclidCircularB-Regular.otf`).

3. **`app/layout.tsx`**  
   Uses the preload helper; if you change how fonts are loaded, adjust preconnect/preload only as needed (same origin may not need a cross-origin `preconnect`).

## Reference in this folder

- **`font-euclid.css`** — example `@font-face` block using remote **woff2** URLs (legacy / CMS). The running app is driven by **`app/globals.css`**, not this file, unless you explicitly import it.

## Design tokens

Type scale and usage rules for product screens live in `skills/Font primitive/primitives.md` (Layer 1 primitives).
