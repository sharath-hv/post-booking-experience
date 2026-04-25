# ACKO Design Foundation

**Layer 1** of the 3-layer token architecture. This file holds raw primitive values — colors, spacing, typography, animation, and asset references. These values are never used directly in components.

```
primitives.md (this file)  →  semantics.md  →  components.md
Primitives (hex, px)          Semantic roles     Component specs
                              (maps primitives    (only references
                               to intent)          semantic tokens)
```

**To change a color value:** Edit the primitive here. It cascades automatically through semantics.md into every component.  
**To change which color a role uses:** Edit semantics.md (e.g. swap primary from purple to blue).  
**Components never reference this file directly** — they use semantic tokens from semantics.md.

---

## Color Primitives

12 color palettes + 1 extended grey scale. Chromatic palettes use a 50→950 scale (50 lightest, 950 darkest). Grey uses a finer White→Black scale with 50-step increments.

### Grey (Extended Neutral)

17-step neutral grey scale with a subtle cool undertone. Provides fine gradation in light tones for background/surface hierarchy.

| Shade | Hex |
|-------|-----|
| White | `#FFFFFF` |
| 50 | `#FBFBFB` |
| 100 | `#F5F5F5` |
| 150 | `#EBEBEB` |
| 200 | `#E0E0E1` |
| 250 | `#CCCCCD` |
| 300 | `#B7B7B8` |
| 350 | `#8F8E92` |
| 400 | `#7A7B7D` |
| 450 | `#605F63` |
| 500 | `#474649` |
| 550 | `#333333` |
| 600 | `#242324` |
| 650 | `#19191A` |
| 700 | `#141414` |
| 750 | `#0F0F10` |
| 800 | `#0A0A0A` |
| Black | `#000000` |

### Red
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FEF2F2` | `#FEE2E2` | `#FECACA` | `#FCA5A5` | `#F87171` | `#EF4444` | `#DC2626` | `#B91C1C` | `#991B1B` | `#7F1D1D` | `#450A0A` |

### Orange
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FFF3E5` | `#FFE5CC` | `#FFCB9E` | `#FFB56B` | `#FFA85C` | `#FF8D28` | `#EB740A` | `#B65C0C` | `#8D4301` | `#521F00` | `#300212` |

### Yellow
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FEFAE8` | `#FEF9C3` | `#FEF08A` | `#FDE047` | `#FACC15` | `#EAB308` | `#D18C0A` | `#A76406` | `#875008` | `#62360F` | `#302012` |

### Green
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#F0FDF4` | `#DCFCE7` | `#BBF7D0` | `#86EFAC` | `#4ADE80` | `#22C55E` | `#16A34A` | `#15803D` | `#166534` | `#14532D` | `#052E16` |

### Lime
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#F4FDF0` | `#E7FCDC` | `#CFF7BB` | `#A9EF86` | `#7BDE4A` | `#58C522` | `#45A316` | `#398015` | `#306516` | `#214210` | `#132E05` |

### Teal
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#EDFDFE` | `#D1FBFC` | `#A9EFFB` | `#6FE2F1` | `#29CEE7` | `#17B6D3` | `#0891B2` | `#0E7490` | `#155E75` | `#164E63` | `#083344` |

### Blue
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#EFF6FF` | `#DBEAFE` | `#BFDBFE` | `#93C5FD` | `#60A5FA` | `#3B82F6` | `#2563EB` | `#1D4ED8` | `#1E40AF` | `#1E3A8A` | `#172554` |

### Purple
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#F5F3FF` | `#EAEAFD` | `#D9D8FC` | `#BDB8FA` | `#9B8FF6` | `#7A62F0` | `#6841E6` | `#582FD2` | `#4E29BB` | `#3E2290` | `#241362` |

### Pink
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FDF2F8` | `#FCE7F3` | `#FBCFE8` | `#F9ABD4` | `#F472B6` | `#EC4899` | `#DB2777` | `#BE185D` | `#9D174D` | `#831843` | `#500724` |

### Zinc
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FAFAFB` | `#F3F4F6` | `#E5E7EB` | `#D1D5DB` | `#9CA3AF` | `#6B7280` | `#485563` | `#374151` | `#1F2937` | `#1A1F2A` | `#030712` |

