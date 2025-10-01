import { createClient } from '@/lib/supabase/client'

export async function getAllSalons() {
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

  // Fetch all salons with owner info and stats
  const { data: salons, error } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      slug,
      business_name,
      business_type,
      created_at,
      updated_at,
      owner:owner_id (
        id,
        email,
        full_name
      ),
      location:salon_locations!inner (
        city,
        state,
        country
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Add placeholder stats to salons (no transactions table available yet)
  const salonsWithStats = (salons || []).map((salon: any) => ({
    ...salon,
    status: 'active', // Would be determined by business logic
    totalRevenue: 0, // Placeholder - no transactions table available
  }))

  return salonsWithStats
}