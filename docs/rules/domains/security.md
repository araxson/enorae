---
domain: SEC
total_rules: 9
critical: 3
high: 3
medium: 2
low: 1
related_domains: [DB, ARCH]
automation_script: _automation/detect-sec-violations.sh
last_updated: "2025-10-19"
---

# Security Rules

> **Domain:** Security | **Rules:** 9 | **Critical:** 3

## Overview

Rules for authentication, authorization, and multi-tenant protections.

**Key Principles:**
1. Always derive the Supabase user before touching data (SEC-P001).
2. Use role helpers to gate privileged paths (SEC-P002).
3. Wrap `auth.uid()` in sub-selects inside policies (SEC-P003).

**📖 See also**: [Database](./database.md), [Architecture](./architecture.md)

## Quick Links

- [Critical Rules](#critical-rules)
- [High Priority](#high-priority)
- [Medium Priority](#medium-priority)
- [Low Priority](#low-priority)
- [Common Mistakes](#common-mistakes)
- [Quick Reference](#quick-reference)

---

## Critical Rules (P-level) {#critical-rules}

### SEC-P001 — Always call verifySession() or getUser() before data access {#sec-p001}

- **Summary:** Always call verifySession() or getUser() before data access
- **Details:** [Critical spec](critical/SEC-P001.md)

### SEC-P002 — Use role helpers (requireRole, requireAnyRole) before Supabase {#sec-p002}

- **Summary:** Use role helpers (requireRole, requireAnyRole) before Supabase
- **Details:** [Critical spec](critical/SEC-P002.md)

### SEC-P003 — RLS policies must wrap auth.uid() in SELECT {#sec-p003}

- **Summary:** RLS policies must wrap auth.uid() in SELECT
- **Details:** [Critical spec](critical/SEC-P003.md)

## High Priority Rules (H-level) {#high-priority}

### SEC-H101 — Enforce MFA on sensitive tables via restrictive policies {#sec-h101}

- **Pattern:** Enforce MFA on sensitive tables via restrictive policies
- **See metadata:** `_meta/rules.json → SEC-H101`

### SEC-H102 — Filter multi-tenant access by SSO provider/team {#sec-h102}

- **Pattern:** Filter multi-tenant access by SSO provider/team
- **See metadata:** `_meta/rules.json → SEC-H102`

### SEC-H103 — Middleware must use updateSession() helper {#sec-h103}

- **Pattern:** Middleware must use updateSession() helper
- **See metadata:** `_meta/rules.json → SEC-H103`

## Medium Priority Rules (M-level) {#medium-priority}

### SEC-M301 — Handle Supabase errors explicitly, map to 401/403 {#sec-m301}

- **Pattern:** Handle Supabase errors explicitly, map to 401/403
- **See metadata:** `_meta/rules.json → SEC-M301`

### SEC-M302 — Validate mutations with Zod before writes {#sec-m302}

- **Pattern:** Validate mutations with Zod before writes
- **See metadata:** `_meta/rules.json → SEC-M302`

## Low Priority Rules (L-level) {#low-priority}

### SEC-L701 — Prefer view-based audits over direct table scans {#sec-l701}

- **Pattern:** Prefer view-based audits over direct table scans
- **See metadata:** `_meta/rules.json → SEC-L701`

## Common Mistakes {#common-mistakes}

1. Trusting client claims instead of role helpers → [SEC-P002](critical/SEC-P002.md).
2. Using bare `auth.uid()` inside policies → [SEC-P003](critical/SEC-P003.md).

## Quick Reference {#quick-reference}

- Review [Code Examples](../reference/examples.md#security) for compliant snippets.
- Run [_automation/detect-sec-violations.sh](../_automation/detect-sec-violations.sh) before committing.
- Critical specs live under [`domains/critical/`](critical/).

## Exclusions

- See [reference/exclusions.md](../reference/exclusions.md) for files exempt from these rules.

**📖 Related Documentation:**
- [Security Notes](../reference/exclusions.md)
- [Database Rules](./database.md)

**Last Updated:** 2025-10-19