### Earth Grey
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#FAFAFA` | `#F5F5F5` | `#E5E5E5` | `#D4D4D4` | `#A3A3A3` | `#737373` | `#525252` | `#404040` | `#262626` | `#171717` | `#0A0A0A` |

### CSS Custom Properties (Primitives)

```css
:root {
  /* Grey (extended neutral) */
  --grey-white: #FFFFFF;
  --grey-50: #FBFBFB; --grey-100: #F5F5F5; --grey-150: #EBEBEB;
  --grey-200: #E0E0E1; --grey-250: #CCCCCD; --grey-300: #B7B7B8;
  --grey-350: #8F8E92; --grey-400: #7A7B7D; --grey-450: #605F63;
  --grey-500: #474649; --grey-550: #333333; --grey-600: #242324;
  --grey-650: #19191A; --grey-700: #141414; --grey-750: #0F0F10;
  --grey-800: #0A0A0A; --grey-black: #000000;

  /* Red */
  --red-50: #FEF2F2; --red-100: #FEE2E2; --red-200: #FECACA;
  --red-300: #FCA5A5; --red-400: #F87171; --red-500: #EF4444;
  --red-600: #DC2626; --red-700: #B91C1C; --red-800: #991B1B;
  --red-900: #7F1D1D; --red-950: #450A0A;

  /* Orange */
  --orange-50: #FFF3E5; --orange-100: #FFE5CC; --orange-200: #FFCB9E;
  --orange-300: #FFB56B; --orange-400: #FFA85C; --orange-500: #FF8D28;
  --orange-600: #EB740A; --orange-700: #B65C0C; --orange-800: #8D4301;
  --orange-900: #521F00; --orange-950: #300212;

  /* Yellow */
  --yellow-50: #FEFAE8; --yellow-100: #FEF9C3; --yellow-200: #FEF08A;
  --yellow-300: #FDE047; --yellow-400: #FACC15; --yellow-500: #EAB308;
  --yellow-600: #D18C0A; --yellow-700: #A76406; --yellow-800: #875008;
  --yellow-900: #62360F; --yellow-950: #302012;

  /* Green */
  --green-50: #F0FDF4; --green-100: #DCFCE7; --green-200: #BBF7D0;
  --green-300: #86EFAC; --green-400: #4ADE80; --green-500: #22C55E;
  --green-600: #16A34A; --green-700: #15803D; --green-800: #166534;
  --green-900: #14532D; --green-950: #052E16;

  /* Lime */
  --lime-50: #F4FDF0; --lime-100: #E7FCDC; --lime-200: #CFF7BB;
  --lime-300: #A9EF86; --lime-400: #7BDE4A; --lime-500: #58C522;
  --lime-600: #45A316; --lime-700: #398015; --lime-800: #306516;
  --lime-900: #214210; --lime-950: #132E05;

  /* Teal */
  --teal-50: #EDFDFE; --teal-100: #D1FBFC; --teal-200: #A9EFFB;
  --teal-300: #6FE2F1; --teal-400: #29CEE7; --teal-500: #17B6D3;
  --teal-600: #0891B2; --teal-700: #0E7490; --teal-800: #155E75;
  --teal-900: #164E63; --teal-950: #083344;

  /* Blue */
  --blue-50: #EFF6FF; --blue-100: #DBEAFE; --blue-200: #BFDBFE;
  --blue-300: #93C5FD; --blue-400: #60A5FA; --blue-500: #3B82F6;
  --blue-600: #2563EB; --blue-700: #1D4ED8; --blue-800: #1E40AF;
  --blue-900: #1E3A8A; --blue-950: #172554;

  /* Purple */
  --purple-50: #F5F3FF; --purple-100: #EAEAFD; --purple-200: #D9D8FC;
  --purple-300: #BDB8FA; --purple-400: #9B8FF6; --purple-500: #7A62F0;
  --purple-600: #6841E6; --purple-700: #582FD2; --purple-800: #4E29BB;
  --purple-900: #3E2290; --purple-950: #241362;

  /* Pink */
  --pink-50: #FDF2F8; --pink-100: #FCE7F3; --pink-200: #FBCFE8;
  --pink-300: #F9ABD4; --pink-400: #F472B6; --pink-500: #EC4899;
  --pink-600: #DB2777; --pink-700: #BE185D; --pink-800: #9D174D;
  --pink-900: #831843; --pink-950: #500724;

  /* Zinc */
  --zinc-50: #FAFAFB; --zinc-100: #F3F4F6; --zinc-200: #E5E7EB;
  --zinc-300: #D1D5DB; --zinc-400: #9CA3AF; --zinc-500: #6B7280;
  --zinc-600: #485563; --zinc-700: #374151; --zinc-800: #1F2937;
  --zinc-900: #1A1F2A; --zinc-950: #030712;

  /* Earth Grey */
  --earth-grey-50: #FAFAFA; --earth-grey-100: #F5F5F5; --earth-grey-200: #E5E5E5;
  --earth-grey-300: #D4D4D4; --earth-grey-400: #A3A3A3; --earth-grey-500: #737373;
  --earth-grey-600: #525252; --earth-grey-700: #404040; --earth-grey-800: #262626;
  --earth-grey-900: #171717; --earth-grey-950: #0A0A0A;
}
```

