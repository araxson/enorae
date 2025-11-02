import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth/guards-simple'
import { requireUserSalonId } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability/logger'

export type CouponServiceOption = {
  id: string
  name: string
}

export async function getCouponServiceOptions(
  salonId?: string,
): Promise<CouponServiceOption[]> {
  const logger = createOperationLogger('getCouponServiceOptions', {})
  logger.start()

  await requireUser()
  const supabase = await createClient()

  const userSalonId = salonId || await requireUserSalonId()

  const { data, error } = await supabase
    .from('services_view')
    .select('id, name')
    .eq('salon_id', userSalonId)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error

  const services = (data ?? []) as Array<{ id: string | null; name: string | null }>

  return services
    .filter((service): service is { id: string; name: string } => Boolean(service.id && service.name))
    .map((service) => ({
      id: service.id,
      name: service.name,
    }))
}
