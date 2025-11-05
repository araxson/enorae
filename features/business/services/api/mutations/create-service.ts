'use server'
import 'server-only'

import { canAccessSalon } from '@/lib/auth'
import { createOperationLogger } from '@/lib/observability'
import { revalidatePath } from 'next/cache'
import {
  ensureBusinessUser,
  generateUniqueServiceSlug,
  getSupabaseClient,
} from './shared'
import { serviceSchema, pricingSchema, bookingRulesSchema } from './create-service-schemas'
import {
  buildServiceInsert,
  buildPricingInsert,
  buildBookingRulesInsert,
  type ServiceFormData,
  type ServicePricingData,
  type ServiceBookingRulesData,
} from './create-service-helpers'
import { rollbackService } from './create-service-rollback' // Server-only function - imported directly
import type { MutationOptions } from '@/lib/types/mutations'

export type { ServiceFormData, ServicePricingData, ServiceBookingRulesData }

export async function createService(
  salonId: string,
  serviceData: ServiceFormData,
  pricingData: ServicePricingData,
  bookingRules: ServiceBookingRulesData,
  options: MutationOptions = {},
) {
  const logger = createOperationLogger('createService', { salonId })
  logger.start()

  const session = options.session ?? await ensureBusinessUser()
  if (!options.skipAccessCheck && !(await canAccessSalon(salonId))) {
    logger.error('Unauthorized access attempt', 'permission', { userId: session.user.id })
    throw new Error('Unauthorized: Not your salon')
  }

  const serviceResult = serviceSchema.safeParse(serviceData)
  if (!serviceResult.success) {
    const fieldErrors = serviceResult.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors)[0]?.[0]
    throw new Error(firstError ?? 'Service validation failed')
  }
  const validatedService = serviceResult.data

  const pricingResult = pricingSchema.safeParse(pricingData)
  if (!pricingResult.success) {
    const fieldErrors = pricingResult.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors)[0]?.[0]
    throw new Error(firstError ?? 'Pricing validation failed')
  }
  const validatedPricing = pricingResult.data

  const bookingResult = bookingRulesSchema.safeParse(bookingRules)
  if (!bookingResult.success) {
    const fieldErrors = bookingResult.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors)[0]?.[0]
    throw new Error(firstError ?? 'Booking rules validation failed')
  }
  const validatedBooking = bookingResult.data

  if (!validatedService.category_id) {
    logger.error('Missing service category', 'validation')
    throw new Error('A service category is required')
  }

  const supabase = options.supabase ?? await getSupabaseClient()
  const slug = await generateUniqueServiceSlug(supabase, salonId, validatedService.name)
  const timestamp = (options.now?.() ?? new Date()).toISOString()

  const serviceInsert = buildServiceInsert(salonId, validatedService, slug, session, timestamp)

  const serviceDbResult = await supabase
    .schema('catalog')
    .from('services')
    .insert(serviceInsert)
    .select('id')
    .single()

  const serviceError = serviceDbResult.error
  const service = serviceDbResult.data as { id: string } | null

  if (serviceError || !service) {
    logger.error('Service insert failed', 'database', { error: serviceError })
    throw serviceError ?? new Error('Failed to create service')
  }

  logger.success({ serviceId: service.id, serviceName: validatedService.name })

  const pricingInsert = buildPricingInsert(service.id, validatedPricing, session, timestamp)

  const { error: pricingError } = await supabase
    .schema('catalog')
    .from('service_pricing')
    .insert(pricingInsert)

  if (pricingError) {
    logger.error('Pricing insert failed, rolling back service', 'database', { error: pricingError })
    await rollbackService(supabase, service.id, false)
    throw pricingError
  }

  const bookingInsert = buildBookingRulesInsert(service.id, validatedBooking, session, timestamp)

  const { error: rulesError } = await supabase
    .schema('catalog')
    .from('service_booking_rules')
    .insert(bookingInsert)

  if (rulesError) {
    logger.error('Booking rules insert failed, rolling back all', 'database', { error: rulesError })
    await rollbackService(supabase, service.id, true)
    throw rulesError
  }

  logger.success({
    serviceId: service.id,
    basePrice: pricingInsert.base_price,
    duration: bookingInsert.duration_minutes,
  })

  revalidatePath('/business/services', 'page')
  return service
}
