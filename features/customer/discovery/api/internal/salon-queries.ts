import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { sanitizeDiscoverySearchInput } from '@/lib/utils/formatting'
import type { Database } from '@/lib/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'
import type { Salon } from './types'

type ServiceRow = Database['public']['Views']['services_view']['Row']

export async function getSalons(categoryFilter?: string): Promise<Salon[]> {
  await requireAuth()
  const supabase = await createClient()

  let query = supabase
    .from('salons_view')
    .select('*')
    .eq('is_active', true)

  // If category filter is provided, find salons offering services in that category
  if (categoryFilter) {
    const { data: servicesData } = await supabase
      .from('services_view')
      .select('salon_id, category_name')
      .eq('category_name', categoryFilter)
      .eq('is_active', true) as { data: Array<Pick<ServiceRow, 'salon_id' | 'category_name'>> | null; error: PostgrestError | null }

    if (servicesData && servicesData.length > 0) {
      const salonIds = [...new Set(servicesData.map(s => s.salon_id).filter(Boolean) as string[])]
      query = query.in('id', salonIds)
    }
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getSalonBySlug(slug: string): Promise<Salon> {
  await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('salons_view')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data
}

export async function searchSalons(query: string, categoryFilter?: string): Promise<Salon[]> {
  await requireAuth()
  const supabase = await createClient()

  const sanitizedQuery = sanitizeDiscoverySearchInput(query)

  let salonQuery = supabase
    .from('salons_view')
    .select('*')
    .eq('is_active', true)

  if (sanitizedQuery.length > 0) {
    const searchTerm = `%${sanitizedQuery}%`
    salonQuery = salonQuery.or(
      `name.ilike.${searchTerm},full_description.ilike.${searchTerm},short_description.ilike.${searchTerm}`,
    )
  }

  // If category filter is provided, find salons offering services in that category
  if (categoryFilter) {
    const { data: servicesData } = await supabase
      .from('services_view')
      .select('salon_id, category_name')
      .eq('category_name', categoryFilter)
      .eq('is_active', true) as { data: Array<Pick<ServiceRow, 'salon_id' | 'category_name'>> | null; error: PostgrestError | null }

    if (servicesData && servicesData.length > 0) {
      const salonIds = [...new Set(servicesData.map(s => s.salon_id).filter(Boolean) as string[])]
      salonQuery = salonQuery.in('id', salonIds)
    }
  }

  salonQuery = salonQuery.order('created_at', { ascending: false })

  const { data, error } = await salonQuery

  if (error) throw error
  return data
}
