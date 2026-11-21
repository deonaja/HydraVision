---
name: HydraVision
description: Warm woven-linen and matte terracotta ceramic visual system for honest at-home skin hydration analysis.
colors:
  indigo-primary: "#234b72"
  indigo-hover: "#1b3c5d"
  indigo-tint: "#e6eef5"
  clay-body: "#a34d2d"
  clay-recess: "#904225"
  linen-ground: "#ede5d8"
  linen-soft: "#f3ece2"
  linen-deep: "#e2d7c6"
  linen-rail: "#e7decb"
  ceramic-ivory: "#faf6ef"
  ceramic-dish: "#f6f0e6"
  ceramic-border: "#d7cab8"
  ceramic-border-strong: "#c4b39c"
  ink-espresso: "#211b17"
  ink-umber: "#51463e"
  ink-muted: "#6c5f55"
  ink-on-clay: "#fbf6f0"
  state-hydrated-bg: "#e6eef5"
  state-hydrated-fg: "#1b3c5d"
  state-hydrated-border: "#a5bfd6"
  state-dry-bg: "#f6e4dc"
  state-dry-fg: "#83371b"
  state-dry-border: "#d9a087"
  state-success-bg: "#e4efe9"
  state-success-fg: "#1f543b"
  state-success-border: "#a7cbb8"
  state-danger-bg: "#f8e4e1"
  state-danger-fg: "#8e241b"
  state-danger-border: "#dda098"
  state-warning-bg: "#f6ecda"
  state-warning-fg: "#724b12"
  state-warning-border: "#d8bc89"
typography:
  display:
    fontFamily: '"Bricolage Grotesque", "Onest", sans-serif'
    fontSize: "clamp(2.05rem, 3.8vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Bricolage Grotesque", "Onest", sans-serif'
    fontSize: "clamp(1.65rem, 2.6vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Bricolage Grotesque", "Onest", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Onest", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  label:
    fontFamily: '"Onest", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "10px"
  pill: "999px"
spacing:
  2xs: "6px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.indigo-primary}"
    textColor: "{colors.ceramic-ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.indigo-hover}"
    textColor: "{colors.ceramic-ivory}"
  button-espresso:
    backgroundColor: "{colors.ink-espresso}"
    textColor: "{colors.ceramic-ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-ceramic:
    backgroundColor: "{colors.ceramic-ivory}"
    textColor: "{colors.ink-espresso}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-clay:
    backgroundColor: "{colors.clay-body}"
    textColor: "{colors.ink-on-clay}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.state-danger-bg}"
    textColor: "{colors.state-danger-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-espresso}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  input-field:
    backgroundColor: "{colors.ceramic-ivory}"
    textColor: "{colors.ink-espresso}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    height: "44px"
  badge-hydrated:
    backgroundColor: "{colors.state-hydrated-bg}"
    textColor: "{colors.state-hydrated-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  badge-dry:
    backgroundColor: "{colors.state-dry-bg}"
    textColor: "{colors.state-dry-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 12px"
  ceramic-panel:
    backgroundColor: "{colors.ceramic-ivory}"
    textColor: "{colors.ink-espresso}"
    rounded: "{rounded.md}"
    padding: "24px"
  vanity-tray:
    backgroundColor: "{colors.clay-body}"
    textColor: "{colors.ink-on-clay}"
    rounded: "{rounded.lg}"
    padding: "12px"
  vanity-tray-well:
    backgroundColor: "{colors.clay-recess}"
    textColor: "{colors.ink-on-clay}"
    rounded: "{rounded.sm}"
    padding: "18px"
  ceramic-dish:
    backgroundColor: "{colors.ceramic-ivory}"
    textColor: "{colors.ink-espresso}"
    rounded: "{rounded.sm}"
    padding: "22px"
  nav-item-active:
    backgroundColor: "{colors.ceramic-ivory}"
    textColor: "{colors.indigo-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "42px"
---

# Design System: HydraVision

## Overview

**Creative North Star: "Meja Rias Linen & Lempung"**

HydraVision translates at-home skin hydration checks into the tactile calm of a morning dressing table. Rather than borrowing the sterile white-and-cyan language of hospital diagnostics or glossy SaaS skincare templates, every surface belongs to a physical material family: an unbleached oat-linen ground with subtle organic fiber grain, matte terracotta vanity trays with recessed compartments, glazed ceramic ivory dishes, and deep espresso ink.

