import { createClient } from '@/lib/supabase/client'

export async function getSalons() {
  const supabase = await createClient()

  const { data: salons, error } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      slug,
      business_name,
      business_type,
      created_at
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching salons:', error)
    return []
  }

  return salons || []
}