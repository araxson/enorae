import { createClient } from '@/lib/supabase/client'

export async function getAllUsers() {
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

  // Fetch all users from profiles
  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      phone,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Add placeholder activity data (no sessions table available yet)
  const usersWithActivity = (users || []).map((user: any) => ({
    ...user,
    status: 'active', // Would be determined by business logic
    last_active: user.updated_at || user.created_at || null,
  }))

  return usersWithActivity
}