import 'server-only'
import { requireAnyRole, requireUserSalonId, canAccessSalon, ROLE_GROUPS } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createOperationLogger } from '@/lib/observability'

type SalonMedia = Database['public']['Views']['salon_media_view']['Row']

export async function getSalonMedia(salonId: string): Promise<SalonMedia | null> {
  const logger = createOperationLogger('getSalonMedia', {})
  logger.start()

  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)

  if (!(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salon_media_view')
    .select('salon_id, logo_url, cover_image_url, gallery_images, created_at, updated_at')
    .eq('salon_id', salonId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore "not found" errors
  return data as unknown as SalonMedia | null
}

export async function getUserSalonMedia(): Promise<SalonMedia | null> {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  return getSalonMedia(salonId)
}