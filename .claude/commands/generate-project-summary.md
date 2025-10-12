# Generate Project Summary

GENERATE PROJECT-WIDE ANALYSIS SUMMARY

You are creating a comprehensive summary of all portal analyses for the Enorae salon booking platform.

## REQUIREMENTS

This command should be run AFTER all individual portal analyses are complete:
- docs/customer-portal/00_SUMMARY.md
- docs/business-portal/00_SUMMARY.md
- docs/staff-portal/00_SUMMARY.md
- docs/admin-portal/00_SUMMARY.md
- docs/marketing-portal/00_SUMMARY.md

## TASK

Read all portal summary files and create a project-wide summary.

Output: docs/00_PROJECT_SUMMARY.md

## TEMPLATE STRUCTURE:

```markdown
# Enorae Platform - Complete Analysis Summary

**Date**: [DATE]
**Portals Analyzed**: 5 (Customer, Business, Staff, Admin, Marketing)
**Total Files Analyzed**: [COUNT]
**Total Issues Found**: [COUNT]

---

## Executive Summary

[High-level overview of project health and major findings]

---

## Issues by Severity

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | X | X% |
| High | X | X% |
| Medium | X | X% |
| Low | X | X% |
| **Total** | **X** | **100%** |

---

## Issues by Portal

| Portal | Total | Critical | High | Medium | Low | Status |
|--------|-------|----------|------|--------|-----|--------|
| Customer | X | X | X | X | X | ⚠️/✅ |
| Business | X | X | X | X | X | ⚠️/✅ |
| Staff | X | X | X | X | X | ⚠️/✅ |
| Admin | X | X | X | X | X | ⚠️/✅ |
| Marketing | X | X | X | X | X | ⚠️/✅ |
| **Total** | **X** | **X** | **X** | **X** | **X** | |

---

## Issues by Layer

| Layer | Total | Critical | High | Medium | Low |
|-------|-------|----------|------|--------|-----|
| Pages | X | X | X | X | X |
| Queries | X | X | X | X | X |
| Mutations | X | X | X | X | X |
| Components | X | X | X | X | X |
| Types | X | X | X | X | X |
| Validation | X | X | X | X | X |
| Security | X | X | X | X | X |
| UX | X | X | X | X | X |
| **Total** | **X** | **X** | **X** | **X** | **X** |

---

## Top 10 Critical Issues (Cross-Portal)

### 1. [Issue Title]
**Portals Affected**: Customer, Business, Staff
**Files**: X files
**Description**: [Brief description]
**Impact**: [Security/Performance/Maintainability]
**Fix Priority**: Immediate

### 2. [Issue Title]
[Same structure]

... (up to 10)

---

## Common Patterns Found

### Pattern 1: [Description]
**Occurrences**: X files across X portals
**Rule Violated**: CLAUDE.md Rule X
**Impact**: [Description]
**Recommended Fix**: [Description]

### Pattern 2: [Description]
[Same structure]

---

## CLAUDE.md Rule Violations Summary

| Rule | Description | Violations | Severity |
|------|-------------|------------|----------|
| Rule 1 | Views vs Schema | X | Critical |
| Rule 2 | View Types not Table Types | X | High |
| Rule 3 | Page Size (5-15 lines) | X | Medium |
| Rule 4 | server-only + Auth Checks | X | Critical |
| Rule 8 | getUser() not getSession() | X | Critical |
| Rule 11 | No 'any' Types | X | High |
| ... | ... | ... | ... |

---

## Best Practices from Context7

### Next.js 15 Patterns
- [Finding 1]
- [Finding 2]

### React 19 Server Components
- [Finding 1]
- [Finding 2]

### TypeScript 5.6
- [Finding 1]
- [Finding 2]

### Supabase
- [Finding 1]
- [Finding 2]

---

## Supabase MCP Findings

### Security Advisors
- [Security issue 1]
- [Security issue 2]

### Performance Advisors
- [Performance issue 1]
- [Performance issue 2]

### RLS Policy Issues
- [RLS issue 1]
- [RLS issue 2]

---

## Recommended Fix Order

### Phase 1: Critical Security Issues (Week 1)
**Priority**: IMMEDIATE
**Estimated Time**: X hours

1. Fix all missing auth checks (X files)
2. Replace getSession() with getUser() (X files)
3. Fix RLS policy issues (X tables)
4. Add server-only directives (X files)

**Files**:
- [List of files]

---

### Phase 2: Critical Type Safety Issues (Week 2)
**Priority**: HIGH
**Estimated Time**: X hours

1. Replace Table types with View types (X files)
2. Remove all 'any' types (X occurrences)
3. Add return type annotations (X functions)

**Files**:
- [List of files]

---

### Phase 3: Architecture Compliance (Week 3)
**Priority**: MEDIUM
**Estimated Time**: X hours

1. Fix oversized page files (X files)
2. Move business logic from pages to features (X files)
3. Fix component structure issues (X files)

**Files**:
- [List of files]

---

### Phase 4: UX & Polish (Week 4)
**Priority**: LOW
**Estimated Time**: X hours

1. Add missing loading states (X components)
2. Add error boundaries (X areas)
3. Fix accessibility issues (X components)

**Files**:
- [List of files]

---

## Effort Estimation

| Phase | Critical | High | Medium | Low | Total Hours |
|-------|----------|------|--------|-----|-------------|
| Phase 1 | X | X | X | X | X hours |
| Phase 2 | X | X | X | X | X hours |
| Phase 3 | X | X | X | X | X hours |
| Phase 4 | X | X | X | X | X hours |
| **Total** | **X** | **X** | **X** | **X** | **X hours** |

**Total Estimated Time**: X hours (X weeks at 40 hours/week)

---

## Progress Tracking

### Overall Completion
- ✅ Analysis Complete: 5/5 portals (100%)
- 🔄 Fixes In Progress: 0/X issues (0%)
- ✅ Fixes Complete: 0/X issues (0%)

### By Portal
- Customer Portal: 0/X issues fixed (0%)
- Business Portal: 0/X issues fixed (0%)
- Staff Portal: 0/X issues fixed (0%)
- Admin Portal: 0/X issues fixed (0%)
- Marketing Portal: 0/X issues fixed (0%)

---

## Next Steps

1. Review this summary with the team
2. Prioritize critical issues
3. Assign issues to developers
4. Begin Phase 1 (Critical Security)
5. Track progress in individual portal task files

---

## Related Documentation

- Customer Portal: docs/customer-portal/00_SUMMARY.md
- Business Portal: docs/business-portal/00_SUMMARY.md
- Staff Portal: docs/staff-portal/00_SUMMARY.md
- Admin Portal: docs/admin-portal/00_SUMMARY.md
- Marketing Portal: docs/marketing-portal/00_SUMMARY.md

---

## Notes

[Any additional observations, recommendations, or context]
```

START WITH: Read all portal summary files and aggregate the data into the project summary.
