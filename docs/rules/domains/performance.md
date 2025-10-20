---
domain: PERF
total_rules: 6
critical: 0
high: 2
medium: 2
low: 2
related_domains: [DB, NEXT]
automation_script: _automation/detect-perf-violations.sh
last_updated: "2025-10-19"
---

# Performance Rules

> **Domain:** Performance | **Rules:** 6 | **Critical:** 0

## Overview

Rules for runtime performance, caching strategies, and query optimization.

**Key Principles:**
1. Batch database queries and revalidate caches after mutations (PERF-H102).
2. Monitor and prune unused indexes (PERF-M301).
3. Stream heavy assets at build time (PERF-L701).

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

- None.

## High Priority Rules (H-level) {#high-priority}

### PERF-H101 — Add covering indexes for foreign keys {#perf-h101}

- **Pattern:** Add covering indexes for foreign keys
- **See metadata:** `_meta/rules.json → PERF-H101`

### PERF-H102 — Remove duplicate indexes {#perf-h102}

- **Pattern:** Remove duplicate indexes
- **See metadata:** `_meta/rules.json → PERF-H102`

## Medium Priority Rules (M-level) {#medium-priority}

### PERF-M301 — Remove unused indexes {#perf-m301}

- **Pattern:** Remove unused indexes
- **See metadata:** `_meta/rules.json → PERF-M301`

### PERF-M302 — Batch independent queries with Promise.all {#perf-m302}

- **Pattern:** Batch independent queries with Promise.all
- **See metadata:** `_meta/rules.json → PERF-M302`

## Low Priority Rules (L-level) {#low-priority}

### PERF-L701 — Stream large assets at build time {#perf-l701}

- **Pattern:** Stream large assets at build time
- **See metadata:** `_meta/rules.json → PERF-L701`

### PERF-L702 — Use revalidatePath after mutations to prewarm caches {#perf-l702}

- **Pattern:** Use revalidatePath after mutations to prewarm caches
- **See metadata:** `_meta/rules.json → PERF-L702`

## Common Mistakes {#common-mistakes}

1. Leaving duplicate indexes → [PERF-H101](../03-QUICK-SEARCH.md#perf-h101).
2. Forgetting to revalidate after mutations → [PERF-L702](../03-QUICK-SEARCH.md#perf-l702).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#performance) for compliant snippets.
- Run [_automation/detect-perf-violations.sh](../_automation/detect-perf-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [Performance Checklist](../workflows/debugging-checklist.md)
- [Automation Script](../_automation/detect-perf-violations.sh)

**Last Updated:** 2025-10-19
