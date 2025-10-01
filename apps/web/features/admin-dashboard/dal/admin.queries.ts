import { createClient } from '@/lib/supabase/client'

export async function getAdminStats() {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if user is admin
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['super_admin', 'platform_admin'])
    .single()

  if (!userRole) throw new Error('Admin access required')

  // Get current date info
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const today = new Date().toISOString().split('T')[0]

  // Get active salon IDs first
  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select('salon_id')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  const activeSalonIds: string[] = recentAppointments
    ? [...new Set(recentAppointments.map((a: any) => a.salon_id).filter(Boolean))]
    : []

  // Fetch all stats in parallel
  const [
    { count: totalUsers },
    { count: newUsersThisMonth },
    { count: totalSalons },
    { count: activeSalons },
    { count: appointmentsToday },
    { count: appointmentsThisWeek },
  ] = await Promise.all([
    // Total users
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true }),

    // New users this month
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString()),

    // Total salons
    supabase
      .from('salons')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null),

    // Active salons (have appointments in last 30 days)
    activeSalonIds.length > 0
      ? supabase
          .from('salons')
          .select('id', { count: 'exact', head: true })
          .is('deleted_at', null)
          .in('id', activeSalonIds)
      : Promise.resolve({ count: 0 }),

    // Appointments today
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', today)
      .neq('status', 'cancelled'),

    // Appointments this week
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('appointment_date', startOfWeek.toISOString())
      .neq('status', 'cancelled'),
  ])

  // Set placeholder revenue values (no transactions table available yet)
  const revenueThisMonth = 0
  const revenueGrowth = 0

  // Placeholder for recent activity (no audit_logs table available yet)
  const formattedActivity: any[] = []

  // Mock alerts for now (would come from monitoring system)
  const alerts: Array<{ severity: string; message: string }> = [
    // { severity: 'high', message: 'Database query response time elevated' },
    // { severity: 'medium', message: '5 failed payment attempts in last hour' },
  ]

  return {
    totalUsers: totalUsers || 0,
    newUsersThisMonth: newUsersThisMonth || 0,
    totalSalons: totalSalons || 0,
    activeSalons: activeSalons || 0,
    appointmentsToday: appointmentsToday || 0,
    appointmentsThisWeek: appointmentsThisWeek || 0,
    revenueThisMonth,
    revenueGrowth,
    growthRate: 15, // Mock growth rate
    systemHealth: 99, // Mock health score
    recentActivity: formattedActivity,
    alerts,
  }
}