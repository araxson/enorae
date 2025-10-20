import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import type { Salon } from './types'
import { sanitizeDiscoverySearchInput } from './helpers'

type ServiceRow = Database['public']['Views']['services']['Row']

export async function getSalons(categoryFilter?: string): Promise<Salon[]> {
  await requireAuth()
  const supabase = await createClient()

  let query = supabase
    .from('salons')
    .select('*')
    .eq('is_active', true)

  // If category filter is provided, find salons offering services in that category
  if (categoryFilter) {
    const { data: servicesData } = await supabase
      .from('services')
      .select('salon_id, category_name')
      .eq('category_name', categoryFilter)
      .eq('is_active', true)
      .returns<Array<Pick<ServiceRow, 'salon_id' | 'category_name'>>>()

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
    .from('salons')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) throw error
  return data
}

export async function searchSalons(query: string, categoryFilter?: string): Promise<Salon[]> {
  await requireAuth()
  const supabase = await createClient()

  const sanitizedQuery = sanitizeDiscoverySearchInput(query)

  let salonQuery = supabase
    .from('salons')
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
      .from('services')
      .select('salon_id, category_name')
      .eq('category_name', categoryFilter)
      .eq('is_active', true)
      .returns<Array<Pick<ServiceRow, 'salon_id' | 'category_name'>>>()

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
