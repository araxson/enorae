'use server'
import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

interface AppointmentStats {
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  revenue_total: number
  average_ticket: number
}

type AppointmentOverviewRow = Database['public']['Views']['admin_appointments_overview']['Row']

export async function getAppointmentStats(
  salonId: string,
  startDate: string,
  endDate: string
): Promise<AppointmentStats | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('admin_appointments_overview')
    .select('status, start_time, id')
    .eq('salon_id', salonId)
    .gte('start_time', startDate)
    .lte('start_time', endDate)
    .returns<Array<Pick<AppointmentOverviewRow, 'status' | 'start_time' | 'id'>>>()

  if (error) throw error
  if (!data) return null

  const total = data.length
  const completed = data.filter((row) => row.status === 'completed').length
  const cancelled = data.filter((row) => row.status === 'cancelled').length
  const noShow = data.filter((row) => row.status === 'no_show').length

  return {
    total_appointments: total,
    completed_appointments: completed,
    cancelled_appointments: cancelled,
    no_show_appointments: noShow,
    revenue_total: 0,
    average_ticket: 0,
  }
}
