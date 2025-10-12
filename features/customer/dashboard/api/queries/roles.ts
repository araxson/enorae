import 'server-only'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

type RoleResponse = {
  isGuest: boolean
  role: string
}

export async function checkGuestRole(): Promise<RoleResponse> {
  const session = await requireAuth()
  const supabase = await createClient()

  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single<{ role: string }>()

  if (roleError && roleError.code !== 'PGRST116') {
    throw roleError
  }

  const derivedRole = roleData?.role || 'guest'
  return {
    isGuest: derivedRole === 'guest',
    role: derivedRole,
  }
}
