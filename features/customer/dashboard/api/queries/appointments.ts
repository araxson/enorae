import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

const UPCOMING_LIMIT = 5
const PAST_LIMIT = 5

type AppointmentStatus = Database['public']['Enums']['appointment_status']
type AppointmentOverviewRow = Database['public']['Views']['admin_appointments_overview_view']['Row']

export type DashboardAppointment = {
  id: string
  salon_name: string | null
  start_time: string | null
  end_time: string | null
  status: AppointmentStatus | null
  service_names: string | null
}

function reduceAppointments(rows: AppointmentOverviewRow[]) {
  const grouped = new Map<string, DashboardAppointment>()

  for (const row of rows) {
    const id = row['id']
    if (!id) continue

    if (!grouped.has(id)) {
      grouped.set(id, {
        id,
        salon_name: row['salon_name'] ?? null,
        start_time: row['start_time'] ?? null,
        end_time: row['end_time'] ?? null,
        status: (row['status'] as AppointmentStatus | null) ?? null,
        service_names: row['service_name'] ?? null,
      })
    } else if (row['service_name']) {
      const existing = grouped.get(id)
      if (!existing) continue
      const existingNames = existing.service_names
      const names = existingNames ? existingNames.split(', ') : []
      if (!names.includes(row['service_name']!)) {
        names.push(row['service_name']!)
        existing.service_names = names.join(', ')
      }
    }
  }

  return Array.from(grouped.values())
}

function sortAppointments(
  appointments: DashboardAppointment[],
  direction: 'asc' | 'desc'
) {
  return appointments.sort((a, b) => {
    const aTime = a.start_time ? Date.parse(a.start_time) : 0
    const bTime = b.start_time ? Date.parse(b.start_time) : 0
    return direction === 'asc' ? aTime - bTime : bTime - aTime
  })
}

export async function getUpcomingAppointments(): Promise<DashboardAppointment[]> {
  const session = await requireAuth()
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_name, start_time, end_time, status, service_name')
    .eq('customer_id', session.user.id)
    .gte('start_time', now)
    .order('start_time', { ascending: true })

  if (error) throw error

  const grouped = reduceAppointments(data || [])
  return sortAppointments(grouped, 'asc').slice(0, UPCOMING_LIMIT)
}

export async function getPastAppointments(): Promise<DashboardAppointment[]> {
  const session = await requireAuth()
  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('id, salon_name, start_time, end_time, status, service_name')
    .eq('customer_id', session.user.id)
    .lt('start_time', now)
    .order('start_time', { ascending: false })

  if (error) throw error

  const grouped = reduceAppointments(data || [])
  return sortAppointments(grouped, 'desc').slice(0, PAST_LIMIT)
}
