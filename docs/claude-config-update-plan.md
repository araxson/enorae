# Claude Configuration Update Plan
**Generated**: 2025-10-19
**Status**: In Progress
**Purpose**: Align all `.claude` configurations with the 71-rule system

---

## Executive Summary

After deep analysis of the rule system (`docs/rules/`), I've identified critical misalignments between current `.claude` agent and command configurations and the project's 71-rule system across 9 domains.

**Key Findings**:
- ✅ **Agent Coverage**: All 9 domains have dedicated analyzer agents
- ❌ **File Path Misalignments**: Agents reference `docs/rules/core/` (should be `domains/`)
- ❌ **Rule Understanding Gaps**: UI-P002 and UI-P004 need clarification on slot customization
- ❌ **Command Structure**: Old commands exist but new structure needed
- ❌ **MCP Integration Missing**: shadcn MCP not actively suggested in agents

---

## Rule System Overview

### Total Rule Count: 71 rules across 9 domains

| Domain | Code Prefix | Total Rules | Critical (P) | High (H) | Medium (M) | Low (L) |
|--------|-------------|-------------|--------------|----------|------------|---------|
| UI | UI-* | 10 | 4 | 3 | 2 | 1 |
| Database | DB-* | 9 | 3 | 3 | 2 | 1 |
| Architecture | ARCH-* | 7 | 2 | 2 | 2 | 1 |
| Security | SEC-* | 9 | 3 | 3 | 2 | 1 |
| Next.js | NEXT-* | 7 | 3 | 2 | 2 | 0 |
| React | REACT-* | 7 | 2 | 2 | 2 | 1 |
| TypeScript | TS-* | 7 | 2 | 2 | 2 | 1 |
| Performance | PERF-* | 6 | 0 | 2 | 2 | 2 |
| Accessibility | A11Y-* | 6 | 0 | 3 | 2 | 1 |
| **TOTAL** | | **71** | **19** | **22** | **18** | **9** |

---

## Critical Rule Clarifications

### UI-P002: Two Distinct Violations

**Original Understanding** (incomplete):
- shadcn/ui compositions must include required subcomponents

**Corrected Understanding** (complete):
1. **Incomplete Compositions**: Missing required subcomponents (Card without CardHeader, Dialog without DialogHeader/Title/Description, Alert without AlertTitle/Description)
2. **Slot Customization**: Customizing slot components with `text-*`, `font-*`, or color classes

**Why This Matters**:
- Slot components (CardTitle, CardDescription, AlertDescription, DialogTitle, AccordionTrigger, TabsTrigger, SidebarMenuButton, Badge, etc.) come with design-system-compliant sizing, font weights, and colors
- Customizing them with `className="text-lg font-bold"` or `className="text-red-600"` breaks design consistency
- Layout/spacing classes are OK: `className="mb-2 flex items-center gap-2"`

**Examples**:
```tsx
❌ WRONG:
<CardTitle className="text-lg font-bold">Dashboard</CardTitle>
<CardDescription className="text-red-600">Overview</CardDescription>
<AlertDescription className="text-sm">Alert text</AlertDescription>

✅ RIGHT:
<CardTitle>Dashboard</CardTitle>
<CardTitle className="mb-2">Dashboard</CardTitle> // layout only
<CardDescription>Overview</CardDescription>
```

### UI-P004: Comprehensive Typography Elimination

**Complete Requirements**:
1. Remove ALL imports from `@/components/ui/typography` (H1, H2, H3, P, Lead, Muted, Small, Large, etc.)
2. Eliminate ALL usage of Typography components
3. Use shadcn component slots FIRST (CardTitle, AlertDescription, Badge, etc.)
4. Explore shadcn blocks via MCP SECOND (`mcp__shadcn__list-blocks`)
5. Use semantic HTML + design tokens ONLY if no primitive/block exists

**shadcn MCP Integration**:
- `mcp__shadcn__list-components` - Explore 50+ components
- `mcp__shadcn__get-component-docs` - Get component details
- `mcp__shadcn__list-blocks` - See pre-built patterns (hero, features, pricing, etc.)
- `mcp__shadcn__get-block-docs` - Get block implementation

