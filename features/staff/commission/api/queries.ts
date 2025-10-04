import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']

export type CommissionData = {
  todayEarnings: number
  weekEarnings: number
  monthEarnings: number
  totalAppointments: number
  avgPerAppointment: number
}

export async function getStaffCommission(staffId: string): Promise<CommissionData> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security check
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  // Get today's completed appointments
  const { data: todayAppts } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay)

  const todayEarnings =
    todayAppts?.reduce((sum, apt) => sum + ((apt as Appointment).total_price || 0), 0) || 0

  // Get this week's earnings
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString()
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)).toISOString()

  const { data: weekAppts } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', startOfWeek)
    .lte('start_time', endOfWeek)

  const weekEarnings =
    weekAppts?.reduce((sum, apt) => sum + ((apt as Appointment).total_price || 0), 0) || 0

  // Get this month's earnings
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()

  const { data: monthAppts } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', startOfMonth)
    .lte('start_time', endOfMonth)

  const monthEarnings =
    monthAppts?.reduce((sum, apt) => sum + ((apt as Appointment).total_price || 0), 0) || 0
  const totalAppointments = monthAppts?.length || 0
  const avgPerAppointment = totalAppointments > 0 ? monthEarnings / totalAppointments : 0

  return {
    todayEarnings,
    weekEarnings,
    monthEarnings,
    totalAppointments,
    avgPerAppointment,
  }
}
