# Aurora Glass Redesign

**Date:** 2026-04-08  
**Status:** Approved  
**Scope:** Full visual + layout redesign of the course tracker Next.js app

---

## Overview

Replace the current Material Design 3 dark theme with an "Aurora Glass" aesthetic: near-black background with animated violet/cyan/rose gradient orbs, frosted-glass cards, Bricolage Grotesque display font, DM Sans body font, and glowing status indicators.

All existing functionality is preserved. Layout improvements are included alongside the visual reskin.

---

## 1. Design System

### 1.1 Colour Tokens (`tailwind.config.ts`)

Replace all existing custom colours with the following:

| Token | Value | Use |
|---|---|---|
| `background` | `#07070f` | Page background |
| `surface` | `rgba(255,255,255,0.04)` | Glass card base |
| `surface-high` | `rgba(255,255,255,0.07)` | Elevated / active cards |
| `surface-container` | `rgba(255,255,255,0.03)` | Subtle containers |
| `primary` | `#7c3aed` | Violet — CTAs, active states, glows |
| `primary-dim` | `#a78bfa` | Violet — text on dark, shimmer accents |
| `secondary` | `#06b6d4` | Cyan — positive metrics, progress fills |
| `secondary-dim` | `#22d3ee` | Cyan — lighter fills, shimmer |
| `tertiary` | `#f43f5e` | Rose — alerts, flags, absent indicators |
| `tertiary-dim` | `#fb7185` | Rose — lighter, text on dark |
| `on-surface` | `#f0eeff` | Primary text |
| `on-surface-variant` | `rgba(240,238,255,0.45)` | Secondary / muted text |
| `outline` | `rgba(255,255,255,0.08)` | Card borders |
| `outline-variant` | `rgba(255,255,255,0.05)` | Subtle dividers |

**Attendance threshold colours:**
- ≥ 80%: `secondary` (cyan)
- 65–79%: `primary-dim` (violet)
- < 65%: `tertiary` (rose)

### 1.2 Typography

Replace Manrope + Inter with:

```ts
// app/layout.tsx
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})
```

Tailwind font families:
- `font-headline` → `var(--font-display)` (Bricolage Grotesque)
- `font-body` → `var(--font-body)` (DM Sans)
- `font-label` → `var(--font-body)` (DM Sans, uppercase tracking)

### 1.3 Aurora Background System

Three fixed-position, `pointer-events-none`, `z-index: 0` orbs in `app/layout.tsx`:

| Orb | Colour | Opacity | Position | Size | Animation |
|---|---|---|---|---|---|
| 1 | `#7c3aed` (violet) | 55% | top-right | 500×500px | 10s float |
| 2 | `#06b6d4` (cyan) | 35% | bottom-left | 420×420px | 13s float (reverse) |
| 3 | `#f43f5e` (rose) | 25% | center-right | 340×340px | 9s float (offset) |

All orbs use `filter: blur(90px)`, `border-radius: 50%`, and a CSS `@keyframes` float animation that only animates `transform: translateY()` — GPU-accelerated, no layout thrash.

```css
@keyframes aurora-float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-24px) scale(1.04); }
}
```

Content sits in a `relative z-10` wrapper over the orbs.

### 1.4 Glass Card Mixin

Reusable pattern applied to all card components:

```
background: rgba(255,255,255,0.04)
backdrop-filter: blur(12px)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 14px (cards) / 10px (rows)
```

**Shimmer top border** (pseudo-element `::before`, `height: 1px`):
- Default (violet): `linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)`
- Positive/cyan: `linear-gradient(90deg, transparent, rgba(34,211,238,0.5), transparent)`
- Alert/rose: `linear-gradient(90deg, transparent, rgba(244,63,94,0.5), transparent)`

---

## 2. Shell & Navigation

### 2.1 `app/layout.tsx`

- Load Bricolage Grotesque + DM Sans via `next/font/google`
- Apply CSS variables to `<html>` element
- Render three aurora orb `div`s as a fixed full-screen layer (`z-0`)
- Wrap `{children}` in `relative z-10`
- Remove existing gradient orb JSX

### 2.2 Desktop Sidebar (`components/layout/Sidebar.tsx`)

- **No logo or wordmark** — nav items start at the top
- Background: `rgba(255,255,255,0.025)` + `backdrop-filter: blur(24px)`
- Right border: `1px solid rgba(255,255,255,0.06)`
- Nav item inactive: `text-on-surface-variant`, no background, `font-body text-sm font-medium`
- Nav item active: `bg-primary/18 border border-primary/28 text-primary-dim rounded-lg` + small glowing dot (6px, `box-shadow: 0 0 8px #7c3aed`)
- User profile card at bottom: same glass treatment, `border border-outline`, avatar with `bg-gradient-to-br from-primary to-secondary`

### 2.3 Mobile Bottom Nav (`components/layout/BottomNav.tsx`)

- Background: `rgba(7,7,15,0.85)` + `backdrop-filter: blur(20px)`
- Top border: `1px solid rgba(255,255,255,0.06)`
- Active tab: violet glass pill (`bg-primary/20 rounded-xl`) wrapping icon + label, `text-primary-dim`
- Inactive tabs: `text-on-surface-variant` (45% white)
- All tap targets: minimum `44px` height

---

## 3. Pages & Components

