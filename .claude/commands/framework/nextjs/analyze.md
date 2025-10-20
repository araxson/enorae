# Next.js Analysis - Violation Detection

Scan codebase for Next.js-specific violations. Update existing report or create new.

## Rules Source

**REQUIRED**: Read `docs/rules/framework/nextjs.md` completely before scanning.

**Additional Context**:
- Rules Index: `docs/rules/01-rules-index.md#next-*`
- Related Rules: ARCH-P002, PERF-M302

## Scan Targets

### Critical Priority Files
- `app/layout.tsx`
- `app/**/page.tsx`

### High Priority Files
- `app/**/loading.tsx`
- `app/**/error.tsx`
- `app/not-found.tsx`
- `middleware.ts`

## Violation Rules

### CRITICAL

#### Rule: NEXT-P001 {#next-p001}
- **Pattern**: Scripts load from app/layout.tsx using next/script
- **Detection**: Search for `<script>` tags or `next/script` imports outside app/layout.tsx
- **Example**:
  ```tsx
  // ✅ CORRECT (in app/layout.tsx)
  import Script from 'next/script'
  <Script src="..." strategy="afterInteractive" />
  ```
- **Reference**: `docs/rules/framework/nextjs.md#next-p001`

#### Rule: NEXT-P002 {#next-p002}
- **Pattern**: Import global styles only from app/layout.tsx
- **Detection**: Search for `import './globals.css'` outside app/layout.tsx
- **Reference**: `docs/rules/framework/nextjs.md#next-p002`

#### Rule: NEXT-P003 {#next-p003}
- **Pattern**: Never use getInitialProps or Pages Router helpers
- **Detection**: `rg "getInitialProps" app`
- **Reference**: `docs/rules/framework/nextjs.md#next-p003`

### HIGH PRIORITY

#### Rule: NEXT-H101 {#next-h101}
- **Pattern**: Wrap Web Vitals in dedicated 'use client' component
- **Detection**: Check for `useReportWebVitals` outside client component
- **Example**:
  ```tsx
  // app/_components/web-vitals.tsx
  'use client'
  import { useReportWebVitals } from 'next/web-vitals'
  export function WebVitals() {
    useReportWebVitals((metric) => console.log(metric))
    return null
  }
  ```
- **Reference**: `docs/rules/framework/nextjs.md#next-h101`

#### Rule: NEXT-H102 {#next-h102}
- **Pattern**: Use GoogleTagManager from @next/third-parties
- **Detection**: Search for `googletagmanager` strings
- **Example**:
  ```tsx
  import { GoogleTagManager } from '@next/third-parties/google'
  <GoogleTagManager gtmId="GTM-XXXX" />
  ```
- **Reference**: `docs/rules/framework/nextjs.md#next-h102`

### MEDIUM PRIORITY

#### Rule: NEXT-M301 {#next-m301}
- **Pattern**: Keep pages ultra-thin (5-15 lines)
- **Detection**: Flag app/**/page.tsx files >15 lines
- **Reference**: `docs/rules/framework/nextjs.md#next-m301`
- **Related**: ARCH-P002

#### Rule: NEXT-M302 {#next-m302}
- **Pattern**: Use container queries for responsive layouts
- **Detection**: Layouts using manual breakpoints
- **Reference**: `docs/rules/framework/nextjs.md#next-m302`

### LOW PRIORITY

#### Rule: NEXT-L701 {#next-l701}
- **Pattern**: Use Promise.all for independent fetches
- **Detection**: Back-to-back await statements
- **Example**:
  ```tsx
  const [services, staff] = await Promise.all([
    getServices(salonId),
    getStaff(salonId),
  ])
  ```
- **Reference**: `docs/rules/framework/nextjs.md#next-l701`
- **Related**: PERF-M302

## Output Files

1. `docs/analyze-fixes/nextjs/analysis-report.json`
2. `docs/analyze-fixes/nextjs/analysis-report.md`

Use NEXT domain prefix.

## Execute now following steps 1-9.
