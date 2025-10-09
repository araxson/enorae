import 'server-only'

import { createInventoryClient, requireBusinessRole, resolveAccessibleSalonIds } from './helpers'

export async function getProductCategories(salonId?: string) {
  await requireBusinessRole()

  const supabase = await createInventoryClient()
  const targetSalonIds = await resolveAccessibleSalonIds(salonId)
  if (!targetSalonIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .in('salon_id', targetSalonIds)
    .order('display_order', { ascending: true })
    .order('name')

  if (error) throw error
  return data || []
}