The system balances warmth with crisp operational clarity. Users check skin hydration from home lighting on phones and laptops, so hierarchy relies on decisive scale jumps, honest plain-language guidance, tabular confidence numerals, and clear binary coding—Mineral Indigo for primary actions and `Terhidrasi` results, Matte Terracotta for the tray vessel and `Kering` results. Interactive surfaces stay calm and flat until physical nesting or user state warrants elevation.

**Key Characteristics:**
- Tactile domestic materials—oat-linen ground with subtle SVG fiber noise, matte terracotta clay vessels, and glazed ceramic ivory dishes—replacing clinical white templates.
- Strict binary material semantics: Mineral Indigo anchors primary actions and `Terhidrasi` status, while Matte Terracotta anchors the vanity tray and `Kering` status.
- Crisp architectural ceramic geometry (`4px`, `6px`, and `10px` radii) paired with full `1.5px` perimeter borders rather than one-sided accent stripes.
- Self-hosted `Bricolage Grotesque` display headings and `Onest` UI copy with `tabular-nums` on every confidence percentage and serial history score.
- Transparent, non-medical framing embedded natively into components (photo-quality checklists, simulation badges, and framed disclaimer notices).

## Colors

A warm earth-and-mineral palette rooted in unbleached linen, glazed ivory ceramic, baked terracotta clay, and deep mineral indigo. *(Note: During implementation, the ground, clay, and ceramic values were subtly refined from the initial surface brief—`#ede5d8`, `#a34d2d`, and `#faf6ef`—for higher text contrast and surface separation; the values in frontmatter are normative.)*

### Primary
- **Mineral Indigo** (`#234b72`): Primary calls to action (`Mulai Cek Kulit`, `Proses Klasifikasi Sekarang`), text links, focus rings, active navigation labels, care-guide icon accents, text selection background, and the `Terhidrasi` confidence fill.
- **Deep Indigo** (`#1b3c5d`): Hover state for primary buttons and links, plus high-contrast foreground text on hydrated status pills and info notices.
- **Indigo Mist** (`#e6eef5`): Soft mineral tint behind guidance icons, hydrated badges, and informational banners.

### Secondary
- **Matte Terracotta** (`#a34d2d`): Outer chassis of the signature two-compartment vanity tray, scope statement box, brand mark container, clay confirmation buttons, `Kering` solid pills, and `Kering` serial strip chips.
- **Recessed Clay** (`#904225`): Sunken interior wells inside the vanity tray that frame the dashed photo dropzone and elevated ceramic result dish.

### Tertiary
- **Hydrated Surface Pair** (`#e6eef5` fill / `#1b3c5d` ink / `#a5bfd6` border): Tinted status badges and info notices for `Terhidrasi` states and neutral system guidance.
- **Dry Surface Pair** (`#f6e4dc` fill / `#83371b` ink / `#d9a087` border): Tinted status badges and dialog accents representing `Kering` skin readings.
- **Botanical Sage Success** (`#e4efe9` fill / `#1f543b` ink / `#a7cbb8` border): Active user account pills, automatic-save confirmations (`Tersimpan Otomatis`), and success toasts.
- **Baked Brick Danger** (`#f8e4e1` fill / `#8e241b` ink / `#dda098` border): Destructive button fills, validation error notices, invalid input borders, and solid danger confirmation buttons (`#8e241b` fill with ivory text).
- **Warm Ochre Warning** (`#f6ecda` fill / `#724b12` ink / `#d8bc89` border): `Mode Simulasi` / `Mode Simulasi Frontend` pills marking synthetic frontend demo states.

### Neutral
- **Oat Linen Ground** (`#ede5d8`): Root page canvas layered with a subtle 4.5% fractal-noise fiber texture and soft warm ambient lighting radials.
- **Soft Linen** (`#f3ece2`): Secondary horizontal section bands (such as the landing workflow track) and nested care-recommendation items inside ceramic panels.
- **Deep Linen** (`#e2d7c6`): Scrollbar tracks, inactive status pills, progress bar tracks, and image preview placeholders.
- **Linen Rail** (`#e7decb`): Persistent desktop sidebar navigation rail, sticky mobile top bar, and public site footer.
- **Glazed Ceramic Ivory** (`#faf6ef`): Primary content panels, elevated result dishes inside clay wells, form inputs, secondary ceramic buttons, active sidebar items, and confirmation modals.
- **Warm Ceramic Dish** (`#f6f0e6`): Subtle warm surface for default notices and mandatory non-medical disclaimer callouts.
- **Stone Border** (`#d7cab8`) & **Strong Stone Border** (`#c4b39c`): Full-perimeter borders (`1px`–`1.5px`) defining ceramic panels, dividers, inputs, notices, and active navigation surfaces.
- **Espresso Ink** (`#211b17`): Primary headings, body copy, wordmarks, high-emphasis secondary buttons (`Daftar`, `Daftar Akun Baru`), and active checklist icons.
- **Umber Ink** (`#51463e`): Secondary body copy, subtitles, metadata, disclaimers, and default sidebar navigation text.
- **Muted Umber** (`#6c5f55`): Hints, input placeholders, sidebar group labels, and secondary role captions.
- **Warm Clay Ivory** (`#fbf6f0`): High-contrast text and icons resting directly on Matte Terracotta and Recessed Clay surfaces.

