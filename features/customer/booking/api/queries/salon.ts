import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'
import {
  mergeStaffWithUsers,
  type EnrichedStaffProfile,
} from '@/features/shared/staff/api/enrich'

type Service = Database['public']['Views']['services_view']['Row']
type StaffProfileRow = Database['public']['Views']['staff_profiles_view']['Row']
type UserOverviewRow = Database['public']['Views']['admin_users_overview_view']['Row']
type Salon = Database['public']['Views']['salons_view']['Row']

export async function getSalonById(salonId: string) {
  const logger = createOperationLogger('getSalonById', {})
  logger.start()

  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .eq('id', salonId)
    .eq('is_active', true)
    .single()
    .returns<Salon>()

  if (error) throw error
  return data as Salon
}

export async function getSalonMetadata(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('name, short_description')
    .eq('id', salonId)
    .single()

  if (error) return null
  return data as { name: string | null; short_description: string | null } | null
}

export async function getAvailableServices(salonId: string) {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services_view')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .eq('is_bookable', true)
    .order('name')
    .returns<Service[]>()

  if (error) throw error
  return data as Service[]
}

export async function getAvailableStaff(salonId: string): Promise<EnrichedStaffProfile[]> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('staff_profiles_view')
    .select('*')
    .eq('salon_id', salonId)
    .order('created_at', { ascending: true })
    .returns<StaffProfileRow[]>()

  if (error) throw error

  const staff = data ?? []
  const userIds = staff
    .map((row) => row.user_id)
    .filter((id): id is string => typeof id === 'string')

  const { data: users, error: userError } = await supabase
    .from('admin_users_overview_view')
    .select('*')
    .in('id', userIds)
    .returns<UserOverviewRow[]>()

  if (userError) throw userError

  return mergeStaffWithUsers(staff, users ?? [])
}
