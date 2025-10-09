'use server'

import { revalidatePath } from 'next/cache'
import { canAccessSalon } from '@/lib/auth'
import type { Session } from '@/lib/auth'
import {
  ensureBusinessUser,
  generateUniqueServiceSlug,
  getSupabaseClient,
  type SupabaseServerClient,
} from '../utils/supabase'
import { deriveBookingDurations, derivePricingMetrics } from '../utils/calculations'

export type ServiceFormData = {
  name: string
  description?: string
  category_id?: string
  is_active: boolean
  is_bookable: boolean
  is_featured: boolean
}

export type ServicePricingData = {
  base_price: number
  sale_price?: number | null
  currency_code: string
  is_taxable?: boolean
  tax_rate?: number | null
  commission_rate?: number | null
  cost?: number | null
}

export type ServiceBookingRulesData = {
  duration_minutes: number
  buffer_minutes?: number | null
  min_advance_booking_hours?: number | null
  max_advance_booking_days?: number | null
}

type CreateServiceOptions = {
  supabase?: SupabaseServerClient
  session?: Session
  now?: () => Date
  skipAccessCheck?: boolean
}

export async function createService(
  salonId: string,
  serviceData: ServiceFormData,
  pricingData: ServicePricingData,
  bookingRules: ServiceBookingRulesData,
  options: CreateServiceOptions = {},
) {
  const session = options.session ?? await ensureBusinessUser()
  if (!options.skipAccessCheck && !(await canAccessSalon(salonId))) {
    throw new Error('Unauthorized: Not your salon')
  }

  const supabase = options.supabase ?? await getSupabaseClient()
  const slug = await generateUniqueServiceSlug(supabase, salonId, serviceData.name)
  const now = options.now?.() ?? new Date()
  const timestamp = now.toISOString()

  const { data: service, error: serviceError } = await supabase
    .schema('catalog')
    .from('services')
    .insert({
      salon_id: salonId,
      name: serviceData.name,
      slug,
      description: serviceData.description ?? null,
      category_id: serviceData.category_id ?? null,
      is_active: serviceData.is_active,
      is_bookable: serviceData.is_bookable,
      is_featured: serviceData.is_featured,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select('id')
    .single<{ id: string }>()

  if (serviceError) throw serviceError

  const basePrice = pricingData.base_price
  const { currentPrice, salePrice, profitMargin } = derivePricingMetrics(
    basePrice,
    pricingData.sale_price,
    pricingData.cost,
  )

  const { error: pricingError } = await supabase
    .schema('catalog')
    .from('service_pricing')
    .insert({
      service_id: service.id,
      base_price: basePrice,
      sale_price: salePrice,
      current_price: currentPrice,
      cost: pricingData.cost ?? null,
      profit_margin: profitMargin,
      currency_code: pricingData.currency_code,
      is_taxable: pricingData.is_taxable ?? true,
      tax_rate: pricingData.tax_rate ?? null,
      commission_rate: pricingData.commission_rate ?? null,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    })

  if (pricingError) {
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
    throw pricingError
  }

  const {
    durationMinutes,
    bufferMinutes,
    totalDurationMinutes,
  } = deriveBookingDurations(bookingRules.duration_minutes, bookingRules.buffer_minutes)

  const { error: rulesError } = await supabase
    .schema('catalog')
    .from('service_booking_rules')
    .insert({
      service_id: service.id,
      duration_minutes: durationMinutes,
      buffer_minutes: bufferMinutes,
      total_duration_minutes: totalDurationMinutes,
      min_advance_booking_hours: bookingRules.min_advance_booking_hours ?? 1,
      max_advance_booking_days: bookingRules.max_advance_booking_days ?? 90,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    })

  if (rulesError) {
    await supabase.schema('catalog').from('service_pricing').delete().eq('service_id', service.id)
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
    throw rulesError
  }

  revalidatePath('/business/services')
  return service
}
