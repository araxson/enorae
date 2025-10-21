import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type StaffService = Database['public']['Views']['staff_services']['Row']

export async function getStaffServices(staffId: string): Promise<StaffService[]> {
  const session = await requireAuth()
  const supabase = await createClient()

  // Security: Verify staff ownership
  const { data: staffProfile } = await supabase
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('id', staffId)
    .single()

  if (!staffProfile) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('staff_services_view')
    .select('*')
    .eq('staff_id', staffId)
    .order('service_name', { ascending: true })

  if (error) throw error
  return data || []
}