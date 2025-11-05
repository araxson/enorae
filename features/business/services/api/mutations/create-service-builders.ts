/**
 * Service builders - Data transformation utilities
 *
 * NOTE: This file does NOT have 'server-only' import because these are pure
 * data transformation functions that can be imported by both server actions
 * and type definitions used by client components.
 *
 * These functions transform validated form data into database insert/update objects.
 * They don't perform any database operations or server-side logic themselves.
 */
import type { Database } from '@/lib/types/database.types'
import type { User } from '@supabase/supabase-js'
import { deriveBookingDurations, derivePricingMetrics } from '@/features/shared/services/utils'
import { BUSINESS_THRESHOLDS } from '@/lib/config/constants'

type SessionContext = { user: User }

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

export function buildServiceInsert(
  salonId: string,
  service: ServiceFormData,
  slug: string,
  session: SessionContext,
  timestamp: string,
): Database['catalog']['Tables']['services']['Insert'] {
  if (!service.category_id) {
    throw new Error('Category ID is required to create a service')
  }

  return {
    salon_id: salonId,
    name: service.name,
    slug,
    description: service.description ?? null,
    category_id: service.category_id,
    is_active: service.is_active,
    is_bookable: service.is_bookable,
    is_featured: service.is_featured,
    created_by_id: session.user.id,
    updated_by_id: session.user.id,
    created_at: timestamp,
    updated_at: timestamp,
  }
}

export function buildPricingInsert(
  serviceId: string,
  pricing: ServicePricingData,
  session: SessionContext,
  timestamp: string,
) {
  const { currentPrice, salePrice, profitMargin } = derivePricingMetrics(
    pricing.base_price,
    pricing.sale_price,
    pricing.cost,
  )

  return {
    service_id: serviceId,
    base_price: pricing.base_price,
    sale_price: salePrice,
    current_price: currentPrice,
    cost: pricing.cost ?? null,
    profit_margin: profitMargin,
    currency_code: pricing.currency_code,
    is_taxable: pricing.is_taxable ?? true,
    tax_rate: pricing.tax_rate ?? null,
    commission_rate: pricing.commission_rate ?? null,
    created_by_id: session.user.id,
    updated_by_id: session.user.id,
    created_at: timestamp,
    updated_at: timestamp,
  }
}

export function buildBookingRulesInsert(
  serviceId: string,
  rules: ServiceBookingRulesData,
  session: SessionContext,
  timestamp: string,
) {
  const { durationMinutes, bufferMinutes, totalDurationMinutes } = deriveBookingDurations(
    rules.duration_minutes,
    rules.buffer_minutes,
  )

  return {
    service_id: serviceId,
    duration_minutes: durationMinutes,
    buffer_minutes: bufferMinutes,
    total_duration_minutes: totalDurationMinutes,
    min_advance_booking_hours: rules.min_advance_booking_hours ?? BUSINESS_THRESHOLDS.DEFAULT_MIN_ADVANCE_BOOKING_HOURS,
    max_advance_booking_days: rules.max_advance_booking_days ?? BUSINESS_THRESHOLDS.DEFAULT_MAX_ADVANCE_BOOKING_DAYS,
    created_by_id: session.user.id,
    updated_by_id: session.user.id,
    created_at: timestamp,
    updated_at: timestamp,
  }
}
