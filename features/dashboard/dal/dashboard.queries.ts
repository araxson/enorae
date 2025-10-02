import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Appointment = Database['public']['Views']['appointments']['Row']
type Salon = Database['public']['Views']['salons']['Row']

export async function getUserSalon() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (error) throw error
  return data as Salon
}

export async function getDashboardMetrics(salonId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get appointment counts by status
  const { data: appointmentsData, error: appointmentsError } = await supabase
    .from('appointments')
    .select('*')
    .eq('salon_id', salonId)

  if (appointmentsError) throw appointmentsError

  const appointments = (appointmentsData || []) as Array<{ status: string | null }>

  const totalAppointments = appointments.length
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length

  // Get total staff count
  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('id')
    .eq('salon_id', salonId)
    .eq('status', 'active')

  if (staffError) throw staffError

  const totalStaff = staff?.length || 0

  // Get total services count
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('id')
    .eq('salon_id', salonId)
    .eq('is_active', true)

  if (servicesError) throw servicesError

  const totalServices = services?.length || 0

  return {
    totalAppointments,
    confirmedAppointments,
    pendingAppointments,
    totalStaff,
    totalServices,
  }
}

export async function getRecentAppointments(salonId: string, limit: number = 5) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      customer:customer_id(id, full_name, email),
      staff:staff_id(id, full_name, title)
    `)
    .eq('salon_id', salonId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as any[]
}
