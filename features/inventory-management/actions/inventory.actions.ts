'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Note: inventory schema tables (products, suppliers, purchase_orders, stock_levels, stock_movements, stock_alerts)
// don't have public views yet. Keeping .schema() calls until public views are created.

// UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Validation schemas
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  category_id: z.string().uuid().optional(),
  supplier_id: z.string().uuid().optional(),
  cost_price: z.number().min(0).optional(),
  retail_price: z.number().min(0).optional(),
  reorder_point: z.number().int().min(0).optional(),
  reorder_quantity: z.number().int().min(0).optional(),
  unit_of_measure: z.string().optional(),
  is_active: z.boolean().default(true),
  is_tracked: z.boolean().default(true),
})

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
})

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().default(true),
})

const purchaseOrderSchema = z.object({
  supplier_id: z.string().uuid(),
  expected_delivery_at: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity_ordered: z.number().int().min(1),
    unit_price: z.number().min(0),
  })).min(1, 'At least one item is required'),
})

type ActionResult = {
  success?: boolean
  error?: string
  data?: any
}

/**
 * Create a new product
 */
export async function createProduct(salonId: string, data: z.infer<typeof productSchema>): Promise<ActionResult> {
  try {
    // Validate inputs
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const validated = productSchema.parse(data)
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Create product
    const { data: product, error } = await supabase
      .schema('inventory')
      .from('products')
      .insert({
        ...validated,
        salon_id: salonId,
        created_by_id: user.id,
        updated_by_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/inventory')
    return { success: true, data: product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { error: error instanceof Error ? error.message : 'Failed to create product' }
  }
}

/**
 * Update a product
 */
export async function updateProduct(productId: string, data: Partial<z.infer<typeof productSchema>>): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(productId)) {
      return { error: 'Invalid product ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify ownership
    const { data: product } = await supabase
      .schema('inventory')
      .from('products')
      .select('salon_id')
      .eq('id', productId)
      .single()

    if (!product) return { error: 'Product not found' }

    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', product.salon_id)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your product' }
    }

    // Update product
    const { data: updated, error } = await supabase
      .schema('inventory')
      .from('products')
      .update({
        ...data,
        updated_by_id: user.id,
      })
      .eq('id', productId)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/inventory')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating product:', error)
    return { error: error instanceof Error ? error.message : 'Failed to update product' }
  }
}

/**
 * Soft delete a product
 */
export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(productId)) {
      return { error: 'Invalid product ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify ownership
    const { data: product } = await supabase
      .schema('inventory')
      .from('products')
      .select('salon_id')
      .eq('id', productId)
      .single()

    if (!product) return { error: 'Product not found' }

    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', product.salon_id)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your product' }
    }

    // Soft delete
    const { error } = await supabase
      .schema('inventory')
      .from('products')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by_id: user.id,
      })
      .eq('id', productId)

    if (error) throw error

    revalidatePath('/business/inventory')
    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: error instanceof Error ? error.message : 'Failed to delete product' }
  }
}

/**
 * Create a new supplier
 */
export async function createSupplier(salonId: string, data: z.infer<typeof supplierSchema>): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const validated = supplierSchema.parse(data)
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Create supplier
    const { data: supplier, error } = await supabase
      .schema('inventory')
      .from('suppliers')
      .insert({
        ...validated,
        salon_id: salonId,
        created_by_id: user.id,
        updated_by_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/business/inventory')
    return { success: true, data: supplier }
  } catch (error) {
    console.error('Error creating supplier:', error)
    return { error: error instanceof Error ? error.message : 'Failed to create supplier' }
  }
}

/**
 * Create a purchase order
 */
