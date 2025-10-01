import { createClient } from '@/lib/supabase/client'

export async function getHomepageData() {
  const supabase = await createClient()

  // Get featured salons
  const { data: featuredSalons } = await supabase
    .from('salons')
    .select(`
      id,
      name,
      slug,
      description,
      address,
      city,
      rating,
      review_count
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(6)

  return {
    featuredSalons: featuredSalons || []
  }
}