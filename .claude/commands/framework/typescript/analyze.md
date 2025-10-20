# TypeScript Analysis - Violation Detection

Scan codebase for TypeScript violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/framework/typescript.md` completely before scanning.

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md#ts-*`
- Related Rules: DB-P001, DB-M301, TS-M302

## Scan Targets

### High Priority Files
- `**/*.ts`
- `**/*.tsx`

### EXCLUDE
- `lib/types/database.types.ts` (auto-generated)

## Violation Rules

### CRITICAL

#### Rule: TS-P001 {#ts-p001}
- **Pattern**: No 'any', no '@ts-ignore', strict mode always
- **Detection**: Check for `any`, `@ts-ignore`, tsconfig relaxations
- **Why Critical**: Catches security bugs in auth-bound paths
- **Example**:
  ```ts
  // ❌ WRONG
  const data: any = await supabase.from('appointments').select('*')

  // ✅ CORRECT
  import type { Database } from '@/lib/types/database.types'
  type Appointment = Database['public']['Views']['appointments']['Row']
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-p001`
- **Related**: DB-P001

#### Rule: TS-P002 {#ts-p002}
- **Pattern**: Never use reserved words (eval, let) as identifiers
- **Detection**: Search for `const eval`, `var let`
- **Why Critical**: Generates TS1214/TS1215 errors, blocks builds
- **Example**:
  ```ts
  // ❌ WRONG
  export const let = 1

  // ✅ CORRECT
  export const level = 1
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-p002`

### HIGH PRIORITY

#### Rule: TS-H101 {#ts-h101}
- **Pattern**: Avoid binding patterns in using declarations
- **Detection**: Search for `for (using {` or `using [`
- **Why High**: TS 5.9 forbids destructuring in using (TS1492)
- **Example**:
  ```ts
  // ❌ WRONG
  for (using { client } of pool) {}

  // ✅ CORRECT
  for (using item of pool) {
    const { client } = item
  }
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-h101`

#### Rule: TS-H102 {#ts-h102}
- **Pattern**: No object/array destructuring in strict mode functions
- **Detection**: Look for `'use strict'` with destructured parameters
- **Why High**: Emits TS1105, breaks builds
- **Reference**: `docs/rules/framework/typescript.md#ts-h102`

### MEDIUM PRIORITY

#### Rule: TS-M301 {#ts-m301}
- **Pattern**: Avoid numeric literals with leading zeros
- **Detection**: Search for regex `\b0[0-9]`
- **Why**: Strict mode forbids (TS1489)
- **Example**:
  ```ts
  // ❌ WRONG
  const status = 009

  // ✅ CORRECT
  const status = 9
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-m301`

#### Rule: TS-M302 {#ts-m302}
- **Pattern**: Use generated Supabase types for reads/writes
- **Detection**: Review queries for manual interfaces
- **Example**:
  ```ts
  type Appointment = Database['public']['Views']['appointments']['Row']
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-m302`
- **Related**: DB-M301, TS-P001

### LOW PRIORITY

#### Rule: TS-L701 {#ts-l701}
- **Pattern**: Use unknown + Zod over 'any'
- **Detection**: `rg 'as any'`
- **Example**:
  ```ts
  const payload = schema.parse(await res.json())
  type Payload = typeof payload
  ```
- **Reference**: `docs/rules/framework/typescript.md#ts-l701`

## Output Files

1. `docs/analyze-fixes/typescript/analysis-report.json`
2. `docs/analyze-fixes/typescript/analysis-report.md`

Use TS domain prefix.

## Execute now following steps 1-9.