export async function createPurchaseOrder(salonId: string, data: z.infer<typeof purchaseOrderSchema>): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(salonId)) {
      return { error: 'Invalid salon ID format' }
    }

    const validated = purchaseOrderSchema.parse(data)
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Verify salon ownership
    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', salonId)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your salon' }
    }

    // Calculate total amount
    const totalAmount = validated.items.reduce((sum, item) => {
      return sum + (item.quantity_ordered * item.unit_price)
    }, 0)

    // Generate order number (PO-YYYYMMDD-XXXX format)
    const orderNumber = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Create purchase order
    const { data: order, error: orderError } = await supabase
      .schema('inventory')
      .from('purchase_orders')
      .insert({
        salon_id: salonId,
        supplier_id: validated.supplier_id,
        order_number: orderNumber,
        expected_delivery_at: validated.expected_delivery_at || null,
        notes: validated.notes || null,
        total_amount: totalAmount,
        status: 'pending',
        created_by_id: user.id,
        updated_by_id: user.id,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = validated.items.map(item => ({
      purchase_order_id: order.id,
      product_id: item.product_id,
      quantity_ordered: item.quantity_ordered,
      unit_price: item.unit_price,
      total_price: item.quantity_ordered * item.unit_price,
    }))

    const { error: itemsError } = await supabase
      .schema('inventory')
      .from('purchase_order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    revalidatePath('/business/inventory')
    return { success: true, data: order }
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return { error: error instanceof Error ? error.message : 'Failed to create purchase order' }
  }
}

/**
 * Update stock level
 */
export async function updateStockLevel(locationId: string, productId: string, quantity: number, reason: string): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(locationId) || !UUID_REGEX.test(productId)) {
      return { error: 'Invalid ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // SECURITY: Verify product belongs to user's salon
    const { data: product } = await supabase
      .schema('inventory')
      .from('products')
      .select('salon_id')
      .eq('id', productId)
      .single()

    if (!product) return { error: 'Product not found' }

    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', product.salon_id)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your product' }
    }

    // SECURITY: Verify location belongs to user's salon
    const { data: location } = await supabase
      .schema('inventory')
      .from('stock_locations')
      .select('salon_id')
      .eq('id', locationId)
      .single()

    if (!location) return { error: 'Location not found' }
    if (location.salon_id !== product.salon_id) {
      return { error: 'Location and product must belong to same salon' }
    }

    // Get current stock level
    const { data: currentStock } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .select('quantity')
      .eq('location_id', locationId)
      .eq('product_id', productId)
      .single()

    const currentQuantity = currentStock?.quantity || 0
    const newQuantity = currentQuantity + quantity

    // Update stock level (upsert)
    const { error: stockError } = await supabase
      .schema('inventory')
      .from('stock_levels')
      .upsert({
        location_id: locationId,
        product_id: productId,
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })

    if (stockError) throw stockError

    // Record stock movement
    const { error: movementError } = await supabase
      .schema('inventory')
      .from('stock_movements')
      .insert({
        location_id: locationId,
        product_id: productId,
        quantity: quantity,
        movement_type: quantity > 0 ? 'adjustment_in' : 'adjustment_out',
        reason,
        performed_by_id: user.id,
      })

    if (movementError) throw movementError

    revalidatePath('/business/inventory')
    return { success: true }
  } catch (error) {
    console.error('Error updating stock level:', error)
    return { error: error instanceof Error ? error.message : 'Failed to update stock level' }
  }
}

/**
 * Resolve a stock alert
 */
export async function resolveStockAlert(alertId: string): Promise<ActionResult> {
  try {
    if (!UUID_REGEX.test(alertId)) {
      return { error: 'Invalid alert ID format' }
    }

    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // SECURITY: Verify alert belongs to user's product/salon
    const { data: alert } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .select('product_id')
      .eq('id', alertId)
      .single()

    if (!alert) return { error: 'Alert not found' }

    // Verify product belongs to user's salon
    const { data: product } = await supabase
      .schema('inventory')
      .from('products')
      .select('salon_id')
      .eq('id', alert.product_id)
      .single()

    if (!product) return { error: 'Product not found' }

    const { data: salon } = await supabase
      .from('salons')
      .select('owner_id')
      .eq('id', product.salon_id)
      .single()

    const typedSalon = salon as { owner_id: string | null } | null
    if (!typedSalon || typedSalon.owner_id !== user.id) {
      return { error: 'Unauthorized: Not your alert' }
    }

    // Resolve alert
    const { error } = await supabase
      .schema('inventory')
      .from('stock_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by_id: user.id,
      })
      .eq('id', alertId)

    if (error) throw error

    revalidatePath('/business/inventory')
    return { success: true }
  } catch (error) {
    console.error('Error resolving stock alert:', error)
    return { error: error instanceof Error ? error.message : 'Failed to resolve alert' }
  }
}