### Named Rules
**The Binary Material Rule.** Reserve Mineral Indigo (`#234b72`) for primary actions and `Terhidrasi` states, and Matte Terracotta (`#a34d2d`) for the vanity tray chassis and `Kering` states. Never mix the two into gradients or swap their semantic meaning across screens.

**The Unbleached Ground Rule.** Anchor canvases on Oat Linen (`#ede5d8`) and cards on Glazed Ceramic Ivory (`#faf6ef`) rather than cold pure white (`#ffffff`). Keep ambient contrast warm and comfortable under bathroom or bedroom lighting.

## Typography

**Display Font:** `Bricolage Grotesque` (fallback: `Onest`, `sans-serif`; self-hosted variable WOFF2, weights 500–700)
**Body Font:** `Onest` (fallback: `sans-serif`; self-hosted variable WOFF2, weights 400–700)

**Character:** Expressive, slightly sculpted humanist grotesque headlines in `Bricolage Grotesque` paired with clean, neutral `Onest` UI typography. Tight negative tracking on headings gives editorial poise without sacrificing instant legibility in Bahasa Indonesia on mobile screens.

### Hierarchy
- **Display** (`700`, `clamp(2.05rem, 3.8vw, 3.25rem)`, `line-height: 1.08`, `letter-spacing: -0.03em`): Landing page hero `<h1>` and major verdict callouts (`clamp(2rem, 3.2vw, 2.65rem)` on classification result verdicts). Uses `text-wrap: balance`.
- **Headline** (`700`, `clamp(1.65rem, 2.6vw, 2.1rem)`, `line-height: 1.18`, `letter-spacing: -0.025em`): Authenticated page titles (`Klasifikasi Kondisi Kulit`, dashboard headers) and landing section `<h2>` headings (`clamp(1.65rem, 2.8vw, 2.25rem)`).
- **Title** (`700`, `1.125rem`–`1.35rem`, `line-height: 1.18`, `letter-spacing: -0.025em`): Brand wordmarks (`1.25rem` landing / `1.15rem` app rail), ceramic panel `<h2>` headers (`1.2rem`–`1.3rem`), modal headings (`1.125rem`), and care step `<h3>` headings (`1rem`–`1.075rem`).
- **Body** (`400`–`500`, `0.9375rem`–`1rem`, `line-height: 1.5`–`1.55`): Primary paragraphs, care advice copy, form input text (`0.9375rem`), and checklist items; prose blocks cap at `60ch` max-width for effortless reading.
- **Label** (`600`, `0.8125rem`–`0.875rem`, `line-height: 1.1`–`1.2`): Form field labels (`0.875rem`), compact buttons (`0.875rem`), status badges (`0.8125rem`), field hints/errors (`0.8125rem`), and sidebar group titles (`0.8125rem`).

### Named Rules
**The Tabular Confidence Rule.** Apply `font-variant-numeric: tabular-nums` (`.tabular`) to every confidence percentage, serial date chip, workflow step index, and dashboard count so digits never jitter when switching history samples.

**The Sentence-Case Honesty Rule.** Set all headings, buttons, badges, and navigation groups in natural Indonesian sentence or title case. Never introduce uppercase kickers, all-caps eyebrows, or wide-tracked micro-labels.

## Layout

HydraVision operates across two complementary spatial shells sharing the same `1160px`–`1180px` visual ceiling:

