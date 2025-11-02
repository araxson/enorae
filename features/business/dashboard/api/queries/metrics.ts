import 'server-only'

import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { getUserSalonIds } from './salon'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability/logger'

type AppointmentWithDetails = Database['public']['Views']['appointments_view']['Row']
type AppointmentRow = Database['public']['Views']['appointments_view']['Row']
type ManualTransaction = Database['public']['Views']['manual_transactions_view']['Row']
type DailyMetricRow = Database['public']['Views']['daily_metrics_view']['Row']
type StaffRow = Database['public']['Views']['staff_enriched_view']['Row']
type ServiceRow = Database['public']['Views']['services_view']['Row']

const getSupabaseClient = () => createClient()

export async function getDashboardMetrics(salonId: string) {
  const logger = createOperationLogger('getDashboardMetrics', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized salon access')
  }

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
      console.error('[getDashboardMetrics] Appointments error:', appointmentsResult.error)
    }
    if (staffResult.error) {
      console.error('[getDashboardMetrics] Staff error:', staffResult.error)
    }
    if (servicesResult.error) {
      console.error('[getDashboardMetrics] Services error:', servicesResult.error)
    }
    if (revenueResult.error) {
      console.error('[getDashboardMetrics] Revenue error:', revenueResult.error)
    }
    if (paymentsResult.error) {
      console.error('[getDashboardMetrics] Payments error:', paymentsResult.error)
    }

    const appointments = (appointmentsResult.data || []) as AppointmentRow[]
    const totalAppointments = appointments.length
    const confirmedAppointments = appointments.filter((appointment) => appointment.status === 'confirmed').length
    const pendingAppointments = appointments.filter((appointment) => appointment.status === 'pending').length
    const dailyMetrics = (revenueResult.data || []) as DailyMetricRow[]
    const last30DaysRevenue = dailyMetrics.reduce((sum, metric) => sum + (metric.total_revenue || 0), 0)

    const payments = (paymentsResult.data || []) as ManualTransaction[]
    const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0)

    return {
      totalAppointments,
      confirmedAppointments,
      pendingAppointments,
      totalStaff: staffResult.data?.length || 0,
      totalServices: servicesResult.data?.length || 0,
      totalRevenue,
      last30DaysRevenue,
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
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
  const logger = createOperationLogger('getMultiLocationMetrics', {})
  logger.start()

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonIds = await getUserSalonIds()
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
      console.error('[getMultiLocationMetrics] Appointments error:', appointmentsResult.error)
    }
    if (staffResult.error) {
      console.error('[getMultiLocationMetrics] Staff error:', staffResult.error)
    }
    if (servicesResult.error) {
      console.error('[getMultiLocationMetrics] Services error:', servicesResult.error)
    }

    const appointments = (appointmentsResult.data || []) as AppointmentRow[]

    return {
      totalLocations: salonIds.length,
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter((appointment) => appointment.status === 'confirmed').length,
      pendingAppointments: appointments.filter((appointment) => appointment.status === 'pending').length,
      totalStaff: staffResult.data?.length || 0,
      totalServices: servicesResult.data?.length || 0,
    }
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system')
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
