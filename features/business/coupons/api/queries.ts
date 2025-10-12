import 'server-only'

import { createClient } from '@/lib/supabase/server'

export * from './queries/coupon-validation'

export type CouponServiceOption = {
  id: string
  name: string
}

export async function getCouponServiceOptions(
  salonId: string,
): Promise<CouponServiceOption[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('services')
    .select('id, name')
    .eq('salon_id', salonId)
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
