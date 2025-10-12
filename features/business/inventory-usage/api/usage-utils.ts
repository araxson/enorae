import type { Database } from '@/lib/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ProductSummary, ServiceSummary } from './types'

export type Client = SupabaseClient<Database>

export const numberOrZero = (value: unknown): number =>
  typeof value === 'number' ? value : Number(value) || 0

export const fetchProductName = async (supabase: Client, productId: string): Promise<string> => {
  const { data } = await supabase.from('products').select('name').eq('id', productId).single()
  return ((data as Pick<ProductSummary, 'name'> | null)?.name) ?? 'Unknown'
}

export const fetchServiceName = async (supabase: Client, serviceId: string): Promise<string> => {
  const { data } = await supabase.from('services').select('name').eq('id', serviceId).single()
  return ((data as ServiceSummary | null)?.name) ?? 'Unknown'
}
