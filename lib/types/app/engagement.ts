import type { Database } from '../database.types'

export type CustomerFavorite = Database['engagement']['Tables']['customer_favorites']['Row'] & {
  business_name?: string | null
  category_name?: string | null
  currency_code?: string | null
  customer_email?: string | null
  customer_name?: string | null
  salon_name?: string | null
  service_name?: string | null
  staff_name?: string | null
  staff_title?: string | null
}

export type CustomerFavoriteView = CustomerFavorite
