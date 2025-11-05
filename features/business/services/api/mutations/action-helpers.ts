'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Generate a unique slug for a service within a salon
 */
export async function generateUniqueSlug(
  salonId: string,
  name: string
): Promise<string> {
  const supabase = await createClient()

  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let slug = baseSlug
  let slugSuffix = 1

  while (true) {
    const { data: existing } = await supabase
      .schema('catalog')
      .from('services')
      .select('id')
      .eq('salon_id', salonId)
      .eq('slug', slug)
      .maybeSingle()

    if (!existing) break
    slug = `${baseSlug}-${slugSuffix}`
    slugSuffix++
  }

  return slug
}