---

## Typography

### Font Family

**Euclid Circular B** — used for all text across the system.

**Base URL:** `https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/Euclid%20Font/`

| Weight | Value | Normal File | Italic File |
|--------|-------|------------|-------------|
| Light | 300 | `EuclidCircularB-Light.otf` | `EuclidCircularB-LightItalic.otf` |
| Regular | 400 | `EuclidCircularB-Regular.otf` | `EuclidCircularB-RegularItalic.otf` |
| Medium | 500 | `EuclidCircularB-Medium.otf` | `EuclidCircularB-MediumItalic.otf` |
| Semibold | 600 | `EuclidCircularB-Semibold.otf` | `EuclidCircularB-SemiboldItalic.otf` |
| Bold | 700 | `EuclidCircularB-Bold.otf` | `EuclidCircularB-BoldItalic.otf` |

**@font-face CSS:** Generate `@font-face` declarations by combining base URL + filename for each weight. Set `format('opentype')`. Always include:
```css
body {
  font-family: 'Euclid Circular B', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Typography Scale

**Display (marketing, heroes)**
| Token | Size | Line Height | Letter Spacing | Weight |
|-------|------|-------------|----------------|--------|
| `display-xl` | 72px | 80px | -2px | Bold (700) |
| `display-lg` | 56px | 64px | -1.5px | Bold (700) |
| `display-md` | 48px | 56px | -1px | Bold (700) |
| `display-sm` | 40px | 48px | -0.5px | Semibold (600) |

**Headings (UI sections)**
| Token | Size | Line Height | Letter Spacing | Weight |
|-------|------|-------------|----------------|--------|
| `heading-xl` | 32px | 40px | -0.5px | Semibold (600) |
| `heading-lg` | 24px | 32px | -0.3px | Semibold (600) |
| `heading-md` | 20px | 28px | -0.2px | Semibold (600) |
| `heading-sm` | 18px | 24px | 0 | Semibold (600) |

**Body (content)**
| Token | Size | Line Height | Letter Spacing | Weight |
|-------|------|-------------|----------------|--------|
| `body-lg` | 18px | 28px | 0 | Regular (400) |
| `body-md` | 16px | 24px | 0 | Regular (400) |
| `body-sm` | 14px | 20px | 0 | Regular (400) |

**Labels & Captions (forms, UI)**
| Token | Size | Line Height | Letter Spacing | Weight |
|-------|------|-------------|----------------|--------|
| `label-lg` | 14px | 20px | 0.1px | Medium (500) |
| `label-md` | 12px | 16px | 0.2px | Medium (500) |
| `label-sm` | 11px | 14px | 0.3px | Medium (500) |
| `caption` | 12px | 16px | 0 | Regular (400) |
| `overline` | 11px | 16px | 0.5px | Semibold (600) |

### Typography Rules

- Sentence case everywhere (headings, buttons, labels, nav)
- Minimum 14px for body text (accessibility)
- Minimum 12px for labels/captions — never smaller
- Medium weight (500) for emphasis in body — not Bold
- Semibold (600) for headings, Bold (700) only for display
- Tighter letter-spacing for larger text, looser for small text
- Never use Light (300) for body text
- Use `text-wrap: balance` on headings

---

## Base Scale

A unified numeric scale that drives spacing, sizing, border radius, and layout values across the system. All tokens reference values from this scale.

| Token | Value |
|-------|-------|
| `-16` | -16px |
| `-12` | -12px |
| `-8` | -8px |
| `-4` | -4px |
| `-2` | -2px |
| `-1` | -1px |
| `0` | 0px |
| `1` | 1px |
| `2` | 2px |
| `4` | 4px |
| `6` | 6px |
| `8` | 8px |
| `10` | 10px |
| `12` | 12px |
| `16` | 16px |
| `20` | 20px |
| `24` | 24px |
| `28` | 28px |
| `32` | 32px |
| `36` | 36px |
| `40` | 40px |
| `44` | 44px |
| `48` | 48px |
| `52` | 52px |
| `56` | 56px |
| `60` | 60px |
| `64` | 64px |
| `68` | 68px |
| `72` | 72px |
| `76` | 76px |
| `80` | 80px |
| `84` | 84px |
| `88` | 88px |
| `92` | 92px |
| `96` | 96px |
| `100` | 100px |
| `104` | 104px |
| `108` | 108px |
| `112` | 112px |
| `116` | 116px |
| `120` | 120px |
| `124` | 124px |
| `128` | 128px |
| `132` | 132px |
| `136` | 136px |
| `140` | 140px |
| `144` | 144px |
| `148` | 148px |
| `152` | 152px |
| `156` | 156px |
| `160` | 160px |

```css
:root {
  --scale-n16: -16px; --scale-n12: -12px; --scale-n8: -8px;
  --scale-n4: -4px; --scale-n2: -2px; --scale-n1: -1px;
  --scale-0: 0px; --scale-1: 1px; --scale-2: 2px;
  --scale-4: 4px; --scale-6: 6px; --scale-8: 8px;
  --scale-10: 10px; --scale-12: 12px; --scale-16: 16px;
  --scale-20: 20px; --scale-24: 24px; --scale-28: 28px;
  --scale-32: 32px; --scale-36: 36px; --scale-40: 40px;
  --scale-44: 44px; --scale-48: 48px; --scale-52: 52px;
  --scale-56: 56px; --scale-60: 60px; --scale-64: 64px;
  --scale-68: 68px; --scale-72: 72px; --scale-76: 76px;
  --scale-80: 80px; --scale-84: 84px; --scale-88: 88px;
  --scale-92: 92px; --scale-96: 96px; --scale-100: 100px;
  --scale-104: 104px; --scale-108: 108px; --scale-112: 112px;
  --scale-116: 116px; --scale-120: 120px; --scale-124: 124px;
  --scale-128: 128px; --scale-132: 132px; --scale-136: 136px;
  --scale-140: 140px; --scale-144: 144px; --scale-148: 148px;
  --scale-152: 152px; --scale-156: 156px; --scale-160: 160px;
}
```

---

## Opacity

Opacity tokens reference the base scale, expressed as percentages. The progression uses multiples of 2 until 12%, multiples of 4 until 56%, then multiples of 8 until 96%, plus 100%.

| Token | Scale Value | Percentage | Use Case |
|-------|------------|------------|----------|
| `opacity-0` | `calc(var(--scale-0) / 100)` | 0% | Fully transparent |
| `opacity-2` | `calc(var(--scale-2) / 100)` | 2% | Near transparent |
| `opacity-4` | `calc(var(--scale-4) / 100)` | 4% | Very subtle tint |
| `opacity-6` | `calc(var(--scale-6) / 100)` | 6% | Subtle hover tint |
| `opacity-8` | `calc(var(--scale-8) / 100)` | 8% | Light overlay, shadow tint |
| `opacity-10` | `calc(var(--scale-10) / 100)` | 10% | Soft background, dark theme subtle fills |
| `opacity-12` | `calc(var(--scale-12) / 100)` | 12% | Subtle pressed state |
| `opacity-15` | `0.15` | 15% | Dark theme inner shadows |
| `opacity-16` | `calc(var(--scale-16) / 100)` | 16% | Light disabled state |
| `opacity-20` | `calc(var(--scale-20) / 100)` | 20% | Subtle fill |
| `opacity-24` | `calc(var(--scale-24) / 100)` | 24% | Muted background |
| `opacity-28` | `calc(var(--scale-28) / 100)` | 28% | Light theme inner shadows |
| `opacity-30` | `0.30` | 30% | Light theme focus rings |
| `opacity-32` | `calc(var(--scale-32) / 100)` | 32% | Tertiary surface |
| `opacity-35` | `0.35` | 35% | Dark theme focus rings |
| `opacity-36` | `calc(var(--scale-36) / 100)` | 36% | Disabled elements |
| `opacity-40` | `calc(var(--scale-40) / 100)` | 40% | Modal backdrop |
| `opacity-44` | `calc(var(--scale-44) / 100)` | 44% | Dim overlay |
| `opacity-48` | `calc(var(--scale-48) / 100)` | 48% | Mid-tone overlay, inner highlights |
| `opacity-52` | `calc(var(--scale-52) / 100)` | 52% | Slightly visible |
| `opacity-56` | `calc(var(--scale-56) / 100)` | 56% | Visible overlay |
| `opacity-64` | `calc(var(--scale-64) / 100)` | 64% | Prominent overlay |
| `opacity-72` | `calc(var(--scale-72) / 100)` | 72% | Strong tint |
| `opacity-80` | `calc(var(--scale-80) / 100)` | 80% | High visibility |
| `opacity-88` | `calc(var(--scale-88) / 100)` | 88% | Near opaque |
| `opacity-96` | `calc(var(--scale-96) / 100)` | 96% | Almost solid |
| `opacity-100` | `calc(var(--scale-100) / 100)` | 100% | Fully opaque |

### Implementation

```css
:root {
  --opacity-0: calc(var(--scale-0) / 100);
  --opacity-2: calc(var(--scale-2) / 100);
  --opacity-4: calc(var(--scale-4) / 100);
  --opacity-6: calc(var(--scale-6) / 100);
  --opacity-8: calc(var(--scale-8) / 100);
  --opacity-10: calc(var(--scale-10) / 100);
  --opacity-12: calc(var(--scale-12) / 100);
  --opacity-15: 0.15;
  --opacity-16: calc(var(--scale-16) / 100);
  --opacity-20: calc(var(--scale-20) / 100);
  --opacity-24: calc(var(--scale-24) / 100);
  --opacity-28: calc(var(--scale-28) / 100);
  --opacity-30: 0.30;
  --opacity-32: calc(var(--scale-32) / 100);
  --opacity-35: 0.35;
  --opacity-36: calc(var(--scale-36) / 100);
  --opacity-40: calc(var(--scale-40) / 100);
  --opacity-44: calc(var(--scale-44) / 100);
  --opacity-48: calc(var(--scale-48) / 100);
  --opacity-52: calc(var(--scale-52) / 100);
  --opacity-56: calc(var(--scale-56) / 100);
  --opacity-64: calc(var(--scale-64) / 100);
  --opacity-72: calc(var(--scale-72) / 100);
  --opacity-80: calc(var(--scale-80) / 100);
  --opacity-88: calc(var(--scale-88) / 100);
  --opacity-96: calc(var(--scale-96) / 100);
  --opacity-100: calc(var(--scale-100) / 100);
}
```

---

## Spacing

Spacing tokens reference the base scale. Use these semantic aliases for consistent layout.

| Token | Scale Value | Use Case |
|-------|------------|----------|
| `space-1` | `4` | Micro gaps |
| `space-2` | `8` | Tight gaps, icon padding, inline elements |
| `space-3` | `12` | Form field gaps, small component padding |
| `space-4` | `16` | Standard padding, card gaps, button padding |
| `space-5` | `20` | Medium gaps |
| `space-6` | `24` | Card padding, section gaps |
| `space-7` | `28` | Component internal spacing |
| `space-8` | `32` | Large component gaps |
| `space-9` | `36` | Section padding |
| `space-10` | `40` | Large spacing |
| `space-12` | `48` | Section margins |
| `space-16` | `64` | Page sections |
| `space-20` | `80` | Hero spacing, major sections |
| `space-24` | `96` | Large section breaks |

```css
:root {
  --space-1: var(--scale-4); --space-2: var(--scale-8); --space-3: var(--scale-12);
  --space-4: var(--scale-16); --space-5: var(--scale-20); --space-6: var(--scale-24);
  --space-7: var(--scale-28); --space-8: var(--scale-32); --space-9: var(--scale-36);
  --space-10: var(--scale-40); --space-12: var(--scale-48); --space-16: var(--scale-64);
  --space-20: var(--scale-80); --space-24: var(--scale-96);
}
```

---

## Border Radius

Border radius tokens reference the base scale.

| Token | Value |
|-------|-------|
| `radius-sm` | `4px` |
| `radius-md` | `6px` |
| `radius-lg` | `8px` |
| `radius-xl` | `10px` |
| `radius-2xl` | `12px` |
| `radius-3xl` | `16px` |
| `radius-full` | `9999px` |

---

## Shadows

| Token | Value | Use Case |
|-------|-------|----------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Cards, raised surfaces |
| `shadow-lg` | `0 4px 24px rgba(0,0,0,0.12)` | Dropdowns, popovers |
| `shadow-xl` | `0 8px 40px rgba(0,0,0,0.16)` | Modals, dialogs |
| `shadow-border` | `0 0 0 1px rgba(0,0,0,0.08)` | Border alternative |

---

## Z-Index Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `z-dropdown` | 100 | Dropdowns, popovers |
| `z-sticky` | 150 | Sticky headers, navbars |
| `z-modal` | 200 | Modals, dialogs |
| `z-tooltip` | 300 | Tooltips |
| `z-toast` | 400 | Toast notifications |

---

## Animation

### Easing Curves

```css
:root {
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
}
```

### Easing Decision Guide

| Scenario | Easing |
|----------|--------|
| Element entering or exiting | `ease-out` |
| On-screen element moving | `ease-in-out` |
| Hover/color transition | `ease` |
| User sees this 100+ times daily | Don't animate |

### Duration

| Token | Value | Use Case |
|-------|-------|----------|
| `duration-instant` | 0ms | Immediate state changes, no animation |
| `duration-fast` | 100ms | Micro-interactions (hover, press) |
| `duration-normal` | 150ms | Standard UI (tooltips, dropdowns) |
| `duration-moderate` | 200ms | Modals entering, menu expansion |
| `duration-slow` | 300ms | Page transitions, complex animations |
| `duration-slower` | 400ms | Hero animations, onboarding |

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 150ms;
  --duration-moderate: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
}
```

