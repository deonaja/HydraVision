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

<!-- impeccable:design-map -->
Name: HydraVision
Colors: primary: indigo-primary #234b72; secondary: clay-body #a34d2d; tertiary: state-hydrated-bg #e6eef5; neutral: linen-ground #ede5d8; primary: indigo-hover #1b3c5d; primary: indigo-tint #e6eef5 (+26 more in the sidecar)
Fonts: Bricolage Grotesque (display, headline, title); Onest (body, label)
Spacing: 2xs 6px, xs 8px, sm 12px, md 16px, lg 24px, xl 32px, 2xl 64px
Radius: xs 4px, sm 6px, md 10px, lg 10px, pill 999px
North Star: "Meja Rias Linen & Lempung"
Rules:
- The Binary Material Rule. Reserve Mineral Indigo (`#234b72`) for primary actions and `Terhidrasi` states, and Matte Terracotta (`#a34d2d`) for the vanity tray chassis and `Kering` states.
- The Unbleached Ground Rule. Anchor canvases on Oat Linen (`#ede5d8`) and cards on Glazed Ceramic Ivory (`#faf6ef`) rather than cold pure white (`#ffffff`).
- The Tabular Confidence Rule. Apply `font-variant-numeric: tabular-nums` (`.tabular`) to every confidence percentage, serial date chip, workflow step index, and dashboard count so digits never jitter when switching history samples.
- The Sentence-Case Honesty Rule. Set all headings, buttons, badges, and navigation groups in natural Indonesian sentence or title case.
- (+1 more)
Elevation:
- Ceramic Panel: 0 2px 6px rgba(33, 27, 23, 0.06), 0 8px 20px rgba(33, 27, 23, 0.05)
- Vanity Tray: 0 12px 26px rgba(48, 28, 18, 0.18), 0 3px 8px rgba(48, 28, 18, 0.14)
- Tray Well: inset 0 3px 8px rgba(56, 20, 9, 0.32), inset 0 1px 0 rgba(56, 20, 9, 0.24), inset 0 -1px 0 rgba(235, 165, 130, 0.16)
- Ceramic Dish: 0 4px 12px rgba(48, 22, 11, 0.22), 0 1px 2px rgba(48, 22, 11, 0.14)
- Popover / Modal: 0 18px 42px rgba(33, 27, 23, 0.18), 0 4px 12px rgba(33, 27, 23, 0.08)
Don't:
- Don't introduce cold clinical cyan, pure-white (`#ffffff`) page backgrounds, neon glows, or gradient fills across buttons and cards.
- Don't use all-caps kickers, over-tracked eyebrow labels, or one-sided `border-left` callout stripes.
- Don't replace custom `HvIcon` stroke SVGs (`1.85px` stroke) with emoji glyphs or mismatched icon packs.
- Don't invent new radius steps outside the stoneware scale (`4px`, `6px`, `10px`, `999px`) when building new components.
- Don't omit confirmation dialogs (`ConfirmDialog`) on destructive actions such as deleting history records or removing user accounts.
Full: .impeccable/design-full.md (read a section when you need its detail)
