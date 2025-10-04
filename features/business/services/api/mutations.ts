'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, ROLE_GROUPS } from '@/lib/auth'

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
  sale_price?: number
  currency_code: string
  is_taxable?: boolean
  tax_rate?: number
  commission_rate?: number
}

export type ServiceBookingRulesData = {
  duration_minutes: number
  buffer_minutes?: number
  min_advance_booking_hours?: number
  max_advance_booking_days?: number
}

/**
 * Create a new service with pricing and booking rules
 */
export async function createService(
  salonId: string,
  serviceData: ServiceFormData,
  pricingData: ServicePricingData,
  bookingRules: ServiceBookingRulesData
) {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Generate slug from name
  const slug = serviceData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  // Create service
  const { data: service, error: serviceError } = await supabase
    .schema('catalog')
    .from('services')
    .insert({
      salon_id: salonId,
      name: serviceData.name,
      slug,
      description: serviceData.description,
      category_id: serviceData.category_id,
      is_active: serviceData.is_active,
      is_bookable: serviceData.is_bookable,
      is_featured: serviceData.is_featured,
    })
    .select('id')
    .single()

  if (serviceError) throw serviceError

  // Create pricing
  const { error: pricingError } = await supabase
    .schema('catalog')
    .from('service_pricing')
    .insert({
      service_id: service.id,
      base_price: pricingData.base_price,
      sale_price: pricingData.sale_price,
      current_price: pricingData.sale_price || pricingData.base_price,
      currency_code: pricingData.currency_code,
      is_taxable: pricingData.is_taxable ?? true,
      tax_rate: pricingData.tax_rate ?? null,
      commission_rate: pricingData.commission_rate ?? null,
    })

  if (pricingError) {
    // Rollback: delete service if pricing creation fails
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
    throw pricingError
  }

  // Create booking rules
  const { error: rulesError } = await supabase
    .schema('catalog')
    .from('service_booking_rules')
    .insert({
      service_id: service.id,
      duration_minutes: bookingRules.duration_minutes,
      buffer_minutes: bookingRules.buffer_minutes || 0,
      total_duration_minutes: bookingRules.duration_minutes + (bookingRules.buffer_minutes || 0),
      min_advance_booking_hours: bookingRules.min_advance_booking_hours || 1,
      max_advance_booking_days: bookingRules.max_advance_booking_days || 90,
    })

  if (rulesError) {
    // Rollback: delete service and pricing if rules creation fails
    await supabase.schema('catalog').from('service_pricing').delete().eq('service_id', service.id)
    await supabase.schema('catalog').from('services').delete().eq('id', service.id)
    throw rulesError
  }

  revalidatePath('/business/services')
  return service
}

/**
 * Update an existing service
 */
export async function updateService(
  serviceId: string,
  serviceData: Partial<ServiceFormData>,
  pricingData?: Partial<ServicePricingData>,
  bookingRules?: Partial<ServiceBookingRulesData>
) {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Update service
  if (Object.keys(serviceData).length > 0) {
    const { error: serviceError } = await supabase
      .schema('catalog')
      .from('services')
      .update(serviceData)
      .eq('id', serviceId)

    if (serviceError) throw serviceError
  }

  // Update pricing
  if (pricingData && Object.keys(pricingData).length > 0) {
    const { error: pricingError } = await supabase
      .schema('catalog')
      .from('service_pricing')
      .update(pricingData)
      .eq('service_id', serviceId)

    if (pricingError) throw pricingError
  }

  // Update booking rules
  if (bookingRules && Object.keys(bookingRules).length > 0) {
    const { error: rulesError } = await supabase
      .schema('catalog')
      .from('service_booking_rules')
      .update(bookingRules)
      .eq('service_id', serviceId)

    if (rulesError) throw rulesError
  }

  revalidatePath('/business/services')
  return { success: true }
}

/**
 * Delete a service (soft delete by setting discontinued_at)
 */
export async function deleteService(serviceId: string) {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  const { error } = await supabase
    .schema('catalog')
    .from('services')
    .update({
      discontinued_at: new Date().toISOString(),
      is_active: false,
      is_bookable: false,
    })
    .eq('id', serviceId)

  if (error) throw error

  revalidatePath('/business/services')
  return { success: true }
}

/**
 * Permanently delete a service (hard delete)
 * Use with caution - only for services never booked
 */
export async function permanentlyDeleteService(serviceId: string) {
  // SECURITY: Require business user role
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const supabase = await createClient()

  // Check if service has any appointments
  const { data: appointments, error: checkError } = await supabase
    .from('appointments')
    .select('id')
    .eq('service_id', serviceId)
    .limit(1)

  if (checkError) throw checkError
  if (appointments && appointments.length > 0) {
    throw new Error('Cannot delete service with existing appointments. Use discontinue instead.')
  }

  // Delete pricing and rules first (foreign key constraints)
  await supabase.schema('catalog').from('service_pricing').delete().eq('service_id', serviceId)

  await supabase.schema('catalog').from('service_booking_rules').delete().eq('service_id', serviceId)

  // Delete service
  const { error } = await supabase
    .schema('catalog')
    .from('services')
    .delete()
    .eq('id', serviceId)

  if (error) throw error

  revalidatePath('/business/services')
  return { success: true }
}
