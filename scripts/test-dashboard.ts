/**
 * Dashboard Diagnostic Script
 *
 * Run with: npx tsx scripts/test-dashboard.ts
 *
 * Tests all dashboard queries to identify issues
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function testDashboardQueries() {
  console.log('🔍 Testing Dashboard Queries...\n')

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  // Test 1: Check views exist
  console.log('1️⃣ Testing view access...')
  try {
    const { data: salons, error } = await supabase
      .from('salons')
      .select('id, name')
      .limit(1)

    if (error) throw error
    console.log(`✅ Salons view accessible (found ${salons?.length || 0} salons)\n`)
  } catch (error) {
    console.error('❌ Salons view error:', error)
  }

  // Test 2: Check appointments view
  console.log('2️⃣ Testing appointments view...')
  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .limit(1)

    if (error) throw error
    console.log(`✅ Appointments view accessible (found ${appointments?.length || 0} appointments)`)
    if (appointments && appointments.length > 0) {
      console.log('   Sample columns:', Object.keys(appointments[0]).slice(0, 5).join(', '))
    }
    console.log()
  } catch (error) {
    console.error('❌ Appointments view error:', error)
  }

  // Test 3: Check staff view
  console.log('3️⃣ Testing staff view...')
  try {
    const { data: staff, error } = await supabase
      .from('staff')
      .select('*')
      .limit(1)

    if (error) throw error
    console.log(`✅ Staff view accessible (found ${staff?.length || 0} staff members)`)
    if (staff && staff.length > 0) {
      console.log('   Sample columns:', Object.keys(staff[0]).slice(0, 5).join(', '))
    }
    console.log()
  } catch (error) {
    console.error('❌ Staff view error:', error)
  }

  // Test 4: Check services view
  console.log('4️⃣ Testing services view...')
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .limit(1)

    if (error) throw error
    console.log(`✅ Services view accessible (found ${services?.length || 0} services)\n`)
  } catch (error) {
    console.error('❌ Services view error:', error)
  }

  // Test 5: Check get_user_salons function
  console.log('5️⃣ Testing get_user_salons function...')
  try {
    const { data, error } = await supabase.rpc('get_user_salons')

    if (error) throw error
    console.log(`✅ get_user_salons function accessible`)
    console.log(`   Returns: ${data || '[]'}\n`)
  } catch (error) {
    console.error('❌ get_user_salons error:', error)
  }

  console.log('✨ Diagnostic complete!')
}

testDashboardQueries().catch(console.error)
