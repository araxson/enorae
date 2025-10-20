---
domain: ARCH
total_rules: 7
critical: 2
high: 2
medium: 2
low: 1
related_domains: [DB, NEXT]
automation_script: _automation/detect-arch-violations.sh
last_updated: "2025-10-19"
---

# Architecture Rules

> **Domain:** Architecture | **Rules:** 7 | **Critical:** 2

## Overview

Rules for file structure, feature organization, and server directives.

**Key Principles:**
1. Server modules declare `"server-only"` or `"use server"` as required (ARCH-P001).
2. Pages stay ultra-thin and delegate to feature components (ARCH-P002).
3. Shared utilities live under `lib/` by domain (ARCH-H101).

**📖 See also**: [Database](./database.md), [Next.js](./nextjs.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

### ARCH-P001 — Server-only directives required in queries.ts, 'use server' in mutations.ts {#arch-p001}

- **Summary:** Server-only directives required in queries.ts, 'use server' in mutations.ts
- **Details:** [Critical spec](critical/ARCH-P001.md)

### ARCH-P002 — Pages must be 5-15 lines, render feature components only {#arch-p002}

- **Summary:** Pages must be 5-15 lines, render feature components only
- **Details:** [Critical spec](critical/ARCH-P002.md)

## High Priority Rules (H-level) {#high-priority}

### ARCH-H101 — Feature directories follow standard template {#arch-h101}

- **Pattern:** Feature directories follow standard template
- **See metadata:** `_meta/rules.json → ARCH-H101`

### ARCH-H102 — Route handlers stay under 120 lines {#arch-h102}

- **Pattern:** Route handlers stay under 120 lines
- **See metadata:** `_meta/rules.json → ARCH-H102`

## Medium Priority Rules (M-level) {#medium-priority}

### ARCH-M301 — Shared utilities belong in lib/ organized by domain {#arch-m301}

- **Pattern:** Shared utilities belong in lib/ organized by domain
- **See metadata:** `_meta/rules.json → ARCH-M301`

### ARCH-M302 — Multi-portal components (≥3 portals) move to features/shared {#arch-m302}

- **Pattern:** Multi-portal components (≥3 portals) move to features/shared
- **See metadata:** `_meta/rules.json → ARCH-M302`

## Low Priority Rules (L-level) {#low-priority}

### ARCH-L701 — Generate exports from index.tsx only {#arch-l701}

- **Pattern:** Generate exports from index.tsx only
- **See metadata:** `_meta/rules.json → ARCH-L701`

## Common Mistakes {#common-mistakes}

1. Missing `"server-only"` in `queries.ts` → [ARCH-P001](critical/ARCH-P001.md).
2. Placing logic in `app/**/page.tsx` → [ARCH-P002](critical/ARCH-P002.md).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#architecture) for compliant snippets.
- Run [_automation/detect-arch-violations.sh](../_automation/detect-arch-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [New Feature Workflow](../workflows/new-feature.md)
- [Task Guide](../04-TASK-GUIDE.md)

**Last Updated:** 2025-10-19
