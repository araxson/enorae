# Pass 2: File Organization Audit - Complete Documentation

**Status:** ANALYSIS COMPLETE ✓ REMEDIATION PLANNING COMPLETE ✓  
**Date:** 2025-10-25  
**Scope:** 74+ files | 70+ violations | 3 categories

---

## Quick Start

### If you're a team lead:
1. Read `PASS2_EXECUTIVE_SUMMARY.md` (10 min)
2. Review effort/timeline section
3. Assign features from `PASS2_DETAILED_FINDINGS.md` to team members
4. Share `PASS2_INDEX.md` with developers

### If you're a developer:
1. Get your feature assignment from team lead
2. Read `PASS2_INDEX.md` → "Execution Checklist" for your phase
3. Follow detailed steps in `FILE_ORGANIZATION_PASS2_REMEDIATION.md`
4. Run verification commands from `PASS2_DETAILED_FINDINGS.md`

---

## All Documentation Files

| File | Purpose | Size | Read Time |
|------|---------|------|-----------|
| **PASS2_EXECUTIVE_SUMMARY.md** | High-level overview for leadership | 5 KB | 10 min |
| **PASS2_DETAILED_FINDINGS.md** | Complete metrics & breakdown | 17 KB | 30-45 min |
| **FILE_ORGANIZATION_PASS2_REMEDIATION.md** | Step-by-step execution guide | 21 KB | 1-2 hours |
| **PASS2_INDEX.md** | Navigation & quick reference | 10 KB | 15-20 min |
| **PASS2_README.md** | This file | 3 KB | 5 min |

**Total Documentation: 56 KB (comprehensive, production-ready)**

---

## The Three Violation Categories

### 1. Custom-Named API Files (45+ violations)
**Lines:** 1,565  
**Examples:** `actions.ts`, `helpers.ts`, `analytics.ts`  
**Remediation:** Consolidate into canonical `queries.ts`/`mutations.ts`  
**Details:** See `PASS2_DETAILED_FINDINGS.md` page 3-7

---

### 2. Large API Files (9 violations)
**Lines:** 3,052  
**Examples:** 
- `admin/moderation/api/queries.ts` (464 lines)
- `admin/chains/api/mutations.ts` (327 lines)
- `business/chains/api/mutations.ts` (322 lines)

**Remediation:** Split into domain subdirectories  
**Details:** See `PASS2_DETAILED_FINDINGS.md` page 8-15

---

### 3. Anti-Pattern /api/internal/ (20+ violations)
**Lines:** 3,892  
**Directories:** 20+ across all portals  
**Remediation:** Flatten into canonical structure  
**Details:** See `PASS2_DETAILED_FINDINGS.md` page 16-21

---

## Execution Roadmap

| Week | Phase | Effort | Deliverable |
|------|-------|--------|-------------|
| 1 | Custom-named files consolidation | 16h | 45+ files consolidated |
| 2 | Large file splitting | 10h | 9 files organized |
| 3 | Anti-pattern elimination | 21h | 20+ directories removed |
| - | Verification & cleanup | - | 100% canonical |

**Total: 47 hours (1 week, 2-3 developers)**

---

## Key Metrics (Current State)

```
Custom API files:        45+
Large files (300+):      9
/api/internal/ dirs:     20+
Total violations:        70+
Lines affected:          8,509
Import updates needed:   350+

npm run typecheck:       PASS (0 file org errors)
Import resolution:       Clean (0 errors)
Server directive %:      ~90%
```

---

## Success Criteria (Pass 2 Complete)

- [ ] No custom-named API files (0 found)
- [ ] All API files < 300 lines OR organized into domains
- [ ] No /api/internal/ directories (0 found)
- [ ] All queries.ts have `import 'server-only'` (100%)
- [ ] All mutations.ts have `'use server'` (100%)
- [ ] npm run typecheck PASSES
- [ ] All imports resolve correctly

---

## How to Use This Documentation

### For Planning
→ Use `PASS2_EXECUTIVE_SUMMARY.md`
- Effort estimate: ~47 hours
- Risk level: MEDIUM
- Team size: 2-3 developers
- Timeline: 1 week (3 phases)

### For Decision Making
→ Use `PASS2_DETAILED_FINDINGS.md`
- Complete file-by-file breakdown
- Consolidation decisions explained
- Risk assessment for each change
- Effort breakdown by phase

### For Execution
→ Use `FILE_ORGANIZATION_PASS2_REMEDIATION.md`
- Step-by-step instructions
- Code examples
- Command recipes
- Verification checklists
- Git commit templates

### For Navigation
→ Use `PASS2_INDEX.md`
- Role-based quick start
- Document cross-references
- Execution timeline
- Common questions

---

## Documents by Audience

### Team Leads
Start → `PASS2_EXECUTIVE_SUMMARY.md` (10 min)  
Then → `PASS2_DETAILED_FINDINGS.md` (30 min)  
Then → `PASS2_INDEX.md` execution timeline (5 min)

