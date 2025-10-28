# 17: Import & Module Dependencies

**Role:** Import Optimizer

## Objective

Identify unused imports, circular dependencies, deep import paths, missing barrel exports, and import organization issues that complicate module dependencies and reduce maintainability.

## What to Search For

- Unused imports in files
- Circular imports/dependencies between modules
- Deep relative import paths (../../../../../../)
- Missing barrel exports (index.ts)
- Inconsistent import patterns
- Importing from wrong layer (component importing from wrong directory)
- Wildcard imports that are too broad
- Unused default exports
- Missing type-only imports
- Importing internal implementations instead of public APIs

## How to Identify Issues

1. **Find unused imports** using ripgrep
2. **Identify circular dependencies** with dependency analysis
3. **Search for deep relative paths** (3+ levels: ../)
4. **Check for missing index.ts** barrel files
5. **Find inconsistent import styles** (mix of relative/absolute)

## Example Problems

```ts
// ❌ Unused imports
import { fetchUser } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { useState } from 'react' // Used
import { useCallback } from 'react' // Unused!

export function Profile() {
  return <Button>{/* ... */}</Button>
}

// ❌ Circular dependency
// features/A/index.ts imports from features/B/index.ts
// features/B/index.ts imports from features/A/index.ts

// ❌ Deep relative import path
import { formatDate } from '../../../../../lib/utils/date'
// Should be: import { formatDate } from '@/lib/utils/date'

// ❌ Missing barrel export
// Must import like: import { Button } from '@/components/ui/button/button.tsx'
// Should be: import { Button } from '@/components/ui/button'

// ❌ Importing internal implementation
import { useFormState } from '../components/form/internal-hooks.ts'
// Should expose through public API

// ❌ Wildcard import too broad
import * as utils from '@/lib/utils'
utils.formatDate() // Which utils are needed?
```

## Fix Approach

- Remove unused imports
- Replace deep relative paths with absolute paths (@/)
- Create barrel exports (index.ts) for directories
- Break circular dependencies
- Use type-only imports for types
- Organize imports (React, libraries, local)
- Import from public APIs, not internals
- Review `docs/ruls/architecture-patterns.md` for import boundaries and barrel export rules

## Output Format

List findings as:
```
- HIGH: features/business/dashboard/index.tsx:1-5 - Unused imports: useCallback, formatDate
- HIGH: features/A/index.ts ↔ features/B/index.ts - Circular dependency
- MEDIUM: features/staff/appointments/components/list.tsx:45 - Deep relative path: ../../../../../lib
- MEDIUM: lib/components/form/ - Missing barrel export (index.ts)
```

## Stack Pattern Reference

Review:
- `docs/ruls/architecture-patterns.md`
- `docs/ruls/architecture-patterns.md`

Complete import audit and report all issues.
