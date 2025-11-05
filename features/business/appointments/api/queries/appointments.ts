'use server'

import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS, canAccessSalon } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { logQuery } from '@/lib/observability/query-logger'

type Appointment = Database['public']['Views']['appointments_view']['Row']

export type AppointmentWithDetails = Appointment

export async function getAppointments(salonId: string) {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const logger = logQuery('getAppointments', { salonId, userId: session.user.id })

  if (!(await canAccessSalon(salonId))) {
    logger.error(new Error('Unauthorized access attempt'), 'permission')
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('id, salon_id, customer_id, staff_id, service_id, start_time, end_time, status, price, created_at, updated_at')
    .eq('salon_id', salonId)
    .order('start_time', { ascending: false })

  if (error) {
    logger.error(error, 'database')
    throw error
  }

  logger.success({ count: data?.length ?? 0 })
  return data as unknown as AppointmentWithDetails[]
}

export async function getAppointmentsByStatus(salonId: string, status: string) {
  const session = await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const logger = logQuery('getAppointmentsByStatus', { salonId, status, userId: session.user.id })

  if (!(await canAccessSalon(salonId))) {
    logger.error(new Error('Unauthorized access attempt'), 'permission')
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('appointments_view')
    .select('id, salon_id, customer_id, staff_id, service_id, start_time, end_time, status, price, created_at, updated_at')
    .eq('salon_id', salonId)
    .eq('status', status as 'draft' | 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled')
    .order('start_time', { ascending: false })

  if (error) {
    logger.error(error, 'database')
    throw error
  }

  logger.success({ count: data?.length ?? 0 })
  return data as unknown as AppointmentWithDetails[]
}
