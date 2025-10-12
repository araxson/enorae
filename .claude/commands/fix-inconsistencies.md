# Fix Project Inconsistencies

Execute this systematic workflow to fix codebase inconsistencies:

## Phase 1: Generate Report
1. Run: `python3 scripts/generate-project-tree.py`
2. Read: `docs/project-inconsistencies.md`

## Phase 2: Fix by Priority
Work through issues in priority order:

### 🔴 CRITICAL (Do First)
- Add missing `import 'server-only'` to queries.ts files
- Add missing `'use server'` to mutations.ts files
- Replace all `any` types with proper Database types
- Split files >350 lines into smaller modules

### 🟠 HIGH (Do Next)
- Rename files with forbidden suffixes (-temp, -test, -v2, etc.)
- Create missing index.tsx entry points
- Create missing api/ folders with queries/mutations files
- Split files 300-350 lines

### 🟡 MEDIUM (Then)
- Create missing components/ folders
- Ensure api/ folders have queries.ts or mutations.ts
- Split files 250-300 lines

### 🟢 LOW (Finally)
- Refactor files 200-250 lines

## Phase 3: Mark Progress
After fixing each task:
- Update `docs/project-inconsistencies.md`
- Change `- [ ]` to `- [x]` for completed items

## Rules
- Fix ONE priority level at a time
- Run typecheck after each batch: `npm run typecheck`
- Verify no breaking changes
- Mark tasks as completed immediately after fixing
- Re-run script after major changes to refresh the list

## Output Format
For each fix, report:
1. File/folder modified
2. Issue resolved
3. Verification (typecheck passed/failed)
