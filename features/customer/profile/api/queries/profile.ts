import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type Profile = Database['public']['Views']['profiles_view']['Row']
type Appointment = Database['public']['Views']['appointments_view']['Row']
type UserRole = Database['public']['Views']['user_roles_view']['Row']
type ProfileMetadata = Database['public']['Views']['profiles_metadata_view']['Row']
type ProfilePreferences = Database['public']['Views']['profiles_preferences_view']['Row']

export type AppointmentWithRelations = Appointment & {
  salon: { id: string; name: string | null; formatted_address: string | null; primary_phone: string | null } | null
  staff: { id: string; full_name: string | null; title: string | null } | null
}

export async function getProfile() {
  const logger = createOperationLogger('getProfile', {})
  logger.start()

  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Explicit user filter for security
  const { data, error } = await supabase
    .from('profiles_view')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error) throw error
  return data as Profile
}

export async function getUserAppointments() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Explicit customer filter for security
  const { data, error } = await supabase
    .from('appointments_view')
    .select(`
      *,
      salon:salon_id(id, name, formatted_address, primary_phone),
      staff:staff_id(id, full_name, title)
    `)
    .eq('customer_id', session.user.id)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data as AppointmentWithRelations[]
}

export async function getUserRoles() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Explicit user filter for security
  const { data, error } = await supabase
    .from('user_roles_view')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as UserRole[]
}

export async function getProfileMetadata() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Explicit user filter for security
  const { data, error } = await supabase
    .from('profiles_metadata_view')
    .select('*')
    .eq('profile_id', session.user.id)
    .maybeSingle()

  if (error) throw error
  return data as ProfileMetadata | null
}

export async function getProfilePreferences() {
  // SECURITY: Require authentication
  const session = await requireAuth()

  const supabase = await createClient()

  // Explicit user filter for security
  const { data, error } = await supabase
    .from('profiles_preferences_view')
    .select('*')
    .eq('profile_id', session.user.id)
    .maybeSingle()

  if (error) throw error
  return data as ProfilePreferences | null
}
