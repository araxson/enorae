'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  categoryId: z.string(),
  supplierId: z.string().optional(),
  unitPrice: z.number().positive(),
  retailPrice: z.number().positive(),
  reorderPoint: z.number().nonnegative(),
  quantity: z.number().nonnegative(),
})

export async function createProduct(salonId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const parsed = productSchema.parse({
    name: formData.get('name'),
    sku: formData.get('sku'),
    categoryId: formData.get('categoryId'),
    supplierId: formData.get('supplierId') || undefined,
    unitPrice: Number(formData.get('unitPrice')),
    retailPrice: Number(formData.get('retailPrice')),
    reorderPoint: Number(formData.get('reorderPoint')),
    quantity: Number(formData.get('quantity')),
  })

  // Create product
  const { data: product, error: productError } = await (supabase as any)
    .from('products')
    .insert({
      salon_id: salonId,
      name: parsed.name,
      sku: parsed.sku,
      category_id: parsed.categoryId,
      supplier_id: parsed.supplierId,
      unit_price: parsed.unitPrice,
      retail_price: parsed.retailPrice,
    })
    .select()
    .single()

  if (productError) throw productError

  // Create inventory record
  const { error: inventoryError } = await (supabase as any)
    .from('inventory')
    .insert({
      product_id: product.id,
      quantity: parsed.quantity,
      reorder_point: parsed.reorderPoint,
    })

  if (inventoryError) throw inventoryError
  revalidatePath('/business/inventory')
}

export async function updateInventory(productId: string, quantity: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('inventory')
    .update({
      quantity,
      last_restocked: new Date().toISOString()
    })
    .eq('product_id', productId)

  if (error) throw error
  revalidatePath('/business/inventory')
}

export async function createSupplier(salonId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase as any)
    .from('suppliers')
    .insert({
      salon_id: salonId,
      name: formData.get('name') as string,
      contact_name: formData.get('contactName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    })

  if (error) throw error
  revalidatePath('/business/inventory/suppliers')
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) throw error
  revalidatePath('/business/inventory')
}