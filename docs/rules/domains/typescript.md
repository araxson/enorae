---
domain: TS
total_rules: 7
critical: 2
high: 2
medium: 2
low: 1
related_domains: [DB, SEC]
automation_script: _automation/detect-ts-violations.sh
last_updated: "2025-10-19"
---

# TypeScript Rules

> **Domain:** TypeScript | **Rules:** 7 | **Critical:** 2

## Overview

Rules for TypeScript 5.9 strict typing, Supabase types, and safety.

**Key Principles:**
1. Keep strict mode active—no `any`, no `@ts-ignore` (TS-P001).
2. Leverage generated Supabase types for reads and writes (TS-M302).
3. Prefer Zod and `unknown` for runtime validation (TS-L701).

**📖 See also**: [Database](./database.md), [Security](./security.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

### TS-P001 — No 'any', no '@ts-ignore', strict mode always {#ts-p001}

- **Summary:** No 'any', no '@ts-ignore', strict mode always
- **Details:** [Critical spec](critical/TS-P001.md)

### TS-P002 — Never use reserved words (eval, let) as identifiers {#ts-p002}

- **Summary:** Never use reserved words (eval, let) as identifiers
- **Details:** [Critical spec](critical/TS-P002.md)

## High Priority Rules (H-level) {#high-priority}

### TS-H101 — Avoid binding patterns in 'using' declarations {#ts-h101}

- **Pattern:** Avoid binding patterns in 'using' declarations
- **See metadata:** `_meta/rules.json → TS-H101`

### TS-H102 — No object/array destructuring in strict mode functions {#ts-h102}

- **Pattern:** No object/array destructuring in strict mode functions
- **See metadata:** `_meta/rules.json → TS-H102`

## Medium Priority Rules (M-level) {#medium-priority}

### TS-M301 — Avoid numeric literals with leading zeros {#ts-m301}

- **Pattern:** Avoid numeric literals with leading zeros
- **See metadata:** `_meta/rules.json → TS-M301`

### TS-M302 — Use generated Supabase types for reads/writes {#ts-m302}

- **Pattern:** Use generated Supabase types for reads/writes
- **See metadata:** `_meta/rules.json → TS-M302`

## Low Priority Rules (L-level) {#low-priority}

### TS-L701 — Use unknown + Zod over 'any' {#ts-l701}

- **Pattern:** Use unknown + Zod over 'any'
- **See metadata:** `_meta/rules.json → TS-L701`

## Common Mistakes {#common-mistakes}

1. Falling back to `any` or `@ts-ignore` → [TS-P001](critical/TS-P001.md).
2. Re-declaring reserved identifiers → [TS-P002](critical/TS-P002.md).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#typescript) for compliant snippets.
- Run [_automation/detect-ts-violations.sh](../_automation/detect-ts-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [Type Generation](../reference/stack-versions.md)
- [Database Rules](./database.md)

**Last Updated:** 2025-10-19
