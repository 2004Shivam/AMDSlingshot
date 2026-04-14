# 🎨 Design System — Evee
> Author: @designer | Date: 2026-04-14

---

## Visual Identity Philosophy

Evee is **not** a medical app. It is not a diet tracker. It is a intelligent companion.
The visual language must feel: **warm, intelligent, premium, India-native**.

Key anti-patterns to avoid:
- ❌ Clinical whites and medical greens
- ❌ Weight-loss "before/after" aesthetic
- ❌ Heavy data dashboards
- ❌ Western minimalism that feels cold

---

## Color Palette

### Primary Brand Colors

```
--evee-ember:       #FF6B35   /* Warm sunset orange — primary CTA, energy */
--evee-ember-light: #FF8C5A   /* Hover state */
--evee-ember-dark:  #E8501F   /* Pressed state */

--evee-indigo:      #6C63FF   /* Electric indigo — AI intelligence, insights */
--evee-indigo-light:#8B84FF   /* Nudge backgrounds */
--evee-indigo-dark: #4D44E0   /* Active state */
```

### Background System (Dark Mode Default)

```
--bg-base:          #0D0D0F   /* OLED black — primary background */
--bg-surface:       #141417   /* Card backgrounds */
--bg-elevated:      #1C1C22   /* Modals, sheets */
--bg-overlay:       rgba(20,20,23,0.92)  /* Glassmorphism base */
```

### Text Colors

```
--text-primary:     #F5F5F7   /* Primary text — off-white, not harsh */
--text-secondary:   #A1A1AA   /* Muted labels, metadata */
--text-tertiary:    #52525B   /* Placeholder, disabled */
--text-accent:      #FF6B35   /* Emphasis, brand moments */
```

### Semantic Colors

```
--color-success:    #22C55E   /* Healthy choice, goal achieved */
--color-warning:    #FBBF24   /* Pattern alert, moderate concern */
--color-danger:     #EF4444   /* Critical alert (rare — not medical) */
--color-info:       #6C63FF   /* AI insight, neutral nudge */
```

### Gradient System

```
/* Hero gradient — warm AI energy */
--gradient-hero: linear-gradient(135deg, #FF6B35 0%, #6C63FF 100%);

/* Card shimmer — for loading states */
--gradient-shimmer: linear-gradient(90deg, #141417 0%, #1C1C22 50%, #141417 100%);

/* Scan overlay */
--gradient-scan: linear-gradient(180deg, rgba(108,99,255,0.0) 0%, rgba(108,99,255,0.15) 100%);
```

---

## Typography

### Font Stack

```
Primary:    'DM Sans', system-ui, sans-serif    /* Headlines, UI labels */
Secondary:  'Inter', system-ui, sans-serif      /* Body text, data */
Accent:     'DM Mono', monospace                /* Nutritional data, scores */
```

> Both DM Sans and Inter support Devanagari script for Hindi rendering via Google Fonts Noto Sans Devanagari fallback.

### Type Scale

```
--text-xs:    12px / 16px line-height   /* Metadata, captions */
--text-sm:    14px / 20px               /* Secondary labels */
--text-base:  16px / 24px               /* Body copy, default */
--text-lg:    18px / 28px               /* Card titles */
--text-xl:    22px / 30px               /* Section headers */
--text-2xl:   28px / 36px               /* Screen titles */
--text-3xl:   36px / 44px               /* Hero numbers */
--text-hero:  48px / 52px               /* Big moments (Food Story score) */
```

### Font Weights

```
--weight-regular:  400
--weight-medium:   500
--weight-semibold: 600
--weight-bold:     700
```

---

## Spacing System (8pt Grid)

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
```

---

## Border Radius

```
--radius-sm:   8px    /* Tags, chips */
--radius-md:   12px   /* Input fields */
--radius-lg:   16px   /* Cards */
--radius-xl:   24px   /* Bottom sheets, modals */
--radius-full: 9999px /* Pills, FABs */
```

---

## Shadow System

```
--shadow-card:   0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3);
--shadow-modal:  0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4);
--shadow-glow-ember:  0 0 24px rgba(255,107,53,0.3);
--shadow-glow-indigo: 0 0 24px rgba(108,99,255,0.3);
```

---

## Glassmorphism Tokens

```
--glass-bg:      rgba(28,28,34,0.7)
--glass-border:  rgba(255,255,255,0.06)
--glass-blur:    backdrop-filter: blur(16px);
```

---

## Motion / Animation

```
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)   /* FAB popout, card entrance */
--ease-smooth:   cubic-bezier(0.4, 0, 0.2, 1)          /* Sheet slides, transitions */
--ease-snappy:   cubic-bezier(0.25, 0.46, 0.45, 0.94) /* Quick responses */

--duration-fast:   150ms
--duration-base:   250ms
--duration-slow:   400ms
--duration-slower: 600ms
```

---

## Component Tokens

### Floating Action Buttons (FABs — Core Action)

```
FAB size:         80px × 80px
FAB icon size:    32px
FAB radius:       --radius-full
FAB primary:      background: --evee-ember, shadow: --shadow-glow-ember
FAB secondary:    background: --evee-indigo, shadow: --shadow-glow-indigo
FAB gap:          24px between FABs
FAB animation:    scale(1.08) on hover, spring easing
```

### Recommendation Cards

```
Card padding:     20px
Card radius:      --radius-xl
Card bg:          --glass-bg
Card border:      1px solid --glass-border
AI bubble:        background indigo/10%, border indigo/20%, radius --radius-lg
Rank badge:       40px circle, --evee-ember background, --weight-bold
```

### Bottom Navigation

```
Height:           72px (+ safe area inset)
Background:       --bg-elevated with --glass-blur
Active indicator: 3px pill under icon, --evee-ember color
Icon size:        24px
Label:            --text-xs, --weight-medium
```

---

## Iconography

- **Style**: Rounded, 2px stroke, `lucide-react-native` or `phosphor-icons`
- **Core icons**: Camera, Mic, Zap (nudge), BarChart2 (insights), User (profile), Scan, Check

---

## Illustration Style

- Minimal, warm-toned line illustrations for empty states
- Indian food icons (thali, dal bowl, chai cup) rendered in gradient fill
- Avoid generic Western food imagery (salads, pizza)