**Duration decision guide:**

| Element Type | Duration Token |
|--------------|----------------|
| Micro-interactions (hover, press) | `--duration-fast` |
| Standard UI (tooltips, dropdowns) | `--duration-normal` |
| Modals, drawers | `--duration-moderate` |
| Page transitions | `--duration-slow` |

### Performance Rules

- Only animate `transform` and `opacity` (GPU-accelerated)
- Never animate `padding`, `margin`, `height`, `width`
- Use `will-change: transform` for elements that animate frequently
- Exit animations can be 20-30% faster than entrances
- Respect `prefers-reduced-motion` (see accessibility.md)

---

## UI Polish Standards

### Font rendering
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Prevent layout shift
- Never change font weight on hover or selected states
- Use `font-variant-numeric: tabular-nums` for dynamic numbers (counters, prices, timers)
- Use hardcoded dimensions for skeleton loaders and image placeholders

### Text wrapping
```css
h1, h2, h3 { text-wrap: balance; }
```

### Hairline borders
```css
:root { --border-hairline: 1px; }
@media (min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  :root { --border-hairline: 0.5px; }
}
```

### Prefer box-shadow over border
```css
/* Use this instead of border: 1px solid rgba(0,0,0,0.08) */
box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
```

### Decorative elements
```css
.decorative { pointer-events: none; user-select: none; }
```

---

## Asset References

### Logos

| Variant | Background | URL |
|---------|-----------|-----|
| Primary | Dark BG | `https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20Primary%20Dark%20BG.svg` |
| Primary | Light BG | `https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20primary%20Light%20BG.svg` |
| Horizontal | Dark BG | `https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20horizontal%20Dark%20bg.svg` |
| Horizontal | Light BG | `https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20horizontal%20Light%20BG.svg` |

**Logo rules:**
- Minimum clear space = ½ logo height on all sides
- Preferred height: 24px. Absolute minimum: 16px
- Never rotate, apply effects, outline, stretch, or place on busy backgrounds

### Icons

| Type | Source | Usage |
|------|--------|-------|
| UI icons | `lucide-react` package | Navigation, actions, status indicators |
| Product icons | `/public/assets/icons/*.svg` | Insurance-specific: car, health, bike, home, travel |
| Illustrations | `/public/assets/illustrations/*.svg` | Empty states, onboarding, marketing |

**Icon sizing:** Follow component size — sm=16px, md=18-20px, lg=24px. Always use `currentColor` for fill so icons inherit text color from the theme.
