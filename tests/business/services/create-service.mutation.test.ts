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

const { createService } = await import('@/features/business/services/api/mutations/create-service.mutation')

const FIXED_DATE = new Date('2025-01-15T10:00:00.000Z')

test('createService inserts service, pricing, and booking rule records', async () => {
  const supabaseStub = createSupabaseClientStub({
    state: {
      services: [
        {
          id: 'svc-existing',
          salon_id: 'salon-123',
          slug: 'classic-cut',
          name: 'Classic Cut',
        },
      ],
      service_pricing: [],
      service_booking_rules: [],
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

  const service = await createService(
    'salon-123',
    {
      name: 'Classic Cut',
      description: 'Gentlemen haircut',
      category_id: undefined,
      is_active: true,
      is_bookable: true,
      is_featured: false,
    },
    {
      base_price: 100,
      sale_price: 80,
      currency_code: 'USD',
      is_taxable: true,
      commission_rate: 10,
      tax_rate: 5,
      cost: 30,
    },
    {
      duration_minutes: 60,
      buffer_minutes: 15,
      min_advance_booking_hours: 2,
      max_advance_booking_days: 30,
    },
    {
      supabase: supabaseStub.client as unknown as SupabaseServerClient,
      session,
      now: () => FIXED_DATE,
      skipAccessCheck: true,
    },
  )

  assert.ok(service)
  assert.equal(service.id.startsWith('services_'), true)

  const servicesTable = supabaseStub.state.services
  const insertedService = servicesTable.find((row) => row.id === service.id)
  assert.ok(insertedService)
  assert.equal(insertedService?.slug, 'classic-cut-2')
  assert.equal(insertedService?.created_by_id, session.user.id)
  assert.equal(insertedService?.updated_by_id, session.user.id)
  assert.equal(insertedService?.created_at, FIXED_DATE.toISOString())
  assert.equal(insertedService?.updated_at, FIXED_DATE.toISOString())

  const pricingTable = supabaseStub.state.service_pricing
  const pricing = pricingTable.find((row) => row.service_id === service.id)
  assert.ok(pricing)
  assert.equal(pricing?.base_price, 100)
  assert.equal(pricing?.sale_price, 80)
  assert.equal(pricing?.current_price, 80)
  assert.equal(pricing?.profit_margin, 62.5)
  assert.equal(pricing?.created_by_id, session.user.id)
  assert.equal(pricing?.updated_by_id, session.user.id)

  const rulesTable = supabaseStub.state.service_booking_rules
  const rules = rulesTable.find((row) => row.service_id === service.id)
  assert.ok(rules)
  assert.equal(rules?.duration_minutes, 60)
  assert.equal(rules?.buffer_minutes, 15)
  assert.equal(rules?.total_duration_minutes, 75)
  assert.equal(rules?.created_by_id, session.user.id)
  assert.equal(rules?.updated_by_id, session.user.id)
})
