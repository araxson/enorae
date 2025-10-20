import 'server-only'
import type { Database } from '@/lib/types/database.types'
import type { Salon, Service } from './types'
import { createPublicClient } from './helpers'

type ServiceRow = Pick<Service, 'salon_id' | 'category_name'>

/**
 * Get salons offering specific services
 * Public endpoint - no auth required
 */
export async function getPublicSalonsByService(serviceCategory: string): Promise<Salon[]> {
  const supabase = await createPublicClient()

  // First, find services in this category
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('salon_id, category_name')
    .eq('is_active', true)
    .ilike('category_name', serviceCategory)
    .returns<ServiceRow[]>()

  if (servicesError) throw servicesError

  if (!services || services.length === 0) {
    return []
  }

  // Get unique salon IDs
  const salonIds = [
    ...new Set(
      services
        .map((service) => service.salon_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ]

  // Get full salon details
  const { data, error } = await supabase
    .from('salons')
    .select('*')
    .in('id', salonIds)
    .eq('is_active', true)
    .order('rating_average', { ascending: false, nullsFirst: false })
    .returns<Salon[]>()

  if (error) throw error
  return data ?? []
}

/**
 * Get unique service categories from all salons
 * Public endpoint - no auth required
 */
export async function getPublicServiceCategories(): Promise<string[]> {
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('services')
    .select('category_name')
    .eq('is_active', true)
    .not('category_name', 'is', null)
    .returns<Pick<Service, 'category_name'>[]>()

  if (error) throw error

  // Get unique categories
  const categories = [
    ...new Set(
      (data ?? [])
        .map((service) => service.category_name)
        .filter((name): name is string => Boolean(name)),
    ),
  ]
  return categories.sort()
}

/**
 * Get services offered by a salon
 * Public endpoint - no auth required
 */
export async function getPublicSalonServices(salonId: string): Promise<Service[]> {
  const supabase = await createPublicClient()

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('salon_id', salonId)
    .eq('is_active', true)
    .order('category_name', { ascending: true })
    .order('name', { ascending: true })
    .returns<Service[]>()

  if (error) throw error
  return data ?? []
}
