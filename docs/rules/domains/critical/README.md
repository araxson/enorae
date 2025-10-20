# Critical Rules (P-Level)

All security-critical and breaking change rules consolidated for rapid review.

## Overview

**Total Critical Rules**: 19
**Domains**: ARCH (2), DB (3), NEXT (3), REACT (2), SEC (3), TS (2), UI (4)

## Why These Are Critical

- 🔒 Security vulnerabilities
- 💥 Breaking changes
- 🚨 Data leaks
- ❌ System failures

**Violations must be fixed immediately.**

## All Critical Rules

### User Interface (4 rules)

- [UI-P001](../critical/UI-P001.md) - Render text via shadcn primitives or semantic tokens (no typography imports)
- [UI-P002](../critical/UI-P002.md) - shadcn/ui compositions must include required subcomponents
- [UI-P003](../critical/UI-P003.md) - ONLY use shadcn/ui components (no custom UI primitives)
- [UI-P004](../critical/UI-P004.md) - Remove `@/components/ui/typography` usage; rely on component slots

### Database (3 rules)

- [DB-P001](../critical/DB-P001.md) - Read from public views, write to schema tables
- [DB-P002](../critical/DB-P002.md) - Auth verification required in every function
- [DB-P003](../critical/DB-P003.md) - Multi-tenant RLS must enforce tenant scope

### Architecture (2 rules)

- [ARCH-P001](../critical/ARCH-P001.md) - Server-only directives required in queries.ts, 'use server' in mutations.ts
- [ARCH-P002](../critical/ARCH-P002.md) - Pages must be 5-15 lines, render feature components only

### Security (3 rules)

- [SEC-P001](../critical/SEC-P001.md) - Always call verifySession() or getUser() before data access
- [SEC-P002](../critical/SEC-P002.md) - Use role helpers (requireRole, requireAnyRole) before Supabase
- [SEC-P003](../critical/SEC-P003.md) - RLS policies must wrap auth.uid() in SELECT

### Next.js (3 rules)

- [NEXT-P001](../critical/NEXT-P001.md) - Scripts load from app/layout.tsx using next/script
- [NEXT-P002](../critical/NEXT-P002.md) - Import global styles only from app/layout.tsx
- [NEXT-P003](../critical/NEXT-P003.md) - Never use getInitialProps or Pages Router helpers

### React (2 rules)

- [REACT-P001](../critical/REACT-P001.md) - Server Components fetch data, Client Components add interactivity
- [REACT-P002](../critical/REACT-P002.md) - Avoid client-side data waterfalls (nested useEffect fetches)

### TypeScript (2 rules)

- [TS-P001](../critical/TS-P001.md) - No 'any', no '@ts-ignore', strict mode always
- [TS-P002](../critical/TS-P002.md) - Never use reserved words (eval, let) as identifiers

## Quick Access

- [Run all detections](../../_automation/detect-all.sh)
- [View full rules index](../../03-QUICK-SEARCH.md)
- [Back to domains](../)