---

## Agent Update Status

### ✅ Completed Updates

#### 1. ui-analyzer.md
**Changes Made**:
- ✅ Updated file paths: `docs/rules/core/` → `docs/rules/domains/`
- ✅ Added 71-rule system reference
- ✅ Clarified UI-P002 to cover BOTH incomplete compositions AND slot customization
- ✅ Added comprehensive UI-P004 guidance with shadcn MCP integration
- ✅ Listed all 10 UI rules with detailed detection patterns
- ✅ Added shadcn MCP command suggestions throughout
- ✅ Updated terminal output format to emphasize slot customization
- ✅ Added 34 approved color tokens from UI-H102
- ✅ Cross-referenced accessibility rules (A11Y-H101, A11Y-H102, A11Y-H103)

**Lines Updated**: 430 (complete rewrite)

### 🔄 Pending Updates (13 agents remaining)

#### 2. database-analyzer.md
**Required Changes**:
- Update file paths: `.claude/commands/core/database/analyze.md` → proper structure
- Reference `docs/rules/domains/database.md` instead of `docs/rules/core/database.md`
- Add all 9 DB rules with detection patterns
- Cross-reference security rules (SEC-P001, SEC-P002, SEC-P003)
- Add reference to 71-rule system

**Critical Rules to Emphasize**:
- DB-P001: Read from public views, write to schema tables
- DB-P002: Auth verification required in every function
- DB-P003: Multi-tenant RLS must enforce tenant scope
- DB-H103: Call revalidatePath after mutations
- DB-M302: Validate with Zod before mutations

#### 3. architecture-analyzer.md
**Required Changes**:
- Update file paths: `docs/rules/core/` → `docs/rules/domains/`
- Add all 7 ARCH rules with detection patterns
- Reference 71-rule system
- Emphasize ARCH-P001 and ARCH-P002 as critical

**Critical Rules to Emphasize**:
- ARCH-P001: Server directives required (`import 'server-only'` in queries.ts, `'use server'` in mutations.ts)
- ARCH-P002: Pages must be 5-15 lines, render feature components only
- ARCH-H101: Feature directories follow standard template

#### 4. security-analyzer.md
**Required Changes**:
- Update file paths
- Add all 9 SEC rules with detection patterns
- Cross-reference database rules (DB-P002, DB-P003, DB-H101)
- Reference 71-rule system

**Critical Rules to Emphasize**:
- SEC-P001: Always call verifySession() or getUser() before data access
- SEC-P002: Use role helpers (requireRole, requireAnyRole)
- SEC-P003: RLS policies must wrap auth.uid() in SELECT
- SEC-M302: Validate mutations with Zod before writes

#### 5. nextjs-analyzer.md
**Required Changes**:
- Update file paths
- Add all 7 NEXT rules
- Reference 71-rule system
- Cross-reference architecture rules

**Critical Rules to Emphasize**:
- NEXT-P001: Scripts load from app/layout.tsx using next/script
- NEXT-P002: Import global styles only from app/layout.tsx
- NEXT-P003: Never use getInitialProps or Pages Router helpers
- NEXT-M301: Keep pages ultra-thin (5-15 lines)

#### 6. react-analyzer.md
**Required Changes**:
- Update file paths
- Add all 7 REACT rules
- Reference 71-rule system

**Critical Rules to Emphasize**:
- REACT-P001: Server Components fetch data, Client Components add interactivity
- REACT-P002: Avoid client-side data waterfalls
- REACT-H102: Use use() hook for server-started promises

#### 7. typescript-analyzer.md
**Required Changes**:
- Update file paths
- Add all 7 TS rules
- Reference 71-rule system
- Cross-reference database rules

**Critical Rules to Emphasize**:
- TS-P001: No 'any', no '@ts-ignore', strict mode always
- TS-P002: Never use reserved words as identifiers
- TS-M302: Use generated Supabase types

