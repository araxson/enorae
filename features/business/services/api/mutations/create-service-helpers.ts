import 'server-only'
import type { Database } from '@/lib/types/database.types'
import type { User } from '@supabase/supabase-js'
import { deriveBookingDurations, derivePricingMetrics } from '@/features/shared/services/utils/calculations'
import { BUSINESS_THRESHOLDS } from '@/lib/config/constants'
import type { SupabaseServerClient } from './shared'

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

/**
 * Rollback service creation by deleting service and optionally pricing
 *
 * Error scenarios:
 * - Pricing deletion fails (constraint violations, permissions)
 * - Service deletion fails (referenced by other tables)
 * - Partial rollback (pricing deleted but service deletion fails)
 *
 * Recovery: Logs full context for debugging, throws to halt transaction
 *
 * @param supabase - Supabase client instance
 * @param serviceId - ID of service to rollback
 * @param includePricing - Whether to also delete pricing data
 */
export async function rollbackService(
  supabase: SupabaseServerClient,
  serviceId: string,
  includePricing: boolean = false,
) {
  const { logInfo, logError: logErrorUtil } = await import('@/lib/observability')

  logInfo('Starting service rollback', {
    operationName: 'rollbackService',
    serviceId,
    includePricing,
  })

  try {
    // Step 1: Delete pricing if requested
    if (includePricing) {
      logInfo('Attempting to delete service pricing during rollback', {
        operationName: 'rollbackService',
        serviceId,
      })

      const { error: pricingError } = await supabase
        .schema('catalog')
        .from('service_pricing')
        .delete()
        .eq('service_id', serviceId)

      if (pricingError) {
        logErrorUtil('Failed to rollback service pricing', {
          operationName: 'rollbackService',
          serviceId,
          error: pricingError,
          errorCategory: 'database',
        })
        throw new Error(`Pricing rollback failed for service ${serviceId}: ${pricingError.message}`)
      }

      logInfo('Successfully deleted service pricing during rollback', {
        operationName: 'rollbackService',
        serviceId,
      })
    }

    // Step 2: Delete service
    logInfo('Attempting to delete service during rollback', {
      operationName: 'rollbackService',
      serviceId,
    })

    const { error: serviceError } = await supabase
      .schema('catalog')
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (serviceError) {
      logErrorUtil('Failed to rollback service', {
        operationName: 'rollbackService',
        serviceId,
        includePricing,
        pricingWasDeleted: includePricing, // Critical: pricing may be orphaned
        error: serviceError,
        errorCategory: 'database',
      })
      throw new Error(`Service rollback failed for service ${serviceId}: ${serviceError.message}`)
    }

    logInfo('Successfully completed service rollback', {
      operationName: 'rollbackService',
      serviceId,
      includePricing,
    })
  } catch (error) {
    // Log complete context for debugging partial rollback scenarios
    logErrorUtil('Rollback operation failed', {
      operationName: 'rollbackService',
      serviceId,
      includePricing,
      error: error instanceof Error ? error : String(error),
      errorCategory: 'system',
    })
    throw error
  }
}
