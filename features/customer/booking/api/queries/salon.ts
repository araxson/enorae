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

  try {
    await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('salons_view')
      .select('id, name, slug, is_active, is_accepting_bookings, short_description, full_description, primary_phone, primary_email, street_address, city, state_province, postal_code, latitude, longitude, formatted_address, rating_average, rating_count, is_verified, is_featured')
      .eq('id', salonId)
      .eq('is_active', true)
      .single()
      .returns<Salon>()

    if (error) throw error

    logger.success({ salonId })
    return data as Salon
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    throw error
  }
}

export async function getSalonMetadata(salonId: string) {
  const logger = createOperationLogger('getSalonMetadata', {})
  logger.start()

  try {
    await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('salons_view')
      .select('name, short_description')
      .eq('id', salonId)
      .single()

    if (error) {
      logger.error(error, 'database', { salonId })
      return null
    }

    logger.success({ salonId })
    return data as { name: string | null; short_description: string | null } | null
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    return null
  }
}

export async function getAvailableServices(salonId: string) {
  const logger = createOperationLogger('getAvailableServices', {})
  logger.start()

  try {
    await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('services_view')
      .select('id, salon_id, category_id, name, slug, description, is_active, is_bookable, is_featured, category_name, price, sale_price, current_price, duration_minutes, buffer_minutes, total_duration_minutes')
      .eq('salon_id', salonId)
      .eq('is_active', true)
      .eq('is_bookable', true)
      .order('name')
      .returns<Service[]>()

    if (error) throw error

    logger.success({ salonId, count: data?.length ?? 0 })
    return data as Service[]
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    return []
  }
}

export async function getAvailableStaff(salonId: string): Promise<EnrichedStaffProfile[]> {
  const logger = createOperationLogger('getAvailableStaff', {})
  logger.start()

  try {
    await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('staff_profiles_view')
      .select('id, user_id, salon_id, bio, specialties, created_at')
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
      .select('id, email, display_name, avatar_url, created_at')
      .in('id', userIds)
      .returns<UserOverviewRow[]>()

    if (userError) throw userError

    const enrichedStaff = mergeStaffWithUsers(staff, users ?? [])
    logger.success({ salonId, staffCount: enrichedStaff.length })
    return enrichedStaff
  } catch (error) {
    logger.error(error instanceof Error ? error : String(error), 'system', { salonId })
    return []
  }
}
