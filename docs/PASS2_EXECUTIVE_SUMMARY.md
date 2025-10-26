# Pass 2: File Organization Audit - Executive Summary

**Status:** Analysis Complete (Ready for Team Execution)  
**Date:** 2025-10-25  
**Scope:** Custom API files, Large file splitting, Anti-pattern elimination  

---

## Key Findings

### 1. Custom-Named API Files: 45+ Violations

**Problem:** Files like `actions.ts`, `helpers.ts`, `analytics.ts` exist in `/api/` alongside canonical `queries.ts`/`mutations.ts`, creating unpredictable import patterns.

**Examples:**
- `features/business/appointments/api/actions.ts` (82 lines)
- `features/admin/appointments/api/alerts.ts` (58 lines)
- `features/admin/messages/api/messages-dashboard.ts` (96 lines)
- `features/business/insights/api/churn-prediction.ts` (68 lines)

**Impact:** Developers don't know where to import from, leading to scattered, hard-to-maintain code.

---

### 2. Large API Files: 9 Files Over 300 Lines

Per canonical patterns, files should be split into domain subdirectories when exceeding 300 lines.

| Feature | File | Lines | Status |
|---------|------|-------|--------|
| Admin Moderation | `api/queries.ts` | 464 | CRITICAL - Sentiment + reviews + messages mixed |
| Admin Chains | `api/mutations.ts` | 327 | High - Lifecycle + verification + subscription |
| Business Chains | `api/mutations.ts` | 322 | High - CRUD + settings + verification |
| Business Notifications | `api/queries.ts` | 321 | High - Notifications + preferences + templates |
| Staff Clients | `api/queries.ts` | 329 | High - Clients + history + analytics |
| Staff Clients | `api/mutations.ts` | 332 | High - Operations + status updates |
| Staff Time-Off | `api/mutations.ts` | 330 | High - Requests + approvals + updates |
| Admin Salons | `api/queries.ts` | 320 | High - Queries + health + compliance |
| Staff Analytics | `api/queries.ts` | 307 | Medium - Analytics operations |

**Impact:** Hard to navigate, difficult to debug, testing is complex, merge conflicts likely.

---

### 3. Anti-Pattern /api/internal/: 20+ Directories

**Problem:** Implementation details segregated in `/api/internal/` instead of being organized by domain within main queries/mutations files.

**Current Structure (Wrong):**
```
api/
├── internal/
│   ├── helpers.ts
│   ├── constants.ts
│   └── functions.ts
├── queries.ts
└── mutations.ts
```

**Canonical Structure (Correct):**
```
api/
├── queries/
│   ├── index.ts
│   ├── domain1.ts
│   └── domain2.ts
└── mutations/
    ├── index.ts
    ├── domain1.ts
    └── domain2.ts
```

**Affected Features:** 20+ (all portals)

---

## What Needs to Happen

### Phase 1: Consolidate Custom-Named Files
- Merge `actions.ts` → `mutations.ts`
- Merge `alerts.ts`, `metrics.ts` → `queries.ts`
- Move `helpers.ts` → `lib/` or consolidate
- **Impact:** 45+ file operations, 100+ import updates

### Phase 2: Split Large Files (300+)
- Convert single files into `queries/{domain}/` structure
- Create `index.ts` re-exports for clean imports
- **Impact:** 9 files reorganized, imports remain unchanged (thanks to index.ts)

### Phase 3: Flatten /api/internal/
- Move internal files to main `queries.ts`/`mutations.ts` (if < 300 lines)
- Create domain subdirectories (if 300-500 lines)
- **Impact:** 20+ directory removals

---

## Success Criteria

**Pass 2 Complete When:**

1. ✅ No custom-named API files (no more `actions.ts`, `helpers.ts`, etc. in `/api/`)
2. ✅ All API files < 300 lines OR organized into domain subdirectories
3. ✅ No `/api/internal/` directories anywhere
4. ✅ All `queries.ts` have `import 'server-only'`
5. ✅ All `mutations.ts` have `'use server'`
6. ✅ `npm run typecheck` passes
7. ✅ All import paths resolve correctly

---

## Effort Estimate

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1 (Custom files) | 2-3 days | High (45+ files, 100+ imports) |
| Phase 2 (Large file split) | 2-3 days | Medium (9 files, clean structure) |
| Phase 3 (Anti-pattern removal) | 2-3 days | High (20+ directories, consolidation) |
| Verification & Cleanup | 1 day | Medium |
| **Total** | **7-10 days** | **High** |

---

## Critical Rules

✅ **DO:**
- Run `npm run typecheck` after each phase
- Create meaningful domain names (`sentiment.ts`, `reviews.ts`, not `helper1.ts`)
- Add server directives FIRST (`'use server'` or `import 'server-only'`)
- Update barrel exports (`index.ts`) after restructuring

❌ **DON'T:**
- Modify `lib/types/database.types.ts` - it's auto-generated
- Create single-file folders (e.g., `api/queries/appointment/index.ts` with only one file)
- Split files prematurely (keep single files if under 300 lines)
- Leave orphaned /api/internal/ directories

---

## Next Steps

1. **Review:** Team reads this summary + full remediation report
2. **Plan:** Assign team members to phases (parallel possible)
3. **Execute:** Follow detailed steps in `FILE_ORGANIZATION_PASS2_REMEDIATION.md`
4. **Verify:** Run checklist after each phase
5. **Commit:** Small commits per feature (e.g., "refactor: consolidate business/appointments api files")

---

## Reference Files

- **Full Remediation Plan:** `docs/FILE_ORGANIZATION_PASS2_REMEDIATION.md`
- **Canonical Patterns:** `docs/stack-patterns/file-organization-patterns.md`
- **Current Project State:** `docs/project-tree-ai.json`

---

**Questions?** Refer to `file-organization-patterns.md` or contact architecture team.

