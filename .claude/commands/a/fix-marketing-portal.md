---
description: Fix issues found in Marketing Portal analysis systematically
---

# Fix Marketing Portal Issues
**Key Principle:** The database is the source of truth. All code must match the database, not the other way around.
You are fixing issues from the Marketing Portal deep analysis.

## Context

The Marketing Portal analysis created 9 files in `docs/marketing-portal/`:
- `00_SUMMARY.md` - Executive summary
- `01_PAGES_ANALYSIS.md` - Pages layer
- `02_QUERIES_ANALYSIS.md` - Queries layer
- `03_MUTATIONS_ANALYSIS.md` - Mutations layer
- `04_COMPONENTS_ANALYSIS.md` - Components layer
- `05_TYPES_ANALYSIS.md` - Type Safety layer
- `06_VALIDATION_ANALYSIS.md` - Validation layer
- `07_SECURITY_ANALYSIS.md` - Security layer
- `08_UX_ANALYSIS.md` - UX layer

## Your Task

Fix issues from the Marketing Portal analysis systematically and safely.

## 🤖 AUTONOMOUS EXECUTION MODE

**CRITICAL INSTRUCTIONS - READ FIRST:**

1. **NO QUESTIONS ALLOWED**: Do not ask the user ANY questions. Work autonomously.
2. **NO PROGRESS UPDATES**: Do not stop to tell the user what you plan to do next.
3. **PROCESS ALL LAYERS**: Always fix ALL layers (1-8) with ALL severity levels in a single run.
4. **MARKDOWN TODO LIST REQUIRED**:
   - Create a markdown file `docs/marketing-portal/fix-progress.md` at the start
   - Add all issues from all layers to this file
   - Mark each task with `- [ ]` when pending, `- [x]` when completed
   - Update the file after EACH issue is fully fixed
5. **COMPLETE FULLY**: Only mark a task as done when it is 100% complete and verified.
6. **NO INTERRUPTIONS**: Continue working until ALL issues across ALL layers are fixed.

### All Layers Override

- Process every layer (1-8) in a single run; treat severity as `all`.
- Skip Step 1 entirely—do not ask the user to choose scope or severity.
- When reporting results in Step 7, remove the "Next Steps" subsection.
- Continue fixing until all layers and severities are covered without pausing for additional instructions.

## STEP 1: Ask User for Scope

Ask the user:
```
Which Marketing Portal issues should I fix?

1. Layer (1-8 or "all"):
   - 1: Pages
   - 2: Queries
   - 3: Mutations
   - 4: Components
   - 5: Type Safety
   - 6: Validation
   - 7: Security
   - 8: UX

2. Severity (critical/high/medium/low/all):
```

## STEP 2: Read Analysis File(s)

Based on layer input, read:
- Layer 1: `docs/marketing-portal/01_PAGES_ANALYSIS.md`
- Layer 2: `docs/marketing-portal/02_QUERIES_ANALYSIS.md`
- Layer 3: `docs/marketing-portal/03_MUTATIONS_ANALYSIS.md`
- Layer 4: `docs/marketing-portal/04_COMPONENTS_ANALYSIS.md`
- Layer 5: `docs/marketing-portal/05_TYPES_ANALYSIS.md`
- Layer 6: `docs/marketing-portal/06_VALIDATION_ANALYSIS.md`
- Layer 7: `docs/marketing-portal/07_SECURITY_ANALYSIS.md`
- Layer 8: `docs/marketing-portal/08_UX_ANALYSIS.md`
- All: Read `00_SUMMARY.md` first, then relevant layer files

## STEP 3: Extract Issues

From the analysis file, extract all issues matching the severity filter. Each issue has:
- Issue number and title
- Severity level
- File path with line numbers
- Current code snippet
- Required fix code
- Steps to fix
- Acceptance criteria

## STEP 4: Create TODO Lists

Create TWO todo lists:

**A. Markdown File** (Primary tracking - REQUIRED):
Create `docs/marketing-portal/fix-progress.md`:
```markdown
# Marketing Portal Fix Progress

## Layer 1: Pages
- [ ] Issue #1: [Title] ([file:line])
- [ ] Issue #2: [Title] ([file:line])

## Layer 2: Queries
- [ ] Issue #3: [Title] ([file:line])
...

## Layer 8: UX
- [ ] Issue #N: [Title] ([file:line])

## Verification
- [ ] Run typecheck and verify (0 errors)
```

**B. TodoWrite Tool** (Secondary - for UI):
Also use TodoWrite to create a fix plan for the UI:
```
1. Fix Issue #1: [Title] ([file:line])
2. Fix Issue #2: [Title] ([file:line])
...
N. Run typecheck and verify
```

## STEP 5: Fix Issues One by One

For EACH issue:

1. **Read the target file** completely (required by Edit tool)
2. **Verify issue exists** (code may have changed since analysis)
3. **Apply the fix** using Edit tool
   - Use exact "Required Fix" from analysis
   - Follow "Steps to Fix" from analysis
   - Meet all "Acceptance Criteria"
4. **Mark TODO as completed** immediately
5. **Move to next issue**

**CRITICAL**:
- Fix ONE issue at a time
- Mark completed immediately after each fix
- Read file before editing
- NO batching or skipping
- NO changes beyond analysis scope

## STEP 6: Verify All Fixes

After fixing all issues:
```bash
npm run typecheck
```

If errors:
- Fix TypeScript errors
- Mark verification todo as completed

## STEP 7: Report Results

Provide summary:
```markdown
## Marketing Portal Fix Summary

**Layer**: [number/name]
**Severity**: [filter]

### Issues Fixed: X/X

1. ✅ Issue #1 - features/marketing/[...]:line - [description]
2. ✅ Issue #2 - features/marketing/[...]:line - [description]

### Skipped: X

1. ⏭️ Issue #X - [reason - e.g., already fixed, not reproducible]

### Verification

- [x] TypeScript: 0 errors
- [x] All acceptance criteria met

### Next Steps

[Recommend next layer or severity level to fix based on 00_SUMMARY.md priorities]
```

## Safety Checklist

Before each fix:
- [ ] Analysis file read
- [ ] Issue understood
- [ ] Target file read
- [ ] Issue confirmed to exist
- [ ] Fix approach clear
- [ ] Acceptance criteria known

After each fix:
- [ ] TODO marked completed
- [ ] Fix matches analysis requirement
- [ ] No unintended changes

After all fixes:
- [ ] TypeScript passes (0 errors)
- [ ] All acceptance criteria met
- [ ] Summary provided

## Important Notes

- **Portal**: Marketing only (features/marketing/, app/(marketing)/)
- **Always use TodoWrite** for progress tracking
- **One at a time** - never batch fixes
- **Read before edit** - required by tool
- **Verify criteria** for each fix
- **Run typecheck** after all fixes
- **Stay in scope** - only fix analyzed issues

---

**Remember**: Systematic, methodical, one issue at a time.
