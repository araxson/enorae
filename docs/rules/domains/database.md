---
domain: DB
total_rules: 9
critical: 3
high: 3
medium: 2
low: 1
related_domains: [SEC, TS, ARCH]
automation_script: _automation/detect-db-violations.sh
last_updated: "2025-10-19"
---

# Database Rules

> **Domain:** Database | **Rules:** 9 | **Critical:** 3

## Overview

Rules for Supabase queries, views, migrations, and RLS enforcement.

**Key Principles:**
1. Reads query public views; writes target schema tables (DB-P001).
2. Every data access verifies the authenticated user (DB-P002).
3. RLS policies enforce tenant-scoped filters (DB-P003).

**📖 See also**: [Security](./security.md), [TypeScript](./typescript.md), [Architecture](./architecture.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

### DB-P001 — Read from public views, write to schema tables {#db-p001}

- **Summary:** Read from public views, write to schema tables
- **Details:** [Critical spec](critical/DB-P001.md)

### DB-P002 — Auth verification required in every function {#db-p002}

- **Summary:** Auth verification required in every function
- **Details:** [Critical spec](critical/DB-P002.md)

### DB-P003 — Multi-tenant RLS must enforce tenant scope {#db-p003}

- **Summary:** Multi-tenant RLS must enforce tenant scope
- **Details:** [Critical spec](critical/DB-P003.md)

## High Priority Rules (H-level) {#high-priority}

### DB-H101 — Policy checks use auth.jwt() and wrap auth.uid() in select {#db-h101}

- **Pattern:** Policy checks use auth.jwt() and wrap auth.uid() in select
- **See metadata:** `_meta/rules.json → DB-H101`

### DB-H102 — Enforce MFA (aal2) on sensitive tables {#db-h102}

- **Pattern:** Enforce MFA (aal2) on sensitive tables
- **See metadata:** `_meta/rules.json → DB-H102`

### DB-H103 — Call revalidatePath after mutations {#db-h103}

- **Pattern:** Call revalidatePath after mutations
- **See metadata:** `_meta/rules.json → DB-H103`

## Medium Priority Rules (M-level) {#medium-priority}

### DB-M301 — Use .returns<Type>() or .maybeSingle<Type>() {#db-m301}

- **Pattern:** Use .returns<Type>() or .maybeSingle<Type>()
- **See metadata:** `_meta/rules.json → DB-M301`

### DB-M302 — Validate payloads with Zod before mutations {#db-m302}

- **Pattern:** Validate payloads with Zod before mutations
- **See metadata:** `_meta/rules.json → DB-M302`

## Low Priority Rules (L-level) {#low-priority}

### DB-L701 — Prefer select/filter over RPC for simple queries {#db-l701}

- **Pattern:** Prefer select/filter over RPC for simple queries
- **See metadata:** `_meta/rules.json → DB-L701`

## Common Mistakes {#common-mistakes}

1. Calling `.select()` on schema tables → [DB-P001](critical/DB-P001.md).
2. Skipping Supabase auth verification → [DB-P002](critical/DB-P002.md).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#database) for compliant snippets.
- Run [_automation/detect-db-violations.sh](../_automation/detect-db-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [Database Workflow](../workflows/database-changes.md)
- [Stack Versions](../reference/stack-versions.md)

**Last Updated:** 2025-10-19
