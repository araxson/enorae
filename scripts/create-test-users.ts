/**
 * Script to create test users via Supabase Admin API
 *
 * This ensures passwords are hashed correctly by Supabase Auth
 * Run with: pnpm tsx scripts/create-test-users.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const TEST_PASSWORD = 'TestPassword123!' // Change this to your desired password

const testUsers = [
  { email: 'superadmin@test.com', role: 'super_admin' as const },
  { email: 'platformadmin@test.com', role: 'platform_admin' as const },
  { email: 'tenantowner@test.com', role: 'tenant_owner' as const },
  { email: 'salonowner@test.com', role: 'salon_owner' as const },
  { email: 'salonmanager@test.com', role: 'salon_manager' as const },
  { email: 'seniorstaff@test.com', role: 'senior_staff' as const },
  { email: 'staff@test.com', role: 'staff' as const },
  { email: 'juniorstaff@test.com', role: 'junior_staff' as const },
  { email: 'vipcustomer@test.com', role: 'vip_customer' as const },
  { email: 'customer@test.com', role: 'customer' as const },
  { email: 'guest@test.com', role: 'guest' as const },
]

async function createTestUsers() {
  console.log('🚀 Creating test users...\n')

  for (const user of testUsers) {
    console.log(`Creating ${user.email} (${user.role})...`)

    try {
      // Create user via Admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: TEST_PASSWORD,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          role: user.role,
        },
      })

      if (error) {
        console.error(`  ❌ Error: ${error.message}`)
        continue
      }

      if (!data.user) {
        console.error(`  ❌ No user returned`)
        continue
      }

      console.log(`  ✅ User created: ${data.user.id}`)

      // Wait a bit to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (err) {
      console.error(`  ❌ Exception:`, err)
    }
  }

  console.log('\n✅ Done! All test users created.')
  console.log(`\n🔐 Password for all accounts: ${TEST_PASSWORD}`)
  console.log('\n⚠️  IMPORTANT: Store this password securely!')
}

createTestUsers().catch(console.error)