#### 8. performance-analyzer.md
**Required Changes**:
- Update file paths
- Add all 6 PERF rules
- Reference 71-rule system

**High Priority Rules to Emphasize**:
- PERF-H101: Add covering indexes for foreign keys
- PERF-H102: Remove duplicate indexes
- PERF-M302: Batch independent queries with Promise.all

#### 9. accessibility-analyzer.md
**Required Changes**:
- Update file paths
- Add all 6 A11Y rules
- Reference 71-rule system
- Cross-reference UI rules

**High Priority Rules to Emphasize**:
- A11Y-H101: Provide aria-label for grouped controls
- A11Y-H102: Enable accessibilityLayer on chart components
- A11Y-H103: Wrap related fields in FieldSet + FieldLegend
- A11Y-M301: Use Form, FormField, FormItem primitives

#### 10-13. Special-Purpose Agents

**domain-fixer.md**:
- Update to reference correct domain files
- Ensure it processes P→H→M→L priorities correctly
- Add 71-rule system reference

**critical-fixer.md**:
- Update to fix all 19 critical (P-level) rules across domains
- Reference correct file paths
- Add 71-rule system reference

**orchestrator.md**:
- Update to coordinate all 9 analyzer agents
- Reference 71-rule system
- Ensure proper reporting aggregation

**db-frontend-alignment-auditor.md**:
- Update file paths
- Cross-reference DB and UI rules
- Add 71-rule system reference

---

## Command Structure Migration

### Current State
```
.claude/old-commands/
├── ui/
│   ├── analyze.md
│   └── fix.md
├── database/
│   ├── analyze.md
│   └── fix.md
├── typescript/
│   ├── analyze.md
│   └── fix.md
├── architecture/
│   ├── analyze.md
│   └── fix.md
└── build/
    ├── analyze.md
    └── fix.md
```

### Proposed New Structure
```
.claude/commands/
├── analyze/
│   ├── ui.md
│   ├── database.md
│   ├── architecture.md
│   ├── security.md
│   ├── nextjs.md
│   ├── react.md
│   ├── typescript.md
│   ├── performance.md
│   ├── accessibility.md
│   └── all.md (runs orchestrator)
├── fix/
│   ├── critical.md (fixes all P-level rules)
│   ├── high.md (fixes all H-level rules)
│   ├── domain/
│   │   ├── ui.md
│   │   ├── database.md
│   │   ├── architecture.md
│   │   └── ... (all 9 domains)
│   └── all.md (complete fix workflow)
└── utils/
    ├── db-frontend-alignment.md
    └── build.md
```

### Command Template (analyze/ui.md)
```markdown
# Analyze UI Code

Scan codebase for UI violations against the 71-rule system.

## Rules Source

**REQUIRED**: Read these files before scanning:
1. `docs/rules/domains/ui.md` - All 10 UI rules (4 Critical, 3 High, 2 Medium, 1 Low)
2. `docs/rules/03-QUICK-SEARCH.md` - Quick reference for all UI-* rules
3. `CLAUDE.md` - Critical reminders about UI violations

## Execution

Use the Task tool to launch the `ui-analyzer` agent:
\`\`\`
Task(
  subagent_type="ui-analyzer",
  prompt="Analyze all UI code for violations of the 10 UI rules. Focus on:
  1. Typography imports (UI-P004)
  2. Slot customization (UI-P002) - NO text-*/font-* classes on slots
  3. Incomplete compositions (UI-P002)
  4. Arbitrary colors (UI-H102) - use 34 approved tokens only
  5. shadcn/ui primitive usage (UI-P003)

  Generate comprehensive report in docs/analyze-fixes/ui/"
)
\`\`\`

## What Gets Checked

### Critical (P-Level) - Must fix immediately:
- ✅ UI-P001: Text renders via shadcn primitives or semantic tokens
- ✅ UI-P002: Complete shadcn compositions + NO slot customization
- ✅ UI-P003: ONLY shadcn/ui components (no custom primitives)
- ✅ UI-P004: NO @/components/ui/typography imports

### High (H-Level) - Important for quality:
- ✅ UI-H101: @utility not @layer for custom styles
- ✅ UI-H102: 34 approved color tokens only (no arbitrary Tailwind)
- ✅ UI-H103: aria-label on grouped controls

### Medium (M-Level) - Best practices:
- ✅ UI-M301: Named container queries
- ✅ UI-M302: Charts have accessibilityLayer

### Low (L-Level) - Improvements:
- ✅ UI-L701: :root colors use hsl() with @theme

## Expected Output

The agent will generate:
1. `docs/analyze-fixes/ui/analysis-report.md` - Human-readable report
2. `docs/analyze-fixes/ui/analysis-report.json` - Machine-readable data
3. Terminal summary with:
   - Total violations by priority (P→H→M→L)
   - File-by-file breakdown
   - shadcn MCP suggestions
   - Actionable next steps

## After Analysis

Review the report and use `/fix/domain/ui` to fix violations in batches, or `/fix/critical` to fix all P-level issues across all domains.
```

