import 'server-only'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { canAccessSalon } from '@/lib/auth'
import type { Session } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'
import {
  ensureBusinessUser,
  generateUniqueServiceSlug,
  getSupabaseClient,
  type SupabaseServerClient,
} from './shared'
import { deriveBookingDurations, derivePricingMetrics } from '@/lib/services/calculations'
import { BUSINESS_THRESHOLDS } from '@/lib/config/constants'

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

const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Service name is required')
    .max(BUSINESS_THRESHOLDS.SERVICE_NAME_MAX_LENGTH, `Service name must be ${BUSINESS_THRESHOLDS.SERVICE_NAME_MAX_LENGTH} characters or fewer`),
  description: z
    .string()
    .trim()
    .max(BUSINESS_THRESHOLDS.SERVICE_DESCRIPTION_MAX_LENGTH, `Description must be ${BUSINESS_THRESHOLDS.SERVICE_DESCRIPTION_MAX_LENGTH} characters or fewer`)
    .optional(),
  category_id: z.string().uuid('Invalid category').optional(),
  is_active: z.boolean(),
  is_bookable: z.boolean(),
  is_featured: z.boolean(),
})

const pricingSchema = z
  .object({
    base_price: z.number().min(0, 'Base price must be positive'),
    sale_price: z.number().min(0, 'Sale price cannot be negative').nullable().optional(),
    currency_code: z
      .string()
      .trim()
      .length(BUSINESS_THRESHOLDS.CURRENCY_CODE_LENGTH, `Currency code must be a ${BUSINESS_THRESHOLDS.CURRENCY_CODE_LENGTH}-letter ISO code`)
      .transform((code) => code.toUpperCase()),
    is_taxable: z.boolean().optional(),
    tax_rate: z
      .number()
      .min(0, 'Tax rate cannot be negative')
      .max(BUSINESS_THRESHOLDS.MAX_TAX_RATE_PERCENT, `Tax rate cannot exceed ${BUSINESS_THRESHOLDS.MAX_TAX_RATE_PERCENT}%`)
      .nullable()
      .optional(),
    commission_rate: z
      .number()
      .min(0, 'Commission rate cannot be negative')
      .max(BUSINESS_THRESHOLDS.MAX_COMMISSION_RATE_PERCENT, `Commission rate cannot exceed ${BUSINESS_THRESHOLDS.MAX_COMMISSION_RATE_PERCENT}%`)
      .nullable()
      .optional(),
    cost: z.number().min(0, 'Cost cannot be negative').nullable().optional(),
  })
  .refine(
    (data) => data.sale_price == null || data.sale_price <= data.base_price,
    { message: 'Sale price cannot exceed the base price', path: ['sale_price'] },
  )

const bookingRulesSchema = z
  .object({
    duration_minutes: z
      .number()
      .int('Duration must be a whole number')
      .min(1, 'Duration must be at least one minute'),
    buffer_minutes: z
      .number()
      .int('Buffer must be a whole number')
      .min(0, 'Buffer cannot be negative')
      .nullable()
      .optional(),
    min_advance_booking_hours: z
      .number()
      .int('Minimum advance booking must be a whole number')
      .min(0, 'Minimum advance booking cannot be negative')
      .max(BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_HOURS, `Minimum advance booking cannot exceed ${BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_HOURS} hours`)
      .nullable()
      .optional(),
    max_advance_booking_days: z
      .number()
      .int('Maximum advance booking must be a whole number')
      .min(0, 'Maximum advance booking cannot be negative')
      .max(BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_DAYS, `Maximum advance booking cannot exceed ${BUSINESS_THRESHOLDS.MAX_ADVANCE_BOOKING_DAYS} days`)
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.min_advance_booking_hours == null || data.max_advance_booking_days == null) {
        return true
      }

      const minHours = data.min_advance_booking_hours
      const maxHours = data.max_advance_booking_days * BUSINESS_THRESHOLDS.HOURS_IN_DAY
      return maxHours >= minHours
    },
    {
      message: 'Maximum advance booking must be greater than the minimum advance booking',
      path: ['max_advance_booking_days'],
    },
  )

function extractFirstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid service data'
}

