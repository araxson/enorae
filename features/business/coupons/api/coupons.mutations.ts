'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

interface CouponInput {
  salon_id: string
  code: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_purchase_amount?: number
  max_discount_amount?: number
  max_uses?: number
  max_uses_per_customer?: number
  valid_from: string
  valid_until: string
  is_active: boolean
  applicable_services?: string[]
  applicable_customer_ids?: string[]
}

interface BulkCouponInput {
  prefix: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  min_purchase_amount?: number | null
  max_discount_amount?: number | null
  max_uses?: number | null
  max_uses_per_customer?: number | null
}

export async function createCoupon(input: CouponInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('coupons')
    .insert({
      ...input,
      created_by_id: user.id,
    })

  if (error) throw error

  revalidatePath('/business/coupons')
  revalidatePath('/business/promotions')
}

export async function updateCoupon(id: string, input: Partial<CouponInput>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('coupons')
    .update({
      ...input,
      updated_by_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/business/coupons')
  revalidatePath('/business/promotions')
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('coupons')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by_id: user.id,
    })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/business/coupons')
  revalidatePath('/business/promotions')
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .schema('catalog')
    .from('coupons')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) throw error

  revalidatePath('/business/coupons')
  revalidatePath('/business/promotions')
}

export async function applyCoupon(
  couponCode: string,
  appointmentId: string,
  discountAmount: number
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Record coupon usage
  const { error } = await supabase
    .schema('catalog')
    .from('coupon_usage')
    .insert({
      coupon_code: couponCode,
      appointment_id: appointmentId,
      customer_id: user.id,
      discount_amount: discountAmount,
    })

  if (error) throw error

  revalidatePath('/business/appointments')
}

export async function bulkGenerateCoupons(salonId: string, input: BulkCouponInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const sanitizedPrefix = input.prefix.trim().toUpperCase()
  const count = Math.max(1, Math.min(input.count, 100))

  const codes = new Set<string>()
  while (codes.size < count) {
    const random = Math.random().toString(36).slice(-6).toUpperCase()
    codes.add(`${sanitizedPrefix}${random}`)
  }

  const now = new Date().toISOString()
  const rows = Array.from(codes).map((code) => ({
    salon_id: salonId,
    code,
    description: input.description,
    discount_type: input.discount_type,
    discount_value: input.discount_value,
    min_purchase_amount: input.min_purchase_amount ?? null,
    max_discount_amount: input.max_discount_amount ?? null,
    max_uses: input.max_uses ?? null,
    max_uses_per_customer: input.max_uses_per_customer ?? null,
    valid_from: input.valid_from || now,
    valid_until: input.valid_until || now,
    is_active: input.is_active,
    created_by_id: user.id,
  }))

  const { error } = await supabase
    .schema('catalog')
    .from('coupons')
    .insert(rows)

  if (error) throw error

  revalidatePath('/business/coupons')
  revalidatePath('/business/promotions')

  return { generated: rows.length }
}
