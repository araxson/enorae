#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js'

const REQUIRED_ENV = ['SUPABASE_SERVICE_ROLE_KEY'] as const

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing ${key} in environment. Ensure it is defined before running.`)
    process.exit(1)
  }
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in environment.')
  process.exit(1)
}

const supabase = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  },
)

async function main() {
  const salonId = process.argv[2]
  if (!salonId) {
    console.error('Usage: tsx scripts/repro/business-services.ts <salon-id>')
    process.exit(1)
  }

  console.log(`Fetching services for salon ${salonId}`)

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .limit(5)

  if (error) {
    console.error('Supabase error:', error)
    process.exit(1)
  }

  if (!services?.length) {
    console.warn('No services found. Check the salon id or seed test data.')
    return
  }

  console.table(
    services.map(({ id, name, price, sale_price, current_price, duration_minutes }) => ({
      id,
      name,
      price,
      sale_price,
      current_price,
      duration_minutes,
    })),
  )
}

main().catch((error) => {
  console.error('Unexpected failure:', error)
  process.exit(1)
})
