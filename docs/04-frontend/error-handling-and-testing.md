# 🛡️ FRONTEND - ERROR HANDLING & TESTING

> **Navigation**: [📘 Docs Index](../index.md) | [🏠 README](../../README.md) | [🤖 CLAUDE.md](../../CLAUDE.md)

> **Enorae Platform - Error Handling & Testing Strategies**
> **Last Updated**: 2025-10-01

---

## 📋 TABLE OF CONTENTS

1. [Error Handling](#error-handling)
2. [Testing Strategy](#testing-strategy)

---

## 🛡️ ERROR HANDLING

### 1. DAL Error Handling

```typescript
export async function getSalon(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    // Map Supabase errors to user-friendly messages
    if (error.code === 'PGRST116') {
      throw new Error('Salon not found')
    }
    if (error.code === '42501') {
      throw new Error('Permission denied')
    }
    throw error
  }

  return data
}
```

### 2. Server Action Error Handling

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const serviceSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive()
})

export async function createService(
  prevState: any,
  formData: FormData
) {
  try {
    // Validate input
    const parsed = serviceSchema.parse({
      name: formData.get('name'),
      price: Number(formData.get('price'))
    })

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'You must be logged in' }
    }

    const { error } = await supabase
      .from('services')
      .insert(parsed)

    if (error) throw error

    revalidatePath('/business/services')
    return { success: true }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }

    return {
      error: error instanceof Error
        ? error.message
        : 'Failed to create service'
    }
  }
}
```

### 3. Error Boundaries

```typescript
// app/error.tsx (catches all errors in app)
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button onClick={reset} className="px-4 py-2 bg-primary text-white rounded">
        Try again
      </button>
    </div>
  )
}
```

### 4. Not Found Handling

```typescript
// app/salons/[slug]/not-found.tsx
export default function SalonNotFound() {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-2">Salon Not Found</h2>
      <p className="text-muted-foreground">
        The salon you're looking for doesn't exist.
      </p>
    </div>
  )
}
```

---

## 🧪 TESTING STRATEGY

### 1. Component Testing (Vitest + Testing Library)

```typescript
// features/salon-discovery/components/salon-card.test.tsx
import { render, screen } from '@testing-library/react'
import { SalonCard } from './salon-card'

describe('SalonCard', () => {
  const mockSalon = {
    id: '123',
    name: 'Test Salon',
    slug: 'test-salon',
    address: '123 Main St',
    created_at: new Date().toISOString()
  }

  it('renders salon name and address', () => {
    render(<SalonCard salon={mockSalon} />)

    expect(screen.getByText('Test Salon')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
  })

  it('links to salon detail page', () => {
    render(<SalonCard salon={mockSalon} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/salons/test-salon')
  })
})
```

### 2. DAL Testing (Mock Supabase)

```typescript
// features/salons/dal/salons.queries.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getSalons } from './salons.queries'

// Mock Supabase client
vi.mock('@enorae/database/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'user-123' } }
      }))
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [{ id: '1', name: 'Test Salon' }],
          error: null
        }))
      }))
    }))
  }))
}))

describe('getSalons', () => {
  it('returns salons for authenticated user', async () => {
    const salons = await getSalons()
    expect(salons).toHaveLength(1)
    expect(salons[0].name).toBe('Test Salon')
  })
})
```

### 3. E2E Testing (Playwright)

```typescript
// e2e/salon-discovery.spec.ts
import { test, expect } from '@playwright/test'

test('search and view salon', async ({ page }) => {
  // Navigate to salons page
  await page.goto('/salons')

  // Search for salon
  await page.fill('input[placeholder="Search salons..."]', 'Test Salon')

  // Wait for results
  await page.waitForSelector('text=Test Salon')

  // Click on salon card
  await page.click('text=Test Salon')

  // Verify salon detail page
  await expect(page).toHaveURL(/\/salons\/test-salon/)
  await expect(page.locator('h1')).toContainText('Test Salon')
})
```

---

**Last Updated**: 2025-10-01
**Maintained By**: Enorae Development Team
**Status**: Production-Ready ✅
