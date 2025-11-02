import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'
import { objectEntries } from '@/lib/utils/typed-object'

type Appointment = Database['public']['Views']['admin_appointments_overview_view']['Row']

export interface CustomerMetrics {
  totalSpending: number
  totalAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  favoriteServices: { service: string; count: number }[]
  recentActivity: Appointment[]
}

/**
 * Get customer analytics metrics
 */
export async function getCustomerMetrics(): Promise<CustomerMetrics> {
  const logger = createOperationLogger('getCustomerMetrics', {})
  logger.start()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get all appointments
  const { data: appointments, error: appointmentsError } = await supabase
    .from('admin_appointments_overview_view')
    .select('*')
    .eq('customer_id', user.id)
    .order('start_time', { ascending: false })
    .returns<Appointment[]>()

  if (appointmentsError) throw appointmentsError

  // Calculate metrics
  const totalAppointments = appointments?.length ?? 0
  const completedAppointments = appointments?.filter((a) => a.status === 'completed').length ?? 0
  const cancelledAppointments = appointments?.filter((a) => a.status === 'cancelled').length ?? 0

  // Calculate total spending from appointment prices
  const totalSpending =
    appointments?.reduce((sum, apt) => {
      const price = typeof apt.total_price === 'number' ? apt.total_price : 0
      return sum + price
    }, 0) ?? 0

  // Get favorite services (most frequently booked)
  const serviceCounts: Record<string, number> = {}
  appointments?.forEach((apt) => {
    const serviceName = apt.service_name
    if (serviceName) {
      serviceCounts[serviceName] = (serviceCounts[serviceName] ?? 0) + 1
    }
  })

  const favoriteServices = objectEntries(serviceCounts)
    .map(([service, count]) => ({ service, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Get recent activity (last 10 appointments)
  const recentActivity = (appointments?.slice(0, 10) || []) as Appointment[]

  return {
    totalSpending,
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    favoriteServices,
    recentActivity,
  }
}

/**
 * Get appointment frequency metrics
 */
export async function getAppointmentFrequency(): Promise<{ month: string; count: number }[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: appointments, error } = await supabase
    .from('admin_appointments_overview_view')
    .select('*')
    .eq('customer_id', user.id)
    .gte('start_time', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
    .returns<Appointment[]>()

  if (error) throw error

  // Group by month
  const monthCounts: Record<string, number> = {}
  appointments?.forEach(apt => {
    if (apt['start_time']) {
      const date = new Date(apt['start_time'])
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
    }
  })

  return objectEntries(monthCounts)
    .map(([month, count]) => ({ month, count: count as number }))
    .sort((a, b) => a.month.localeCompare(b.month))
}
