import test from 'node:test'
import assert from 'node:assert/strict'

import { createSupabaseClientStub } from '../../utils/create-supabase-client-stub'
import { createSessionStub } from '../../utils/create-session-stub'
import type { SupabaseServerClient } from '@/features/business/services/api/utils/supabase'

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

const { updateService } = await import('@/features/business/services/api/mutations/update-service.mutation')

const FIXED_DATE = new Date('2025-01-20T08:30:00.000Z')

test('updateService recalculates pricing and booking details', async () => {
  const initialServiceId = 'svc-123'
  const supabaseStub = createSupabaseClientStub({
    state: {
      services: [
        {
          id: initialServiceId,
          salon_id: 'salon-123',
          slug: 'classic-cut',
          name: 'Classic Cut',
          is_active: true,
          is_bookable: true,
          is_featured: false,
        },
      ],
      service_pricing: [
        {
          id: 'pricing-123',
          service_id: initialServiceId,
          base_price: 100,
          sale_price: 90,
          current_price: 90,
          profit_margin: 40,
          cost: 60,
        },
      ],
      service_booking_rules: [
        {
          id: 'br-123',
          service_id: initialServiceId,
          duration_minutes: 60,
          buffer_minutes: 15,
          total_duration_minutes: 75,
        },
      ],
    },
  })

  const session = createSessionStub({
    user: {
      created_at: FIXED_DATE.toISOString(),
      updated_at: FIXED_DATE.toISOString(),
      last_sign_in_at: FIXED_DATE.toISOString(),
      email_confirmed_at: FIXED_DATE.toISOString(),
      confirmed_at: FIXED_DATE.toISOString(),
    },
  })

  const result = await updateService(
    initialServiceId,
    {
      name: 'Classic Cut Deluxe',
      description: 'Updated description',
      is_featured: true,
    },
    {
      base_price: 150,
      sale_price: 120,
      cost: 50,
    },
    {
      duration_minutes: 75,
      buffer_minutes: 10,
    },
    {
      supabase: supabaseStub.client as unknown as SupabaseServerClient,
      session,
      now: () => FIXED_DATE,
      skipAccessCheck: true,
    },
  )

  assert.deepEqual(result, { success: true })

  const updatedService = supabaseStub.state.services.find((row) => row.id === initialServiceId)
  assert.ok(updatedService)
  assert.equal(updatedService?.name, 'Classic Cut Deluxe')
  assert.equal(updatedService?.description, 'Updated description')
  assert.equal(updatedService?.is_featured, true)
  assert.equal(updatedService?.updated_by_id, session.user.id)
  assert.equal(updatedService?.updated_at, FIXED_DATE.toISOString())
  assert.equal(updatedService?.slug, 'classic-cut-deluxe')

  const pricing = supabaseStub.state.service_pricing.find((row) => row.service_id === initialServiceId)
  assert.ok(pricing)
  assert.equal(pricing?.base_price, 150)
  assert.equal(pricing?.sale_price, 120)
  assert.equal(pricing?.current_price, 120)
  assert.equal(pricing?.profit_margin, 58.33)
  assert.equal(pricing?.cost, 50)
  assert.equal(pricing?.updated_by_id, session.user.id)
  assert.equal(pricing?.updated_at, FIXED_DATE.toISOString())

  const booking = supabaseStub.state.service_booking_rules.find((row) => row.service_id === initialServiceId)
  assert.ok(booking)
  assert.equal(booking?.duration_minutes, 75)
  assert.equal(booking?.buffer_minutes, 10)
  assert.equal(booking?.total_duration_minutes, 85)
  assert.equal(booking?.updated_by_id, session.user.id)
  assert.equal(booking?.updated_at, FIXED_DATE.toISOString())
})
