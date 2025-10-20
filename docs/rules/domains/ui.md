---
domain: UI
total_rules: 10
critical: 4
high: 3
medium: 2
low: 1
related_domains: [A11Y, REACT]
automation_script: _automation/detect-ui-violations.sh
last_updated: "2025-10-19"
---

# User Interface Rules

> **Domain:** User Interface | **Rules:** 10 | **Critical:** 4

## Overview

Rules for shadcn/ui primitives, design tokens, and slot-based typography.

**Key Principles:**
1. Remove imports/usages of `@/components/ui/typography`; rely on typography baked into shadcn primitives (CardTitle, CardDescription, SidebarMenuButton, Badge, etc.). (`UI-P004`)
2. Render plain text inside shadcn slots that already provide styling—no extra `<span>` wrappers or custom font classes unless strictly necessary. (`UI-P004`)
3. When encountering ad-hoc text markup, refactor to the appropriate shadcn primitive; only fall back to semantic elements + design tokens if no primitive exists. (`UI-P004`)
4. Preserve each component’s documented composition (Card → CardHeader → CardTitle → CardContent, DropdownMenu hierarchy, etc.) before considering custom styling. (`UI-P002`)
5. Never introduce new primitives or edit `components/ui/*.tsx`; all changes occur in feature/layout code. (`UI-P003`)

**📖 See also**: [Accessibility](./accessibility.md), [React](./react.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

### UI-P001 — Render text via shadcn primitives or semantic tokens (no typography imports) {#ui-p001}

- **Summary:** Render text via shadcn primitives or semantic tokens (no typography imports)
- **Details:** [Critical spec](critical/UI-P001.md)

### UI-P002 — shadcn/ui compositions must include required subcomponents {#ui-p002}

- **Summary:** shadcn/ui compositions must include required subcomponents
- **Details:** [Critical spec](critical/UI-P002.md)

### UI-P003 — ONLY use shadcn/ui components (no custom UI primitives) {#ui-p003}

- **Summary:** ONLY use shadcn/ui components (no custom UI primitives)
- **Details:** [Critical spec](critical/UI-P003.md)

### UI-P004 — Remove `@/components/ui/typography` usage; rely on component slots {#ui-p004}

- **Summary:** Remove `@/components/ui/typography` usage; rely on component slots
- **Details:** [Critical spec](critical/UI-P004.md)

## High Priority Rules (H-level) {#high-priority}

### UI-H101 — Define custom styles with @utility not @layer {#ui-h101}

- **Pattern:** Define custom styles with @utility not @layer
- **See metadata:** `_meta/rules.json → UI-H101`

### UI-H102 — ONLY use approved color tokens - never arbitrary Tailwind colors {#ui-h102}

- **Pattern:** ONLY use approved color tokens from `app/globals.css` - never arbitrary Tailwind colors. NEVER edit `app/globals.css` directly.
- **See metadata:** `_meta/rules.json → UI-H102`

### UI-H103 — Provide aria-label on grouped controls {#ui-h103}

- **Pattern:** Provide aria-label on grouped controls
- **See metadata:** `_meta/rules.json → UI-H103`

## Medium Priority Rules (M-level) {#medium-priority}

### UI-M301 — Use named container queries {#ui-m301}

- **Pattern:** Use named container queries
- **See metadata:** `_meta/rules.json → UI-M301`

### UI-M302 — Charts include accessibilityLayer prop {#ui-m302}

- **Pattern:** Charts include accessibilityLayer prop
- **See metadata:** `_meta/rules.json → UI-M302`

## Low Priority Rules (L-level) {#low-priority}

### UI-L701 — Refactor :root colors to hsl() with @theme inline {#ui-l701}

- **Pattern:** Refactor :root colors to hsl() with @theme inline
- **See metadata:** `_meta/rules.json → UI-L701`

## Common Mistakes {#common-mistakes}

1. Leaving imports/usages of `@/components/ui/typography` in features → [UI-P004](critical/UI-P004.md).
2. Wrapping shadcn text slots in ad-hoc `<span>`/`<p>` with custom classes → [UI-P004](critical/UI-P004.md).
3. Using manual markup instead of available shadcn primitives → [UI-P004](critical/UI-P004.md).
4. Skipping required shadcn subcomponents (CardHeader, DialogHeader, etc.) → [UI-P002](critical/UI-P002.md).
5. Editing `components/ui/*` or introducing bespoke primitives → [UI-P003](critical/UI-P003.md).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#user-interface) for compliant snippets.
- Run [_automation/detect-ui-violations.sh](../_automation/detect-ui-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [Color Tokens](../reference/color-tokens.md)
- [shadcn Components](../reference/shadcn-components.md)

**Last Updated:** 2025-10-19
