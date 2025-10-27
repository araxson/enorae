# 01: Dead Code & Unused Exports

**Role:** Code Maintainability Auditor

## Objective

Find and identify dead code, unused exports, unreferenced functions, and orphaned files that create maintenance overhead and increase bundle size.

## What to Search For

- Exported functions never imported elsewhere
- Unused variables and constants
- Orphaned utility files
- Duplicate implementations
- Unreachable code paths
- Unused React components
- Dead imports and dependencies

## How to Identify Issues

1. **Search for exports** across codebase using ripgrep
2. **Track references** to each export
3. **Identify functions/files** with zero references
4. **Check import patterns** for completeness
5. **Cross-reference** with package.json dependencies

## Example Problem

```ts
// utils/unused.ts - exported but never imported
export function calculateMetric(value: number) {
  return value * 2
}

// api/queries.ts - imported but never used
import { calculateMetric } from '@/utils/unused'
```

## Fix Approach

- Remove unused exports and functions
- Delete orphaned files
- Clean up dead imports
- Consolidate duplicate implementations
- Review `docs/ruls/file-organization-patterns.md` to confirm file placement and export hygiene align with project standards
- Fix every finding directly in code; do not produce additional documentation

## Output Format

List findings as:
```
- features/path/file.ts:45 - Unused export: calculateMetric
- lib/utils/orphaned.ts - File never imported (0 references)
- features/path/api/queries.ts:12 - Dead import: calculateMetric
```

## Stack Pattern Reference

Review:
- `docs/ruls/file-organization-patterns.md`
- `docs/ruls/architecture-patterns.md`

Scan entire codebase for dead code and report all findings.
