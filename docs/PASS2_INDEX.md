# Pass 2: File Organization Audit - Complete Documentation Index

**Pass Status:** Analysis Complete ✓ Remediation Planning Complete ✓ Ready for Execution ✓  
**Report Date:** 2025-10-25  
**Scope:** 74+ files across 3 violation categories  

---

## Quick Navigation

### For Team Leads
- **START HERE:** `PASS2_EXECUTIVE_SUMMARY.md` - High-level findings, effort estimate, success criteria
- **THEN READ:** `PASS2_DETAILED_FINDINGS.md` - Complete metrics, file-by-file breakdown, risk assessment

### For Individual Contributors
- **STEP 1:** Read relevant section of `PASS2_EXECUTIVE_SUMMARY.md`
- **STEP 2:** Get assigned feature/phase
- **STEP 3:** Follow step-by-step instructions in `FILE_ORGANIZATION_PASS2_REMEDIATION.md`
- **STEP 4:** Run verification checklist in remediation guide

### For Architecture Review
- **REFERENCE:** `docs/stack-patterns/file-organization-patterns.md` - Canonical patterns
- **CONTEXT:** `docs/project-tree-ai.json` - Current project structure
- **STANDARDS:** `CLAUDE.md` - Project-specific requirements

---

## Document Guide

### 1. PASS2_EXECUTIVE_SUMMARY.md
**Length:** 3 pages | **Read Time:** 10 minutes  
**Audience:** Team leads, architecture team, project managers

**Contains:**
- Key findings summary (3 violation categories)
- Impact assessment for each category
- Effort estimate & timeline
- Success criteria checklist
- Critical do's and don'ts
- Next steps workflow

**Use This When:**
- Planning team assignments
- Reporting status to stakeholders
- Determining resource allocation
- Creating timeline estimates

---

### 2. PASS2_DETAILED_FINDINGS.md
**Length:** 10+ pages | **Read Time:** 30-45 minutes  
**Audience:** Developers, technical leads, architects

**Contains:**
- Baseline metrics (current state)
- 45+ custom-named files with line counts and contents
- 9 large files with function breakdown
- 20+ /api/internal/ directories with consolidation decisions
- Server directive coverage analysis
- Risk assessment for each change
- Detailed effort breakdown

**Use This When:**
- Understanding scope of individual changes
- Planning parallel work streams
- Assessing risk of specific consolidations
- Documenting decisions

---

### 3. FILE_ORGANIZATION_PASS2_REMEDIATION.md
**Length:** 20+ pages | **Read Time:** 1-2 hours**  
**Audience:** Individual contributors executing the work

**Contains:**
- Phase-by-phase execution roadmap
- Detailed step-by-step instructions for each category
- Code examples for each remediation pattern
- Command-line recipes for finding imports
- Barrel export patterns
- Verification checklist for each phase
- Git commit message templates

**Use This When:**
- You're assigned a specific feature to consolidate
- You need detailed step-by-step instructions
- You're consolidating a custom API file
- You're splitting a large API file
- You're flattening an /api/internal/ directory

---

### 4. PASS2_INDEX.md (This File)
**Purpose:** Navigation guide and document cross-reference

---

## The Three Violation Categories

### Category 1: Custom-Named API Files (45+ files)
**Problem:** Files like `actions.ts`, `helpers.ts` exist in `/api/` alongside canonical `queries.ts`  
**Solution:** Consolidate into canonical locations  
**Effort:** 2-3 days  
**Details:** See `PASS2_EXECUTIVE_SUMMARY.md` page 2-3 + `FILE_ORGANIZATION_PASS2_REMEDIATION.md` Section "Priority 1"

---

### Category 2: Large API Files (9 files over 300 lines)
**Problem:** Files exceed recommended 300-line threshold  
**Solution:** Split into domain subdirectories with index.ts re-exports  
**Effort:** 2-3 days  
**Details:** See `PASS2_DETAILED_FINDINGS.md` page 4-8 + `FILE_ORGANIZATION_PASS2_REMEDIATION.md` Section "Priority 2"

---

### Category 3: Anti-Pattern /api/internal/ (20+ directories)
**Problem:** Implementation segregated into `/internal/` subdirectories  
**Solution:** Consolidate (< 300 lines) or reorganize into domain structure (300+ lines)  
**Effort:** 2-3 days  
**Details:** See `PASS2_EXECUTIVE_SUMMARY.md` page 3 + `FILE_ORGANIZATION_PASS2_REMEDIATION.md` Section "Priority 3"

---

## Execution Timeline

### Week 1: Custom-Named Files
**Mon-Tue:** Consolidate query helpers (alerts.ts, metrics.ts → queries.ts)  
**Wed:** Consolidate mutation/action files (actions.ts → mutations.ts)  
**Thu:** Move utilities to lib/  
**Fri:** Verify all imports, run typecheck  
**Result:** 45+ files consolidated ✓

### Week 2: Large File Splitting
**Mon:** Split admin/moderation/api/queries.ts (464 lines → 3 files)  
**Tue:** Split admin/chains/api/mutations.ts (327 lines)  
**Wed:** Split business/chains/api/mutations.ts (322 lines)  
**Thu:** Split remaining 6 files  
**Fri:** Verify all imports, run typecheck  
**Result:** 9 files reorganized ✓

