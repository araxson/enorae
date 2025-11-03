import 'server-only'

import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { getUserSalonIds } from './salon'
import type { Database } from '@/lib/types/database.types'
import { logQuery } from '@/lib/observability/query-logger'

type AppointmentWithDetails = Database['public']['Views']['appointments_view']['Row']
type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
type ManualTransaction = Database['public']['Views']['manual_transactions_view']['Row']
type DailyMetricRow = Database['public']['Views']['daily_metrics_view']['Row']
type StaffRow = Database['public']['Views']['staff_enriched_view']['Row']
type ServiceRow = Database['public']['Views']['services_view']['Row']

const getSupabaseClient = () => createClient()

export async function getDashboardMetrics(salonId: string) {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

  const logger = logQuery('getDashboardMetrics', { salonId })
  const supabase = await getSupabaseClient()

  try {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const [appointmentsResult, staffResult, servicesResult, revenueResult, paymentsResult] = await Promise.all([
      supabase.from('appointments_view').select('status').eq('salon_id', salonId),
      supabase.from('staff_enriched_view').select('id').eq('salon_id', salonId).eq('is_active', true),
      supabase.from('services_view').select('id').eq('salon_id', salonId).eq('is_active', true),
      supabase
        .from('daily_metrics_view')
        .select('total_revenue, metric_at')
        .eq('salon_id', salonId)
        .gte('metric_at', thirtyDaysAgo.toISOString().split('T')[0])
        .order('metric_at', { ascending: false }),
      supabase
        .from('manual_transactions_view')
        .select('amount, transaction_type')
        .eq('salon_id', salonId)
        .in('transaction_type', ['service_payment', 'product_sale', 'tip', 'fee', 'other']),
    ])

    if (appointmentsResult.error) {
      logger.error(appointmentsResult.error, 'database', { query: 'appointments' })
    }
    if (staffResult.error) {
      logger.error(staffResult.error, 'database', { query: 'staff' })
    }
    if (servicesResult.error) {
      logger.error(servicesResult.error, 'database', { query: 'services' })
    }
    if (revenueResult.error) {
      logger.error(revenueResult.error, 'database', { query: 'revenue' })
    }
    if (paymentsResult.error) {
      logger.error(paymentsResult.error, 'database', { query: 'payments' })
    }

    const appointments = (appointmentsResult.data || []) as AppointmentRow[]
    const totalAppointments = appointments.length
    const confirmedAppointments = appointments.filter((appointment) => appointment.status === 'confirmed').length
    const pendingAppointments = appointments.filter((appointment) => appointment.status === 'pending').length
    const dailyMetrics = (revenueResult.data || []) as DailyMetricRow[]
    const last30DaysRevenue = dailyMetrics.reduce((sum, metric) => sum + (metric.total_revenue || 0), 0)

    const payments = (paymentsResult.data || []) as ManualTransaction[]
    const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0)

    const metrics = {
      totalAppointments,
      confirmedAppointments,
      pendingAppointments,
      totalStaff: staffResult.data?.length || 0,
      totalServices: servicesResult.data?.length || 0,
      totalRevenue,
      last30DaysRevenue,
    }

    logger.success(metrics)
    return metrics
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'system')

    // Return default metrics on fatal error
    return {
      totalAppointments: 0,
      confirmedAppointments: 0,
      pendingAppointments: 0,
      totalStaff: 0,
      totalServices: 0,
      totalRevenue: 0,
      last30DaysRevenue: 0,
    }
  }
}

export async function getBusinessDashboardData() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  const supabase = await getSupabaseClient()

  const [salonResult, appointmentsData, staff, services, recentAppointments] = await Promise.all([
    supabase.from('salons_view').select('*').eq('id', salonId).single(),
    supabase.from('appointments_view').select('status').eq('salon_id', salonId),
    supabase.from('staff_enriched_view').select('id').eq('salon_id', salonId).eq('is_active', true),
    supabase.from('services_view').select('id').eq('salon_id', salonId).eq('is_active', true),
    supabase
      .from('appointments_view')
      .select('*')
      .eq('salon_id', salonId)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  if (salonResult.error) throw salonResult.error
  if (appointmentsData.error) throw appointmentsData.error
  if (staff.error) throw staff.error
  if (services.error) throw services.error
  if (recentAppointments.error) throw recentAppointments.error

  const appointments = (appointmentsData.data || []) as Array<{ status: string | null }>

  return {
    salon: salonResult.data,
    metrics: {
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter((appointment) => appointment.status === 'confirmed').length,
      pendingAppointments: appointments.filter((appointment) => appointment.status === 'pending').length,
      totalStaff: staff.data?.length || 0,
      totalServices: services.data?.length || 0,
    },
    recentAppointments: (recentAppointments.data || []) as AppointmentWithDetails[],
  }
}

export async function getMultiLocationMetrics() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonIds = await getUserSalonIds()
  const logger = logQuery('getMultiLocationMetrics', { locationCount: salonIds?.length ?? 0 })
  const supabase = await getSupabaseClient()

  try {
    if (!salonIds || salonIds.length === 0) {
      return {
        totalLocations: 0,
        totalAppointments: 0,
        confirmedAppointments: 0,
        pendingAppointments: 0,
        totalStaff: 0,
        totalServices: 0,
      }
    }

    const [appointmentsResult, staffResult, servicesResult] = await Promise.all([
      supabase.from('appointments_view').select('status, salon_id').in('salon_id', salonIds),
      supabase.from('staff_enriched_view').select('id, salon_id').in('salon_id', salonIds).eq('is_active', true),
      supabase.from('services_view').select('id, salon_id').in('salon_id', salonIds).eq('is_active', true),
    ])

    if (appointmentsResult.error) {
      logger.error(appointmentsResult.error, 'database', { query: 'appointments' })
    }
    if (staffResult.error) {
      logger.error(staffResult.error, 'database', { query: 'staff' })
    }
    if (servicesResult.error) {
      logger.error(servicesResult.error, 'database', { query: 'services' })
    }

    const appointments = (appointmentsResult.data || []) as AppointmentRow[]

    const metrics = {
      totalLocations: salonIds.length,
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter((appointment) => appointment.status === 'confirmed').length,
      pendingAppointments: appointments.filter((appointment) => appointment.status === 'pending').length,
      totalStaff: staffResult.data?.length || 0,
      totalServices: servicesResult.data?.length || 0,
    }

    logger.success(metrics)
    return metrics
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'system')

    // Return default metrics on fatal error
    return {
      totalLocations: 0,
      totalAppointments: 0,
      confirmedAppointments: 0,
      pendingAppointments: 0,
      totalStaff: 0,
      totalServices: 0,
    }
  }
}
