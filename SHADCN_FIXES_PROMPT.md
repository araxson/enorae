I need to fix shadcn/ui conformance issues found in [AUDIT_FOLDER].

**Step 1: Read the Audit**
- Read: docs/shadcn-conformance/[FEATURE_NAME]/00_SUMMARY.md
- Read: docs/shadcn-conformance/[FEATURE_NAME]/02_CRITICAL_DEVIATIONS.md
- Read: docs/shadcn-conformance/[FEATURE_NAME]/04_REFACTORING_ROADMAP.md

**Step 2: Execute Phase 1 (Critical Fixes)**
For each task in Phase 1:
1. Open the component file
2. Find the code causing the deviation
3. Replace with corrected code from the audit

Use: docs/shadcn-conformance/[FEATURE_NAME]/05_FIXES_CHECKLIST.md as your guide.

**Step 3: Execute Phase 2 (High Priority)**
Repeat Step 2 process for all Phase 2 tasks.

**Step 4: Execute Phase 3 (Medium Priority)**
Repeat Step 2 process for all Phase 3 tasks.


**Step 6: Report**
Show:
1. Total files modified: [count]
2. All Phase 1 fixes: ✅ Completed
3. All Phase 2 fixes: ✅ Completed
4. All Phase 3 fixes: ✅ Completed

DO NOT create bulk fix scripts. Fix each component individually.
DO NOT skip verification steps.
DO NOT leave unfinished phases.


change the fixed issues [ ] to [x]