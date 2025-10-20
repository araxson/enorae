import 'server-only'
import { createPublicClient } from './helpers'
import type { Service } from './types'

/**
 * Get all active public services with optional filters
 * Public endpoint - no auth required
 */
export async function getPublicServices(category?: string): Promise<Service[]> {
  const supabase = await createPublicClient()

  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (category) {
    query = query.ilike('category_name', category)
  }

  const { data, error } = await query

  if (error) throw error
  return (data ?? []) as Service[]
}

/**
 * Get featured services for homepage
 * Public endpoint - no auth required
 */
export async function getFeaturedServices(limit: number = 6): Promise<Service[]> {
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .is('deleted_at', null)
    .order('name', { ascending: true })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as Service[]
}

/**
 * Search services by name or description
 * Public endpoint - no auth required
 */
export async function searchPublicServices(searchTerm: string): Promise<Service[]> {
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .is('deleted_at', null)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as Service[]
}
