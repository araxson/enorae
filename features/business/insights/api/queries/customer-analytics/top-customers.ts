import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability/logger'

type AppointmentSummary = {
  id: string
  customer_id: string
}

type ProfileSummary = {
  id: string
  full_name: string | null
  email?: string | null
}

type PaymentRecord = {
  customer_id: string | null
  amount: number | null
  transaction_type: string | null
}

/**
 * Get top customers by value
 */
export async function getTopCustomers(limit: number = 10) {
  const logger = createOperationLogger('getTopCustomers', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // Get appointment counts and revenue per customer
  const { data: appointments, error } = await supabase
    .from('appointments_view')
    .select('customer_id, id')
    .eq('salon_id', salonId)
    .eq('status', 'completed')

  if (error) throw error

  const appointmentRows = (appointments ?? []) as AppointmentSummary[]

  const { data: payments, error: paymentsError } = await supabase
    .from('manual_transactions_view')
    .select('customer_id, amount, transaction_type')
    .eq('salon_id', salonId)
    .eq('transaction_type', 'payment')

  if (paymentsError) throw paymentsError

  const revenueByCustomer = new Map<string, number>()
  ;((payments ?? []) as PaymentRecord[]).forEach((payment) => {
    if (!payment.customer_id) return
    const amount = Number(payment.amount ?? 0)
    if (!amount) return
    revenueByCustomer.set(
      payment.customer_id,
      (revenueByCustomer.get(payment.customer_id) ?? 0) + amount
    )
  })

  if (appointmentRows.length === 0) {
    return []
  }

  // Count visits and calculate revenue per customer
  const customerData = new Map<string, { visitCount: number; totalRevenue: number }>()
  for (const apt of appointmentRows) {
    const data = customerData.get(apt.customer_id) || { visitCount: 0, totalRevenue: 0 }
    data.visitCount++
    customerData.set(apt.customer_id, data)
  }

  for (const [customerId, amount] of revenueByCustomer.entries()) {
    const data = customerData.get(customerId) || { visitCount: 0, totalRevenue: 0 }
    data.totalRevenue += amount
    customerData.set(customerId, data)
  }

  // Sort by visit count
  const topCustomerIds = Array.from(customerData.entries())
    .sort((a, b) => b[1].visitCount - a[1].visitCount)
    .slice(0, limit)
    .map(([customerId, data]) => ({
      customerId,
      visitCount: data.visitCount,
      totalRevenue: data.totalRevenue,
    }))

  // Get customer details
  const { data: profiles, error: profileError } = await supabase
    .from('profiles_view')
    .select('id, full_name, email')
    .in(
      'id',
      topCustomerIds.map((c) => c.customerId)
    )

  if (profileError) throw profileError

  const profileRows = (profiles ?? []) as Array<ProfileSummary>

  // Combine data
  return topCustomerIds
    .map((item) => {
      const profile = profileRows.find((p) => p.id === item.customerId)
      return {
        id: item.customerId,
        name: profile?.full_name || 'Unknown',
        email: profile?.email || '',
        visitCount: item.visitCount,
        estimatedValue: item.totalRevenue,
      }
    })
    .filter((c) => c.name !== 'Unknown')
}
