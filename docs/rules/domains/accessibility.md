---
domain: A11Y
total_rules: 6
critical: 0
high: 3
medium: 2
low: 1
related_domains: [UI, REACT]
automation_script: _automation/detect-a11y-violations.sh
last_updated: "2025-10-19"
---

# Accessibility Rules

> **Domain:** Accessibility | **Rules:** 6 | **Critical:** 0

## Overview

Rules for WCAG compliance, aria attributes, and assistive support.

**Key Principles:**
1. Provide accessible names to grouped controls (A11Y-H101).
2. Enable `accessibilityLayer` on charts (A11Y-H102).
3. Use shadcn form primitives for labels, help text, and errors (A11Y-M301).

**📖 See also**: [User Interface](./ui.md), [React](./react.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

- None.

## High Priority Rules (H-level) {#high-priority}

### A11Y-H101 — Provide aria-label for grouped controls {#a11y-h101}

- **Pattern:** Provide aria-label for grouped controls
- **See metadata:** `_meta/rules.json → A11Y-H101`

### A11Y-H102 — Enable accessibilityLayer on chart components {#a11y-h102}

- **Pattern:** Enable accessibilityLayer on chart components
- **See metadata:** `_meta/rules.json → A11Y-H102`

### A11Y-H103 — Wrap related fields in FieldSet + FieldLegend {#a11y-h103}

- **Pattern:** Wrap related fields in FieldSet + FieldLegend
- **See metadata:** `_meta/rules.json → A11Y-H103`

## Medium Priority Rules (M-level) {#medium-priority}

### A11Y-M301 — Use Form, FormField, FormItem primitives {#a11y-m301}

- **Pattern:** Use Form, FormField, FormItem primitives
- **See metadata:** `_meta/rules.json → A11Y-M301`

### A11Y-M302 — Input OTP uses new composition pattern {#a11y-m302}

- **Pattern:** Input OTP uses new composition pattern
- **See metadata:** `_meta/rules.json → A11Y-M302`

## Low Priority Rules (L-level) {#low-priority}

### A11Y-L701 — Provide descriptive Suspense fallbacks {#a11y-l701}

- **Pattern:** Provide descriptive Suspense fallbacks
- **See metadata:** `_meta/rules.json → A11Y-L701`

## Common Mistakes {#common-mistakes}

1. Missing aria-label on grouped controls → [A11Y-H101](../03-QUICK-SEARCH.md#a11y-h101).
2. Skipping descriptive Suspense fallbacks → [A11Y-L701](../03-QUICK-SEARCH.md#a11y-l701).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#accessibility) for compliant snippets.
- Run [_automation/detect-a11y-violations.sh](../_automation/detect-a11y-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [UI Rules](./ui.md)
- [Code Examples](../reference/examples.md#a11y)

**Last Updated:** 2025-10-19
