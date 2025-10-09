import 'server-only'
import { createClient } from '@/lib/supabase/server'

export interface ServicePerformance {
  service_id: string
  service_name: string
  total_bookings: number
  total_revenue: number
  avg_rating: number
  cancellation_rate: number
  popularity_score: number
}

export async function getServicePerformance(salonId: string, dateFrom?: string, dateTo?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('get_service_performance', {
      p_salon_id: salonId,
      p_start_date: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      p_end_date: dateTo || new Date().toISOString(),
    })

  if (error) throw error
  return data as ServicePerformance[]
}

export async function refreshServicePerformance(serviceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .rpc('refresh_service_performance', {
      p_service_id: serviceId,
    })

  if (error) throw error
  return data
}

export async function getTrendingServices(salonId: string, limit = 5) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      name,
      price,
      duration_minutes,
      is_active,
      appointments:appointments(count)
    `)
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getServiceRevenue(salonId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select('service_id, total_price, status')
    .eq('salon_id', salonId)
    .in('status', ['completed', 'confirmed'])

  if (error) throw error

  // Aggregate revenue by service
  const revenueByService = (data || []).reduce((acc: Record<string, number>, appointment) => {
    const serviceId = appointment.service_id
    if (serviceId) {
      acc[serviceId] = (acc[serviceId] || 0) + (appointment.total_price || 0)
    }
    return acc
  }, {})

  return revenueByService
}
