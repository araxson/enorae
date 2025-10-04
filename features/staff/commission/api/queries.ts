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

export type DailyEarnings = {
  date: string
  earnings: number
  appointments: number
}

export type ServiceRevenue = {
  service_name: string
  revenue: number
  count: number
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

export async function getDailyEarnings(staffId: string, days: number = 30): Promise<DailyEarnings[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', startDate.toISOString())
    .order('start_time', { ascending: true })

  const dailyMap = new Map<string, DailyEarnings>()

  appointments?.forEach((apt) => {
    const appointment = apt as Appointment
    if (!appointment.start_time) return

    const date = new Date(appointment.start_time).toISOString().split('T')[0]
    const existing = dailyMap.get(date)

    if (existing) {
      existing.earnings += appointment.total_price || 0
      existing.appointments += 1
    } else {
      dailyMap.set(date, {
        date,
        earnings: appointment.total_price || 0,
        appointments: 1,
      })
    }
  })

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getServiceBreakdown(
  staffId: string,
  dateFrom: string,
  dateTo: string
): Promise<ServiceRevenue[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .eq('status', 'completed')
    .gte('start_time', dateFrom)
    .lte('start_time', dateTo)

  const serviceMap = new Map<string, ServiceRevenue>()

  appointments?.forEach((apt) => {
    const appointment = apt as Appointment
    const serviceName = appointment.service_names || 'Unknown Service'

    const existing = serviceMap.get(serviceName)
    if (existing) {
      existing.revenue += appointment.total_price || 0
      existing.count += 1
    } else {
      serviceMap.set(serviceName, {
        service_name: serviceName,
        revenue: appointment.total_price || 0,
        count: 1,
      })
    }
  })

  return Array.from(serviceMap.values()).sort((a, b) => b.revenue - a.revenue)
}
