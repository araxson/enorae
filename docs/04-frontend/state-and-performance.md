# 🚀 FRONTEND - STATE & PERFORMANCE

> **Navigation**: [📘 Docs Index](../index.md) | [🏠 README](../../README.md) | [🤖 CLAUDE.md](../../CLAUDE.md)

> **Enorae Platform - State Management & Optimization Patterns**
> **Last Updated**: 2025-10-01

---

## 📋 TABLE OF CONTENTS

1. [State Management](#state-management)
2. [Performance Optimization](#performance-optimization)

---

## 🚀 STATE MANAGEMENT

### 1. URL State (Preferred for Filters/Search)

```typescript
// Use URL search params for shareable state
const searchParams = useSearchParams()
const router = useRouter()

function updateFilter(key: string, value: string) {
  const params = new URLSearchParams(searchParams)
  params.set(key, value)
  router.push(`?${params.toString()}`)
}
```

### 2. React Context (Auth, Theme)

```typescript
// lib/contexts/auth-context.tsx
'use client'

import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  user
}: {
  children: React.ReactNode
  user: User | null
}) {
  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### 3. Server State (React Query/SWR)

```typescript
// Only for client-side mutations/optimistic updates
'use client'

import useSWR from 'swr'
import { getSalons } from '../dal/salons.queries'

export function useSalons() {
  const { data, error, mutate } = useSWR('salons', getSalons)

  return {
    salons: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
```

### 4. Form State (React Hook Form + Zod)

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  duration_minutes: z.number().int().positive()
})

type ServiceFormData = z.infer<typeof serviceSchema>

export function ServiceForm() {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      price: 0,
      duration_minutes: 30
    }
  })

  async function onSubmit(data: ServiceFormData) {
    // Handle submission
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### 1. Database Query Optimization

```typescript
// ✅ GOOD - Select only needed fields
const { data } = await supabase
  .from('salons')
  .select('id, name, slug, address')  // Minimal fields

// ❌ BAD - Select everything
const { data } = await supabase
  .from('salons')
  .select('*')  // Unnecessary data transfer
```

### 2. Pagination & Infinite Scroll

```typescript
// Cursor-based pagination for large datasets
export async function getAppointmentsInfinite({
  cursor,
  limit = 20
}: {
  cursor?: string
  limit?: number
}) {
  const supabase = await createClient()

  let query = supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  if (error) throw error

  return {
    data,
    nextCursor: data.length === limit ? data[data.length - 1].created_at : null
  }
}
```

### 3. React Server Components Caching

```typescript
// Next.js 15 App Router caching
import { unstable_cache } from 'next/cache'
import { getSalons } from './dal/salons.queries'

// Cache for 1 hour
export const getCachedSalons = unstable_cache(
  getSalons,
  ['salons'],
  { revalidate: 3600 }
)
```

### 4. Image Optimization

```typescript
import Image from 'next/image'

// Always use Next.js Image component
<Image
  src={salon.image_url}
  alt={salon.name}
  width={400}
  height={300}
  className="object-cover"
  priority={false}  // Lazy load by default
/>
```

### 5. Code Splitting

```typescript
import dynamic from 'next/dynamic'

// Lazy load heavy components
const AnalyticsChart = dynamic(
  () => import('./components/analytics-chart'),
  { loading: () => <Skeleton className="h-64" /> }
)
```

---

**Last Updated**: 2025-10-01
**Maintained By**: Enorae Development Team
**Status**: Production-Ready ✅