### Week 3: Anti-Pattern Elimination
**Mon-Tue:** Consolidate small /api/internal/ (< 300 lines)  
**Wed-Thu:** Create domain subdirectories (300-500 lines)  
**Fri:** Final verification and cleanup  
**Result:** 20+ directories eliminated ✓

---

## Key Files Reference

| File | Purpose | Size |
|------|---------|------|
| `docs/stack-patterns/file-organization-patterns.md` | Canonical patterns (SOURCE OF TRUTH) | 700 lines |
| `docs/project-tree-ai.json` | Current project structure | 2MB |
| `docs/PASS2_EXECUTIVE_SUMMARY.md` | Leadership summary | 3 pages |
| `docs/PASS2_DETAILED_FINDINGS.md` | Complete metrics & breakdown | 10+ pages |
| `docs/FILE_ORGANIZATION_PASS2_REMEDIATION.md` | Step-by-step execution guide | 20+ pages |
| `CLAUDE.md` | Project-specific requirements | 5 pages |

---

## Before You Start

### Prerequisites
✓ Read `PASS2_EXECUTIVE_SUMMARY.md` (10 min)  
✓ Review assignment from team lead  
✓ Read relevant section of `PASS2_DETAILED_FINDINGS.md` (15 min)  
✓ Clone latest main branch  

### Environment Checks
```bash
# Verify you're on main
git branch | grep "^\* main"

# Verify typecheck passes (current baseline)
npm run typecheck

# Verify your feature branch is clean
git status
```

---

## Execution Checklist (Per Feature)

### Phase 1: Custom-Named Files
- [ ] Read "Priority 1" section in remediation guide
- [ ] Identify all custom files for your feature
- [ ] Find all imports using grep command provided
- [ ] Merge content into canonical file
- [ ] Delete old files
- [ ] Update imports
- [ ] Run typecheck
- [ ] Commit with message: "refactor: consolidate {feature} api files"

### Phase 2: Large File Splitting
- [ ] Read "Priority 2" section in remediation guide
- [ ] Create domain subdirectories (queries/, mutations/)
- [ ] Move functions to domain files
- [ ] Create index.ts re-exports
- [ ] Delete original large file
- [ ] Verify imports still work (thanks to index.ts)
- [ ] Run typecheck
- [ ] Commit with message: "refactor: split {feature} api/{queries,mutations}.ts into domains"

### Phase 3: Anti-Pattern Elimination
- [ ] Read "Priority 3" section in remediation guide
- [ ] Check total lines in /api/internal/
- [ ] If < 300 lines: consolidate to main file
- [ ] If 300-500 lines: create domain subdirectories
- [ ] Delete /api/internal/ directory
- [ ] Update all imports
- [ ] Run typecheck
- [ ] Commit with message: "refactor: flatten {feature} api/internal directory"

---

## Success Verification

### After Each Phase
```bash
npm run typecheck  # MUST pass

# Check for orphaned files
find features/your-feature/api -type f -name "*.ts" \
  ! -name "queries.ts" ! -name "mutations.ts" ! -name "types.ts" \
  ! -name "schema.ts" ! -name "index.ts" ! -path "*/queries/*" \
  ! -path "*/mutations/*" | wc -l
# Should be 0 or only expected subdirs

# Check for internal directories
find features/your-feature/api -type d -name "internal"
# Should be 0
```

### Final Verification (Pass 2 Complete)
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

# All queries have 'server-only'
rg "import 'server-only'" features/**/api/queries.ts | wc -l
# Should equal number of queries.ts files

# All mutations have 'use server'
rg "'use server'" features/**/api/mutations.ts | wc -l
# Should equal number of mutations.ts files

# Typecheck passes
npm run typecheck
# MUST PASS
```

---

## Common Questions

**Q: What if I find duplicate functions in two files?**  
A: Consolidate into one, delete the other, update imports. See Category 1B example.

**Q: Do imports change after splitting with index.ts?**  
A: No! That's the beauty of index.ts re-exports. All imports stay the same.

**Q: Can I do multiple phases in parallel?**  
A: Yes, but different team members on different features to avoid merge conflicts.

**Q: What if a file is exactly 300 lines?**  
A: Split it. The threshold is "under 300", so 300+ requires splitting.

**Q: What about /api/internal/queries/ subdirectories?**  
A: Those should become `api/queries/{domain}/` pattern (no /internal/ part).

---

## Getting Help

**For tactical questions about a specific file:**  
→ See detailed breakdown in `PASS2_DETAILED_FINDINGS.md`

**For step-by-step instructions:**  
→ See remediation pattern in `FILE_ORGANIZATION_PASS2_REMEDIATION.md`

**For canonical patterns:**  
→ Reference `docs/stack-patterns/file-organization-patterns.md`

**For project context:**  
→ Check `CLAUDE.md` for ENORAE-specific requirements

---

## Related Documents

- **Pass 1 Report:** See git history for previous file organization fixes
- **Stack Patterns:** `docs/stack-patterns/00-INDEX.md` - All pattern documentation
- **Database Schema:** `docs/stack-patterns/supabase-patterns.md` - Data patterns
- **UI Patterns:** `docs/stack-patterns/ui-patterns.md` - Component organization

---

## Report Metadata

```
Generated: 2025-10-25
Scope: 74+ files, 3 violation categories, 70+ violations
Analysis Time: 2.5 hours
Estimated Execution Time: 47 hours (1 week, 2-3 developers)
Status: Ready for team execution
Next Milestone: Phase 1 completion
```

---

**Questions? Refer to the full remediation guide or contact your tech lead.**

