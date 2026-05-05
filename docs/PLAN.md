# Post-booking experience — implementation plan

Living document: update this file when flows, routes, or UI behavior change.

**Source spec:** `docs/detailed_post_booking_experience.docx`  
**Design (Figma):** [Post-booking-experience](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience) — bank sheet node `1941:12822`.

---

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- Local dev: `npm run dev` → **http://localhost:3000** (`next dev --turbopack --port 3000`)
- Static assets: `/public/assets/` (keep in sync with repo `assets/` where applicable)

---

## Routes (current)

| Path | Purpose |
|------|---------|
| `/` | Redirects to `/quote` |
| `/quote` | Entry / quote screen |
| `/payment/choose` | Choose payment method (ACKO Drive / self / full) |
| `/payment/acko-drive-finance-confirmed` | After bank sheet **Confirm banking partner** — same celebration UI as booking confirmed |
| `/payment` | Payment flow screen |
| `/payment/default` | Default payment variant |
| `/payment/booking-success` | Booking-lock payment success — Lottie + headline + car card; **`router.replace`** → `/payment/booking-success/next` **3s** after car shows (max **10s**) |
| `/payment/booking-success/next` | Shivi RM intro + fixed **Up next:** + **Continue** → `/kyc` |
| `/kyc` | KYC hub / redirect |
| `/kyc/upload` | Document upload |
| `/kyc/processing` | Processing |
| `/kyc/documents-received` | Documents received |
| `/kyc/booking-confirmed` | Booking confirmed |

Intended journey (from product doc): **Payment success → KYC → Processing → Confirmed** (wire as needed per final IA).

---

## Done — payment choice + bank sheet (ACKO Drive)

### Behaviour

- On **Finance with ACKO Drive**, primary CTA label is **“See bank options”** (not direct checkout).
- Tap opens **`BankSelectionBottomSheet`** (modal over dimmed backdrop).
- **Confirm banking partner** closes the sheet and navigates to **`/payment/acko-drive-finance-confirmed`** (celebration screen; **Okay** → `/payment/default`). Chosen bank id is not yet persisted — see backlog.

### Files

- `components/payment/BankSelectionBottomSheet.tsx` — sheet UI + open/close animation
- `components/payment/ChoosePaymentOptionsScreen.tsx` — `bankSheetOpen` state, CTA wiring, sheet mount
- `components/payment/payment-choose-assets.ts` — `BANK_SHEET_OPTIONS`, `PAYMENT_CHOOSE_ASSETS.ackoDriveLogo`, `asset()` helper for `/public/assets/`

### Bank sheet UX (implemented)

- **Animation:** Sheet slides up on open, down on dismiss (~280ms); backdrop fades in/out. `prefers-reduced-motion` disables motion.
- **Backdrop:** `bg-black/90` (90% opacity).
- **Layout:** Full-viewport overlay; sheet `max-w-[360px]`, centered, `rounded-t-[20px]`, `max-h-[90dvh]` with sheet-level scroll only if viewport is very short (removed inner scroll + 560px cap that caused unnecessary scrolling).
- **Header:** Title “Choose your banking partner”; subtitle “Finance through” + **ACKO Drive logo** (`public/assets/ACKO Drive logo.svg`).
- **Top padding** on scrollable header block: **24px** (`pt-6`).
- **Bank rows:** HDFC, Bank of Baroda, ICICI, Bank of India, Canara Bank — logo, name, “Interest rate from …”, selected border/background, shared radio artwork from assets.
- **Radio:** Absolutely positioned **12px from top and right** of each card (`top-3 right-3`); `pointer-events-none` so the whole row remains the hit target; content uses extra right padding (`pr-10`) to avoid overlap.
- **Footer:** **Confirm banking partner** uses `primary-cta`; **no top border** above the CTA.

### Assets added / referenced

- `public/assets/ACKO Drive logo.svg` (wordmark; synced from `assets/ACKO Drive logo.svg`)

---

## Local-only dev tools (not in git)

These paths are **gitignored** (see root `.gitignore`). They are optional helpers kept on developer machines only; fresh clones will not include them unless you restore copies locally.

| Path | Purpose |
|------|---------|
| `/dev/flow-visualiser` | Flow catalogue + screen picker, device chrome, iframe (`app/dev/flow-visualiser/page.tsx`, `components/dev/FlowVisualiser.tsx`) |
| `/dev/mobile-mock` | Same-origin iframe preview (`app/dev/mobile-mock/page.tsx`, e.g. `?path=/payment`) |

---

## Operational notes (local)

- **“This page isn’t working” / HTTP 500 in dev** with the server still listening: often **stale Turbopack `.next`**. Fix: stop the process on **3000**, `rm -rf .next`, `npm run dev`.
- Do not run `http://localhost:3000` in the shell as a command; open it in the **browser**.

---

## Backlog / follow-ups

1. **Persist selected bank** on Confirm (query param, `sessionStorage`, or app state) so `/payment` (or checkout) can use it.
2. **Accessibility:** focus trap in sheet, return focus to trigger on close, optional `aria-describedby` for subtitle.
3. **Z-index / stacking:** confirm no clash with other fixed layers (e.g. choose-screen footer).
4. **KYC + payment sequencing:** align route guards and deep links with final product copy in the DOCX.

---

## Checklist (high level)

- [x] Payment choose screen with three options + partner strip
- [x] ACKO Drive → bank selection bottom sheet (Figma-aligned iterations)
- [x] Sheet motion, strong backdrop, layout and radio placement refinements
- [x] ACKO Drive logo in sheet subtitle
- [ ] Pass selected `bankId` into payment/checkout
- [ ] Full a11y pass on sheet
- [ ] End-to-end journey documented in README (optional)