- **Public Landing Shell (`max-width: 1180px`):** Centered horizontal container with `28px` desktop side gutters (`18px` on mobile) and generous `64px` vertical section bands (`44px` on mobile). The first viewport pairs an asymmetric vanity workspace (`minmax(0, 1fr) 232px`, `32px` gap) with a 4-column interactive serial history strip (`repeat(4, minmax(0, 1fr))`, `14px` gap) immediately beneath. Inside the landing tray, the upload and result wells split `1.16fr / 0.84fr` with `14px` internal gap and `16px` outer clay padding.
- **Authenticated Application Shell:** A two-column CSS Grid (`264px 1fr`) pairing a full-height sticky Linen Rail sidebar (`100vh`, `padding: 22px 16px 18px`) with a fluid content canvas (`max-width: 1160px`, `padding: 34px 36px 56px`, vertical stack gap `24px`). Classification splits `minmax(0, 1.35fr) minmax(280px, 0.85fr)` during upload and `0.95fr 1.05fr` inside the result vanity tray.
- **Spacing Rhythm:** Tight `6px`–`8px` gaps inside form fields, buttons, and badge clusters; `12px`–`16px` inside terracotta tray rims and recessed wells; `24px`–`32px` internal padding inside ceramic panels and dialogs; `64px` vertical breathing room between landing bands.
- **Responsive Breakpoints:**
  - `1020px` (Tablet): Landing vanity workspace, honesty grid, and multi-column dashboard layouts collapse to single column; 4-column history strip and workflow track step down to 2 columns; the landing guide column adopts a ceramic panel enclosure.
  - `960px` (App Drawer): Application shell collapses to single column; the `264px` sidebar becomes a `280px` fixed slide-in drawer (`240ms` ease-out) paired with a sticky mobile top bar (`padding: 12px 18px`) and `rgba(33, 27, 23, 0.45)` backdrop; classify upload, loading, and result grids stack vertically.
  - `720px` (Mobile Landing): Landing top bar hides anchor links and divider; the two-compartment tray, history strip, and workflow track stack to single column; gutters tighten to `18px`.
  - `600px`–`640px` (Compact Mobile): Secondary dashboard and admin grids collapse to full-width single columns.

## Elevation & Depth

HydraVision uses a physical-tactile depth model built from warm espresso- and clay-tinted ambient shadows, recessed inner shadows, and gentle tonal surface stepping (`#ede5d8` linen → `#e7decb` rail → `#faf6ef` ceramic). Shadows never use pure black (`#000`) or glowing halos, and motion respects `prefers-reduced-motion: reduce`.

### Shadow Vocabulary
- **Ceramic Panel** (`box-shadow: 0 2px 6px rgba(33, 27, 23, 0.06), 0 8px 20px rgba(33, 27, 23, 0.05)`): Soft resting elevation for `.ceramic-panel` containers sitting directly on Oat Linen.
- **Vanity Tray** (`box-shadow: 0 12px 26px rgba(48, 28, 18, 0.18), 0 3px 8px rgba(48, 28, 18, 0.14)`): Weighted outer drop shadow for Matte Terracotta vanity trays (paired with a subtle top-edge inner highlight `inset 0 1px 0 rgba(242, 180, 148, 0.3)`).
- **Tray Well** (`box-shadow: inset 0 3px 8px rgba(56, 20, 9, 0.32), inset 0 1px 0 rgba(56, 20, 9, 0.24), inset 0 -1px 0 rgba(235, 165, 130, 0.16)`): Recessed clay cavity depth carved into the vanity tray.
- **Ceramic Dish** (`box-shadow: 0 4px 12px rgba(48, 22, 11, 0.22), 0 1px 2px rgba(48, 22, 11, 0.14)`): Distinct resting weight for glazed ivory result and preview dishes seated inside a recessed clay well.
- **Popover / Modal** (`box-shadow: 0 18px 42px rgba(33, 27, 23, 0.18), 0 4px 12px rgba(33, 27, 23, 0.08)`): Highest overlay tier used by confirmation dialogs and floating toast notifications.

### Named Rules
**The Physical Vessel Rule.** Match shadow direction and weight to physical nesting: outer terracotta trays cast grounded clay shadows (`--shadow-tray`), inner compartments recede via inset depth (`--shadow-tray-well`), and ivory dishes rest inside wells with tighter contact shadows (`--shadow-dish`).

## Shapes

The form language evokes precision-molded stoneware—crisp architectural corners with just enough chamfer to feel tactile rather than sharp:

