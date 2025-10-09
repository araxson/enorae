import test from 'node:test'
import assert from 'node:assert/strict'

import { createSupabaseStub } from '../utils/create-supabase-stub'

const envDefaults: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key-1234567890',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-1234567890',
  NODE_ENV: 'test',
}

for (const [key, value] of Object.entries(envDefaults)) {
  if (!process.env[key]) {
    process.env[key] = value
  }
}

const { generateUniqueServiceSlug } = await import('@/features/business/services/api/utils/supabase')

test('generateUniqueServiceSlug returns sanitized slug when no conflicts', async () => {
  const supabase = createSupabaseStub({
    services: [],
  })

  const slug = await generateUniqueServiceSlug(
    supabase as never,
    'salon-123',
    'Deluxe Blowout Service!',
  )

  assert.equal(slug, 'deluxe-blowout-service')
})

test('generateUniqueServiceSlug appends numeric suffix when slug already exists', async () => {
  const supabase = createSupabaseStub({
    services: [
      { id: 'svc-1', slug: 'deluxe-blowout-service' },
      { id: 'svc-2', slug: 'deluxe-blowout-service-2' },
    ],
  })

  const slug = await generateUniqueServiceSlug(
    supabase as never,
    'salon-123',
    'Deluxe Blowout Service',
  )

  assert.equal(slug, 'deluxe-blowout-service-3')
})

test('generateUniqueServiceSlug ignores the current service id when updating', async () => {
  const supabase = createSupabaseStub({
    services: [
      { id: 'svc-123', slug: 'express-cut' },
    ],
  })

  const slug = await generateUniqueServiceSlug(
    supabase as never,
    'salon-123',
    'Express Cut',
    'svc-123',
  )

  assert.equal(slug, 'express-cut')
})

test('generateUniqueServiceSlug throws when supabase returns an error', async () => {
  const supabase = createSupabaseStub({
    error: {
      message: 'query failed',
      code: '12345',
      details: '',
      hint: '',
      name: 'PostgrestError',
    },
  })

  await assert.rejects(
    () =>
      generateUniqueServiceSlug(
        supabase as never,
        'salon-123',
        'Any Service',
      ),
    /query failed/,
  )
})
