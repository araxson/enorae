/**
 * Create Simple Test Accounts for All Roles
 *
 * Creates test accounts with simple email/password:
 * - Email: {simple-name}@test.com
 * - Password: password
 * - Roles: All 11 roles in the system
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface TestAccount {
  email: string
  password: string
  fullName: string
  role: string
}

const testAccounts: TestAccount[] = [
  { email: 'admin@test.com', password: 'password', fullName: 'Super Admin', role: 'super_admin' },
  { email: 'platform@test.com', password: 'password', fullName: 'Platform Admin', role: 'platform_admin' },
  { email: 'tenant@test.com', password: 'password', fullName: 'Tenant Owner', role: 'tenant_owner' },
  { email: 'owner@test.com', password: 'password', fullName: 'Salon Owner', role: 'salon_owner' },
  { email: 'manager@test.com', password: 'password', fullName: 'Salon Manager', role: 'salon_manager' },
  { email: 'senior@test.com', password: 'password', fullName: 'Senior Staff', role: 'senior_staff' },
  { email: 'staff@test.com', password: 'password', fullName: 'Staff Member', role: 'staff' },
  { email: 'junior@test.com', password: 'password', fullName: 'Junior Staff', role: 'junior_staff' },
  { email: 'vip@test.com', password: 'password', fullName: 'VIP Customer', role: 'vip_customer' },
  { email: 'customer@test.com', password: 'password', fullName: 'Regular Customer', role: 'customer' },
  { email: 'guest@test.com', password: 'password', fullName: 'Guest User', role: 'guest' },
]

async function createTestAccounts() {
  console.log('🚀 Creating test accounts...\n')

  const results = []

  for (const account of testAccounts) {
    try {
      // Create user with admin API (bypasses email confirmation)
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: account.fullName,
        },
      })

      if (error) {
        console.error(`❌ Failed to create ${account.email}:`, error.message)
        results.push({ ...account, success: false, error: error.message })
        continue
      }

      console.log(`✅ Created: ${account.email}`)

      // Update role if not customer (customer is default from trigger)
      if (account.role !== 'customer') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: account.role })
          .eq('user_id', data.user.id)

        if (roleError) {
          console.error(`  ⚠️  Failed to update role for ${account.email}:`, roleError.message)
          results.push({ ...account, success: true, roleUpdated: false })
        } else {
          console.log(`  → Role set to: ${account.role}`)
          results.push({ ...account, success: true, roleUpdated: true })
        }
      } else {
        results.push({ ...account, success: true, roleUpdated: true })
      }

    } catch (err) {
      console.error(`❌ Unexpected error for ${account.email}:`, err)
      results.push({ ...account, success: false, error: String(err) })
    }
  }

  // Summary
  console.log('\n📊 Summary:')
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  console.log(`✅ Successful: ${successful}/${testAccounts.length}`)
  console.log(`❌ Failed: ${failed}/${testAccounts.length}`)

  if (successful === testAccounts.length) {
    console.log('\n🎉 All test accounts created successfully!')
  }

  // Display credentials
  console.log('\n📝 Test Account Credentials:')
  console.log('════════════════════════════════════════════════')
  testAccounts.forEach(account => {
    console.log(`${account.email.padEnd(20)} | password | ${account.role}`)
  })
  console.log('════════════════════════════════════════════════')
}

createTestAccounts()
  .then(() => {
    console.log('\n✨ Script completed')
    process.exit(0)
  })
  .catch((err) => {
    console.error('\n💥 Script failed:', err)
    process.exit(1)
  })
