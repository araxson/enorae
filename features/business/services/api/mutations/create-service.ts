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
  rollbackService,
  type ServiceFormData,
  type ServicePricingData,
  type ServiceBookingRulesData,
} from './create-service-helpers'
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

  const validatedService = serviceSchema.parse(serviceData)
  const validatedPricing = pricingSchema.parse(pricingData)
  const validatedBooking = bookingRulesSchema.parse(bookingRules)

  if (!validatedService.category_id) {
    logger.error('Missing service category', 'validation')
    throw new Error('A service category is required')
  }

  const supabase = options.supabase ?? await getSupabaseClient()
  const slug = await generateUniqueServiceSlug(supabase, salonId, validatedService.name)
  const timestamp = (options.now?.() ?? new Date()).toISOString()

  const serviceInsert = buildServiceInsert(salonId, validatedService, slug, session, timestamp)

  const serviceResult = await supabase
    .schema('catalog')
    .from('services')
    .insert(serviceInsert)
    .select('id')
    .single()

  const serviceError = serviceResult.error
  const service = serviceResult.data as { id: string } | null

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
