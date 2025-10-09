import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { requireAnyRole, requireUserSalonId, ROLE_GROUPS } from '@/lib/auth'
import type { Database } from '@/lib/types/database.types'

// COMPLIANCE: Use public view types for SELECTs
type StockAlert = Database['public']['Views']['stock_alerts']['Row']

type StockAlertRelations = {
  product: {
    id: string
    name: string
    sku: string | null
    unit_of_measure: string | null
    salon_id?: string | null
  } | null
  location: {
    id: string
    name: string
  } | null
}

export type StockAlertWithProduct = StockAlert & StockAlertRelations

const SELECT_FIELDS = `
  *,
  product:products!fk_stock_alerts_product(
    id,
    name,
    sku,
    unit_of_measure,
    salon_id
  ),
  location:stock_locations!stock_alerts_location_id_fkey(
    id,
    name
  )
`

async function getScopedQuery() {
  await requireAnyRole(ROLE_GROUPS.BUSINESS_USERS)
  const salonId = await requireUserSalonId()
  if (!salonId) throw new Error('User salon not found')

  const supabase = await createClient()
  const baseQuery = supabase
    .from('stock_alerts')
    .select(SELECT_FIELDS)
    .eq('products.salon_id', salonId)

  return { baseQuery, salonId }
}

async function fetchAlertList(modify?: (query: any) => any) {
  const { baseQuery } = await getScopedQuery()
  const orderedQuery = baseQuery.order('created_at', { ascending: false })
  const query = modify ? modify(orderedQuery) : orderedQuery

  const { data, error } = await query
  if (error) throw error
  return (data || []) as StockAlertWithProduct[]
}

export async function getStockAlerts(): Promise<StockAlertWithProduct[]> {
  return fetchAlertList()
}

export async function getUnresolvedStockAlerts(): Promise<StockAlertWithProduct[]> {
  return fetchAlertList((query) => query.eq('is_resolved', false))
}

export async function getStockAlertsByType(alertType: string): Promise<StockAlertWithProduct[]> {
  return fetchAlertList((query) => query.eq('alert_type', alertType))
}

export async function getStockAlertsByLevel(alertLevel: string): Promise<StockAlertWithProduct[]> {
  return fetchAlertList((query) => query.eq('alert_level', alertLevel))
}

export async function getStockAlertById(id: string): Promise<StockAlertWithProduct | null> {
  const { baseQuery, salonId } = await getScopedQuery()
  const { data, error } = await baseQuery.eq('id', id).single()

  if (error) throw error
  if (!data) return null

  const alertData = data as StockAlertWithProduct & { product?: { salon_id?: string } }
  if (alertData.product?.salon_id && alertData.product.salon_id !== salonId) {
    throw new Error('Unauthorized: Alert not found for your salon')
  }

  return alertData
}
