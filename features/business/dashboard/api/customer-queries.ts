import 'server-only'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

/**
 * Get customer insights and analytics
 */
export async function getCustomerInsights(salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  // Get all completed appointments with customer info
  const { data, error } = await supabase
    .from('appointments')
    .select('customer_id, customer_name, customer_email, total_price, created_at')
    .eq('salon_id', salonId)
    .eq('status', 'completed')
    .not('customer_id', 'is', null)

  if (error) {
    console.error('[getCustomerInsights] Error:', error)
    return {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      retentionRate: 0,
      averageLifetimeValue: 0,
      averageOrderValue: 0,
      topCustomers: [],
    }
  }

  const appointments = (data || []) as Appointment[]

  // Calculate customer metrics
  const customerMap = new Map<string, {
    id: string
    name: string
    email?: string | null
    totalSpent: number
    visitCount: number
    firstVisit: string
  }>()

  let totalRevenue = 0

  appointments.forEach(apt => {
    if (!apt['customer_id']) return

    const revenue = Number(apt['total_price']) || 0
    totalRevenue += revenue

    const existing = customerMap.get(apt['customer_id'])
    if (existing) {
      existing.visitCount++
      existing.totalSpent += revenue
      // Update first visit if earlier
      if (apt['created_at'] && apt['created_at'] < existing.firstVisit) {
        existing.firstVisit = apt['created_at']
      }
    } else {
      customerMap.set(apt['customer_id'], {
        id: apt['customer_id'],
        name: apt['customer_name'] || 'Unknown',
        email: apt['customer_email'],
        totalSpent: revenue,
        visitCount: 1,
        firstVisit: apt['created_at'] || new Date().toISOString(),
      })
    }
  })

  const customers = Array.from(customerMap.values())
  const totalCustomers = customers.length
  const newCustomers = customers.filter(c => c.visitCount === 1).length
  const returningCustomers = customers.filter(c => c.visitCount > 1).length

  // Calculate retention rate
  const retentionRate = totalCustomers > 0
    ? (returningCustomers / totalCustomers) * 100
    : 0

  // Calculate average lifetime value
  const averageLifetimeValue = totalCustomers > 0
    ? totalRevenue / totalCustomers
    : 0

  // Calculate average order value
  const averageOrderValue = appointments.length > 0
    ? totalRevenue / appointments.length
    : 0

  // Get top 5 customers by total spent
  const topCustomers = customers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map(c => ({
      name: c['name'],
      email: c['email'] || undefined,
      totalSpent: c.totalSpent,
      visitCount: c.visitCount,
    }))

  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    retentionRate,
    averageLifetimeValue,
    averageOrderValue,
    topCustomers,
  }
}
