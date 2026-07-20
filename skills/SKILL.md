---
name: acko-design-system
description: ACKO's design system principles and patterns for building polished, accessible, production-ready UI. Use this skill when building any ACKO product UI — purchase flows, claims, renewals, dashboards, or any customer-facing surface. Triggers on: UI components, layout composition, forms, animations, transitions, responsive design, typography, spacing, color, insurance flows, mobile UX, accessibility, button states, input fields, loading states, error states, copy tone, marketing pages.
---

# ACKO Design System — Skill Orchestrator

## Token Architecture

All values flow through a 3-layer system. Never skip layers.

```
primitives.md → semantics.md → components
Raw values       Semantic roles    Component specs
```

**Rule:** Components reference semantic tokens only. Semantic tokens reference primitives only. Never use a primitive directly in a component.

---

## ACKO Product Personality

**Warm, bright, modern, and disciplined.**
Playful in spirit — never in execution.

This → Clear, human, confident, fast, trustworthy.
Not this → Cold, corporate, bloated, legal-heavy, fear-driven.
Not this → Cartoony, gimmicky, over-animated, patronizing.

---

## Design Principles

1. **Clear over Clever** — Plain language, no jargon, error messages explain what to do next.
2. **Effortless by Default** — No unnecessary steps, always show loading states, prefill known data.
3. **Present When It Matters** — Claims and emergencies get maximum clarity, no clutter.
4. **Respectful of User's Time** — No forced upsells in flows, no dead ends, remember context.
5. **Trustworthy at Every Touchpoint** — Visual consistency, only ACKO package components, no stale data.

---

## Hard Constraints

```
NEVER create a component that does not exist in the ACKO component package.
NEVER hardcode any value — always use tokens from primitives.md via semantics.md.
NEVER write playful, witty, or clever copy. Clear always wins.
NEVER ship a layout that is not fully responsive.

NEVER leave an error state without a resolution path.
NEVER use a z-index value outside --z-dropdown / --z-sticky / --z-modal / --z-tooltip / --z-toast.
NEVER use transition: all.
NEVER change font weight on hover or selected state.

NEVER reference a primitive token directly in a component — always go through semantics.

NEVER place a card primary title and supporting body in a left/right split row — use vertical reading order. See cards.md.

NEVER place a title-reference Badge beside or below the title — only above the title (top-edge overlap allowed). See cards.md.
```

---

## Styling in this repo (SCSS)

This project styles with **SCSS / CSS modules** (`*.module.scss`, `styles/_*.scss`). Do **not** introduce utility-class strings in JSX or a utility CSS build step.

- Prefer `Component.module.scss` next to the component
- Shared surfaces/CTAs live in `styles/_components.scss` (e.g. `primary-cta`, `card-elevated`)
- Tokens and reset live in `styles/_theme.scss`, `styles/_tokens.scss`, `styles/_preflight.scss`

---

## Decision Flowcharts

### Is This Copy Correct?

```
Plain language a first-time insurance buyer would understand?
├── No → Rewrite
└── Yes → Contains jargon or hidden conditions?
           ├── Yes → Rewrite
           └── No → Warm but controlled? → Yes → Ship it
```

### Card or Flat Surface?

```
Content scanned independently? → Card (--shadow-md, --radius-4xl)
Part of a list or feed?        → Flat surface with --border-hairline divider
Inline content in a flow?      → No surface, spacing tokens only
```

---

## Review Checklist

Before shipping any UI:

- [ ] All values from tokens — zero hardcoded values
- [ ] Token layering: components → semantics → primitives
- [ ] Only ACKO package components — no improvised patterns
- [ ] Copy is clear, plain, sentence case, never playful
- [ ] Fully responsive — mobile first, 768px, 1024px breakpoints

- [ ] Touch targets minimum 44px
- [ ] Hover effects disabled on touch devices
- [ ] Keyboard navigation works
- [ ] All icon buttons have aria labels
- [ ] Forms submit on Enter / Cmd+Enter
- [ ] Input font size minimum 16px (body-md)
- [ ] Loading states for all async content
- [ ] Error states have resolution paths
- [ ] No layout shift on dynamic content
- [ ] No `transition: all`
- [ ] z-index uses defined scale tokens only
- [ ] No app-level `--spacing` override — must match `@acko/tokens` only (see **spacing scale spacing and @acko/tokens**)
- [ ] Cards: title + body/subtext stack vertically — not title left / subtext right
- [ ] Title-reference badge above title only (top-edge overlap OK); unrelated badges use their own slot
- [ ] Card grids: primary CTAs align to the same vertical position (equal-height / footer pinned)

---

## Reference Files

| File | What's in it |
|------|-------------|
| [primitives.md](primitives.md) | All Layer 1 raw values: colors, spacing, typography scale, radius, shadows, easing, opacity, z-index, breakpoints |
| [semantics.md](semantics.md) | All Layer 2 semantic mappings: color roles, shadow aliases, component tokens, light + dark theme variable mappings |
| [typography.md](typography.md) | Typography component API, variants, weights, colors, patterns, text casing rules |
| [iconography.md](iconography.md) | Icon library, arrow vs chevron semantics, sizing, placement, anti-patterns |
| [layout.md](layout.md) | Layout hierarchy, breakpoints, section container, spacing rhythm, surface decisions, responsive composition, empty states |
| [motion.md](motion.md) | Easing curves, keyframes, animation performance rules, duration guidance |
| [forms-controls.md](forms-controls.md) | Inputs, buttons, validation timing, error handling, OTP, multi-step forms, CTA copy |
| [touch-accessibility.md](touch-accessibility.md) | Tap targets, hover on touch, keyboard nav, ARIA, reduced motion, time-limited actions |
| [performance.md](performance.md) | Image optimization, code splitting, list virtualization, React patterns, Vite config |
| [ui-polish.md](ui-polish.md) | Focus states, skeleton loaders, dark mode implementation, safe areas, logo assets, decorative elements |
| [cards.md](cards.md) | Card base API, **10** typed card patterns (incl. **PlanRadioCard** §10 — selectable plan option), slot vocabulary, **layout hierarchy & badge placement**, shell selection guide, token reference |