### 3.1 Dashboard (`app/dashboard/page.tsx`)

**Layout change — asymmetric hero (replaces equal 4-column KPI grid):**

Desktop:
```
[ Attendance Ring + Big Number (60%) ] [ Present Today card ] 
                                        [ Flagged card      ]
```

- Left (60%): `ProgressNebula` ring (large, ~120px) beside the big attendance number in Bricolage Grotesque 64px + "/ total" in muted secondary. Subtitle: "Q3 · date"
- Right (40%): two stacked glass satellite cards — Present Today (cyan shimmer), Flagged (rose shimmer)

Mobile: stacks vertically — ring card full-width first, then 2-col satellite row.

**Below hero:**
- Module attendance list: glass rows, gradient progress bars (cyan fill), violet shimmer
- Critical alerts panel: rose-tinted glass cards (`bg-tertiary/5 border-tertiary/20`), glowing left border `border-l-2 border-tertiary`

### 3.2 Courses Directory (`app/courses/page.tsx` + `CourseDirectoryClient.tsx`)

- Search bar: glass input (`bg-surface border-outline`), violet focus ring + glow (`focus:border-primary/30 focus:ring-1 focus:ring-primary/20 focus:shadow-[0_0_16px_rgba(124,58,237,0.15)]`)
- Grid: 2-col desktop (was 3-col) → 1-col mobile
- `CourseCard`: full glass treatment, module code styled in `font-mono text-xs text-on-surface-variant`, gradient progress bar, cyan shimmer on cards ≥80%, rose shimmer on cards <65%

### 3.3 Course Detail (`app/courses/[id]/page.tsx`)

- Student table rows: glass base (`bg-surface/50`), `hover:bg-surface-high` with `transition-colors`, separated by `border-b border-outline-variant` (no solid borders)
- `StatusBadge` — Present: `bg-secondary/15 border-secondary/25 text-secondary-dim` + `box-shadow: 0 0 8px rgba(6,182,212,0.2)`; Absent: `bg-tertiary/15 border-tertiary/25 text-tertiary-dim` + rose glow
- Topic progress bars: `bg-gradient-to-r from-secondary to-primary-dim`

### 3.4 Students Directory (`app/students/page.tsx`)

- Student cards: glass panel (`bg-surface border-outline rounded-2xl`)
- Attendance progress bar → attendance ring (small `ProgressNebula`, 48px) replacing the flat bar on desktop
- Class section headers: title + gradient accent underline (`bg-gradient-to-r from-primary-dim to-transparent h-px`)

### 3.5 Attendance Taking (`app/attend/page.tsx`)

- Student toggle rows: glass cards, toggled-present = `border-secondary/40 bg-secondary/5` with cyan glow; toggled-absent = `border-tertiary/40 bg-tertiary/5` with rose glow
- Submit / confirm FAB: `bg-gradient-to-r from-primary to-secondary text-white shadow-[0_4px_20px_rgba(124,58,237,0.4)]`

### 3.6 Teachers (`app/teachers/page.tsx`)

- Teacher cards: glass panel, same treatment as student cards
- Attendance metric: cyan progress ring

### 3.7 Shared Components

| Component | Change |
|---|---|
| `StatusBadge` | Glow variants (cyan present, rose absent) |
| `ProgressNebula` | Stroke colours → `secondary` (cyan), `primary-dim` (violet), `tertiary` (rose) |
| `CourseCard` | Full glass treatment, gradient progress bar |
| `StatPill` | Glass background, Bricolage Grotesque value font |
| `CriticalAlertCard` | Rose glass (`bg-tertiary/5`), glowing left border |
| `TeacherCard` | Glass panel, remove solid background |

---

## 4. Files Touched

| File | Type of change |
|---|---|
| `tailwind.config.ts` | Replace all custom colour tokens |
| `app/globals.css` | Update scrollbar, base styles, font variables; add aurora keyframes |
| `app/layout.tsx` | Swap fonts, add aurora orb layer |
| `components/layout/Sidebar.tsx` | Full glass redesign, remove logo |
| `components/layout/BottomNav.tsx` | Glass redesign, active pill |
| `components/layout/PrincipalShell.tsx` | Update header glass treatment |
| `app/dashboard/page.tsx` | Asymmetric hero layout |
| `app/courses/page.tsx` + `CourseDirectoryClient.tsx` | Glass search, 2-col grid |
| `app/courses/[id]/page.tsx` | Glass table, glow badges |
| `app/students/page.tsx` | Glass cards, attendance rings |
| `app/attend/page.tsx` | Glow toggle rows, gradient FAB |
| `app/teachers/page.tsx` | Glass cards |
| `components/ui/StatusBadge.tsx` | Glow variants |
| `components/ui/ProgressNebula.tsx` | Colour remapping |
| `components/ui/CourseCard.tsx` | Glass treatment |
| `components/ui/StatPill.tsx` | Glass + display font |
| `components/ui/CriticalAlertCard.tsx` | Rose glass |
| `components/teachers/TeacherCard.tsx` | Glass panel |

---

## 5. Out of Scope

- `app/login/page.tsx` — not redesigned in this pass
- `app/reports/page.tsx` — stub page, not redesigned
- `app/attendance/page.tsx` — secondary attendance overview, not in scope unless trivial
- No functional changes — all data fetching, routing, and business logic unchanged
- No new pages or features