---

## Implementation Checklist

### Phase 1: Agent Updates (In Progress)
- [x] ui-analyzer.md - COMPLETED
- [ ] database-analyzer.md
- [ ] architecture-analyzer.md
- [ ] security-analyzer.md
- [ ] nextjs-analyzer.md
- [ ] react-analyzer.md
- [ ] typescript-analyzer.md
- [ ] performance-analyzer.md
- [ ] accessibility-analyzer.md
- [ ] domain-fixer.md
- [ ] critical-fixer.md
- [ ] orchestrator.md
- [ ] db-frontend-alignment-auditor.md

### Phase 2: Command Structure Creation
- [ ] Create `.claude/commands/` directory structure
- [ ] Migrate old commands with updated paths
- [ ] Create new domain-specific analyze commands
- [ ] Create priority-based fix commands
- [ ] Add utility commands

### Phase 3: Verification
- [ ] Test each analyzer agent
- [ ] Verify rule file paths are correct
- [ ] Confirm 71-rule system is properly referenced
- [ ] Validate shadcn MCP integration
- [ ] Test command execution
- [ ] Review generated reports for accuracy

### Phase 4: Documentation
- [ ] Update `.claude/README.md` with new structure
- [ ] Document command usage examples
- [ ] Add troubleshooting guide
- [ ] Create agent usage matrix

---

## Critical Reminders for All Agents

Every analyzer agent MUST:
1. ✅ Reference `docs/rules/domains/` (NOT `docs/rules/core/`)
2. ✅ Include reference to 71-rule system across 9 domains
3. ✅ List all rules for their domain with detection patterns
4. ✅ Prioritize by P → H → M → L
5. ✅ Cross-reference related rules from other domains
6. ✅ Generate reports in `docs/analyze-fixes/[domain]/`
7. ✅ Provide actionable fix suggestions with code examples
8. ✅ Include terminal summary with clear next steps
9. ✅ Never edit protected files (components/ui/*, app/globals.css)
10. ✅ Reference CLAUDE.md for project-specific patterns

---

## Next Steps

1. **Complete Agent Updates**: Update remaining 13 agents following ui-analyzer.md pattern
2. **Create Command Structure**: Build new `.claude/commands/` directory with proper organization
3. **Test System**: Run each analyzer to verify correct operation
4. **Document Changes**: Update project documentation to reflect new structure
5. **Train Team**: Ensure all developers understand new command system

---

## Success Criteria

✅ All 14 agents reference correct file paths
✅ All agents understand the 71-rule system
✅ UI-P002 and UI-P004 are correctly understood (no slot customization)
✅ shadcn MCP integration is present in UI analyzer
✅ Command structure follows logical organization
✅ All generated reports follow consistent format
✅ Cross-domain rule references are accurate
✅ Priority ordering is consistent (P→H→M→L)

---

**Last Updated**: 2025-10-19
**Status**: Phase 1 in progress (1/14 agents complete)
**Next Action**: Continue systematic agent updates