- **Corner Scale:** `4px` (`--radius-xs`) for inline validation alerts inside dark wells; `6px` (`--radius-sm`) for all buttons, inputs, notices, toasts, recessed wells, ceramic dishes, and serial history chips; `10px` (`--radius-md` / `--radius-lg`, currently aliased to the same step) for outer ceramic panels, confirmation modals, and terracotta vanity trays; `999px` (`--radius-pill`) for status badges, progress tracks, and scrollbar thumbs; `50%` circles for upload dropzone emblems, workflow step numbers, dialog icons, and user avatars.
- **Perimeter Framing:** Every panel, notice, input, and chip uses a complete `1px`–`1.5px` four-sided border (`#d7cab8` or `#c4b39c`) instead of a heavy single-side accent stripe.
- **Iconography:** Custom inline outline SVGs (`HvIcon`) drawn on a `24x24` grid with `1.85px` stroke width, round linecaps, and round joins—never icon fonts or emoji glyphs.

## Components

### Buttons
Confident, touch-ready controls built for both phone thumbs and desktop pointers.
- **Shape:** Crisp stoneware rectangle (`6px` radius), `44px` minimum height (`36px` small, `50px` large), `0 20px` horizontal padding (`0 14px` sm, `0 26px` lg), `8px` icon-label gap, `0.9375rem` semibold (`600`) `Onest`.
- **Primary:** Mineral Indigo (`#234b72`) fill, Ceramic Ivory (`#faf6ef`) ink, subtle grounded shadow (`0 3px 10px rgba(21, 47, 73, 0.24)`).
- **Hover / Focus / Active:** Fast `150ms` `cubic-bezier(0.22, 1, 0.36, 1)` color transitions; Primary darkens to Deep Indigo (`#1b3c5d`); tactile `translateY(1px)` press on `:active`; crisp `2.5px solid #234b72` outline with `2px` offset on `:focus-visible`; `0.55` opacity when disabled.
- **Secondary / Variants:**
  - *Espresso:* `#211b17` fill with ivory text for high-priority account entry (`Daftar`, `Buka Dashboard`).
  - *Ceramic:* `#faf6ef` fill, `#211b17` text, `1.5px` Strong Stone border (`#c4b39c`) for neutral secondary actions (`Ganti Foto`, `Keluar`, `Batal`).
  - *Clay:* `#a34d2d` fill, `#fbf6f0` text for warm terracotta confirmation actions.
  - *Danger & Danger-Solid:* Tinted Brick (`#f8e4e1` / `#8e241b` / `#dda098` border) for reversible removal (`Hapus Foto`), and solid `#8e241b` with ivory text inside destructive confirmation dialogs.
  - *Ghost:* Transparent resting fill with `rgba(33, 27, 23, 0.06)` hover tint.

### Status Badges & Serial Strip Chips
Clear, scannable pills for binary verdicts and interactive dated tiles for tracking hydration over time.
- **Status Badges:** Pill geometry (`999px`), `5px 12px` padding, `0.8125rem` semibold (`600`), `1px` semantic border. Available in tinted and solid `Terhidrasi` (Indigo), tinted and solid `Kering` (Terracotta), `Active` (Sage), `Inactive` (Deep Linen), and `Mode Simulasi` (Ochre).
- **Serial Strip Chips:** Full-width `54px`-tall ceramic buttons (`6px` radius, `0 2px 6px rgba(33, 27, 23, 0.06)`) pairing date + label on the left with bold tabular percentage on the right. `Terhidrasi` chips sit on Ceramic Ivory; `Kering` chips sit on Matte Terracotta with ivory text. Hover lifts `translateY(-1px)`; active selection highlights with a `2px` Indigo ring (hydrated) or Espresso ring (dry).

### Ceramic Panels, Notices & Dialogs
Calm glazed enclosures with complete borders and honest visual hierarchy.
- **Ceramic Panels:** `10px` radius, Ceramic Ivory (`#faf6ef`) fill, `1.5px solid #d7cab8`, `--shadow-ceramic`, `24px`–`32px` internal padding.
- **Notices:** `6px` radius, `14px 16px` padding, `12px` icon-copy gap, `1.5px` full border. Variants cover default/disclaimer (`#f6f0e6` dish fill, `#51463e` text), error (`#f8e4e1`), and info (`#e6eef5`).
- **Confirmation Dialogs & Toasts:** Native `<dialog>` card (`max-width: 440px`, `10px` radius, `24px` padding, `--shadow-popover`) over a `rgba(33, 27, 23, 0.52)` backdrop with `blur(3px)` for destructive confirmations. Floating toasts anchor bottom-right (`20px` inset, `6px` radius, `240ms` vertical slide/fade) in neutral, success, and error tones.

