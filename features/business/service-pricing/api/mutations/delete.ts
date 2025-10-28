'use server'

import { revalidatePath } from 'next/cache'
import { resolveSalonContext, UUID_REGEX } from '@/features/business/business-common/api/salon-context'

const CATALOG_SCHEMA = 'catalog'
const PRICING_TABLE = 'service_pricing'
const SERVICES_PATH = '/business/services'
const PRICING_PATH = '/business/services/pricing'

type PricingWithService = {
  id: string
  service: {
    salon_id: string | null
  } | null
}

export async function deleteServicePricing(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id || !UUID_REGEX.test(id)) {
      return { error: 'Invalid pricing ID' }
    }

    const { supabase, session, salonId } = await resolveSalonContext()

    const { data: pricing } = await supabase
      .schema(CATALOG_SCHEMA)
      .from(PRICING_TABLE)
      .select(`
        id,
        service:services!fk_service_pricing_service(salon_id)
      `)
      .eq('id', id)
      .single<PricingWithService>()

    if (pricing?.service?.salon_id !== salonId) {
      return { error: 'Unauthorized: Pricing not found for your salon' }
    }

    const { error: deleteError } = await supabase
      .schema(CATALOG_SCHEMA)
      .from(PRICING_TABLE)
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (deleteError) {
      return { error: deleteError.message }
    }

    revalidatePath(PRICING_PATH, 'page')
    revalidatePath(SERVICES_PATH, 'page')
    return { success: true }
  } catch (error) {
    console.error('Error deleting service pricing:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete pricing',
    }
  }
}
