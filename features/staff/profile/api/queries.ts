import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type StaffProfile = Database['public']['Views']['staff']['Row']

export async function getMyStaffProfile(): Promise<StaffProfile | null> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error) {
    console.error('Error fetching staff profile:', error)
    return null
  }

  return data
}
