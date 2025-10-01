import { createClient } from '@/lib/supabase/client'

export async function getProductCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_categories')
    .select(`
      *,
      products(count)
    `)
    .order('name')

  if (error) throw error
  return data
}