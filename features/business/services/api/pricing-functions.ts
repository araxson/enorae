'use server'

import 'server-only'

import { z } from 'zod'

import { resolveSalonContext, UUID_REGEX } from '@/features/shared/service-pricing/api/shared'

const dynamicPricingSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  bookingTime: z.coerce.date(),
  customerId: z.string().regex(UUID_REGEX, 'Invalid customer ID').optional(),
})

type DynamicPricingInput = {
  serviceId: string
  bookingTime: string | Date
  customerId?: string
}

type DynamicPricingResult = {
  price: number | null
}

export async function calculateDynamicPrice(input: DynamicPricingInput): Promise<DynamicPricingResult> {
  const payload = dynamicPricingSchema.safeParse({
    serviceId: input.serviceId,
    bookingTime: input.bookingTime instanceof Date ? input.bookingTime.toISOString() : input.bookingTime,
    customerId: input.customerId,
  })

  if (!payload.success) {
    throw new Error(payload.error.errors[0]?.message ?? 'Invalid pricing input')
  }

  const { bookingTime, serviceId, customerId } = payload.data

  const { supabase, salonId } = await resolveSalonContext()

  const { data: service, error: serviceError } = await supabase
    .schema('catalog')
    .from('services')
    .select('salon_id')
    .eq('id', serviceId)
    .single<{ salon_id: string | null }>()

  if (serviceError) {
    throw new Error(serviceError.message)
  }

  if (service?.salon_id !== salonId) {
    throw new Error('Unauthorized: Service not found for your salon')
  }

  const { data, error } = await supabase.rpc<number>('calculate_service_price', {
    p_service_id: serviceId,
    p_customer_id: customerId ?? null,
    p_booking_time: bookingTime.toISOString(),
  })

  if (error) {
    throw new Error(error.message)
  }

  return {
    price: typeof data === 'number' ? data : null,
  }
}

/**
 * Apply dynamic pricing rules to a base price
 * Uses: catalog.apply_dynamic_pricing (when available)
 */
export async function applyDynamicPricing({
  basePrice,
  serviceId,
  bookingTime,
}: {
  basePrice: number
  serviceId: string
  bookingTime: string | Date
}): Promise<number> {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // TODO: Replace with actual RPC when database function is available
  // const { data, error } = await supabase.rpc('apply_dynamic_pricing', {
  //   p_base_price: basePrice,
  //   p_service_id: serviceId,
  //   p_booking_time: typeof bookingTime === 'string' ? bookingTime : bookingTime.toISOString(),
  //   p_salon_id: salonId,
  // })

  // For now, return base price without adjustments
  return basePrice
}

const couponSchema = z.object({
  code: z.string().min(1).max(50),
  customerId: z.string().regex(UUID_REGEX).optional(),
  amount: z.number().positive(),
})

type CouponValidationResult = {
  valid: boolean
  discountAmount?: number
  discountPercentage?: number
  finalAmount?: number
  error?: string
}

/**
 * Validate a coupon code
 * Uses: catalog.validate_coupon (when available)
 */
export async function validateCoupon(input: {
  code: string
  customerId?: string
  amount: number
}): Promise<CouponValidationResult> {
  const parsed = couponSchema.safeParse(input)
  if (!parsed.success) {
    return {
      valid: false,
      error: parsed.error.errors[0]?.message ?? 'Invalid input',
    }
  }

  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()

  const supabase = await createClient()

  // TODO: Replace with actual RPC when database function is available
  // const { data, error } = await supabase.rpc('validate_coupon', {
  //   p_code: parsed.data.code,
  //   p_salon_id: salonId,
  //   p_customer_id: parsed.data.customerId || null,
  //   p_amount: parsed.data.amount,
  // })

  // For now, return invalid coupon with placeholder message
  return {
    valid: false,
    error: 'Coupon validation not yet implemented (database function pending)',
  }
}
