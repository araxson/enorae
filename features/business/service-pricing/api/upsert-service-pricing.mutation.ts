'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { resolveSalonContext, UUID_REGEX } from '@/features/business/business-common/api/salon-context'

const pricingSchema = z.object({
  serviceId: z.string().regex(UUID_REGEX, 'Invalid service ID'),
  basePrice: z.number().min(0, 'Base price must be positive'),
  salePrice: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  isTaxable: z.boolean().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  currencyCode: z.string().default('USD'),
})

const updatePricingSchema = pricingSchema.extend({
  id: z.string().regex(UUID_REGEX, 'Invalid pricing ID'),
})

const CATALOG_SCHEMA = 'catalog'
const PRICING_TABLE = 'service_pricing'
const SERVICES_TABLE = 'services'
const SERVICES_PATH = '/business/services'
const PRICING_PATH = '/business/services/pricing'

type PricingInput = z.infer<typeof pricingSchema>

type PricingPayload = {
  id?: string
  serviceId: string
  basePrice: number
  salePrice?: number
  cost?: number
  taxRate?: number
  isTaxable?: boolean
  commissionRate?: number
  currencyCode: string
}

const parsePricingForm = (formData: FormData): PricingPayload => ({
  id: formData.get('id')?.toString(),
  serviceId: formData.get('serviceId') as string,
  basePrice: parseFloat(formData.get('basePrice') as string),
  salePrice: formData.get('salePrice') ? parseFloat(formData.get('salePrice') as string) : undefined,
  cost: formData.get('cost') ? parseFloat(formData.get('cost') as string) : undefined,
  taxRate: formData.get('taxRate') ? parseFloat(formData.get('taxRate') as string) : undefined,
  isTaxable: formData.get('isTaxable') === 'true',
  commissionRate: formData.get('commissionRate') ? parseFloat(formData.get('commissionRate') as string) : undefined,
  currencyCode: (formData.get('currencyCode') as string) || 'USD',
})

const buildPricingRecord = (pricing: PricingInput, userId: string) => {
  const currentPrice = pricing.salePrice && pricing.salePrice > 0 ? pricing.salePrice : pricing.basePrice
  const profitMargin = pricing.cost && pricing.cost > 0
    ? ((currentPrice - pricing.cost) / currentPrice) * 100
    : null

  return {
    service_id: pricing.serviceId,
    base_price: pricing.basePrice,
    sale_price: pricing.salePrice || null,
    current_price: currentPrice,
    cost: pricing.cost || null,
    tax_rate: pricing.taxRate || null,
    is_taxable: pricing.isTaxable ?? true,
    commission_rate: pricing.commissionRate || null,
    profit_margin: profitMargin,
    currency_code: pricing.currencyCode,
    updated_by_id: userId,
  }
}

export async function upsertServicePricing(formData: FormData) {
  try {
    const payload = parsePricingForm(formData)
    const schema = payload.id ? updatePricingSchema : pricingSchema
    const parsed = schema.safeParse(payload)

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message || 'Validation failed' }
    }

    const { supabase, session, salonId } = await resolveSalonContext()

    const { data: service } = await supabase
      .schema(CATALOG_SCHEMA)
      .from(SERVICES_TABLE)
      .select('salon_id')
      .eq('id', parsed.data.serviceId)
      .single<{ salon_id: string | null }>()

    if (service?.salon_id !== salonId) {
      return { error: 'Unauthorized: Service not found for your salon' }
    }

    const pricingRecord = buildPricingRecord(parsed.data, session.user.id)

    if (payload.id) {
      const { error: updateError } = await supabase
        .schema(CATALOG_SCHEMA)
        .from(PRICING_TABLE)
        .update({
          ...pricingRecord,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.id)

      if (updateError) {
        return { error: updateError.message }
      }
    } else {
      const { error: insertError } = await supabase
        .schema(CATALOG_SCHEMA)
        .from(PRICING_TABLE)
        .insert({
          ...pricingRecord,
          created_by_id: session.user.id,
        })

      if (insertError) {
        return { error: insertError.message }
      }
    }

    revalidatePath(PRICING_PATH, 'page')
    revalidatePath(SERVICES_PATH, 'page')
    return { success: true }
  } catch (error) {
    console.error('Error upserting service pricing:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to save pricing',
    }
  }
}