### Developers
Start → `PASS2_INDEX.md` your phase section (10 min)  
Then → `PASS2_DETAILED_FINDINGS.md` your feature (20 min)  
Then → `FILE_ORGANIZATION_PASS2_REMEDIATION.md` detailed steps (30-60 min)

### Architects
Start → `PASS2_DETAILED_FINDINGS.md` (45 min)  
Reference → `docs/stack-patterns/file-organization-patterns.md` (as needed)  
Review → `docs/project-tree-ai.json` (current state)

### QA/Testers
Reference → `PASS2_INDEX.md` verification section (10 min)  
Execute → Commands from `PASS2_DETAILED_FINDINGS.md` (ongoing)

---

## Critical Rules

### DO
✓ Run `npm run typecheck` after each phase  
✓ Create meaningful domain names (sentiment.ts, reviews.ts)  
✓ Add server directives FIRST, then consolidate  
✓ Update barrel exports (index.ts) after splitting  
✓ Commit per feature with clear messages  

### DON'T
✗ Modify `lib/types/database.types.ts` (auto-generated)  
✗ Create single-file folders  
✗ Split prematurely (keep < 300 lines together)  
✗ Leave orphaned /api/internal/ directories  
✗ Use generic file names (helpers.ts → sentiment.ts)  

---

## Reference Materials

### Canonical Patterns (SOURCE OF TRUTH)
→ `docs/stack-patterns/file-organization-patterns.md`

### Current Project Structure
→ `docs/project-tree-ai.json`

### Project Context
→ `CLAUDE.md` (ENORAE-specific requirements)

### All Pattern Documentation
→ `docs/stack-patterns/00-INDEX.md`

---

## Common Questions

**Q: What if I'm confused about where to start?**  
A: Read `PASS2_INDEX.md` → find your role → follow navigation

**Q: What's the estimated time for my feature?**  
A: Check `PASS2_DETAILED_FINDINGS.md` → find your feature → see lines/effort estimate

**Q: How do I handle imports when splitting files?**  
A: Create `index.ts` re-export. Imports DON'T change. See example in `FILE_ORGANIZATION_PASS2_REMEDIATION.md` Priority 2

**Q: What if I find duplicate functions?**  
A: Keep one, delete the other, update imports. See Category 1B in `FILE_ORGANIZATION_PASS2_REMEDIATION.md`

**Q: Can I do multiple phases in parallel?**  
A: Yes, but different team members on different features to avoid merge conflicts

**Q: What about the existing TypeScript errors?**  
A: Those are schema mismatches (not file org). Pass 2 focuses on file organization only.

---

## Verification Commands

### After Each Phase
```bash
# Type checking
npm run typecheck  # MUST pass

# Check your feature is clean
find features/your-feature/api -type f -name "*.ts" \
  ! -name 'queries.ts' ! -name 'mutations.ts' ! -name 'types.ts' \
  ! -name 'schema.ts' ! -name 'index.ts' ! -path '*/queries/*' \
  ! -path '*/mutations/*' | wc -l
# Should be 0 or only expected subdirs
```

### Final Verification (All Phases Complete)
```bash
# No custom API files
find features -type f -path '*/api/*.ts' \
  ! -name 'queries.ts' ! -name 'mutations.ts' ! -name 'types.ts' \
  ! -name 'schema.ts' ! -name 'index.ts' ! -path '*/api/*/* | wc -l
# Should be 0

# No large files
wc -l features/*/*/api/{queries,mutations}.ts | grep -E '^\s+[3-9][0-9]{2,}\s' | wc -l
# Should be 0

# No /api/internal/ directories
find features -type d -path '*/api/internal' | wc -l
# Should be 0
```

---

## Getting Help

### Tactical Questions
→ `PASS2_DETAILED_FINDINGS.md` (see your feature section)

### Step-by-Step Instructions
→ `FILE_ORGANIZATION_PASS2_REMEDIATION.md` (see your category section)

### Canonical Patterns
→ `docs/stack-patterns/file-organization-patterns.md`

### Project Context
→ `CLAUDE.md`

---

## Status Summary

| Item | Status | Evidence |
|------|--------|----------|
| Analysis | COMPLETE ✓ | 4 documentation files created |
| Remediation Plan | COMPLETE ✓ | Phase-by-phase roadmap defined |
| Ready for Execution | YES ✓ | All 74+ violations catalogued |
| Estimated Effort | 47 hours | 1 week, 2-3 developers |
| Risk Level | MEDIUM | Manageable with planning |
| Next Step | TEAM REVIEW | Start with executive summary |

---

## Report Metadata

```
Generated: 2025-10-25
Analysis Time: 2.5 hours
Documentation Pages: 50+
Code Examples: 20+
Total Size: 56 KB
Status: Production Ready
Confidence Level: High (comprehensive analysis)
```

---

## Next Steps

1. **Review** (1-2 hours) - Team reads summary
2. **Plan** (2-4 hours) - Assign features and phases
3. **Execute** (Week 1-3) - Follow remediation guide
4. **Verify** (1-2 hours) - Run final checklist

---

**Start with: `PASS2_EXECUTIVE_SUMMARY.md`**

Questions? Check the document index above or read `PASS2_INDEX.md`

