---
domain: REACT
total_rules: 7
critical: 2
high: 2
medium: 2
low: 1
related_domains: [NEXT, UI]
automation_script: _automation/detect-react-violations.sh
last_updated: "2025-10-19"
---

# React Rules

> **Domain:** React | **Rules:** 7 | **Critical:** 2

## Overview

Rules for React 19 Server/Client boundaries and async patterns.

**Key Principles:**
1. Server Components fetch data directly and hand off to clients (REACT-P001).
2. Hoist data requirements to avoid client-side waterfalls (REACT-P002).
3. Prefer React 19 async patterns and context shorthand (REACT-H101).

**📖 See also**: [Next.js](./nextjs.md), [User Interface](./ui.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

### REACT-P001 — Server Components fetch data, Client Components add interactivity {#react-p001}

- **Summary:** Server Components fetch data, Client Components add interactivity
- **Details:** [Critical spec](critical/REACT-P001.md)

### REACT-P002 — Avoid client-side data waterfalls (nested useEffect fetches) {#react-p002}

- **Summary:** Avoid client-side data waterfalls (nested useEffect fetches)
- **Details:** [Critical spec](critical/REACT-P002.md)

## High Priority Rules (H-level) {#high-priority}

### REACT-H101 — Place metadata tags directly in components {#react-h101}

- **Pattern:** Place metadata tags directly in components
- **See metadata:** `_meta/rules.json → REACT-H101`

### REACT-H102 — Use use() hook for server-started promises {#react-h102}

- **Pattern:** Use use() hook for server-started promises
- **See metadata:** `_meta/rules.json → REACT-H102`

## Medium Priority Rules (M-level) {#medium-priority}

### REACT-M301 — Use React 19 context shorthand {#react-m301}

- **Pattern:** Use React 19 context shorthand
- **See metadata:** `_meta/rules.json → REACT-M301`

### REACT-M302 — Define hook helpers inline {#react-m302}

- **Pattern:** Define hook helpers inline
- **See metadata:** `_meta/rules.json → REACT-M302`

## Low Priority Rules (L-level) {#low-priority}

### REACT-L701 — Server Components import heavy libraries server-side only {#react-l701}

- **Pattern:** Server Components import heavy libraries server-side only
- **See metadata:** `_meta/rules.json → REACT-L701`

## Common Mistakes {#common-mistakes}

1. Fetching data from client components → [REACT-P001](critical/REACT-P001.md).
2. Creating client waterfalls with nested effects → [REACT-P002](critical/REACT-P002.md).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#react) for compliant snippets.
- Run [_automation/detect-react-violations.sh](../_automation/detect-react-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [React Patterns](../04-TASK-GUIDE.md#react)
- [UI Rules](./ui.md)

**Last Updated:** 2025-10-19
