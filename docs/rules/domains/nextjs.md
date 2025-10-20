---
domain: NEXT
total_rules: 8
critical: 3
high: 2
medium: 2
low: 1
related_domains: [REACT, ARCH]
automation_script: _automation/detect-next-violations.sh
last_updated: "2025-10-19"
---

# Next.js Rules

> **Domain:** Next.js | **Rules:** 8 | **Critical:** 3

## Overview

Rules for Next.js 15 App Router layouts, metadata, and routing.

**Key Principles:**
1. Load third-party scripts via `app/layout.tsx` using `<Script />` (NEXT-P001).
2. Keep global CSS imports inside `app/layout.tsx` (NEXT-P002).
3. Use App Router features exclusively—no legacy Pages Router helpers (NEXT-P003).

**📖 See also**: [React](./react.md), [Architecture](./architecture.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

### NEXT-P001 — Scripts load from app/layout.tsx using next/script {#next-p001}

- **Summary:** Scripts load from app/layout.tsx using next/script
- **Details:** [Critical spec](critical/NEXT-P001.md)

### NEXT-P002 — Import global styles only from app/layout.tsx {#next-p002}

- **Summary:** Import global styles only from app/layout.tsx
- **Details:** [Critical spec](critical/NEXT-P002.md)

### NEXT-P003 — Never use getInitialProps or Pages Router helpers {#next-p003}

- **Summary:** Never use getInitialProps or Pages Router helpers
- **Details:** [Critical spec](critical/NEXT-P003.md)

## High Priority Rules (H-level) {#high-priority}

### NEXT-H101 — Wrap Web Vitals in dedicated 'use client' component {#next-h101}

- **Pattern:** Wrap Web Vitals in dedicated 'use client' component
- **See metadata:** `_meta/rules.json → NEXT-H101`

### NEXT-H102 — Use GoogleTagManager from @next/third-parties {#next-h102}

- **Pattern:** Use GoogleTagManager from @next/third-parties
- **See metadata:** `_meta/rules.json → NEXT-H102`

## Medium Priority Rules (M-level) {#medium-priority}

### NEXT-M301 — Keep pages ultra-thin (5-15 lines) {#next-m301}

- **Pattern:** Keep pages ultra-thin (5-15 lines)
- **See metadata:** `_meta/rules.json → NEXT-M301`

### NEXT-M302 — Use container queries for responsive layouts {#next-m302}

- **Pattern:** Use container queries for responsive layouts
- **See metadata:** `_meta/rules.json → NEXT-M302`

## Low Priority Rules (L-level) {#low-priority}

### NEXT-L701 — Use Promise.all for independent fetches {#next-l701}

- **Pattern:** Use Promise.all for independent fetches
- **See metadata:** `_meta/rules.json → NEXT-L701`

## Common Mistakes {#common-mistakes}

1. Adding scripts inside individual pages → [NEXT-P001](critical/NEXT-P001.md).
2. Importing global CSS outside `app/layout.tsx` → [NEXT-P002](critical/NEXT-P002.md).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#next.js) for compliant snippets.
- Run [_automation/detect-next-violations.sh](../_automation/detect-next-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [Next.js Task Guide](../04-TASK-GUIDE.md#nextjs)
- [Performance Rules](./performance.md)

**Last Updated:** 2025-10-19
