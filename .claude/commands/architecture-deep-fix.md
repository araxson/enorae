# Architecture Deep Fix

**Core Principle:** Systematically enforce all architecture patterns from `docs/rules/architecture.md` through comprehensive, iterative agent passes.

**Role:** Architecture compliance enforcer with deep analysis mode enabled.

**Action Mode:** ULTRATHINK - Use extended reasoning to identify ALL violations, prioritize by impact, and execute systematic fixes across 10+ agent iterations.

**Purpose:** Achieve 100% compliance with ENORAE architecture standards by running the architecture-enforcer agent comprehensively until zero violations remain.

---

## Execution Strategy

**Phase 1: Discovery (Passes 1-3)**
1. **Pass 1:** Scan all features for file naming violations (suffixes, kebab-case, dots)
2. **Pass 2:** Audit all `components/index.ts` files for completeness and missing re-exports
3. **Pass 3:** Check all feature `index.tsx` files for bypassed imports (direct vs index)

**Phase 2: Structure (Passes 4-6)**
4. **Pass 4:** Verify file size limits across components (< 200 lines)
5. **Pass 5:** Verify file size limits across queries/mutations (< 300 lines)
6. **Pass 6:** Validate directory organization patterns (Small/Medium/Large)

**Phase 3: Patterns (Passes 7-9)**
7. **Pass 7:** Enforce server directives ('server-only', 'use server', 'use client')
8. **Pass 8:** Audit lib/ organization for feature-specific code violations
9. **Pass 9:** Validate naming conventions (camelCase, PascalCase, kebab-case)

**Phase 4: Cleanup (Passes 10-12)**
10. **Pass 10:** Fix incomplete index.ts files across all features
11. **Pass 11:** Remove redundant files, duplicates, and misplaced code
12. **Pass 12:** Final comprehensive sweep for any remaining violations

---

## Agent Invocation Pattern

For EACH pass:
1. Launch architecture-enforcer agent with specific focus area
2. Review violations report
3. Apply fixes systematically
4. Verify fixes with typecheck: `pnpm typecheck`
5. Document remaining issues
6. Proceed to next pass

---

## Success Criteria

- [ ] Zero file naming violations (suffixes, dots, case)
- [ ] All `components/index.ts` export ALL components
- [ ] All feature imports use index files (no bypassing)
- [ ] All files respect size limits
- [ ] All server directives present and correct
- [ ] No feature-specific code in lib/
- [ ] All naming conventions followed
- [ ] Zero redundant or misplaced files
- [ ] `pnpm typecheck` passes cleanly
- [ ] Final agent pass reports zero violations

---

## Critical Rules

**Never Edit:**
- `lib/types/database.types.ts` (auto-generated)
- `components/ui/*` (shadcn/ui primitives)
- `app/globals.css` (locked)

**Always:**
- Fix violations in place (no bulk scripts)
- Run typecheck after each major change
- Update imports when moving files
- Maintain feature boundaries
- Preserve business logic

---

## Deliverable

Complete architecture compliance report showing:
1. Initial violation count by category
2. Fixes applied per pass (with file paths)
3. Final violation count (target: 0)
4. Any remaining issues requiring manual review
5. Typecheck status (must pass)

Execute all 12+ passes systematically. Use ULTRATHINK mode for deep pattern detection.
