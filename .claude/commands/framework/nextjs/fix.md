# Next.js Fix - Reusable Session

Auto-fix Next.js issues in batches. Run multiple times to complete all fixes.

## Input File

Read: `docs/analyze-fixes/nextjs/analysis-report.json`

## Fix Patterns by Rule

### Rule: NEXT-P001 {#next-p001}

**Fix**: Move scripts to app/layout.tsx with next/script

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/analytics.js" strategy="afterInteractive" />
    </html>
  )
}
```

### Rule: NEXT-P002 {#next-p002}

**Fix**: Remove globals.css imports from non-layout files

```tsx
// ❌ Remove from feature files
// import './globals.css'

// ✅ Only in app/layout.tsx
import './globals.css'
```

### Rule: NEXT-P003 {#next-p003}

**Fix**: Convert to Server Components or route handlers

```tsx
// ❌ WRONG
MyApp.getInitialProps = async () => ({ data: await fetchData() })

// ✅ CORRECT
export default async function Page() {
  const data = await getData()
  return <Feature data={data} />
}
```

### Rule: NEXT-H101 {#next-h101}

**Fix**: Create dedicated client component for Web Vitals

```tsx
// Create app/_components/web-vitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
  return null
}

// Import in app/layout.tsx
import { WebVitals } from './_components/web-vitals'
```

### Rule: NEXT-H102 {#next-h102}

**Fix**: Use @next/third-parties GTM component

```tsx
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <GoogleTagManager gtmId="GTM-XXXX" />
      <body>{children}</body>
    </html>
  )
}
```

### Rule: NEXT-M301 {#next-m301}

**Fix**: Move logic to feature components

```tsx
// Move to features/{portal}/{feature}/index.tsx
import { Feature } from '@/features/portal/feature'
export default async function Page() {
  return <Feature />
}
```

### Rule: NEXT-M302 {#next-m302}

**Fix**: Use container queries

```tsx
<div className="@container/main">
  <section className="@sm/main:flex-col">
    {children}
  </section>
</div>
```

### Rule: NEXT-L701 {#next-l701}

**Fix**: Batch with Promise.all

```tsx
// ❌ WRONG
const services = await getServices()
const staff = await getStaff()

// ✅ CORRECT
const [services, staff] = await Promise.all([
  getServices(),
  getStaff(),
])
```

## Process

1. Load report
2. Fix 10-20 pending issues in NEXT-P### → NEXT-L### order
3. Update status
4. Save report

**Start now.** Fix next batch of Next.js issues.
