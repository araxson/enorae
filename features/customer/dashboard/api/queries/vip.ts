import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { getDateRanges } from '@/lib/utils/dates'

type UserRole = Database['public']['Views']['user_roles_view']['Row']
type AppointmentOverview = Database['public']['Views']['admin_appointments_overview_view']['Row']

const LOYALTY_THRESHOLDS: Array<{ min: number; tier: 'bronze' | 'silver' | 'gold' | 'platinum' }> = [
  { min: 5000, tier: 'platinum' },
  { min: 2000, tier: 'gold' },
  { min: 500, tier: 'silver' },
  { min: 0, tier: 'bronze' },
]

const LOYALTY_DIVISOR = 10

const defaultVipResponse = {
  isVIP: false,
  isGuest: false,
  loyaltyPoints: 0,
  loyaltyTier: null as 'bronze' | 'silver' | 'gold' | 'platinum' | null,
  lifetimeSpend: 0,
  monthlySpend: 0,
  memberSince: null as string | null,
}

export type CustomerVipStatus = typeof defaultVipResponse

export async function getVIPStatus() {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: roleData, error: roleError } = await supabase
    .from('user_roles_view')
    .select('*')
    .eq('user_id', session.user['id'])
    .maybeSingle<UserRole>()

  if (roleError) throw roleError

  if (!roleData || roleData['role'] === 'guest') {
    return { ...defaultVipResponse, isGuest: true }
  }

  if (roleData['role'] !== 'vip_customer') {
    return defaultVipResponse
  }

  const { month } = getDateRanges()

  const { data: appointments, error: appointmentsError } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, total_price, created_at')
    .eq('customer_id', session.user['id'])
    .eq('status', 'completed')

  if (appointmentsError) throw appointmentsError

  const uniqueAppointments = new Map<
    string,
    { total_price: number | null; created_at: string | null }
  >()

  for (const row of appointments || []) {
    const id = (row as AppointmentOverview)['id']
    if (!id || uniqueAppointments.has(id)) continue
    uniqueAppointments.set(id, {
      total_price: (row as AppointmentOverview)['total_price'],
      created_at: (row as AppointmentOverview)['created_at'],
    })
  }

  const records = Array.from(uniqueAppointments.values())

  const lifetimeSpend = records.reduce((sum, apt) => sum + (apt['total_price'] || 0), 0)
  const monthlySpend = records
    .filter((apt) => apt['created_at'] && apt['created_at'] >= month.start)
    .reduce((sum, apt) => sum + (apt['total_price'] || 0), 0)

  const loyaltyTier =
    LOYALTY_THRESHOLDS.find(({ min }) => lifetimeSpend >= min)?.tier ?? defaultVipResponse.loyaltyTier

  const loyaltyPoints = Math.floor(lifetimeSpend / LOYALTY_DIVISOR)
  const oldestAppointment = records[records.length - 1]

  return {
    isVIP: true,
    isGuest: false,
    loyaltyPoints,
    loyaltyTier,
    lifetimeSpend,
    monthlySpend,
    memberSince: oldestAppointment?.['created_at'] || null,
  }
}