### Inputs / Fields
Clean ceramic fields with unmistakable focus and validation feedback.
- **Style:** `44px` min-height (`104px` for textareas), `10px 14px` padding, Ceramic Ivory (`#faf6ef`) background, `1.5px solid #c4b39c` border, `6px` radius, `0.9375rem` `Onest`, `6px` vertical field stack gap.
- **Hover / Focus:** Border shifts to Umber Ink (`#51463e`) on hover; focuses with Mineral Indigo (`#234b72`) border and `0 0 0 3px rgba(35, 75, 114, 0.16)` focus halo.
- **Error:** `aria-invalid="true"` switches border to Baked Brick (`#8e241b`), accompanied by `0.8125rem` error copy below the field.

### Navigation
Uncluttered orientation split cleanly between public landing and authenticated workspace.
- **Landing Header:** Transparent band over Oat Linen (`max-width: 1180px`, `padding: 20px 28px 8px`), pairing the terracotta droplet mark (`30x30px`) and `Bricolage Grotesque` wordmark on the left with anchor links, a `1px` stone separator, and an Espresso `Daftar` CTA on the right.
- **Application Sidebar Rail:** Sticky `264px` Linen Rail (`#e7decb`, `1.5px` right stone border) with `42px` nav rows (`6px` radius, `11px` icon gap). Active route elevates onto a bordered Ceramic Ivory tile with Mineral Indigo ink and `0 2px 6px rgba(33, 27, 23, 0.06)` shadow. Admin routes separate cleanly beneath a `1px` stone rule and muted group label (`Pengelolaan Sistem`), while the footer anchors the user account chip and full-width Ceramic `Keluar` button. Below `960px`, it slides in as a `280px` drawer triggered from a sticky mobile bar.

### Terracotta Vanity Tray & Ivory Result Dish
HydraVision's signature component unifying photo intake and hydration verdict inside a single tactile vessel.
- **Structure:** Outer `.vanity-tray` (`#a34d2d`, `10px` radius, `12px`–`16px` padding, `--shadow-tray`) encloses one or two recessed `.vanity-tray-well` cavities (`#904225`, `6px` radius, `--shadow-tray-well`).
- **Intake Well:** Houses a dashed warm-ivory dropzone (`1.75px dashed rgba(250, 246, 239, 0.56)`) with a `52px`–`56px` circular icon medallion, drag-over darkening state, file validation feedback, and the primary Indigo CTA.
- **Result Dish:** Seated inside the opposite well, `.ceramic-dish` (`#faf6ef`, `6px` radius, `22px`–`24px` padding, `--shadow-dish`) presents the status pill, bold tabular verdict (`Terhidrasi — 91%`), confidence bar (`10px` pill track with `360ms` width transition), and daily care advice separated by a `1px` stone hairline. Switching serial strip dates animates dish content via a crisp `180ms` vertical settle transition (`translateY(4px)`).

## Do's and Don'ts

### Do:
- **Do** keep Mineral Indigo (`#234b72`) and Matte Terracotta (`#a34d2d`) semantically distinct—Indigo for primary actions and `Terhidrasi`, Terracotta for vanity trays and `Kering`.
- **Do** frame every ceramic panel, disclaimer notice, and status dish with full four-sided borders (`1px`–`1.5px`) rather than one-sided accent bars.
- **Do** apply `tabular-nums` (`.tabular`) to all confidence percentages, serial dates, and metric counters.
- **Do** pair every classification result with a visible non-medical disclaimer notice and clearly label synthetic/demo data with the Warm Ochre `Mode Simulasi` badge.
- **Do** respect physical shadow nesting: `--shadow-tray` on outer clay trays, `--shadow-tray-well` inset inside cavities, and `--shadow-dish` on ivory cards resting inside wells.
- **Do** maintain at least `44px` interactive height on primary buttons and form inputs for comfortable one-handed mobile use.

### Don't:
- **Don't** introduce cold clinical cyan, pure-white (`#ffffff`) page backgrounds, neon glows, or gradient fills across buttons and cards.
- **Don't** use all-caps kickers, over-tracked eyebrow labels, or one-sided `border-left` callout stripes.
- **Don't** replace custom `HvIcon` stroke SVGs (`1.85px` stroke) with emoji glyphs or mismatched icon packs.
- **Don't** invent new radius steps outside the stoneware scale (`4px`, `6px`, `10px`, `999px`) when building new components.
- **Don't** omit confirmation dialogs (`ConfirmDialog`) on destructive actions such as deleting history records or removing user accounts.
