import { createClient } from '@/lib/supabase/client'

export async function getAnalyticsData(period: string = 'last30days') {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get user's salon
  const { data: staff } = await supabase
    .from('staff' as any)
    .select('salon_id')
    .eq('user_id', user.id)
    .single()

  const salonId = (staff as any)?.salon_id

  // Calculate date range
  const endDate = new Date()
  let startDate = new Date()

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'last7days':
      startDate.setDate(startDate.getDate() - 7)
      break
    case 'last30days':
      startDate.setDate(startDate.getDate() - 30)
      break
    case 'last90days':
      startDate.setDate(startDate.getDate() - 90)
      break
    case 'thisYear':
      startDate = new Date(startDate.getFullYear(), 0, 1)
      break
  }

  // Placeholder revenue data (no transactions table available yet)
  const totalRevenue = 0
  const revenueGrowth = 0

  // Fetch appointments
  const { data: appointments } = await supabase
    .from('appointments' as any)
    .select('id, status, customer_id, created_at')
    .eq('salon_id', salonId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  const totalAppointments = appointments?.length || 0
  const completedAppointments = (appointments as any)?.filter((a: any) => a.status === 'completed').length || 0
  const cancelledAppointments = (appointments as any)?.filter((a: any) => a.status === 'cancelled').length || 0

  // Get unique customers
  const uniqueCustomers = new Set((appointments as any)?.map((a: any) => a.customer_id))
  const newCustomers = uniqueCustomers.size
  const returningCustomers = (appointments as any)?.filter((a: any, i: number, arr: any[]) =>
    arr.findIndex((x: any) => x.customer_id === a.customer_id) !== i
  ).length || 0

  // Get top services
  const { data: serviceStats } = await supabase
    .from('appointment_services')
    .select(`
      service:service_id (
        name,
        price
      )
    `)
    .in('appointment_id', (appointments as any)?.map((a: any) => a.id) || [])

  const serviceRevenue: { [key: string]: { name: string, revenue: number, bookings: number } } = {}

  serviceStats?.forEach((stat: any) => {
    const name = stat.service?.name || 'Unknown'
    if (!serviceRevenue[name]) {
      serviceRevenue[name] = { name, revenue: 0, bookings: 0 }
    }
    serviceRevenue[name].revenue += stat.service?.price || 0
    serviceRevenue[name].bookings += 1
  })

  const topServices = Object.values(serviceRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Get staff performance
  const { data: staffStats } = await supabase
    .from('appointments')
    .select(`
      staff:staff_id (
        full_name
      ),
      status
    `)
    .eq('salon_id', salonId)
    .gte('created_at', startDate.toISOString())

  const staffPerformance: { [key: string]: any } = {}

  staffStats?.forEach((stat: any) => {
    const name = stat.staff?.full_name || 'Unknown'
    if (!staffPerformance[name]) {
      staffPerformance[name] = { name, appointments: 0, revenue: 0, rating: 4.5 }
    }
    staffPerformance[name].appointments += 1
    staffPerformance[name].revenue += 75 // Mock average service price
  })

  const topStaff = Object.values(staffPerformance).slice(0, 5)

  // Mock peak hours data
  const peakHours = [
    { time: '9:00 AM - 10:00 AM', appointments: 12 },
    { time: '10:00 AM - 11:00 AM', appointments: 18 },
    { time: '11:00 AM - 12:00 PM', appointments: 22 },
    { time: '2:00 PM - 3:00 PM', appointments: 20 },
    { time: '3:00 PM - 4:00 PM', appointments: 15 },
  ]

  return {
    revenue: {
      total: totalRevenue,
      growth: revenueGrowth,
    },
    appointments: {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
    },
    customers: {
      new: newCustomers,
      returning: returningCustomers,
    },
    rating: {
      average: 4.7,
      total: 234,
    },
    topServices,
    staffPerformance: topStaff,
    peakHours,
    retention: {
      rate: 78,
      avgVisits: 3.2,
      lifetimeValue: 450.00,
      referralRate: 23,
    },
  }
}