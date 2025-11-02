import 'server-only'
import { requireAnyRole, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type Appointment = Database['public']['Views']['appointments_view']['Row']
type ManualTransaction = Database['public']['Views']['manual_transactions_view']['Row']
type Profile = Database['public']['Views']['profiles_view']['Row']

/**
 * Get customer insights and analytics
 */
export async function getCustomerInsights(salonId: string) {
  const logger = createOperationLogger('getCustomerInsights', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const supabase = await createClient()

  const [appointmentsResponse, paymentsResponse] = await Promise.all([
    supabase
      .from('appointments_view')
      .select('customer_id, created_at, status')
      .eq('salon_id', salonId)
      .eq('status', 'completed')
      .not('customer_id', 'is', null),
    supabase
      .from('manual_transactions_view')
      .select('customer_id, amount, transaction_type')
      .eq('salon_id', salonId)
      .eq('transaction_type', 'payment')
      .not('customer_id', 'is', null),
  ])

  if (appointmentsResponse.error) {
    console.error('[getCustomerInsights] Appointments error:', appointmentsResponse.error)
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

  if (paymentsResponse.error) {
    console.error('[getCustomerInsights] Payments error:', paymentsResponse.error)
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

  const appointments = (appointmentsResponse.data || []) as Appointment[]
  const payments = (paymentsResponse.data || []) as ManualTransaction[]

  const revenueByCustomer = new Map<string, number>()
  payments.forEach(payment => {
    if (!payment['customer_id']) return
    const amount = Number(payment['amount'] ?? 0)
    if (!amount) return
    revenueByCustomer.set(
      payment['customer_id'],
      (revenueByCustomer.get(payment['customer_id']) ?? 0) + amount
    )
  })

  // Calculate customer metrics
  const customerMap = new Map<string, {
    id: string
    name: string
    email?: string | null
    totalSpent: number
    visitCount: number
    firstVisit: string
  }>()

  appointments.forEach(apt => {
    if (!apt['customer_id']) return

    const existing = customerMap.get(apt['customer_id'])
    if (existing) {
      existing.visitCount++
      if (apt['created_at'] && apt['created_at'] < existing.firstVisit) {
        existing.firstVisit = apt['created_at']
      }
    } else {
      customerMap.set(apt['customer_id'], {
        id: apt['customer_id'],
        name: 'Unknown',
        email: undefined,
        totalSpent: 0,
        visitCount: 1,
        firstVisit: apt['created_at'] || new Date().toISOString(),
      })
    }
  })

  let totalRevenue = 0
  for (const [customerId, amount] of revenueByCustomer.entries()) {
    const entry = customerMap.get(customerId)
    if (!entry) continue
    entry.totalSpent += amount
    totalRevenue += amount
  }

  const customerIds = Array.from(customerMap.keys())
  const chunkSize = 500
  for (let i = 0; i < customerIds.length; i += chunkSize) {
    const slice = customerIds.slice(i, i + chunkSize)
    const { data, error } = await supabase
      .from('profiles_view')
      .select('id, full_name, email')
      .in('id', slice)

    if (error) {
      console.error('[getCustomerInsights] Profile fetch error:', error)
      break
    }

    ;((data ?? []) as Profile[]).forEach(profile => {
      if (!profile['id']) return
      const entry = customerMap.get(profile['id'])
      if (!entry) return
      entry.name = profile['full_name'] || entry.name
      entry.email = profile['email'] || entry.email
    })
  }

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
