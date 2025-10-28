'use server'
import 'server-only'

import { revalidatePath } from 'next/cache'

import { canAccessSalon } from '@/lib/auth'
import type { Session } from '@/lib/auth'
import {
  ensureBusinessUser,
  generateUniqueServiceSlug,
  getSupabaseClient,
  type SupabaseServerClient,
} from './shared'
import { serviceSchema, pricingSchema, bookingRulesSchema } from './create-service-schemas'
import {
  extractFirstError,
  buildServiceInsert,
  buildPricingInsert,
  buildBookingRulesInsert,
  rollbackService,
  type ServiceFormData,
  type ServicePricingData,
  type ServiceBookingRulesData,
} from './create-service-helpers'

export type { ServiceFormData, ServicePricingData, ServiceBookingRulesData }

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

  const serviceInsert = buildServiceInsert(salonId, validatedService, slug, session, timestamp)

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

  const pricingInsert = buildPricingInsert(service.id, validatedPricing, session, timestamp)

  const { error: pricingError } = await supabase
    .schema('catalog')
    .from('service_pricing')
    .insert(pricingInsert)

  if (pricingError) {
    console.error('createService pricing insert failed - rolling back service', {
      salonId,
      serviceId: service.id,
      userId: session.user.id,
      basePrice: validatedPricing.base_price,
      error: pricingError.message
    })
    await rollbackService(supabase, service.id, false)
    console.log('createService rollback completed - service deleted', {
      serviceId: service.id,
      userId: session.user.id
    })
    throw pricingError
  }

  const bookingInsert = buildBookingRulesInsert(service.id, validatedBooking, session, timestamp)

  const { error: rulesError } = await supabase
    .schema('catalog')
    .from('service_booking_rules')
    .insert(bookingInsert)

  if (rulesError) {
    console.error('createService booking rules insert failed - rolling back all', {
      salonId,
      serviceId: service.id,
      userId: session.user.id,
      durationMinutes: bookingInsert.duration_minutes,
      error: rulesError.message
    })
    await rollbackService(supabase, service.id, true)
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
    basePrice: pricingInsert.base_price,
    currentPrice: pricingInsert.current_price,
    durationMinutes: bookingInsert.duration_minutes,
    userId: session.user.id
  })

  revalidatePath('/business/services', 'page')
  return service
}
