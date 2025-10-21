'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { canAccessSalon } from '@/lib/auth'
import type { Session } from '@/lib/auth'
import {
  ensureBusinessUser,
  generateUniqueServiceSlug,
  getSupabaseClient,
  type SupabaseServerClient,
} from './shared'
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

const serviceSchema = z.object({
  name: z
    .string({ required_error: 'Service name is required' })
    .trim()
    .min(1, 'Service name is required')
    .max(120, 'Service name must be 120 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(2000, 'Description must be 2000 characters or fewer')
    .optional(),
  category_id: z.string().uuid('Invalid category').optional(),
  is_active: z.boolean(),
  is_bookable: z.boolean(),
  is_featured: z.boolean(),
})

const pricingSchema = z
  .object({
    base_price: z.number({ required_error: 'Base price is required' }).min(0, 'Base price must be positive'),
    sale_price: z.number().min(0, 'Sale price cannot be negative').nullable().optional(),
    currency_code: z
      .string({ required_error: 'Currency code is required' })
      .trim()
      .length(3, 'Currency code must be a 3-letter ISO code')
      .transform((code) => code.toUpperCase()),
    is_taxable: z.boolean().optional(),
    tax_rate: z
      .number()
      .min(0, 'Tax rate cannot be negative')
      .max(100, 'Tax rate cannot exceed 100%')
      .nullable()
      .optional(),
    commission_rate: z
      .number()
      .min(0, 'Commission rate cannot be negative')
      .max(100, 'Commission rate cannot exceed 100%')
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
      .number({ required_error: 'Duration is required' })
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
      .max(720, 'Minimum advance booking cannot exceed 720 hours')
      .nullable()
      .optional(),
    max_advance_booking_days: z
      .number()
      .int('Maximum advance booking must be a whole number')
      .min(0, 'Maximum advance booking cannot be negative')
      .max(365, 'Maximum advance booking cannot exceed 365 days')
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.min_advance_booking_hours == null || data.max_advance_booking_days == null) {
        return true
      }

      const minHours = data.min_advance_booking_hours
      const maxHours = data.max_advance_booking_days * 24
      return maxHours >= minHours
    },
    {
      message: 'Maximum advance booking must be greater than the minimum advance booking',
      path: ['max_advance_booking_days'],
    },
  )

function extractFirstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? 'Invalid service data'
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

  const parsedService = serviceSchema.safeParse(serviceData)
  if (!parsedService.success) {
    throw new Error(extractFirstError(parsedService.error))
  }

  const parsedPricing = pricingSchema.safeParse(pricingData)
  if (!parsedPricing.success) {
    throw new Error(extractFirstError(parsedPricing.error))
  }

  const parsedBooking = bookingRulesSchema.safeParse(bookingRules)
  if (!parsedBooking.success) {
    throw new Error(extractFirstError(parsedBooking.error))
  }

  const validatedService = parsedService.data
  const validatedPricing = parsedPricing.data
  const validatedBooking = parsedBooking.data

  const supabase = options.supabase ?? await getSupabaseClient()
  const slug = await generateUniqueServiceSlug(supabase, salonId, validatedService.name)
  const now = options.now?.() ?? new Date()
  const timestamp = now.toISOString()

  const { data: service, error: serviceError } = await supabase
    .schema('catalog')
    .from('services')
    .insert({
      salon_id: salonId,
      name: validatedService.name,
      slug,
      description: validatedService.description ?? null,
      category_id: validatedService.category_id ?? null,
      is_active: validatedService.is_active,
      is_bookable: validatedService.is_bookable,
      is_featured: validatedService.is_featured,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select('id')
    .single<{ id: string }>()

  if (serviceError) throw serviceError

  const basePrice = validatedPricing.base_price
  const { currentPrice, salePrice, profitMargin } = derivePricingMetrics(
    basePrice,
    validatedPricing.sale_price,
    validatedPricing.cost,
  )

  const { error: pricingError } = await supabase
    .schema('catalog')
    .from('service_pricing_view')
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
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
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
    .from('service_booking_rules_view')
    .insert({
      service_id: service.id,
      duration_minutes: durationMinutes,
      buffer_minutes: bufferMinutes,
      total_duration_minutes: totalDurationMinutes,
      min_advance_booking_hours: validatedBooking.min_advance_booking_hours ?? 1,
      max_advance_booking_days: validatedBooking.max_advance_booking_days ?? 90,
      created_by_id: session.user.id,
      updated_by_id: session.user.id,
      created_at: timestamp,
      updated_at: timestamp,
    })

  if (rulesError) {
    await supabase.schema('catalog').from('service_pricing_view').delete().eq('service_id', service.id)
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
    throw rulesError
  }

  revalidatePath('/business/services')
  return service
}
