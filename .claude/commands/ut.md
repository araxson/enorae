# ULTRATHINK - Comprehensive System Audit

**Role**: System Architect & Quality Assurance Lead
**Mission**: Complete end-to-end analysis and issue resolution

---

## ULTRATHINK Methodology

**U**nderstand architecture deeply
**L**ocate all issues systematically
**T**race dependencies and relationships
**R**eview against best practices
**A**nalyze performance implications
**T**est security vulnerabilities
**H**ighlight critical vs minor issues
**I**dentify quick wins vs long-term fixes
**N**ote breaking changes and risks
**K**eep solutions practical and actionable

---

## Execution Phases

### Phase 1: Security Audit (CRITICAL)
- [ ] Auth checks in all functions
- [ ] Ownership verification on mutations
- [ ] Input validation everywhere
- [ ] No credential exposure
- [ ] RLS enabled on all tables

### Phase 2: Architecture Compliance
- [ ] Pages are 5-15 lines
- [ ] Features properly organized
- [ ] DAL pattern correct (server-only, auth, views)
- [ ] Mutations pattern correct (use server, validation)
- [ ] Import order consistent

### Phase 3: Type Safety
- [ ] Zero 'any' types
- [ ] Views types only (no Tables)
- [ ] Explicit return types
- [ ] Proper React event types
- [ ] `pnpm typecheck` passes

### Phase 4: Database Performance
- [ ] RLS policies optimized (wrapped auth.uid())
- [ ] Foreign keys indexed
- [ ] Query performance acceptable
- [ ] No N+1 queries
- [ ] Advisor reports clean

### Phase 5: Frontend Quality
- [ ] Proper data joins (no UUIDs shown)
- [ ] Null safety everywhere
- [ ] Loading states implemented
- [ ] Error boundaries in place
- [ ] Component patterns followed

---

## Priority Classification

🔴 **CRITICAL**: Security, auth, data exposure
🟠 **HIGH**: Type errors, broken access control
🟡 **MEDIUM**: Architecture violations, missing metadata
🟢 **LOW**: Accessibility, performance optimizations

---

## Deliverables

Generate comprehensive report in `docs/ULTRATHINK_AUDIT_REPORT.md`:

```markdown
# ULTRATHINK Audit - [DATE]

## Executive Summary
- Critical: X issues
- High: X issues
- Medium: X issues
- Low: X issues

## Security Audit
[Findings + fixes]

## Architecture Compliance
[Findings + fixes]

## Type Safety
[Findings + fixes]

## Database Performance
[Findings + fixes]

## Frontend Quality
[Findings + fixes]

## Quick Wins (< 1 hour each)
1. [Issue + Fix + Impact]
2. ...

## Success Metrics
✅/❌ Zero TypeScript errors
✅/❌ Zero security vulnerabilities
✅/❌ All auth checks present
✅/❌ All pages ultra-thin
✅/❌ Database advisors clean
```

---

## Success Criteria

✅ Zero critical issues
✅ Zero type errors
✅ 100% auth coverage
✅ All advisor reports clean
✅ Comprehensive docs generated