export async function createService(
  salonId: string,
  serviceData: ServiceFormData,
  pricingData: ServicePricingData,
  bookingRules: ServiceBookingRulesData,
  options: CreateServiceOptions = {},
) {
  console.log('Starting service creation', {
    salonId,
    serviceName: serviceData.name,
    basePrice: pricingData.base_price,
    duration: bookingRules.duration_minutes,
    timestamp: new Date().toISOString()
  })

  const session = options.session ?? await ensureBusinessUser()
  if (!options.skipAccessCheck && !(await canAccessSalon(salonId))) {
    console.error('createService unauthorized access attempt', {
      salonId,
      userId: session.user.id
    })
    throw new Error('Unauthorized: Not your salon')
  }

  const parsedService = serviceSchema.safeParse(serviceData)
  if (!parsedService.success) {
    const error = extractFirstError(parsedService.error)
    console.error('createService validation failed - service data', {
      salonId,
      userId: session.user.id,
      error,
      serviceName: serviceData.name
    })
    throw new Error(error)
  }

  const parsedPricing = pricingSchema.safeParse(pricingData)
  if (!parsedPricing.success) {
    const error = extractFirstError(parsedPricing.error)
    console.error('createService validation failed - pricing data', {
      salonId,
      userId: session.user.id,
      error,
      basePrice: pricingData.base_price
    })
    throw new Error(error)
  }

  const parsedBooking = bookingRulesSchema.safeParse(bookingRules)
  if (!parsedBooking.success) {
    const error = extractFirstError(parsedBooking.error)
    console.error('createService validation failed - booking rules', {
      salonId,
      userId: session.user.id,
      error,
      duration: bookingRules.duration_minutes
    })
    throw new Error(error)
  }

  const validatedService = parsedService.data
  const validatedPricing = parsedPricing.data
  const validatedBooking = parsedBooking.data

  if (!validatedService.category_id) {
    console.error('createService missing category', {
      salonId,
      userId: session.user.id,
      serviceName: validatedService.name
    })
    throw new Error('A service category is required')
  }

  const supabase = options.supabase ?? await getSupabaseClient()
  const slug = await generateUniqueServiceSlug(supabase, salonId, validatedService.name)
  const now = options.now?.() ?? new Date()
  const timestamp = now.toISOString()

  const serviceInsert: Database['catalog']['Tables']['services']['Insert'] = {
    salon_id: salonId,
    name: validatedService.name,
    slug,
    description: validatedService.description ?? null,
    category_id: validatedService.category_id,
    is_active: validatedService.is_active,
    is_bookable: validatedService.is_bookable,
    is_featured: validatedService.is_featured,
    created_by_id: session.user.id,
    updated_by_id: session.user.id,
    created_at: timestamp,
    updated_at: timestamp,
  }

  const { data: service, error: serviceError } = await supabase
    .schema('catalog')
    .from('services')
    .insert(serviceInsert)
    .select('id')
    .single<{ id: string }>()

  if (serviceError) {
    console.error('createService service insert failed', {
      salonId,
      userId: session.user.id,
      serviceName: validatedService.name,
      error: serviceError.message
    })
    throw serviceError
  }

  console.log('createService service record created', {
    salonId,
    serviceId: service.id,
    serviceName: validatedService.name,
    userId: session.user.id
  })

  const basePrice = validatedPricing.base_price
  const { currentPrice, salePrice, profitMargin } = derivePricingMetrics(
    basePrice,
    validatedPricing.sale_price,
    validatedPricing.cost,
  )

  const { error: pricingError } = await supabase
    .schema('catalog')
    .from('service_pricing')
    .insert({
      service_id: service.id,
      base_price: basePrice,
      sale_price: salePrice,
      current_price: currentPrice,
      cost: validatedPricing.cost ?? null,
      profit_margin: profitMargin,
      currency_code: validatedPricing.currency_code,
      is_taxable: validatedPricing.is_taxable ?? true,
      tax_rate: validatedPricing.tax_rate ?? null,
      commission_rate: validatedPricing.commission_rate ?? null,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    })

  if (pricingError) {
    console.error('createService pricing insert failed - rolling back service', {
      salonId,
      serviceId: service.id,
      userId: session.user.id,
      basePrice,
      error: pricingError.message
    })
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
    console.log('createService rollback completed - service deleted', {
      serviceId: service.id,
      userId: session.user.id
    })
    throw pricingError
  }

  const {
    durationMinutes,
    bufferMinutes,
    totalDurationMinutes,
  } = deriveBookingDurations(
    validatedBooking.duration_minutes,
    validatedBooking.buffer_minutes,
  )

  const { error: rulesError } = await supabase
    .schema('catalog')
    .from('service_booking_rules')
    .insert({
      service_id: service.id,
      duration_minutes: durationMinutes,
      buffer_minutes: bufferMinutes,
      total_duration_minutes: totalDurationMinutes,
      min_advance_booking_hours: validatedBooking.min_advance_booking_hours ?? BUSINESS_THRESHOLDS.DEFAULT_MIN_ADVANCE_BOOKING_HOURS,
      max_advance_booking_days: validatedBooking.max_advance_booking_days ?? BUSINESS_THRESHOLDS.DEFAULT_MAX_ADVANCE_BOOKING_DAYS,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    })

  if (rulesError) {
    console.error('createService booking rules insert failed - rolling back all', {
      salonId,
      serviceId: service.id,
      userId: session.user.id,
      durationMinutes,
      error: rulesError.message
    })
    await supabase.schema('catalog').from('service_pricing').delete().eq('service_id', service.id)
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
    console.log('createService complete rollback - pricing and service deleted', {
      serviceId: service.id,
      userId: session.user.id
    })
    throw rulesError
  }

  console.log('createService completed successfully', {
    salonId,
    serviceId: service.id,
    serviceName: validatedService.name,
    basePrice,
    currentPrice,
    durationMinutes,
    userId: session.user.id
  })

  revalidatePath('/business/services', 'page')
  return service
}
