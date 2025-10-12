'use server'

import { revalidatePath } from 'next/cache'
import type { Session } from '@/lib/auth'
import {
  assertSalonAccess,
  ensureBusinessUser,
  generateUniqueServiceSlug,
  type SupabaseServerClient,
} from './shared'
import { deriveBookingDurations, derivePricingMetrics } from '../utils/calculations'
import type {
  ServiceFormData,
  ServicePricingData,
  ServiceBookingRulesData,
} from './create-service.mutation'

type UpdateServiceOptions = {
  supabase?: SupabaseServerClient
  session?: Session
  now?: () => Date
  skipAccessCheck?: boolean
}

export async function updateService(
  serviceId: string,
  serviceData: Partial<ServiceFormData>,
  pricingData?: Partial<ServicePricingData>,
  bookingRules?: Partial<ServiceBookingRulesData>,
  options: UpdateServiceOptions = {},
) {
  const session = options.session ?? await ensureBusinessUser()
  const { supabase, salonId } = await assertSalonAccess(serviceId, options.supabase, {
    skipAccessCheck: options.skipAccessCheck,
  })
  const now = options.now?.() ?? new Date()
  const timestamp = now.toISOString()

  if (Object.keys(serviceData).length > 0) {
    const serviceUpdates: Record<string, unknown> = {}

    if (serviceData.name !== undefined) {
      serviceUpdates.name = serviceData.name
      if (serviceData.name?.trim()) {
        serviceUpdates.slug = await generateUniqueServiceSlug(
          supabase,
          salonId,
          serviceData.name,
          serviceId,
        )
      }
    }

    if (serviceData.description !== undefined) {
      serviceUpdates.description = serviceData.description ?? null
    }
    if (serviceData.category_id !== undefined) {
      serviceUpdates.category_id = serviceData.category_id ?? null
    }
    if (serviceData.is_active !== undefined) {
      serviceUpdates.is_active = serviceData.is_active
    }
    if (serviceData.is_bookable !== undefined) {
      serviceUpdates.is_bookable = serviceData.is_bookable
    }
    if (serviceData.is_featured !== undefined) {
      serviceUpdates.is_featured = serviceData.is_featured
    }

    if (Object.keys(serviceUpdates).length > 0) {
      serviceUpdates.updated_by_id = session.user.id
      serviceUpdates.updated_at = timestamp

      const { error: serviceError } = await supabase
        .schema('catalog')
        .from('services')
        .update(serviceUpdates)
        .eq('id', serviceId)

      if (serviceError) throw serviceError
    }
  }

  if (pricingData && Object.keys(pricingData).length > 0) {
    const { data: existingPricing, error: fetchPricingError } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .select('id, base_price, sale_price, cost')
      .eq('service_id', serviceId)
      .maybeSingle<{ id: string; base_price: number; sale_price: number | null; cost: number | null }>()

    if (fetchPricingError) throw fetchPricingError
    if (!existingPricing) {
      throw new Error('Pricing not found for service')
    }

    const pricingUpdates: Record<string, unknown> = {}
    if (pricingData.base_price !== undefined) {
      pricingUpdates.base_price = pricingData.base_price
    }
    if (pricingData.currency_code !== undefined) {
      pricingUpdates.currency_code = pricingData.currency_code
    }
    if (pricingData.is_taxable !== undefined) {
      pricingUpdates.is_taxable = pricingData.is_taxable
    }
    if (pricingData.tax_rate !== undefined) {
      pricingUpdates.tax_rate = pricingData.tax_rate ?? null
    }
    if (pricingData.commission_rate !== undefined) {
      pricingUpdates.commission_rate = pricingData.commission_rate ?? null
    }

    const basePrice = pricingData.base_price ?? existingPricing.base_price
    const salePriceInput = pricingData.sale_price !== undefined
      ? pricingData.sale_price
      : existingPricing.sale_price
    const costInput = pricingData.cost !== undefined
      ? pricingData.cost
      : existingPricing.cost

    const { currentPrice, salePrice, profitMargin } = derivePricingMetrics(
      basePrice,
      salePriceInput,
      costInput,
    )

    if (pricingData.sale_price !== undefined) {
      pricingUpdates.sale_price = salePrice
    }
    if (pricingData.cost !== undefined) {
      pricingUpdates.cost = costInput ?? null
    }
    pricingUpdates.current_price = currentPrice
    pricingUpdates.profit_margin = profitMargin

    pricingUpdates.updated_by_id = session.user.id
    pricingUpdates.updated_at = timestamp

    const { error: pricingError } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .update(pricingUpdates)
      .eq('service_id', serviceId)

    if (pricingError) throw pricingError
  }

  if (bookingRules && Object.keys(bookingRules).length > 0) {
    const { data: existingRules, error: fetchRulesError } = await supabase
      .schema('catalog')
      .from('service_booking_rules')
      .select('id, duration_minutes, buffer_minutes, min_advance_booking_hours, max_advance_booking_days')
      .eq('service_id', serviceId)
      .maybeSingle<{
        id: string
        duration_minutes: number | null
        buffer_minutes: number | null
        min_advance_booking_hours: number | null
        max_advance_booking_days: number | null
      }>()

    if (fetchRulesError) throw fetchRulesError
    if (!existingRules) {
      throw new Error('Booking rules not found for service')
    }

    const rulesUpdates: Record<string, unknown> = {}
    const derivedDurations = deriveBookingDurations(
      bookingRules.duration_minutes !== undefined
        ? bookingRules.duration_minutes
        : existingRules.duration_minutes ?? 0,
      bookingRules.buffer_minutes !== undefined
        ? bookingRules.buffer_minutes
        : existingRules.buffer_minutes ?? 0,
    )

    if (bookingRules.duration_minutes !== undefined) {
      rulesUpdates.duration_minutes = derivedDurations.durationMinutes
    }
    if (bookingRules.buffer_minutes !== undefined) {
      rulesUpdates.buffer_minutes = derivedDurations.bufferMinutes
    }
    if (bookingRules.min_advance_booking_hours !== undefined) {
      rulesUpdates.min_advance_booking_hours = bookingRules.min_advance_booking_hours ?? null
    }
    if (bookingRules.max_advance_booking_days !== undefined) {
      rulesUpdates.max_advance_booking_days = bookingRules.max_advance_booking_days ?? null
    }

    if (Object.keys(rulesUpdates).length > 0) {
      rulesUpdates.total_duration_minutes = derivedDurations.totalDurationMinutes
      rulesUpdates.updated_by_id = session.user.id
      rulesUpdates.updated_at = timestamp

      const { error: rulesError } = await supabase
        .schema('catalog')
        .from('service_booking_rules')
        .update(rulesUpdates)
        .eq('service_id', serviceId)

      if (rulesError) throw rulesError
    }
  }

  revalidatePath('/business/services')
  return { success: true }
}
